-- ============================================================
-- Migration 0007 — Comptes Rendus d'Interventions
-- ============================================================

-- Table principale des comptes rendus
CREATE TABLE IF NOT EXISTS intervention_reports (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  intervention_id     INTEGER,
  reference_num       TEXT,
  title               TEXT NOT NULL,
  -- Infos intervention dupliquées pour lisibilité
  client              TEXT,
  technician_name     TEXT,
  equipment           TEXT,
  city                TEXT,
  site                TEXT,
  intervention_type   TEXT DEFAULT 'corrective',
  priority            TEXT DEFAULT 'medium',
  scheduled_date      TEXT,
  intervention_date   TEXT,
  -- Corps du rapport
  work_performed      TEXT,        -- Travaux effectués
  observations        TEXT,        -- Observations / constats
  recommendations     TEXT,        -- Recommandations
  parts_used          TEXT,        -- Pièces utilisées (JSON array)
  duration_hours      REAL DEFAULT 0,
  -- Résultat
  result              TEXT DEFAULT 'resolved',  -- resolved | partial | pending
  quality_rating      INTEGER,     -- 1-10
  client_signature    TEXT,        -- nom signature client
  -- Statut
  status              TEXT DEFAULT 'draft',  -- draft | finalized
  created_by          TEXT DEFAULT 'Responsable GMAO',
  created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (intervention_id) REFERENCES interventions(id) ON DELETE SET NULL
);

-- Table photos attachées au compte rendu
CREATE TABLE IF NOT EXISTS report_photos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id   INTEGER NOT NULL,
  filename    TEXT,
  caption     TEXT,
  data_url    TEXT NOT NULL,   -- base64 data URL (image encodée)
  size_bytes  INTEGER,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES intervention_reports(id) ON DELETE CASCADE
);

-- Index
CREATE INDEX IF NOT EXISTS idx_reports_intervention ON intervention_reports(intervention_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON intervention_reports(status);
CREATE INDEX IF NOT EXISTS idx_report_photos_report ON report_photos(report_id);
