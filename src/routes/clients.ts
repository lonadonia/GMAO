import { Hono } from 'hono'

type Bindings = { DB: D1Database }
const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM clients ORDER BY name ASC').all()
  return c.json({ data: rows.results })
})

app.get('/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM clients WHERE id = ?').bind(c.req.param('id')).first()
  if (!row) return c.json({ error: 'Client non trouvé' }, 404)
  return c.json(row)
})

app.post('/', async (c) => {
  const body = await c.req.json()
  const { name, contact_name, email, phone, address, city } = body
  if (!name) return c.json({ error: 'Le nom est obligatoire' }, 400)
  const result = await c.env.DB.prepare(
    'INSERT INTO clients (name, contact_name, email, phone, address, city) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(name, contact_name || null, email || null, phone || null, address || null, city || null).run()
  const newRow = await c.env.DB.prepare('SELECT * FROM clients WHERE id = ?').bind(result.meta.last_row_id).first()
  return c.json(newRow, 201)
})

app.put('/:id', async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT * FROM clients WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Client non trouvé' }, 404)
  const { name, contact_name, email, phone, address, city } = await c.req.json()
  await c.env.DB.prepare(
    'UPDATE clients SET name=?, contact_name=?, email=?, phone=?, address=?, city=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).bind(
    name ?? (existing as any).name, contact_name ?? (existing as any).contact_name,
    email ?? (existing as any).email, phone ?? (existing as any).phone,
    address ?? (existing as any).address, city ?? (existing as any).city, id
  ).run()
  return c.json(await c.env.DB.prepare('SELECT * FROM clients WHERE id = ?').bind(id).first())
})

app.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT id FROM clients WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Client non trouvé' }, 404)
  await c.env.DB.prepare('DELETE FROM clients WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

export default app
