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
-- TODO: protect `begin_ts` and `end_ts`!
alter table rooms enable row level security;
create policy "Can create own rooms." on rooms for insert with check (auth.uid() = user_id);
create policy "Can update own rooms." on rooms for update using (auth.uid() = user_id);
create policy "Can view any rooms." on rooms for select using (true);

create table participations (
  id uuid not null primary key default uuid_generate_v4(),
  room_id uuid references rooms not null,
  user_id uuid references auth.users not null default auth.uid(),
  created_ts TIMESTAMP WITH TIME ZONE default now(),
  role text not null,

  UNIQUE(room_id, user_id)
);
alter table participations add column status text not null default 'granted';
-- TODO: protect `status`!

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


-- TODO: protect `role`!
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


create or replace function participate_room(param_slug text)
returns void as $$
  declare
    room_id uuid;
  begin
    select id
    into room_id
    from rooms where rooms.slug = param_slug;

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
alter table rooms enable row level security;
create policy "Can create own messages." on messages for insert with check (
  auth.uid() = user_id and is_participating(room_id)
);
create policy "Can view any messages in participating rooms." on messages for select using (
  is_participating(room_id)
);

