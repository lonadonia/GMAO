-- Seed : données réelles PPrime (data pprime.xlsx)
-- Insérées via INSERT OR IGNORE sur reference_num unique

-- Techniciens (Ali et Mohamed = responsables principaux)
INSERT OR IGNORE INTO technicians (name, specialty) VALUES ('Ali',     'Mécanique');
INSERT OR IGNORE INTO technicians (name, specialty) VALUES ('Mohamed', 'Électrique');

-- Clients
INSERT OR IGNORE INTO clients (name, city) VALUES ('SI2A', 'Sidi Kacem');
INSERT OR IGNORE INTO clients (name, city) VALUES ('ABM FARMS', 'Agadir');
INSERT OR IGNORE INTO clients (name, city) VALUES ('ZALAR ALPAGRI', 'Guelmim');

-- Interventions
INSERT OR IGNORE INTO interventions (
  reference_num, title, description, type, status, priority,
  client, site, city, client_type,
  equipment, technician_name, technician_assistant,
  downtime, duration_hours, duration_real,
  start_date, end_date, reception_date,
  nb_days, root_cause, quality_score,
  spare_part_name, spare_part_ref, spare_part_qty,
  recurring, notes
) VALUES (
  'INT-2026-001',
  'Coffret principal station 3 — Court-circuit',
  'Nettoyage intérieur du coffret et amélioration de l''étanchéité.',
  'corrective', 'resolved', 'high',
  'SI2A', 'Sidi Kacem', 'Sidi Kacem', 'agricole',
  'Coffret principal station 3', 'Ali', 'Tahar',
  0, 5, 7.5,
  '2026-02-17 08:30:00', '2026-02-17 16:00:00', '2026-02-15',
  3, 'étanchéité — infiltration eau de pluie', 9,
  'Disjoncteur Schneider Compact NSX160B 160A 4P4D 25kA', 'LV430750', 2,
  0,
  'Court-circuit détecté en amont du disjoncteur principal, probablement causé par intrusion animale.'
);

INSERT OR IGNORE INTO interventions (
  reference_num, title, description, type, status, priority,
  client, site, city, client_type,
  equipment, technician_name, technician_assistant,
  downtime, duration_hours, duration_real,
  start_date, end_date, reception_date,
  nb_days, root_cause, quality_score,
  recurring, notes
) VALUES (
  'INT-2026-002',
  'Pompe de surface — Anomalie mécanique',
  NULL,
  'corrective', 'pending', 'medium',
  'ABM FARMS', 'Agadir', 'Agadir', 'agricole',
  'Pompe de surface', 'Mohamed', 'Tahar',
  0, 1, 1.0,
  '2026-02-18 14:00:00', '2026-02-18 15:00:00', '2026-02-18',
  1, 'Anomalie mécanique — rotor et éléments internes', 8,
  1,
  'Contrôle mécanique effectué. Bruit réduit après intervention. Suivi périodique recommandé.'
);

INSERT OR IGNORE INTO interventions (
  reference_num, title, description, type, status, priority,
  client, site, city, client_type,
  equipment, technician_name, technician_assistant,
  downtime, duration_hours, duration_real,
  start_date, end_date, reception_date,
  nb_days, root_cause, quality_score,
  spare_part_name, spare_part_ref, spare_part_qty,
  recurring, notes
) VALUES (
  'INT-2026-003',
  'Variateur de vitesse — Défaut capteur pression',
  'Diagnostic électrique — Remplacement du capteur de pression — Test de fonctionnement concluant',
  'corrective', 'resolved', 'high',
  'ABM FARMS', 'Agadir', 'Agadir', 'agricole',
  'Variateur de vitesse', 'Mohamed', 'Tahar',
  1, 1, 1.0,
  '2026-02-18 15:00:00', '2026-03-18 16:00:00', '2026-02-18',
  1, 'Défaut capteur de pression (absence de signal correct)', 9,
  'Capteur de pression 4-20mA SS201', '4-20mA SS201', 1,
  1,
  'Fonctionnement normal rétabli après remplacement du capteur. Contrôle périodique recommandé.'
);

INSERT OR IGNORE INTO interventions (
  reference_num, title, description, type, status, priority,
  client, site, city, client_type,
  equipment, technician_name, technician_assistant,
  downtime, duration_hours, duration_real,
  start_date, end_date, reception_date,
  nb_days, root_cause, quality_score,
  spare_part_name, spare_part_ref, spare_part_qty,
  recurring, notes
) VALUES (
  'INT-2026-004',
  'Pompe immergée puits — Panne mécanique',
  'Diagnostic électrique — Remplacement relais de niveau — Test de fonctionnement',
  'corrective', 'pending', 'high',
  'ZALAR ALPAGRI', 'Guelmim', 'Guelmim', 'agricole',
  'Pompe immergée dans le puits', 'Mohamed', 'Hassan',
  1, 4, 4.0,
  '2026-02-26 13:00:00', '2026-02-26 17:00:00', '2026-02-25',
  1, 'Cause mécanique probable', 6,
  'Relais de niveau RM22LGMR + Electrode TOSUN 3SN-107316C', NULL, 4,
  1,
  'Intervention électrique réalisée sans amélioration du débit. Démontage et extraction du puits requis.'
);

INSERT OR IGNORE INTO interventions (
  reference_num, title, description, type, status, priority,
  client, site, city, client_type,
  equipment, technician_name, technician_assistant,
  downtime, duration_hours, duration_real,
  start_date, end_date, reception_date,
  nb_days, root_cause, quality_score,
  recurring, notes
) VALUES (
  'INT-2026-005',
  'Variateur de vitesse — Dérèglement paramètres',
  'Vérification câblage — Réglage et reparamétrage du variateur — Test OK',
  'corrective', 'resolved', 'medium',
  'ABM FARMS', 'Agadir', 'Agadir', 'agricole',
  'Variateur de vitesse', 'Mohamed', 'Tahar',
  1, 1, 1.0,
  '2026-02-18 16:00:00', '2026-02-18 17:00:00', '2026-02-18',
  1, 'Dérèglement des paramètres du variateur', 10,
  0,
  'Réinitialisation et réglage effectués avec succès. Sauvegarder les paramètres recommandé.'
);
