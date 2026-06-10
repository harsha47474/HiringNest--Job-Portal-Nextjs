CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`tags` text,
	`min_salary` int,
	`max_salary` int,
	`salary_currency` enum('INR','USD','EUR','GBP'),
	`salary_period` enum('hourly','monthly','yearly'),
	`job_type` enum('full_time','part_time','contract','internship','freelance'),
	`location` varchar(255),
	`work_type` enum('remote','hybrid','onsite'),
	`job_level` enum('entry','mid','senior','lead','manager'),
	`experience` text,
	`min_education` enum('high_school','diploma','bachelors','masters','phd'),
	`is_featured` boolean NOT NULL DEFAULT false,
	`is_active` boolean NOT NULL DEFAULT true,
	`employer_id` int NOT NULL,
	`deleted_at` timestamp,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_employer_id_employers_id_fk` FOREIGN KEY (`employer_id`) REFERENCES `employers`(`id`) ON DELETE cascade ON UPDATE no action;