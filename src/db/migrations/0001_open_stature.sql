CREATE TABLE IF NOT EXISTS `membership_applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`membership_type` text NOT NULL,
	`first_name` text NOT NULL,
	`middle_name` text,
	`last_name` text NOT NULL,
	`maiden_name` text,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`zip` text NOT NULL,
	`profession` text,
	`age_group` text,
	`finnish_background` text,
	`how_heard` text,
	`reference1_name` text NOT NULL,
	`reference1_email` text NOT NULL,
	`reference2_name` text NOT NULL,
	`reference2_email` text NOT NULL,
	`reason_for_joining` text NOT NULL,
	`volunteer_interests` text,
	`spouse_name` text,
	`children_names` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `pending_subscribers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `pending_subscribers_token_unique` ON `pending_subscribers` (`token`);
