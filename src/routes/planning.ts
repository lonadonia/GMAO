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

// ============================================================
// PLANNING PRÉVENTIF CONTRACTUEL (planning_preventif)
// IMPORTANT: Ces routes doivent être définies AVANT /:id
// ============================================================

// GET /api/planning/preventif — liste complète avec filtres
app.get('/preventif', async (c) => {
  const { nature, client, frequence, annee, fait } = c.req.query()
  let conditions: string[] = []
  let params: any[] = []

  if (nature)    { conditions.push("nature = ?");    params.push(nature) }
  if (client)    { conditions.push("client LIKE ?"); params.push(`%${client}%`) }
  if (frequence) { conditions.push("frequence = ?"); params.push(frequence) }
  if (annee)     { conditions.push("annee = ?");     params.push(parseInt(annee)) }
  if (fait !== undefined && fait !== '') {
    conditions.push("fait = ?")
    params.push(fait === 'true' ? 1 : 0)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const rows = await c.env.DB.prepare(
    `SELECT * FROM planning_preventif ${where} ORDER BY nature ASC, client ASC`
  ).bind(...params).all()

  // Stats globales (toujours sur toute l'année sélectionnée)
  const statsWhere = annee ? `WHERE annee = ${parseInt(annee)}` : ''
  const stats = await c.env.DB.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(fait) as fait_count,
      COUNT(*) - SUM(fait) as en_attente_count,
      SUM(CASE WHEN nature='Contrat de maintenance' THEN 1 ELSE 0 END) as contrats,
      SUM(CASE WHEN nature='Bon de commande' THEN 1 ELSE 0 END) as bons_commande,
      SUM(CASE WHEN frequence='Trimestrielle' THEN 1 ELSE 0 END) as trimestriel,
      SUM(CASE WHEN frequence='Semestrielle' THEN 1 ELSE 0 END) as semestriel,
      SUM(CASE WHEN frequence='Annuelle' THEN 1 ELSE 0 END) as annuel
    FROM planning_preventif ${statsWhere}
  `).first()

  return c.json({ data: rows.results, stats })
})

// GET /api/planning/preventif/mois/:mois — interventions prévues ce mois (par date_planifiee EXACTE uniquement)
app.get('/preventif/mois/:mois', async (c) => {
  const mois = parseInt(c.req.param('mois'))
  const annee = parseInt(c.req.query('annee') || '2026')
  if (mois < 1 || mois > 12) return c.json({ error: 'Mois invalide (1-12)' }, 400)

  const monthStr = `${annee}-${String(mois).padStart(2,'0')}`

  // Uniquement les entrées avec date_planifiee dans ce mois — PAS de fallback
  const rows = await c.env.DB.prepare(
    `SELECT * FROM planning_preventif 
     WHERE annee = ?
       AND date_planifiee IS NOT NULL
       AND strftime('%Y-%m', date_planifiee) = ?
     ORDER BY date_planifiee ASC, client ASC`
  ).bind(annee, monthStr).all()
  return c.json({ mois, data: rows.results, count: rows.results.length })
})

// POST /api/planning/preventif — créer une nouvelle entrée
app.post('/preventif', async (c) => {
  const body = await c.req.json()
  const {
    nature = 'Contrat de maintenance', description, client, frequence = 'Annuelle',
    fait = 0, annee = 2026, notes,
    mois_1=0,mois_2=0,mois_3=0,mois_4=0,mois_5=0,mois_6=0,
    mois_7=0,mois_8=0,mois_9=0,mois_10=0,mois_11=0,mois_12=0
  } = body
  if (!description) return c.json({ error: 'La description est obligatoire' }, 400)
  if (!client)      return c.json({ error: 'Le client est obligatoire' }, 400)

  const result = await c.env.DB.prepare(`
    INSERT INTO planning_preventif 
    (nature, description, client, frequence, fait, annee, notes,
     mois_1,mois_2,mois_3,mois_4,mois_5,mois_6,
     mois_7,mois_8,mois_9,mois_10,mois_11,mois_12)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).bind(
    nature, description, client, frequence, fait?1:0, annee, notes||null,
    mois_1?1:0,mois_2?1:0,mois_3?1:0,mois_4?1:0,mois_5?1:0,mois_6?1:0,
    mois_7?1:0,mois_8?1:0,mois_9?1:0,mois_10?1:0,mois_11?1:0,mois_12?1:0
  ).run()

  const newRow = await c.env.DB.prepare('SELECT * FROM planning_preventif WHERE id = ?')
    .bind(result.meta.last_row_id).first()
  return c.json(newRow, 201)
})

// PUT /api/planning/preventif/:id — mettre à jour
app.put('/preventif/:id', async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT * FROM planning_preventif WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Entrée non trouvée' }, 404)

  const body = await c.req.json()
  const e = existing as any

  await c.env.DB.prepare(`
    UPDATE planning_preventif SET
      nature=?, description=?, client=?, frequence=?, fait=?, annee=?, notes=?,
      mois_1=?,mois_2=?,mois_3=?,mois_4=?,mois_5=?,mois_6=?,
      mois_7=?,mois_8=?,mois_9=?,mois_10=?,mois_11=?,mois_12=?,
      updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).bind(
    body.nature     ?? e.nature,
    body.description?? e.description,
    body.client     ?? e.client,
    body.frequence  ?? e.frequence,
    body.fait !== undefined ? (body.fait?1:0) : e.fait,
    body.annee      ?? e.annee,
    body.notes      !== undefined ? (body.notes||null) : e.notes,
    body.mois_1  !== undefined ? (body.mois_1 ?1:0) : e.mois_1,
    body.mois_2  !== undefined ? (body.mois_2 ?1:0) : e.mois_2,
    body.mois_3  !== undefined ? (body.mois_3 ?1:0) : e.mois_3,
    body.mois_4  !== undefined ? (body.mois_4 ?1:0) : e.mois_4,
    body.mois_5  !== undefined ? (body.mois_5 ?1:0) : e.mois_5,
    body.mois_6  !== undefined ? (body.mois_6 ?1:0) : e.mois_6,
    body.mois_7  !== undefined ? (body.mois_7 ?1:0) : e.mois_7,
    body.mois_8  !== undefined ? (body.mois_8 ?1:0) : e.mois_8,
    body.mois_9  !== undefined ? (body.mois_9 ?1:0) : e.mois_9,
    body.mois_10 !== undefined ? (body.mois_10?1:0) : e.mois_10,
    body.mois_11 !== undefined ? (body.mois_11?1:0) : e.mois_11,
    body.mois_12 !== undefined ? (body.mois_12?1:0) : e.mois_12,
    id
  ).run()

  return c.json(await c.env.DB.prepare('SELECT * FROM planning_preventif WHERE id = ?').bind(id).first())
})

// PATCH /api/planning/preventif/:id/fait — toggle fait/non fait
app.patch('/preventif/:id/fait', async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT fait FROM planning_preventif WHERE id = ?').bind(id).first() as any
  if (!existing) return c.json({ error: 'Entrée non trouvée' }, 404)
  const newFait = existing.fait ? 0 : 1
  await c.env.DB.prepare('UPDATE planning_preventif SET fait=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .bind(newFait, id).run()
  return c.json({ id: parseInt(id), fait: newFait === 1 })
})

// DELETE /api/planning/preventif/:id
app.delete('/preventif/:id', async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT id FROM planning_preventif WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: 'Entrée non trouvée' }, 404)
  await c.env.DB.prepare('DELETE FROM planning_preventif WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

// ============================================================
// PLANS DE MAINTENANCE (maintenance_plans) — routes génériques
// Ces routes doivent être après les routes /preventif
// ============================================================

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
    frequency = 'monthly', next_date, duration_hours = 1, priority = 'medium', notes,
    start_date, start_time = '08:00', notification_date, notification_emails
  } = body
  if (!title) return c.json({ error: 'Le titre est obligatoire' }, 400)
  if (!next_date) return c.json({ error: 'La prochaine date est obligatoire' }, 400)

  const result = await c.env.DB.prepare(`
    INSERT INTO maintenance_plans 
    (title, description, equipment_id, equipment_name, technician_id, technician_name,
     frequency, next_date, duration_hours, priority, notes, active,
     start_date, start_time, notification_date, notification_emails)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
  `).bind(
    title, description || null, equipment_id || null, equipment_name || null,
    technician_id || null, technician_name || null,
    frequency, next_date, duration_hours, priority, notes || null,
    start_date || null, start_time || '08:00',
    notification_date || null, notification_emails || 'mfs326467@gmail.com'
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
    frequency, next_date, last_done_date, duration_hours, priority, active, notes,
    start_date, start_time, notification_date, notification_emails
  } = body

  await c.env.DB.prepare(`
    UPDATE maintenance_plans SET
      title=?, description=?, equipment_id=?, equipment_name=?,
      technician_id=?, technician_name=?, frequency=?, next_date=?,
      last_done_date=?, duration_hours=?, priority=?, active=?, notes=?,
      start_date=?, start_time=?, notification_date=?, notification_emails=?,
      updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).bind(
    title ?? (existing as any).title, description ?? (existing as any).description,
    equipment_id ?? (existing as any).equipment_id, equipment_name ?? (existing as any).equipment_name,
    technician_id ?? (existing as any).technician_id, technician_name ?? (existing as any).technician_name,
    frequency ?? (existing as any).frequency, next_date ?? (existing as any).next_date,
    last_done_date ?? (existing as any).last_done_date, duration_hours ?? (existing as any).duration_hours,
    priority ?? (existing as any).priority, active !== undefined ? (active ? 1 : 0) : (existing as any).active,
    notes ?? (existing as any).notes,
    start_date !== undefined ? (start_date || null) : (existing as any).start_date,
    start_time ?? (existing as any).start_time ?? '08:00',
    notification_date !== undefined ? (notification_date || null) : (existing as any).notification_date,
    notification_emails ?? (existing as any).notification_emails ?? 'mfs326467@gmail.com',
    id
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
