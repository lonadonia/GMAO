-- Migration 0004 : ajout colonnes issues du fichier Excel PPrime
-- SQLite ne supporte pas IF NOT EXISTS pour ALTER TABLE ADD COLUMN
ALTER TABLE interventions ADD COLUMN reference_num TEXT;
ALTER TABLE interventions ADD COLUMN quality_score REAL;
ALTER TABLE interventions ADD COLUMN duration_real REAL;
ALTER TABLE interventions ADD COLUMN root_cause TEXT;
ALTER TABLE interventions ADD COLUMN spare_part_name TEXT;
ALTER TABLE interventions ADD COLUMN spare_part_ref TEXT;
ALTER TABLE interventions ADD COLUMN spare_part_qty INTEGER;
ALTER TABLE interventions ADD COLUMN technician_assistant TEXT;
ALTER TABLE interventions ADD COLUMN reception_date DATE;
ALTER TABLE interventions ADD COLUMN nb_days INTEGER;
ALTER TABLE interventions ADD COLUMN recurring INTEGER DEFAULT 0;
ALTER TABLE interventions ADD COLUMN site TEXT;
ALTER TABLE interventions ADD COLUMN client_type TEXT;
