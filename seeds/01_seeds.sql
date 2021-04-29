TRUNCATE TABLE users 
RESTART IDENTITY CASCADE;

INSERT INTO users(name , email , password) 
VALUES ('anthony','example@aol.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
       ('minny','minni@aol.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u') ,
       ('donny','donny@aol.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties(owner_id,title ,description , thumbnail_photo_url,cover_photo_url,cost_per_night,parking_spaces,number_of_bathrooms,number_of_bedrooms,country,street,city,province,post_code,active) 
VALUES ('1','Speed lamp' ,'island get away','https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg','930.61','6','4','8','Canada','536 Namsub Highway','Sotboske','Quebec','28142','true'),
       ('1','Slow lamp' ,'mountain get away','https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg','1002.50','8','3','7','Canada','884 Vegsub Highway','Lotboske','Alberta','84142','true'),
       ('2','Ramped up lamp' ,'beach get away','https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg','1899.50','2','1','4','Canada','7485 Vegansub Highway','Saltboske','Ontario','59142','true');

INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (1, 1, '2018-09-11', '2018-09-26'),
       (2, 2, '2019-01-04', '2019-02-01'),
       (3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews ( guest_id, property_id, reservation_id, rating,message) 
VALUES (1,2,2,5,'Chilling experience'),
       (2,2,2,5,'Crazy yet beautiful'),
       (3,2,2,1,'Worse experience');