CREATE DATABASE PRODUCTS;
USE PRODUCTS;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE `pencils` (
  `id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `hardness` int(11) NOT NULL,
  `thickness` int(11) NOT NULL,
  `description` varchar(256) DEFAULT NULL,
  `image_url` varchar(256) DEFAULT NULL,
  `brand` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `pencils` (`id`, `name`, `hardness`, `thickness`, `description`, `image_url`, `brand`) VALUES
(1, 'MAJESTIC JUMBO NUMBER 2 PENCIL', 107, 15, 'Loverly pencil this', 'Caran_d_Ache_Bicolor_999_pencil_grande.jpg', 1),
(2, 'NO SMOKING MINI PENCIL - HB', 1, 0, 'Loverly pencil this', 'eye_ball_no_smoking_pencil_grande.jpg', 1),
(3, 'ACADEMIC WRITING 9606 PENCIL - HB', 20, 125, 'Loverly pencil this', 'Generals_Badger_pencil_grande.jpg', 1),
(4, 'BACKYARDS AND GARDENS OF PORTUGAL SCENTED PENCILS', 9, 5, 'Loverly pencil this', 'hester_and_cook_midtown_white_pencil_grande.jpg', 1),
(5, 'BADGER #2 PENCIL', 33, 15, 'Loverly pencil this', 'kitaboshi_academic_writing_pencil_grande.jpg', 1);


CREATE TABLE `stationery` (
  `id` int(11) NOT NULL,
  `NAME` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `stationery` (`id`, `NAME`) VALUES
(3, 'Biros'),
(1, 'Pencils'),
(4, 'Rubbers'),
(2, 'Toppers');


CREATE TABLE `orders` (
  `id` int(10) NOT NULL,
  `date` date DEFAULT NULL,
  `description` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `orders` (`id`, `date`, `description`) VALUES
(1, '2012-12-02', 'Order desc, some pencils');

ALTER TABLE `pencils`
  ADD PRIMARY KEY (`id`),
  ADD KEY `brand` (`brand`);


ALTER TABLE `stationery`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `NAME` (`NAME`);

ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `pencils`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `stationery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `orders`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `pencils`
  ADD CONSTRAINT `pencils_ibfk_1` FOREIGN KEY (`brand`) REFERENCES `stationery` (`id`) ON UPDATE CASCADE;
