import { Hono } from 'hono'

type Bindings = { DB: D1Database }
const app = new Hono<{ Bindings: Bindings }>()

// GET /api/technicians
app.get('/', async (c) => {
  const rows = await c.env.DB.prepare(`
    SELECT 
      t.*,
      COUNT(i.id) as total_interventions,
      SUM(CASE WHEN i.status = 'resolved' THEN 1 ELSE 0 END) as resolved_count,
      ROUND(AVG(i.duration_hours), 2) as avg_duration,
      ROUND(
        CASE WHEN COUNT(i.id) > 0 
          THEN (SUM(CASE WHEN i.status = 'resolved' THEN 1 ELSE 0 END) * 100.0 / COUNT(i.id))
          ELSE 0 
        END, 1
      ) as resolution_rate
    FROM technicians t
    LEFT JOIN interventions i ON t.id = i.technician_id
    GROUP BY t.id
    ORDER BY t.name ASC
  `).all()
  return c.json({ data: rows.results })
})

// GET /api/technicians/:id
app.get('/:id', async (c) => {
  const id = c.req.param('id')
  const row = await c.env.DB.prepare(`
    SELECT 
      t.*,
      COUNT(i.id) as total_interventions,
      SUM(CASE WHEN i.status = 'resolved' THEN 1 ELSE 0 END) as resolved_count,
      ROUND(AVG(i.duration_hours), 2) as avg_duration,
      ROUND(
        CASE WHEN COUNT(i.id) > 0 
          THEN (SUM(CASE WHEN i.status = 'resolved' THEN 1 ELSE 0 END) * 100.0 / COUNT(i.id))
          ELSE 0 
        END, 1
      ) as resolution_rate
    FROM technicians t
    LEFT JOIN interventions i ON t.id = i.technician_id
    WHERE t.id = ?
    GROUP BY t.id
  `).bind(id).first()
  if (!row) return c.json({ error: 'Technicien non trouvé' }, 404)
  return c.json(row)
})

// GET /api/technicians/:id/interventions
app.get('/:id/interventions', async (c) => {
  const id = c.req.param('id')
  const rows = await c.env.DB.prepare(
    'SELECT * FROM interventions WHERE technician_id = ? ORDER BY created_at DESC'
  ).bind(id).all()
  return c.json({ data: rows.results })
})

// POST /api/technicians
app.post('/', async (c) => {
  const body = await c.req.json()
  const { name, email, phone, specialty, rating = 0 } = body
  if (!name) return c.json({ error: 'Le nom est obligatoire' }, 400)

  const result = await c.env.DB.prepare(`
    INSERT INTO technicians (name, email, phone, specialty, rating)
    VALUES (?, ?, ?, ?, ?)
  `).bind(name, email || null, phone || null, specialty || null, rating).run()

  const newRow = await c.env.DB.prepare('SELECT * FROM technicians WHERE id = ?')
    .bind(result.meta.last_row_id).first()
  return c.json(newRow, 201)
})

// PUT /api/technicians/:id
app.put('/:id', async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT * FROM technicians WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Technicien non trouvé' }, 404)

  const body = await c.req.json()
  const { name, email, phone, specialty, rating } = body

  await c.env.DB.prepare(`
    UPDATE technicians SET
      name = ?, email = ?, phone = ?, specialty = ?, rating = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    name ?? (existing as any).name,
    email ?? (existing as any).email,
    phone ?? (existing as any).phone,
    specialty ?? (existing as any).specialty,
    rating ?? (existing as any).rating,
    id
  ).run()

  const updated = await c.env.DB.prepare('SELECT * FROM technicians WHERE id = ?').bind(id).first()
  return c.json(updated)
})

// DELETE /api/technicians/:id
app.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT id FROM technicians WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Technicien non trouvé' }, 404)
  await c.env.DB.prepare('DELETE FROM technicians WHERE id = ?').bind(id).run()
  return c.json({ success: true, message: 'Technicien supprimé' })
})

export default app
