-- ============================================================
-- Migration 0003 : Planning Préventif Contractuel 2026
-- Données issues du fichier Excel planning_maintenance_2026.xlsx
-- ============================================================

-- Table du planning préventif contractuel
CREATE TABLE IF NOT EXISTS planning_preventif (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nature TEXT NOT NULL DEFAULT 'Contrat de maintenance', -- 'Contrat de maintenance' | 'Bon de commande'
  description TEXT NOT NULL,
  client TEXT NOT NULL,
  frequence TEXT NOT NULL DEFAULT 'Annuelle', -- 'Annuelle' | 'Semestrielle' | 'Trimestrielle'
  fait INTEGER DEFAULT 0,       -- 0=Non fait, 1=Fait
  -- Mois planifiés (1=planifié ce mois, 0=non)
  mois_1  INTEGER DEFAULT 0,    -- Janvier
  mois_2  INTEGER DEFAULT 0,    -- Février
  mois_3  INTEGER DEFAULT 0,    -- Mars
  mois_4  INTEGER DEFAULT 0,    -- Avril
  mois_5  INTEGER DEFAULT 0,    -- Mai
  mois_6  INTEGER DEFAULT 0,    -- Juin
  mois_7  INTEGER DEFAULT 0,    -- Juillet
  mois_8  INTEGER DEFAULT 0,    -- Août
  mois_9  INTEGER DEFAULT 0,    -- Septembre
  mois_10 INTEGER DEFAULT 0,    -- Octobre
  mois_11 INTEGER DEFAULT 0,    -- Novembre
  mois_12 INTEGER DEFAULT 0,    -- Décembre
  annee   INTEGER DEFAULT 2026,
  notes   TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_planning_preventif_client ON planning_preventif(client);
CREATE INDEX IF NOT EXISTS idx_planning_preventif_nature ON planning_preventif(nature);
CREATE INDEX IF NOT EXISTS idx_planning_preventif_annee  ON planning_preventif(annee);

-- ============================================================
-- Données initiales — Contrat de maintenance (Sheet 1)
-- Fréquence Trimestrielle → mois 3,6,9,12
-- Fréquence Semestrielle  → mois 6,12
-- Fréquence Annuelle      → mois 6 (ou mois selon convention)
-- ============================================================

-- Contrats de maintenance
INSERT INTO planning_preventif (nature, description, client, frequence, mois_3, mois_6, mois_9, mois_12) VALUES
  ('Contrat de maintenance',
   'Entretien préventif des installations de détection incendie',
   'PESCASUD', 'Trimestrielle', 1, 1, 1, 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6, mois_12) VALUES
  ('Contrat de maintenance',
   'Entretien du poste de livraison et du poste de transformation',
   'PESCASUD', 'Semestrielle', 1, 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6, mois_12) VALUES
  ('Contrat de maintenance',
   'Entretien du poste électrique et du groupe électrogène',
   'CLINIQUE DE L''UNIVERSITÉ', 'Semestrielle', 1, 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Contrat de maintenance',
   'Entretien du groupe électrogène',
   'POLYCLINIQUE OASIS', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Contrat de maintenance',
   'Entretien du poste électrique, du poste de transformation, du poste de livraison et des tableaux électriques',
   'SUDAPHI', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6, mois_12) VALUES
  ('Contrat de maintenance',
   'Entretien des postes de transformation, des tableaux électriques et des extincteurs',
   'ZALAR FRESH', 'Semestrielle', 1, 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6, mois_12) VALUES
  ('Contrat de maintenance',
   'Entretien du poste de transformation et des tableaux électriques',
   'ABM FARMS', 'Semestrielle', 1, 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6, mois_12) VALUES
  ('Contrat de maintenance',
   'Entretien du poste de transformation et des tableaux électriques',
   'JAOUDA AGRI', 'Semestrielle', 1, 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6, mois_12) VALUES
  ('Contrat de maintenance',
   'Entretien du poste de transformation et des tableaux électriques',
   'ALPAGRI', 'Semestrielle', 1, 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6, mois_12) VALUES
  ('Contrat de maintenance',
   'Entretien du poste de transformation et des tableaux électriques',
   'FONDATION AIN SALSABIL', 'Semestrielle', 1, 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Contrat de maintenance',
   'Entretien du poste de livraison, du poste de transformation, du groupe électrogène et des onduleurs',
   'JOUMAPACK', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Contrat de maintenance',
   'Entretien du poste de livraison, du poste de transformation et du groupe électrogène',
   'PLASTICK PACK', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Contrat de maintenance',
   'Entretien des postes de livraison et des postes de transformation',
   'PPrime (Interne)', 'Annuelle', 1);

-- ============================================================
-- Données initiales — Bon de commande (Sheet 2)
-- Toutes Annuelles → mois 6 (planifié en milieu d'année)
-- ============================================================

INSERT INTO planning_preventif (nature, description, client, frequence, fait, mois_6) VALUES
  ('Bon de commande',
   'Entretien général des postes électriques',
   'NOUVELLE CONSERVERIE BOUJDOUR', 'Annuelle', 1, 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien des postes de transformation',
   'QUALIAGRO - STATION SOUSSIA', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien des postes de livraison et de transformation',
   'NUOVA ONDAMAR', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien des postes de livraison et de transformation',
   'BELMA', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien des postes de livraison et de transformation',
   'STE INTERNATIONALE POUR L''AGRICULTURE ET L''AGRO INDUSTRIE', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien des postes de transformation',
   'MINOTERIE ITRANE', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien des postes de livraison et de transformation',
   'ZENITH PHARMA', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien des postes de livraison et de transformation',
   'COOPERATIVE M''BROUKA', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien des postes de livraison et de transformation',
   'SOREMED', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien des postes de livraison et de transformation',
   'COOPERATIVE AGRICOLE MAROCAIN DU SUD', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien des postes de livraison et de transformation',
   'LDAF', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien des postes de livraison et de transformation',
   'COPAG', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien des postes de livraison et de transformation (Agence Houara)',
   'COPAG', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien du poste électrique - Agence COPAG Houara',
   'COOPERATIVE AGRICOLE MAROCAIN DU SUD', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Travaux d''entretien du groupe électrogène',
   'AGADIR ICE', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien des postes de livraison et de transformation',
   'Quality Bean Morocco', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien des postes de transformation',
   'COOPERATIVE M''BROUKA', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien des postes de livraison et de transformation',
   'QUALITY SEA PRODUCT', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien du poste de transformation et du groupe électrogène',
   'Coopérative Comaprim', 'Annuelle', 1);

INSERT INTO planning_preventif (nature, description, client, frequence, mois_6) VALUES
  ('Bon de commande',
   'Entretien du poste de transformation et de deux groupes électrogènes',
   'LINA SOUSS', 'Annuelle', 1);
