import { Hono } from 'hono'

type Bindings = { DB: D1Database }
const app = new Hono<{ Bindings: Bindings }>()

// GET /api/equipment
app.get('/', async (c) => {
  const { city, client, status } = c.req.query()
  let conditions: string[] = []
  let params: any[] = []
  if (city) { conditions.push("city LIKE ?"); params.push(`%${city}%`) }
  if (client) { conditions.push("client LIKE ?"); params.push(`%${client}%`) }
  if (status) { conditions.push("status = ?"); params.push(status) }
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const rows = await c.env.DB.prepare(`SELECT * FROM equipment ${where} ORDER BY name ASC`).bind(...params).all()
  return c.json({ data: rows.results })
})

// GET /api/equipment/:id
app.get('/:id', async (c) => {
  const id = c.req.param('id')
  const row = await c.env.DB.prepare('SELECT * FROM equipment WHERE id = ?').bind(id).first()
  if (!row) return c.json({ error: 'Équipement non trouvé' }, 404)
  return c.json(row)
})

// POST /api/equipment
app.post('/', async (c) => {
  const body = await c.req.json()
  const { name, reference, category, location, city, client, installation_date, status = 'operational', notes } = body
  if (!name) return c.json({ error: 'Le nom est obligatoire' }, 400)

  const result = await c.env.DB.prepare(`
    INSERT INTO equipment (name, reference, category, location, city, client, installation_date, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(name, reference || null, category || null, location || null, city || null, client || null, installation_date || null, status, notes || null).run()

  const newRow = await c.env.DB.prepare('SELECT * FROM equipment WHERE id = ?').bind(result.meta.last_row_id).first()
  return c.json(newRow, 201)
})

// PUT /api/equipment/:id
app.put('/:id', async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT * FROM equipment WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Équipement non trouvé' }, 404)

  const body = await c.req.json()
  const { name, reference, category, location, city, client, installation_date, last_maintenance_date, status, notes } = body

  await c.env.DB.prepare(`
    UPDATE equipment SET name=?, reference=?, category=?, location=?, city=?, client=?,
      installation_date=?, last_maintenance_date=?, status=?, notes=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).bind(
    name ?? (existing as any).name, reference ?? (existing as any).reference,
    category ?? (existing as any).category, location ?? (existing as any).location,
    city ?? (existing as any).city, client ?? (existing as any).client,
    installation_date ?? (existing as any).installation_date,
    last_maintenance_date ?? (existing as any).last_maintenance_date,
    status ?? (existing as any).status, notes ?? (existing as any).notes, id
  ).run()

  const updated = await c.env.DB.prepare('SELECT * FROM equipment WHERE id = ?').bind(id).first()
  return c.json(updated)
})

// DELETE /api/equipment/:id
app.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT id FROM equipment WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Équipement non trouvé' }, 404)
  await c.env.DB.prepare('DELETE FROM equipment WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

export default app
