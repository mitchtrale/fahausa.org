import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  dateStart: text('date_start').notNull(),
  dateEnd: text('date_end'),
  timeStart: text('time_start'),
  timeEnd: text('time_end'),
  location: text('location').default('FAHA, 197 W. Verano Avenue, Sonoma, CA 95476'),
  imageUrl: text('image_url'),
  ticketPrice: text('ticket_price'),
  rsvpUrl: text('rsvp_url'),
  published: integer('published', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

export const eventRecurrence = sqliteTable('event_recurrence', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  parentEventId: integer('parent_event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  frequency: text('frequency').notNull(), // 'weekly' | 'biweekly' | 'monthly' | 'yearly'
  interval: integer('interval').notNull().default(1),
  dayOfWeek: integer('day_of_week'), // 0=Sun..6=Sat
  weekOfMonth: integer('week_of_month'), // 1..5
  endsAt: text('ends_at'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const eventOccurrences = sqliteTable('event_occurrences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventId: integer('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  timeStart: text('time_start'),
  timeEnd: text('time_end'),
  cancelled: integer('cancelled', { mode: 'boolean' }).notNull().default(false),
  overrideTitle: text('override_title'),
  overrideDescription: text('override_description'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const siteContent = sqliteTable('site_content', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sectionKey: text('section_key').notNull().unique(),
  label: text('label').notNull(),
  content: text('content').notNull(),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  expiresAt: text('expires_at').notNull(),
});
