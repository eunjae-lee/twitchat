create table rooms (
  id uuid not null primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  slug text unique default LOWER(SUBSTRING(MD5(''||NOW()::TEXT||RANDOM()::TEXT) FOR 8)),
  created_ts TIMESTAMP WITH TIME ZONE default now(),
  updated_ts TIMESTAMP WITH TIME ZONE
);
alter table rooms enable row level security;
create policy "Can create own rooms." on rooms for insert with check (auth.uid() = user_id);
create policy "Can update own rooms." on rooms for update using (auth.uid() = user_id);

create table schedules (
  id uuid not null primary key default uuid_generate_v4(),
  room_id uuid references rooms not null,
  user_id uuid references auth.users not null,
  begin_ts TIMESTAMP WITH TIME ZONE,
  end_ts TIMESTAMP WITH TIME ZONE
);


-- attach a schedule automatically when a room is created
create function public.add_schedule_automatically()
returns trigger as $$
begin
  insert into public.schedules (room_id, user_id, begin_ts, end_ts)
  values (new.id, auth.uid(), now(), now() + interval '2 hours');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_room_created
  after insert on public.rooms
  for each row execute procedure public.add_schedule_automatically();


create table participations (
  id uuid not null primary key default uuid_generate_v4(),
  room_id uuid references rooms not null,
  user_id uuid references auth.users not null,
  created_ts TIMESTAMP WITH TIME ZONE default now(),
  role text not null
);
alter table participations enable row level security;
create policy "Can view own participations." on participations for select using (auth.uid() = user_id);

create function public.participate_as_admin()
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


create view check_participation as
select 
  participations.user_id,
  participations.role,
  rooms.slug
from participations
inner join rooms on participations.room_id = rooms.id;
