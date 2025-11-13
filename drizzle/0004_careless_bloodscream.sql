ALTER TABLE `investimentos` ADD `endereco` text;--> statement-breakpoint
ALTER TABLE `investimentos` ADD `area_m2` int;--> statement-breakpoint
ALTER TABLE `investimentos` ADD `banheiros` int;--> statement-breakpoint
ALTER TABLE `investimentos` ADD `quartos` int;--> statement-breakpoint
ALTER TABLE `investimentos` ADD `suites` int;--> statement-breakpoint
ALTER TABLE `investimentos` ADD `garagem` int;--> statement-breakpoint
ALTER TABLE `investimentos` ADD `piscina` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `investimentos` ADD `academia` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `investimentos` ADD `churrasqueira` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `investimentos` ADD `condominio` int;--> statement-breakpoint
ALTER TABLE `investimentos` ADD `iptu` int;--> statement-breakpoint
ALTER TABLE `investimentos` ADD `preco` int;--> statement-breakpoint
ALTER TABLE `settings` ADD `createdAt` timestamp DEFAULT (now()) NOT NULL;