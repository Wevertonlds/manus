CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`location` text,
	`price` int,
	`area_m2` int,
	`bedrooms` int,
	`bathrooms` int,
	`suites` int,
	`garage` int,
	`pool` int DEFAULT 0,
	`gym` int DEFAULT 0,
	`bbq` int DEFAULT 0,
	`condominium` int,
	`iptu` int,
	`year_built` int,
	`type` varchar(64),
	`main_image` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`whatsapp` varchar(255),
	`facebook` varchar(255),
	`instagram` varchar(255),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`)
);
