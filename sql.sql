drop database netflix;
create database netflix;

use netflix;
create table users(
	nameUser varchar(20),
    movie varchar(50),
    dateSeen timestamp
);

INSERT INTO users (nameUser, movie, dateSeen) 
VALUES
("sebqdwas", "xd", '2024-12-05'),
("sadf", "asdf", '2024-12-05'),
("aasdfjl", "sdfasdjfak", '2024-12-05');