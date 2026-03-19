import { Hono } from 'hono'

type Bindings = { DB: D1Database }
const app = new Hono<{ Bindings: Bindings }>()

// GET /api/planning — liste des plans de maintenance
app.get('/', async (c) => {
  const { month, year, technician_id, active } = c.req.query()
  let conditions: string[] = []
  let params: any[] = []

  if (active !== undefined) { conditions.push("active = ?"); params.push(active === 'true' ? 1 : 0) }
  if (technician_id) { conditions.push("technician_id = ?"); params.push(technician_id) }
  if (month && year) {
    conditions.push("strftime('%Y-%m', next_date) = ?")
    params.push(`${year}-${month.padStart(2, '0')}`)
  } else if (year) {
    conditions.push("strftime('%Y', next_date) = ?")
    params.push(year)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const rows = await c.env.DB.prepare(
    `SELECT * FROM maintenance_plans ${where} ORDER BY next_date ASC`
  ).bind(...params).all()
  return c.json({ data: rows.results })
})

// GET /api/planning/calendar/:year/:month — vue calendrier
app.get('/calendar/:year/:month', async (c) => {
  const { year, month } = c.req.param()
  const yearMonth = `${year}-${month.padStart(2, '0')}`

  const plans = await c.env.DB.prepare(
    `SELECT * FROM maintenance_plans WHERE strftime('%Y-%m', next_date) = ? AND active = 1 ORDER BY next_date ASC`
  ).bind(yearMonth).all()

  const plannedInterventions = await c.env.DB.prepare(
    `SELECT * FROM interventions 
     WHERE strftime('%Y-%m', scheduled_date) = ? 
     ORDER BY scheduled_date ASC`
  ).bind(yearMonth).all()

  return c.json({
    year: parseInt(year),
    month: parseInt(month),
    maintenance_plans: plans.results,
    planned_interventions: plannedInterventions.results
  })
})

// GET /api/planning/:id
app.get('/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM maintenance_plans WHERE id = ?').bind(c.req.param('id')).first()
  if (!row) return c.json({ error: 'Plan non trouvé' }, 404)
  return c.json(row)
})

// POST /api/planning
app.post('/', async (c) => {
  const body = await c.req.json()
  const {
    title, description, equipment_id, equipment_name, technician_id, technician_name,
    frequency = 'monthly', next_date, duration_hours = 1, priority = 'medium', notes
  } = body
  if (!title) return c.json({ error: 'Le titre est obligatoire' }, 400)
  if (!next_date) return c.json({ error: 'La prochaine date est obligatoire' }, 400)

  const result = await c.env.DB.prepare(`
    INSERT INTO maintenance_plans 
    (title, description, equipment_id, equipment_name, technician_id, technician_name,
     frequency, next_date, duration_hours, priority, notes, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).bind(
    title, description || null, equipment_id || null, equipment_name || null,
    technician_id || null, technician_name || null,
    frequency, next_date, duration_hours, priority, notes || null
  ).run()

  const newRow = await c.env.DB.prepare('SELECT * FROM maintenance_plans WHERE id = ?')
    .bind(result.meta.last_row_id).first()
  return c.json(newRow, 201)
})

// PUT /api/planning/:id
app.put('/:id', async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT * FROM maintenance_plans WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Plan non trouvé' }, 404)

  const body = await c.req.json()
  const {
    title, description, equipment_id, equipment_name, technician_id, technician_name,
    frequency, next_date, last_done_date, duration_hours, priority, active, notes
  } = body

  await c.env.DB.prepare(`
    UPDATE maintenance_plans SET
      title=?, description=?, equipment_id=?, equipment_name=?,
      technician_id=?, technician_name=?, frequency=?, next_date=?,
      last_done_date=?, duration_hours=?, priority=?, active=?, notes=?,
      updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).bind(
    title ?? (existing as any).title, description ?? (existing as any).description,
    equipment_id ?? (existing as any).equipment_id, equipment_name ?? (existing as any).equipment_name,
    technician_id ?? (existing as any).technician_id, technician_name ?? (existing as any).technician_name,
    frequency ?? (existing as any).frequency, next_date ?? (existing as any).next_date,
    last_done_date ?? (existing as any).last_done_date, duration_hours ?? (existing as any).duration_hours,
    priority ?? (existing as any).priority, active !== undefined ? (active ? 1 : 0) : (existing as any).active,
    notes ?? (existing as any).notes, id
  ).run()

  return c.json(await c.env.DB.prepare('SELECT * FROM maintenance_plans WHERE id = ?').bind(id).first())
})

// DELETE /api/planning/:id
app.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT id FROM maintenance_plans WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Plan non trouvé' }, 404)
  await c.env.DB.prepare('DELETE FROM maintenance_plans WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

export default app
