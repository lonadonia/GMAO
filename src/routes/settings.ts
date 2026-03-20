import { Hono } from 'hono'

type Bindings = { DB: D1Database }
const app = new Hono<{ Bindings: Bindings }>()

// GET /api/settings — retourne tous les paramètres
app.get('/', async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT key, value FROM settings ORDER BY key`
  ).all<{ key: string; value: string }>()

  const result: Record<string, string> = {}
  for (const row of rows.results) {
    result[row.key] = row.value
  }
  return c.json(result)
})

// GET /api/settings/:key
app.get('/:key', async (c) => {
  const key = c.req.param('key')
  const row = await c.env.DB.prepare(
    `SELECT value FROM settings WHERE key = ?`
  ).bind(key).first<{ value: string }>()

  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json({ key, value: row.value })
})

// PUT /api/settings — upsert multiple keys at once
// Body: { key1: value1, key2: value2, ... }
app.put('/', async (c) => {
  const body = await c.req.json<Record<string, string>>()

  const stmts = Object.entries(body).map(([key, value]) =>
    c.env.DB.prepare(
      `INSERT INTO settings (key, value, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    ).bind(key, value)
  )

  if (stmts.length > 0) {
    await c.env.DB.batch(stmts)
  }

  return c.json({ success: true, updated: Object.keys(body).length })
})

// PUT /api/settings/:key — upsert single key
app.put('/:key', async (c) => {
  const key = c.req.param('key')
  const body = await c.req.json<{ value: string }>()

  await c.env.DB.prepare(
    `INSERT INTO settings (key, value, updated_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  ).bind(key, body.value).run()

  return c.json({ success: true, key, value: body.value })
})

export default app
