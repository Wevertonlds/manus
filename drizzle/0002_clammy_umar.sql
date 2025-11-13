ALTER TABLE `config` MODIFY COLUMN `corPrimaria` varchar(7);--> statement-breakpoint
ALTER TABLE `config` ADD `logo` text;--> statement-breakpoint
ALTER TABLE `config` ADD `banner` text;