CREATE TABLE `todo` (
    `uid` int(20) NOT NULL,
    `jsonstr` varchar(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`uid`)
) engine = innodb charset utf8mb4 COLLATE utf8mb4_general_ci;