CREATE DATABASE PRODUCTS;
USE PRODUCTS;

CREATE TABLE `pencils` (
  `id` int(11) NOT NULL,
  `price` float(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `hardness` int(11) NOT NULL,
  `thickness` int(11) NOT NULL,
  `description` varchar(256) DEFAULT NULL,
  `image_url` varchar(256) DEFAULT NULL,
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `price` float(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `hardness` int(11) NOT NULL,
  `thickness` int(11) NOT NULL,
  `description` varchar(256) DEFAULT NULL,
  `image_url` varchar(256) DEFAULT NULL,
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `pencils` (`id`, `price`, `name`, `hardness`, `thickness`, `description`, `image_url`, `stock`) VALUES
(1,  2.99, 'MAJESTIC JUMBO NUMBER 2 PENCIL', 2.0, 9, 'Nostalgic, comfortable to hold and just downright cute, these jumbo pencils are a standard HB/#2 graphite.', 'Caran_d_Ache_Bicolor_999_pencil_grande.jpg', 99),
(2, 4.99, 'NO SMOKING MINI PENCIL - HB', 2.5, 10, 'This tiny pencil measures a mere 3 1/2 inches and looks exactly like a (less deadly) cigarette.', 'eye_ball_no_smoking_pencil_grande.jpg', 102),
(3, 1.99, 'ACADEMIC WRITING 9606 PENCIL - HB', 1.0, 12, 'This pencil contains a 5mm wide stick of super soft, super dark water-soluble graphite.', 'Generals_Badger_pencil_grande.jpg', 67),
(4, 2.99, 'BACKYARDS AND GARDENS OF PORTUGAL SCENTED PENCILS', 2.2, 10, 'This pencil is made in the US and features a nostalgic gold end-cap.', 'hester_and_cook_midtown_white_pencil_grande.jpg', 92),
(5, 1.99, 'BADGER #2 PENCIL', 1.1, 8, 'Designated for academic writing, which is printed on the back of the pencil.', 'kitaboshi_academic_writing_pencil_grande.jpg', 45);

CREATE TABLE `stationery` (
  `id` int(11) NOT NULL,
  `NAME` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `stationery` (`id`, `NAME`) VALUES
(3, 'Biros'),
(1, 'Pencils'),
(4, 'Rubbers'),
(2, 'Toppers');

ALTER TABLE `pencils`
  ADD PRIMARY KEY (`id`);

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
