import { Hono } from 'hono'

type Bindings = { DB: D1Database }
const app = new Hono<{ Bindings: Bindings }>()

// ─── helpers ────────────────────────────────────────────────
function now() { return new Date().toISOString().replace('T', ' ').substring(0, 19) }

// ─── LIST all reports (with pagination + filters) ───────────
app.get('/', async (c) => {
  const { DB } = c.env
  const page    = Number(c.req.query('page')  || '1')
  const limit   = Number(c.req.query('limit') || '20')
  const offset  = (page - 1) * limit
  const status  = c.req.query('status') || ''
  const q       = c.req.query('q') || ''

  let where = 'WHERE 1=1'
  const params: (string | number)[] = []

  if (status) { where += ' AND r.status = ?'; params.push(status) }
  if (q) {
    where += ` AND (r.title LIKE ? OR r.client LIKE ? OR r.reference_num LIKE ? OR r.technician_name LIKE ?)`
    const like = `%${q}%`
    params.push(like, like, like, like)
  }

  const [rows, total] = await Promise.all([
    DB.prepare(`
      SELECT r.*,
        (SELECT COUNT(*) FROM report_photos p WHERE p.report_id = r.id) AS photo_count
      FROM intervention_reports r
      ${where}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all(),
    DB.prepare(`SELECT COUNT(*) as cnt FROM intervention_reports r ${where}`)
      .bind(...params).first<{ cnt: number }>()
  ])

  return c.json({
    data:  rows.results,
    total: total?.cnt ?? 0,
    page,
    pages: Math.ceil((total?.cnt ?? 0) / limit)
  })
})

// ─── GET single report (with photos) ────────────────────────
app.get('/:id', async (c) => {
  const { DB } = c.env
  const id = Number(c.req.param('id'))

  const [report, photos] = await Promise.all([
    DB.prepare('SELECT * FROM intervention_reports WHERE id = ?').bind(id).first(),
    DB.prepare('SELECT id, filename, caption, size_bytes, created_at FROM report_photos WHERE report_id = ? ORDER BY created_at ASC').bind(id).all()
  ])

  if (!report) return c.json({ error: 'Rapport introuvable' }, 404)

  return c.json({ ...report, photos: photos.results })
})

// ─── GET photo data (base64) ─────────────────────────────────
app.get('/:id/photos/:photoId', async (c) => {
  const { DB } = c.env
  const photoId = Number(c.req.param('photoId'))
  const photo = await DB.prepare('SELECT * FROM report_photos WHERE id = ?').bind(photoId).first<any>()
  if (!photo) return c.json({ error: 'Photo introuvable' }, 404)
  return c.json({ id: photo.id, filename: photo.filename, caption: photo.caption, data_url: photo.data_url })
})

// ─── CREATE report ───────────────────────────────────────────
app.post('/', async (c) => {
  const { DB } = c.env
  const body = await c.req.json()

  const {
    intervention_id, reference_num, title, client, technician_name,
    equipment, city, site, intervention_type, priority,
    scheduled_date, intervention_date,
    work_performed, observations, recommendations,
    parts_used, duration_hours, result,
    quality_rating, client_signature, status, created_by,
    photos = []
  } = body

  if (!title) return c.json({ error: 'Le titre est obligatoire' }, 400)

  const res = await DB.prepare(`
    INSERT INTO intervention_reports (
      intervention_id, reference_num, title, client, technician_name,
      equipment, city, site, intervention_type, priority,
      scheduled_date, intervention_date,
      work_performed, observations, recommendations,
      parts_used, duration_hours, result,
      quality_rating, client_signature, status, created_by,
      created_at, updated_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).bind(
    intervention_id || null, reference_num || null, title, client || null, technician_name || null,
    equipment || null, city || null, site || null, intervention_type || 'corrective', priority || 'medium',
    scheduled_date || null, intervention_date || now().substring(0,10),
    work_performed || null, observations || null, recommendations || null,
    parts_used ? JSON.stringify(parts_used) : null,
    duration_hours || 0, result || 'resolved',
    quality_rating || null, client_signature || null, status || 'draft', created_by || 'Mohcine Banaoui',
    now(), now()
  ).run()

  const reportId = res.meta.last_row_id

  // Insert photos
  if (photos && photos.length > 0) {
    for (const photo of photos) {
      if (!photo.data_url) continue
      await DB.prepare(`
        INSERT INTO report_photos (report_id, filename, caption, data_url, size_bytes, created_at)
        VALUES (?,?,?,?,?,?)
      `).bind(
        reportId, photo.filename || 'photo.jpg', photo.caption || '',
        photo.data_url, photo.size_bytes || 0, now()
      ).run()
    }
  }

  return c.json({ id: reportId, success: true, message: 'Compte rendu créé' }, 201)
})

// ─── UPDATE report ───────────────────────────────────────────
app.put('/:id', async (c) => {
  const { DB } = c.env
  const id   = Number(c.req.param('id'))
  const body = await c.req.json()

  const {
    title, client, technician_name, equipment, city, site,
    intervention_type, priority, scheduled_date, intervention_date,
    work_performed, observations, recommendations,
    parts_used, duration_hours, result,
    quality_rating, client_signature, status, created_by,
    photos = []
  } = body

  await DB.prepare(`
    UPDATE intervention_reports SET
      title=?, client=?, technician_name=?, equipment=?, city=?, site=?,
      intervention_type=?, priority=?, scheduled_date=?, intervention_date=?,
      work_performed=?, observations=?, recommendations=?,
      parts_used=?, duration_hours=?, result=?,
      quality_rating=?, client_signature=?, status=?, created_by=?,
      updated_at=?
    WHERE id=?
  `).bind(
    title, client || null, technician_name || null, equipment || null, city || null, site || null,
    intervention_type || 'corrective', priority || 'medium',
    scheduled_date || null, intervention_date || null,
    work_performed || null, observations || null, recommendations || null,
    parts_used ? JSON.stringify(parts_used) : null,
    duration_hours || 0, result || 'resolved',
    quality_rating || null, client_signature || null, status || 'draft', created_by || 'Mohcine Banaoui',
    now(), id
  ).run()

  // Add new photos if provided
  if (photos && photos.length > 0) {
    for (const photo of photos) {
      if (!photo.data_url) continue
      await DB.prepare(`
        INSERT INTO report_photos (report_id, filename, caption, data_url, size_bytes, created_at)
        VALUES (?,?,?,?,?,?)
      `).bind(id, photo.filename || 'photo.jpg', photo.caption || '', photo.data_url, photo.size_bytes || 0, now()).run()
    }
  }

  return c.json({ success: true, message: 'Compte rendu mis à jour' })
})

// ─── DELETE report ───────────────────────────────────────────
app.delete('/:id', async (c) => {
  const { DB } = c.env
  const id = Number(c.req.param('id'))
  await DB.prepare('DELETE FROM report_photos WHERE report_id = ?').bind(id).run()
  await DB.prepare('DELETE FROM intervention_reports WHERE id = ?').bind(id).run()
  return c.json({ success: true, message: 'Compte rendu supprimé' })
})

// ─── DELETE single photo ─────────────────────────────────────
app.delete('/:id/photos/:photoId', async (c) => {
  const { DB } = c.env
  const photoId = Number(c.req.param('photoId'))
  await DB.prepare('DELETE FROM report_photos WHERE id = ?').bind(photoId).run()
  return c.json({ success: true })
})

// ─── FINALIZE report (draft → finalized) ─────────────────────
app.post('/:id/finalize', async (c) => {
  const { DB } = c.env
  const id = Number(c.req.param('id'))
  await DB.prepare(`UPDATE intervention_reports SET status='finalized', updated_at=? WHERE id=?`).bind(now(), id).run()
  return c.json({ success: true, message: 'Rapport finalisé' })
})

export default app
