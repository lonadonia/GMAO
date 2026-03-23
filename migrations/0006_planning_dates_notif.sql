-- Migration 0006 : champs planning — date/heure début + notification
ALTER TABLE maintenance_plans ADD COLUMN start_date DATE;
ALTER TABLE maintenance_plans ADD COLUMN start_time TEXT DEFAULT '08:00';
ALTER TABLE maintenance_plans ADD COLUMN notification_date DATE;
ALTER TABLE maintenance_plans ADD COLUMN notification_emails TEXT DEFAULT 'mfs326467@gmail.com';
