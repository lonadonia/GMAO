-- ============================================================
-- GMAO - Schéma initial de la base de données
-- ============================================================

-- Table des techniciens
CREATE TABLE IF NOT EXISTS technicians (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  specialty TEXT,
  rating REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des équipements
CREATE TABLE IF NOT EXISTS equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  reference TEXT UNIQUE,
  category TEXT,
  location TEXT,
  city TEXT,
  client TEXT,
  installation_date DATE,
  last_maintenance_date DATE,
  status TEXT DEFAULT 'operational',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des interventions
CREATE TABLE IF NOT EXISTS interventions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'corrective', -- 'preventive' | 'corrective'
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress' | 'resolved' | 'planned' | 'cancelled'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low' | 'medium' | 'high' | 'critical'
  client TEXT,
  equipment TEXT,
  city TEXT,
  technician_id INTEGER,
  technician_name TEXT,
  downtime INTEGER DEFAULT 0, -- 0 = non, 1 = oui
  duration_hours REAL DEFAULT 0, -- durée en heures
  scheduled_date DATETIME,
  start_date DATETIME,
  end_date DATETIME,
  failure_date DATETIME,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (technician_id) REFERENCES technicians(id) ON DELETE SET NULL
);

-- Table du planning de maintenance préventive
CREATE TABLE IF NOT EXISTS maintenance_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  equipment_id INTEGER,
  equipment_name TEXT,
  technician_id INTEGER,
  technician_name TEXT,
  frequency TEXT NOT NULL DEFAULT 'monthly', -- 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  next_date DATE NOT NULL,
  last_done_date DATE,
  duration_hours REAL DEFAULT 1,
  priority TEXT DEFAULT 'medium',
  active INTEGER DEFAULT 1,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE SET NULL,
  FOREIGN KEY (technician_id) REFERENCES technicians(id) ON DELETE SET NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_interventions_status ON interventions(status);
CREATE INDEX IF NOT EXISTS idx_interventions_technician ON interventions(technician_id);
CREATE INDEX IF NOT EXISTS idx_interventions_city ON interventions(city);
CREATE INDEX IF NOT EXISTS idx_interventions_type ON interventions(type);
CREATE INDEX IF NOT EXISTS idx_interventions_scheduled_date ON interventions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_interventions_created_at ON interventions(created_at);
CREATE INDEX IF NOT EXISTS idx_maintenance_plans_next_date ON maintenance_plans(next_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_plans_technician ON maintenance_plans(technician_id);
