CREATE TABLE `event_occurrences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`date` text NOT NULL,
	`time_start` text,
	`time_end` text,
	`cancelled` integer DEFAULT false NOT NULL,
	`override_title` text,
	`override_description` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `event_recurrence` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`parent_event_id` integer NOT NULL,
	`frequency` text NOT NULL,
	`interval` integer DEFAULT 1 NOT NULL,
	`day_of_week` integer,
	`week_of_month` integer,
	`ends_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`parent_event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`date_start` text NOT NULL,
	`date_end` text,
	`time_start` text,
	`time_end` text,
	`location` text DEFAULT 'FAHA, 197 W. Verano Avenue, Sonoma, CA 95476',
	`image_url` text,
	`ticket_price` text,
	`rsvp_url` text,
	`published` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`expires_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_content` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section_key` text NOT NULL,
	`label` text NOT NULL,
	`content` text NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `site_content_section_key_unique` ON `site_content` (`section_key`);