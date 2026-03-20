-- Settings table: key-value store for app configuration
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Default MTBF / Availability parameters
INSERT OR IGNORE INTO settings (key, value) VALUES
  ('mtbf_total_machines',    '1'),
  ('mtbf_total_hours_per_year', '8760'),
  ('company_name',           'PPrime'),
  ('logo_data',              '');
