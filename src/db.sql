create table accounts (
  id uuid not null primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  plan text not null default 'basic'
);
alter table accounts enable row level security;
create policy "Can view own user data." on accounts for select using (auth.uid() = user_id);
create policy "Can update own user data." on accounts for update using (auth.uid() = user_id);

create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.accounts (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.tidy_account_before_update()
returns trigger as $$
begin
  if auth.uid() != null then
    -- keep previous values as-is if it's not admin
    new.plan := old.plan;
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_account_before_update
  before update on public.accounts
  for each row execute procedure public.tidy_account_before_update();


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
create policy "Can view any rooms." on rooms for select using (now() <= end_ts + '7 day');

alter table rooms alter column begin_ts set not null;
alter table rooms alter column end_ts set not null;
alter table rooms add column user_name text not null default '';
alter table rooms add column full_name text not null default '';
alter table rooms add column picture text not null default '';
alter table rooms add column lang text not null default 'en';

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
  can_create_another_room boolean;
begin
  select can_create_room()
  into can_create_another_room;

  if can_create_another_room = false then
    raise 'cannot create another room';
  end if;

  select
    (raw_user_meta_data->>'preferred_username') as c1,
    (raw_user_meta_data->>'full_name') as c2,
    (raw_user_meta_data->>'picture') as c3
  into admin_user_name, admin_full_name, admin_picture
  from auth.users
  where id = auth.uid();

  if new.lang != 'ko' then
    new.lang := 'en';
  end if;

  SELECT admin_user_name = ANY ('{"eunjae_lee","eunjae_lee_ko","twitchat_app","chaewon_dev","changerlemond","bohynkang","83tt3r","boyeonihn","ramgee66","sudokeepcoding","dylayed","autumn_bom","channprj","uphill_gosu","yyijoo","gaebalgombal","imperativ2nxtlv","doomydoomydooms"}'::text[])
  into allowed_to_create;

  if allowed_to_create = false then
    raise 'not allowed to create a room';
  end if;

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
    new.lang := old.lang;
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
returns boolean
security definer set search_path = public
as $$
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
create policy "Can view own participations." on participations for select using (is_participating(room_id));
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

create or replace function public.can_create_room()
returns boolean as $$
declare
  user_plan text;
  last_created_ts TIMESTAMP with time zone;
begin
  select max(created_ts)
  into last_created_ts
  from rooms
  where user_id = auth.uid();

  select plan
  into user_plan
  from accounts
  where user_id = auth.uid();

  if user_plan = 'pro' then
    return true;
  else
    return last_created_ts + '1 day' <= now();
  end if;
end;
$$ language plpgsql;

-- https://supabase.com/blog/postgres-as-a-cron-server
create or replace function public.clean_up_old_rooms_and_messages()
returns void as $$
begin
  delete from messages where room_id in (
    select id from rooms where end_ts + '7 day' < now()
  );
end;
$$ language plpgsql;

select
  cron.schedule(
    'clean-up-old-rooms-and-messages',
    '0 * * * *',
    $$
    select clean_up_old_rooms_and_messages;
    $$
  );