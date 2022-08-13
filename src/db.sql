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
-- TODO: protect `role`!
alter table participations enable row level security;
create policy "Can create own participations" on participations for insert with check (auth.uid() = user_id);
create policy "Can view own participations." on participations for select using (auth.uid() = user_id);
create policy "Can update own participations." on participations for update using (auth.uid() = user_id);

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

create or replace function particiate_room(param_slug text)
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