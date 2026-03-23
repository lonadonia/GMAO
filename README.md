# GMAO — Système de Gestion de Maintenance Assistée par Ordinateur

## Présentation

Application web complète de GMAO (Gestion de Maintenance Assistée par Ordinateur) construite avec **Hono + TypeScript + Cloudflare D1**. Interface moderne dark mode, 100% SPA vanilla JS, sans aucune donnée factice.

## URLs

- **Production** : `https://pprime-gmao.pages.dev`
- **GitHub** : `https://github.com/lonadonia/GMAO`

## Fonctionnalités complètes

### Dashboard KPI (calculés dynamiquement)
- **MTTR** — Temps Moyen de Réparation
- **MTBF** — Temps Moyen Entre Pannes (global + par technicien)
- **Disponibilité** — calculée à partir de MTBF / (MTBF + MTTR)
- **% Préventif vs Correctif**
- **Taux de résolution**
- **Total interventions** par statut, priorité, type
- **Carte interactive Leaflet** — interventions par ville (thème sombre, marqueurs proportionnels)
- Graphiques : mensuel (12 mois), statuts, priorités, top villes, performance techniciens

### KPI Techniciens avancés
- **Temps moyen de réparation** par technicien
- **Temps d'attente moyen** (panne → début intervention)
- **Ranking techniciens** : score composite (résolution 40% + qualité 30% + vitesse 30%)
- **MTBF par technicien** : calculé sur interventions correctives uniquement, affiché en h/j/mois

### Notifications email automatiques ⭐ NEW
- Envoi automatique via **Resend API** (sans SMTP)
- **Cron trigger Cloudflare** toutes les heures (`0 * * * *`)
- **48h avant** une intervention → email de rappel (une seule fois)
- **24h avant** → email urgent (une seule fois)
- **Anti-doublon** : colonnes `email_sent_24h` / `email_sent_48h` en base
- Destinataire configurable via secret Cloudflare `NOTIFICATION_EMAIL`
- **Template HTML** dark mode responsive avec toutes les infos de l'intervention
- Page de gestion dans l'application (preview, statut, reset, trigger manuel)

### Gestion des Interventions (CRUD complet)
- Création / modification / suppression
- Champs : client, équipement, ville, priorité, durée, technicien, statut, arrêt machine, dates
- Filtres : statut, type, priorité, technicien, ville, plage de dates
- Pagination (20 par page)
- Vue détaillée dans modal

### Gestion des Techniciens
- Fiche technicien : nom, email, téléphone, spécialité, note (0–5 étoiles)
- KPIs automatiques par technicien : nombre d'interventions, résolutions, durée moyenne, taux de résolution

### Équipements, Clients, Planning, Rapports
- CRUD complet pour chaque module
- Planning calendrier mensuel avec maintenance préventive
- Rapports filtrables (période, ville, technicien)

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Backend | **Hono** (TypeScript) |
| Base de données | **Cloudflare D1** (SQLite) |
| Build | **Vite** + @hono/vite-cloudflare-pages |
| Déploiement | **Cloudflare Pages** |
| Email | **Resend API** |
| Cron | **Cloudflare Cron Triggers** |
| Frontend | SPA Vanilla JS |
| Style | Tailwind CSS CDN + CSS custom |
| Charts | Chart.js 4 |
| Carte | Leaflet.js 1.9 |
| HTTP client | Axios |
| Dates | Day.js (fr) |

## Structure du projet

```
webapp/
├── src/
│   ├── index.tsx                # Point d'entrée Hono + cron handler
│   └── routes/
│       ├── interventions.ts     # CRUD interventions
│       ├── technicians.ts       # CRUD techniciens
│       ├── equipment.ts         # CRUD équipements
│       ├── clients.ts           # CRUD clients
│       ├── planning.ts          # CRUD planning + calendrier
│       ├── kpi.ts               # KPIs dynamiques + MTBF/technicien
│       ├── settings.ts          # Paramètres GMAO
│       └── notifications.ts     # ⭐ Notifications email automatiques
├── public/static/
│   ├── app.js                   # Frontend SPA complet (~70KB)
│   ├── styles.css               # Thème dark personnalisé
│   └── favicon.svg
├── migrations/
│   ├── 0001_initial_schema.sql
│   ├── 0002_settings.sql
│   ├── 0003_planning_preventif.sql
│   ├── 0004_interventions_excel_fields.sql
│   └── 0005_email_notifications.sql  # ⭐ Colonnes email_sent_24h/48h
├── .dev.vars                    # Variables locales (non commité)
├── ecosystem.config.cjs         # PM2 config
├── wrangler.jsonc               # Cloudflare config (+ cron trigger)
└── package.json
```

## API REST

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/kpi` | KPIs + charts (filtres: date_from, date_to, city, technician_id) |
| GET/POST | `/api/interventions` | Liste + création |
| GET/PUT/DELETE | `/api/interventions/:id` | CRUD intervention |
| GET/POST | `/api/technicians` | CRUD techniciens |
| GET | `/api/technicians/:id/interventions` | Interventions d'un technicien |
| GET/POST | `/api/equipment` | CRUD équipements |
| GET/POST | `/api/clients` | CRUD clients |
| GET/POST | `/api/planning` | Plans de maintenance |
| GET | `/api/planning/calendar/:year/:month` | Vue calendrier |
| GET | `/api/notifications/preview` | ⭐ Interventions à notifier (48h) |
| GET | `/api/notifications/check` | ⭐ Déclencher la vérification |
| GET | `/api/notifications/status` | ⭐ Statut de tous les flags email |
| POST | `/api/notifications/reset/:id` | ⭐ Réinitialiser les flags |

## Schéma Base de Données (D1)

- `interventions` — Interventions de maintenance (+ `email_sent_24h`, `email_sent_48h`)
- `technicians` — Techniciens (Ali = Mécanique, Mohamed = Électrique)
- `equipment` — Équipements / machines
- `clients` — Clients
- `maintenance_plans` — Plans de maintenance préventive
- `gmao_settings` — Paramètres de configuration

## Activation des notifications email en production

### 1. Créer un compte Resend (gratuit)
```
https://resend.com → Sign up → API Keys → Create API Key
```

### 2. Ajouter les secrets Cloudflare Pages
```bash
npx wrangler pages secret put RESEND_API_KEY --project-name pprime-gmao
# Entrer votre clé: re_xxxxxxxxxxxx

npx wrangler pages secret put NOTIFICATION_EMAIL --project-name pprime-gmao
# Entrer: mfs326467@gmail.com
```

### 3. Déployer en production
```bash
npm run build
npx wrangler pages deploy dist --project-name pprime-gmao
```

### 4. Appliquer la migration en production
```bash
npx wrangler d1 migrations apply gmao-production
```

### 5. Vérifier le cron trigger
Dans le dashboard Cloudflare Pages → votre projet → Settings → Functions → Cron Triggers
Le cron `0 * * * *` doit apparaître (exécution toutes les heures).

## Développement local

```bash
# Installer les dépendances
npm install

# Appliquer toutes les migrations localement
npm run db:migrate:local

# Build
npm run build

# Démarrer avec PM2
pm2 start ecosystem.config.cjs

# Tester les notifications (sans vraie clé Resend = erreur 401 attendue)
curl http://localhost:3000/api/notifications/preview
curl http://localhost:3000/api/notifications/check
```

## Variables d'environnement

| Variable | Local (`.dev.vars`) | Production (Cloudflare secret) |
|----------|--------------------|---------------------------------|
| `RESEND_API_KEY` | `re_REPLACE_WITH_YOUR_KEY` | Votre vraie clé Resend |
| `NOTIFICATION_EMAIL` | `mfs326467@gmail.com` | Adresse de réception |

## Statut

- ✅ Backend API complet (8 routes)
- ✅ Dashboard KPI dynamique (MTTR, MTBF, Disponibilité, etc.)
- ✅ Carte interactive Leaflet (interventions par ville)
- ✅ MTBF par technicien (calcul sur interventions correctives)
- ✅ Ranking techniciens (résolution + qualité + vitesse)
- ✅ CRUD Interventions avec filtres avancés
- ✅ CRUD Techniciens avec KPIs de performance
- ✅ CRUD Équipements, Clients, Planning
- ✅ Rapports avec filtres
- ✅ **Notifications email automatiques** (Resend + cron Cloudflare)
- ✅ Design dark mode moderne
- ✅ Base de données D1 SQLite
- ⏳ Activation production : nécessite clé Resend + secrets Cloudflare
