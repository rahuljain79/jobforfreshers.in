use jobforfreshers;

CREATE TABLE admin(
email varchar(30) Not Null,
password varchar(30) Not Null,
primary key (email)
);

Insert into admin values ('sammedsingalkar@gmail.com','123456789');
Insert into admin values ('rahuljain@gmail.com','jainrahul');

select * from admin;