CREATE TABLE `user` (
    `id` int(20) NOT NULL AUTO_INCREMENT,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `lms_sid` varchar(255) NOT NULL,
    `lms_pass` varchar(255) NOT NULL,
    `permissionLevel` int(11) NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) engine = innodb charset utf8mb4 COLLATE utf8mb4_general_ci;