-- Migration 0005: Email notification tracking flags
-- Adds two boolean columns to avoid duplicate email sends

ALTER TABLE interventions ADD COLUMN email_sent_48h INTEGER DEFAULT 0;
ALTER TABLE interventions ADD COLUMN email_sent_24h  INTEGER DEFAULT 0;

-- Index for fast cron queries (only scan non-notified, non-completed rows)
CREATE INDEX IF NOT EXISTS idx_interventions_email_flags
  ON interventions (email_sent_48h, email_sent_24h, status, scheduled_date);
