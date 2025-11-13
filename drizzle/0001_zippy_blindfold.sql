CREATE TABLE `carrossel` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`descricao` text,
	`imagemUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `carrossel_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quemSomos` text,
	`corPrimaria` varchar(7) DEFAULT '#1E40AF',
	`tamanho` int DEFAULT 16,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `config_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `investimentos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tipo` enum('lancamentos','na_planta','aluguel') NOT NULL,
	`titulo` text NOT NULL,
	`descricao` text,
	`imagemUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `investimentos_id` PRIMARY KEY(`id`)
);
