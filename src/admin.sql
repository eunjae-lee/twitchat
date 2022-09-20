create view user_count_view as
select count(*) from users where id not in
('4872df12-6f57-457e-be21-67cca337e4c2',
'a9f39f0b-7768-4359-900a-b7e7225aeec9',
'a91ea2c3-fa01-4c08-9305-6013fa313a51');

create view room_count_view as
select count(*) from rooms where user_id not in
('4872df12-6f57-457e-be21-67cca337e4c2',
'a9f39f0b-7768-4359-900a-b7e7225aeec9',
'a91ea2c3-fa01-4c08-9305-6013fa313a51');

create view room_creators_count_view as
select count(distinct user_id) from rooms where user_id not in
('4872df12-6f57-457e-be21-67cca337e4c2',
'a9f39f0b-7768-4359-900a-b7e7225aeec9',
'a91ea2c3-fa01-4c08-9305-6013fa313a51');