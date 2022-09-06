create table rooms (
  id uuid not null primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null default auth.uid(),
  title text not null,
  slug text unique default LOWER(SUBSTRING(MD5(''||NOW()::TEXT||RANDOM()::TEXT) FOR 8)),
  created_ts TIMESTAMP WITH TIME ZONE default now(),
  updated_ts TIMESTAMP WITH TIME ZONE,
  begin_ts TIMESTAMP WITH TIME ZONE default now(),
  end_ts TIMESTAMP WITH TIME ZONE default now() + interval '2 hours'
);
alter table rooms enable row level security;
create policy "Can create own rooms." on rooms for insert with check (auth.uid() = user_id);
create policy "Can update own rooms." on rooms for update using (auth.uid() = user_id);
create policy "Can view any rooms." on rooms for select using (true);

alter table rooms alter column begin_ts set not null;
alter table rooms alter column end_ts set not null;
alter table rooms add column user_name text not null default '';
alter table rooms add column full_name text not null default '';
alter table rooms add column picture text not null default '';

create or replace function public.is_room_viewable(param_room_id uuid)
returns boolean as $$
declare
  room_end_ts TIMESTAMP WITH TIME ZONE;
  room_user_id uuid;
begin
  select
    end_ts, user_id
  into
    room_end_ts, room_user_id
  from rooms
  where id = param_room_id;

  if room_user_id = auth.uid() then
    return true;
  else
    return now() <= room_end_ts + interval '30 minute';
  end if;
end;
$$ language plpgsql;

create or replace function public.tidy_room_before_insert()
returns trigger as $$
declare
  admin_user_name text;
  admin_full_name text;
  admin_picture text;

  allowed_to_create boolean;
begin
  SELECT auth.uid() = ANY ('{"4872df12-6f57-457e-be21-67cca337e4c2","ea882074-19ad-459e-a710-fbf78947bc74","decfe743-6703-4789-9692-12c2999ad296","27e2a744-ae34-4bb0-bb3a-7367cab99e1e","a9f39f0b-7768-4359-900a-b7e7225aeec9","a91ea2c3-fa01-4c08-9305-6013fa313a51","fcf73f74-f4a6-4dd1-b4f6-212e0378f070","413ba069-e5b5-425b-9ea9-6d219e3f2551","afe0f771-7dfa-4d5c-bfd7-14c4f4db3768","460fad78-6e2c-42aa-8cd3-df8f77355982"}'::text[])
  into allowed_to_create;

  if allowed_to_create = false then
    raise 'cannot create a room';
  end if;

  select
    (raw_user_meta_data->>'preferred_username') as c1,
    (raw_user_meta_data->>'full_name') as c2,
    (raw_user_meta_data->>'picture') as c3
  into admin_user_name, admin_full_name, admin_picture
  from auth.users
  where id = auth.uid();

  -- provide default values for begin_ts and end_ts
  new.begin_ts := now();
  new.end_ts := now() + interval '2 hours';
  new.user_id := auth.uid();
  new.user_name := admin_user_name;
  new.full_name := admin_full_name;
  new.picture := admin_picture;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_room_before_insert
  before insert on public.rooms
  for each row execute procedure public.tidy_room_before_insert();


create or replace function public.tidy_room_before_update()
returns trigger as $$
begin
  if auth.uid() != null then
    -- keep previous values as-is if it's not admin
    new.user_id := old.user_id;
    new.slug := old.slug;
    new.created_ts := old.created_ts;
    new.updated_ts := old.updated_ts;
    new.begin_ts := old.begin_ts;
    new.end_ts := old.end_ts;
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_room_before_update
  before update on public.rooms
  for each row execute procedure public.tidy_room_before_update();


create table participations (
  id uuid not null primary key default uuid_generate_v4(),
  room_id uuid references rooms not null,
  user_id uuid references auth.users not null default auth.uid(),
  created_ts TIMESTAMP WITH TIME ZONE default now(),
  role text not null,

  UNIQUE(room_id, user_id)
);
alter table participations add column status text not null default 'granted';
alter table participations alter column created_ts set not null;

create or replace function public.tidy_participation_before_update()
returns trigger as $$
begin
  if auth.uid() != null then
    -- keep previous values as-is if it's not admin
    new.id := old.id;
    new.room_id := old.room_id;
    new.user_id := old.user_id;
    new.created_ts := old.created_ts;
    new.role := old.role;
  end if;

  if auth.uid() != null AND old.status = 'banned' THEN
    -- user cannot get out of the banned status on their own
    new.status = 'banned';
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_participation_before_update
  before update on public.participations
  for each row execute procedure public.tidy_participation_before_update();


create or replace function is_participating(param_room_id uuid)
returns boolean as $$
  select exists
    (
      select 1
      from participations
      where room_id = param_room_id
        and user_id = auth.uid()
        and (role = 'admin' or role = 'user')
        and status = 'granted'
    );
$$ language sql;


create view participations_with_slug as
select
  rooms.slug,
  rooms.id as room_id,
  participations.user_id as user_id
from participations
inner join rooms
on participations.room_id = rooms.id
where
  (participations.role = 'admin' or participations.role = 'user')
  and participations.status = 'granted';


alter table participations enable row level security;
create policy "Can create own participations" on participations for insert with check (auth.uid() = user_id);
create policy "Can view own participations." on participations for select using (true);
create policy "Can update own participations." on participations for update using (auth.uid() = user_id);

alter table participations add column user_name text;
alter table participations add column full_name text;
alter table participations add column picture text;

create or replace function public.participate_as_admin()
returns trigger as $$
begin
  insert into public.participations (room_id, user_id, role)
  values (new.id, auth.uid(), 'admin');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_room_created2
  after insert on public.rooms
  for each row execute procedure public.participate_as_admin();


create or replace function participate_as_user(param_slug text)
returns void as $$
  declare
    room_id uuid;
    room_end_ts TIMESTAMP with time zone;
  begin
    select id, end_ts
    into room_id, room_end_ts
    from rooms where rooms.slug = param_slug;

    if room_end_ts < now() then
      raise 'room is closed';
    end if;

    insert into participations (room_id, user_id, role)
    values (room_id, auth.uid(), 'user');
  end;
$$ language plpgsql;


create or replace function public.update_user_info_to_participation()
returns trigger as $$
declare
  new_user_name text;
  new_full_name text;
  new_picture text;
begin
  select
    (raw_user_meta_data->>'preferred_username') as c1,
    (raw_user_meta_data->>'full_name') as c2,
    (raw_user_meta_data->>'picture') as c3
  into new_user_name, new_full_name, new_picture
  from auth.users
  where id = new.user_id;

  new.user_name := new_user_name;
  new.full_name := new_full_name;
  new.picture := new_picture;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_participation_inserted
  before insert on public.participations
  for each row execute procedure public.update_user_info_to_participation();


create table messages (
  id uuid not null primary key default uuid_generate_v4(),
  room_id uuid references rooms not null,
  user_id uuid references auth.users not null default auth.uid(),
  created_ts TIMESTAMP WITH TIME ZONE default now(),
  
  content text,
  type text default 'text' -- 'text' | 'emoji' | ...
);
alter table messages enable row level security;
ALTER TABLE messages ALTER COLUMN created_ts SET NOT NULL;
create policy "Can create own messages." on messages for insert with check (
  auth.uid() = user_id and is_participating(room_id)
);
create policy "Can view any messages in participating rooms." on messages for select using (
  is_room_viewable(room_id) and is_participating(room_id)
);

create or replace function public.check_before_inserting_message()
returns trigger as $$
declare
  room_end_ts TIMESTAMP WITH TIME ZONE;
begin
  select
    end_ts
  into room_end_ts
  from rooms
  where id = new.room_id;

  if room_end_ts < now() then
    raise 'room is closed';
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_message_inserted
  before insert on public.messages
  for each row execute procedure public.check_before_inserting_message();
