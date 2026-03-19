import { Hono } from 'hono'

type Bindings = { DB: D1Database }
const app = new Hono<{ Bindings: Bindings }>()

// GET /api/interventions — liste avec filtres
app.get('/', async (c) => {
  const { status, city, technician_id, type, priority, date_from, date_to, page, limit } = c.req.query()
  const pageNum = parseInt(page || '1')
  const limitNum = parseInt(limit || '50')
  const offset = (pageNum - 1) * limitNum

  let conditions: string[] = []
  let params: any[] = []

  if (status) { conditions.push("status = ?"); params.push(status) }
  if (city) { conditions.push("city LIKE ?"); params.push(`%${city}%`) }
  if (technician_id) { conditions.push("technician_id = ?"); params.push(technician_id) }
  if (type) { conditions.push("type = ?"); params.push(type) }
  if (priority) { conditions.push("priority = ?"); params.push(priority) }
  if (date_from) { conditions.push("(scheduled_date >= ? OR created_at >= ?)"); params.push(date_from, date_from) }
  if (date_to) { conditions.push("(scheduled_date <= ? OR created_at <= ?)"); params.push(date_to, date_to) }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const countResult = await c.env.DB.prepare(
    `SELECT COUNT(*) as total FROM interventions ${where}`
  ).bind(...params).first<{ total: number }>()

  const rows = await c.env.DB.prepare(
    `SELECT * FROM interventions ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).bind(...params, limitNum, offset).all()

  return c.json({
    data: rows.results,
    total: countResult?.total || 0,
    page: pageNum,
    limit: limitNum,
    pages: Math.ceil((countResult?.total || 0) / limitNum)
  })
})

// GET /api/interventions/:id
app.get('/:id', async (c) => {
  const id = c.req.param('id')
  const row = await c.env.DB.prepare('SELECT * FROM interventions WHERE id = ?').bind(id).first()
  if (!row) return c.json({ error: 'Intervention non trouvée' }, 404)
  return c.json(row)
})

// POST /api/interventions
app.post('/', async (c) => {
  const body = await c.req.json()
  const {
    title, description, type = 'corrective', status = 'in_progress',
    priority = 'medium', client, equipment, city,
    technician_id, technician_name, downtime = 0, duration_hours = 0,
    scheduled_date, start_date, end_date, failure_date, notes
  } = body

  if (!title) return c.json({ error: 'Le titre est obligatoire' }, 400)

  const result = await c.env.DB.prepare(`
    INSERT INTO interventions 
    (title, description, type, status, priority, client, equipment, city,
     technician_id, technician_name, downtime, duration_hours,
     scheduled_date, start_date, end_date, failure_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    title, description || null, type, status, priority,
    client || null, equipment || null, city || null,
    technician_id || null, technician_name || null,
    downtime ? 1 : 0, duration_hours,
    scheduled_date || null, start_date || null, end_date || null,
    failure_date || null, notes || null
  ).run()

  const newRow = await c.env.DB.prepare('SELECT * FROM interventions WHERE id = ?')
    .bind(result.meta.last_row_id).first()

  return c.json(newRow, 201)
})

// PUT /api/interventions/:id
app.put('/:id', async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT * FROM interventions WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Intervention non trouvée' }, 404)

  const body = await c.req.json()
  const {
    title, description, type, status, priority, client, equipment, city,
    technician_id, technician_name, downtime, duration_hours,
    scheduled_date, start_date, end_date, failure_date, notes
  } = body

  await c.env.DB.prepare(`
    UPDATE interventions SET
      title = ?, description = ?, type = ?, status = ?, priority = ?,
      client = ?, equipment = ?, city = ?,
      technician_id = ?, technician_name = ?, downtime = ?, duration_hours = ?,
      scheduled_date = ?, start_date = ?, end_date = ?, failure_date = ?,
      notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    title ?? (existing as any).title,
    description ?? (existing as any).description,
    type ?? (existing as any).type,
    status ?? (existing as any).status,
    priority ?? (existing as any).priority,
    client ?? (existing as any).client,
    equipment ?? (existing as any).equipment,
    city ?? (existing as any).city,
    technician_id !== undefined ? technician_id : (existing as any).technician_id,
    technician_name ?? (existing as any).technician_name,
    downtime !== undefined ? (downtime ? 1 : 0) : (existing as any).downtime,
    duration_hours ?? (existing as any).duration_hours,
    scheduled_date ?? (existing as any).scheduled_date,
    start_date ?? (existing as any).start_date,
    end_date ?? (existing as any).end_date,
    failure_date ?? (existing as any).failure_date,
    notes ?? (existing as any).notes,
    id
  ).run()

  const updated = await c.env.DB.prepare('SELECT * FROM interventions WHERE id = ?').bind(id).first()
  return c.json(updated)
})

// DELETE /api/interventions/:id
app.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT id FROM interventions WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Intervention non trouvée' }, 404)
  await c.env.DB.prepare('DELETE FROM interventions WHERE id = ?').bind(id).run()
  return c.json({ success: true, message: 'Intervention supprimée' })
})

export default app
