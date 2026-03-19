# GMAO — Système de Gestion de Maintenance Assistée par Ordinateur

## Présentation

Application web complète de GMAO (Gestion de Maintenance Assistée par Ordinateur) construite avec **Hono + TypeScript + Cloudflare D1**. Interface moderne dark mode, 100% SPA vanilla JS, sans aucune donnée factice.

## URL

- **Sandbox** : `https://3000-iczdlvmk1sh5ss8fnwij1-b32ec7bb.sandbox.novita.ai`

## Fonctionnalités complètes

### Dashboard KPI (calculés dynamiquement)
- **MTTR** — Temps Moyen de Réparation
- **MTBF** — Temps Moyen Entre Pannes
- **Disponibilité** — calculée à partir de MTBF / (MTBF + MTTR)
- **% Préventif vs Correctif**
- **Taux de résolution**
- **Total interventions** par statut, priorité, type
- Graphiques : mensuel (12 mois), statuts, priorités, top villes, performance techniciens

### Gestion des Interventions (CRUD complet)
- Création / modification / suppression
- Champs : client, équipement, ville, priorité, durée, technicien, statut, arrêt machine, dates
- Filtres : statut, type, priorité, technicien, ville, plage de dates
- Pagination (20 par page)
- Vue détaillée dans modal

### Gestion des Techniciens
- Fiche technicien : nom, email, téléphone, spécialité, note (0–5 étoiles)
- KPIs automatiques par technicien : nombre d'interventions, résolutions, durée moyenne, taux de résolution
- Barre de progression visuelle des performances

### Équipements
- Référencement du parc machines
- Champs : nom, référence, catégorie, client, ville, emplacement, date d'installation, statut

### Clients
- Répertoire clients avec contact, email, téléphone, adresse, ville

### Planning / Calendrier
- Vue calendrier mensuel (navigation mois/mois)
- Plans de maintenance préventive : fréquence (quotidien, hebdo, mensuel, trimestriel, annuel)
- Affichage des interventions planifiées sur le calendrier

### Rapports avec filtres
- Filtres : période (de/à), ville, technicien
- Performance par technicien avec barres de progression
- Répartition par ville avec pourcentages

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Backend | **Hono** (TypeScript) |
| Base de données | **Cloudflare D1** (SQLite) |
| Build | **Vite** + @hono/vite-build |
| Déploiement | **Cloudflare Pages** |
| Frontend | SPA Vanilla JS |
| Style | Tailwind CSS CDN + CSS custom |
| Charts | Chart.js 4 |
| HTTP client | Axios |
| Dates | Day.js (fr) |

## Structure du projet

```
webapp/
├── src/
│   ├── index.tsx              # Point d'entrée Hono + routing SPA
│   └── routes/
│       ├── interventions.ts   # CRUD interventions
│       ├── technicians.ts     # CRUD techniciens
│       ├── equipment.ts       # CRUD équipements
│       ├── clients.ts         # CRUD clients
│       ├── planning.ts        # CRUD planning + calendrier
│       └── kpi.ts             # KPIs dynamiques
├── public/static/
│   ├── app.js                 # Frontend SPA complet (~92KB)
│   ├── styles.css             # Thème dark personnalisé
│   └── favicon.svg
├── migrations/
│   └── 0001_initial_schema.sql
├── ecosystem.config.cjs       # PM2 config
├── wrangler.jsonc             # Cloudflare config
└── package.json
```

## API REST

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/kpi` | KPIs + charts (filtres: date_from, date_to, city, technician_id) |
| GET/POST | `/api/interventions` | Liste + création (filtres: status, type, priority, city, technician_id, date) |
| GET/PUT/DELETE | `/api/interventions/:id` | Détail, modification, suppression |
| GET/POST | `/api/technicians` | Liste + création |
| GET/PUT/DELETE | `/api/technicians/:id` | CRUD technicien |
| GET | `/api/technicians/:id/interventions` | Interventions d'un technicien |
| GET/POST | `/api/equipment` | CRUD équipements |
| GET/POST | `/api/clients` | CRUD clients |
| GET/POST | `/api/planning` | Plans de maintenance |
| GET | `/api/planning/calendar/:year/:month` | Vue calendrier |

## Schéma Base de Données (D1)

- `interventions` — Interventions de maintenance
- `technicians` — Techniciens
- `equipment` — Équipements / machines
- `clients` — Clients
- `maintenance_plans` — Plans de maintenance préventive

## Démarrage local

```bash
# Installer les dépendances
npm install

# Appliquer les migrations localement
npm run db:migrate:local

# Build
npm run build

# Démarrer avec PM2
pm2 start ecosystem.config.cjs

# Ou directement
npm run dev:sandbox
```

## Déploiement Cloudflare Pages

```bash
# 1. Créer la base D1 production
npx wrangler d1 create gmao-production
# → Copier le database_id dans wrangler.jsonc

# 2. Appliquer les migrations production
npm run db:migrate:prod

# 3. Build + deploy
npm run deploy:prod
```

## Important

- **Aucune donnée factice** : le système démarre vide, prêt pour vos données réelles
- Toutes les valeurs (KPIs, statistiques, graphiques) sont calculées dynamiquement depuis la base de données
- L'interface s'adapte automatiquement quand vous ajoutez des données

## Statut

- ✅ Backend API complet (6 routes)
- ✅ Dashboard KPI dynamique (MTTR, MTBF, Disponibilité, etc.)
- ✅ CRUD Interventions avec filtres
- ✅ CRUD Techniciens avec KPIs de performance
- ✅ CRUD Équipements
- ✅ CRUD Clients
- ✅ Planning calendrier mensuel
- ✅ Rapports avec filtres avancés
- ✅ Design dark mode moderne
- ✅ Base de données D1 SQLite
