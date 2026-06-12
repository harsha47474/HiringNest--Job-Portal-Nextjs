ALTER TABLE `jobs` ADD `status` enum('draft','published','expired','closed');--> statement-breakpoint
ALTER TABLE `jobs` DROP COLUMN `is_active`;