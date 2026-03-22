import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/cloudflare-workers'
import interventionsRoutes from './routes/interventions'
import techniciansRoutes from './routes/technicians'
import equipmentRoutes from './routes/equipment'
import clientsRoutes from './routes/clients'
import planningRoutes from './routes/planning'
import kpiRoutes from './routes/kpi'
import settingsRoutes from './routes/settings'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', logger())
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Static files
app.use('/static/*', serveStatic({ root: './public' }))

// API Routes
app.route('/api/interventions', interventionsRoutes)
app.route('/api/technicians', techniciansRoutes)
app.route('/api/equipment', equipmentRoutes)
app.route('/api/clients', clientsRoutes)
app.route('/api/planning', planningRoutes)
app.route('/api/kpi', kpiRoutes)
app.route('/api/settings', settingsRoutes)

// SPA - toutes les autres routes renvoient l'index.html
app.get('*', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PPrime — GMAO Maintenance</title>
  <link rel="icon" type="image/svg+xml" href="/static/favicon.svg" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/locale/fr.js"></script>
  <!-- Leaflet.js for interactive map -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <link href="/static/styles.css" rel="stylesheet" />
</head>
<body>
  <div id="app"></div>
  <script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
