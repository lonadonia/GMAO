import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
  RESEND_API_KEY: string
  NOTIFICATION_EMAIL: string   // recipient — default: mfs326467@gmail.com
}

const notifApp = new Hono<{ Bindings: Bindings }>()

/* ─────────────────────────────────────────────────────────────
   RESEND helper — sends a single email via the Resend REST API
   ───────────────────────────────────────────────────────────── */
async function sendResendEmail(
  apiKey: string,
  to: string,
  subject: string,
  html: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'GMAO PPrime <notifications@pprime-gmao.pages.dev>',
        to: [to],
        subject,
        html,
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      return { ok: false, error: err }
    }
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'unknown error' }
  }
}

/* ─────────────────────────────────────────────────────────────
   EMAIL TEMPLATE  (24h or 48h)
   ───────────────────────────────────────────────────────────── */
function buildEmailHtml(
  intervention: any,
  horizon: '24h' | '48h'
): { subject: string; html: string } {
  const isUrgent = horizon === '24h'
  const accentColor = isUrgent ? '#ef4444' : '#f59e0b'
  const bannerText  = isUrgent
    ? '⚠️ Intervention dans moins de 24 heures'
    : '🔔 Rappel — Intervention dans moins de 48 heures'
  const badgeLabel = isUrgent ? 'URGENT — 24h' : 'RAPPEL — 48h'

  const typeBadge: Record<string, string> = {
    corrective:  '#ef4444',
    preventive:  '#3b82f6',
    installation:'#8b5cf6',
  }
  const typeColor = typeBadge[intervention.type] ?? '#6b7280'

  const subject = `[PPrime GMAO] ${badgeLabel} — ${intervention.reference_num ?? intervention.title} | ${intervention.client ?? 'Client inconnu'}`

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Header banner -->
        <tr>
          <td style="background:${accentColor};border-radius:12px 12px 0 0;padding:20px 28px;text-align:center">
            <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px">${bannerText}</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:6px">
              Système de notification automatique — PPrime GMAO
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#1a1d2e;padding:28px;border:1px solid #2d2f45;border-top:none">

            <!-- Ref + title -->
            <div style="margin-bottom:24px">
              <span style="background:#252840;color:#a5b4fc;font-size:11px;font-weight:700;
                           padding:4px 10px;border-radius:20px;letter-spacing:.5px;text-transform:uppercase">
                ${intervention.reference_num ?? 'Réf. N/A'}
              </span>
              <div style="font-size:20px;font-weight:700;color:#f1f5f9;margin-top:10px;line-height:1.3">
                ${escapeHtml(intervention.title)}
              </div>
            </div>

            <!-- Details grid -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
              ${buildRow('fas fa-user-hard-hat', 'Client', intervention.client ?? '—', '#3b82f6')}
              ${buildRow('fas fa-calendar-alt', 'Date prévue',
                  formatDate(intervention.scheduled_date), accentColor)}
              ${buildRow('fas fa-user-cog', 'Technicien',
                  intervention.technician_name ?? '—', '#8b5cf6')}
              ${buildRow('fas fa-tag', 'Type',
                  capitalize(intervention.type), typeColor)}
              ${buildRow('fas fa-exclamation-circle', 'Priorité',
                  capitalize(intervention.priority ?? 'medium'), priorityColor(intervention.priority))}
              ${buildRow('fas fa-map-marker-alt', 'Site / Ville',
                  [intervention.site, intervention.city].filter(Boolean).join(' — ') || '—', '#14b8a6')}
              ${intervention.equipment ? buildRow('fas fa-cogs', 'Équipement', intervention.equipment, '#f59e0b') : ''}
              ${intervention.notes    ? buildRow('fas fa-sticky-note', 'Notes',    escapeHtml(intervention.notes), '#6b7280') : ''}
            </table>

            <!-- CTA -->
            <div style="margin-top:28px;text-align:center">
              <a href="https://pprime-gmao.pages.dev"
                 style="display:inline-block;background:${accentColor};color:#fff;font-weight:700;
                        font-size:14px;padding:12px 32px;border-radius:8px;text-decoration:none;
                        letter-spacing:.3px">
                Voir l'intervention →
              </a>
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#13151f;border:1px solid #2d2f45;border-top:none;
                     border-radius:0 0 12px 12px;padding:16px 28px;text-align:center">
            <div style="font-size:11px;color:#4b5563;line-height:1.6">
              Cet email a été envoyé automatiquement par le système GMAO PPrime.<br/>
              Ne pas répondre à ce message. — <a href="https://pprime-gmao.pages.dev" style="color:#6366f1">pprime-gmao.pages.dev</a>
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  return { subject, html }
}

/* helpers */
function buildRow(icon: string, label: string, value: string, color: string): string {
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #252840;width:38%">
      <span style="color:${color};font-size:12px;font-weight:600">
        ${escapeHtml(label)}
      </span>
    </td>
    <td style="padding:8px 0;border-bottom:1px solid #252840;color:#cbd5e1;font-size:13px">
      ${value}
    </td>
  </tr>`
}
function escapeHtml(s: string | null | undefined): string {
  if (!s) return ''
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
function capitalize(s: string | null | undefined): string {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
function formatDate(d: string | null | undefined): string {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Casablanca'
    })
  } catch { return d ?? '—' }
}
function priorityColor(p: string | null | undefined): string {
  const m: Record<string, string> = { critical:'#ef4444', high:'#f97316', medium:'#f59e0b', low:'#22c55e' }
  return m[p ?? 'medium'] ?? '#6b7280'
}

/* ─────────────────────────────────────────────────────────────
   CORE CHECK FUNCTION — used by both cron and manual trigger
   ───────────────────────────────────────────────────────────── */
export async function runNotificationCheck(env: Bindings): Promise<{
  checked: number
  sent: { id: number; ref: string; horizon: string }[]
  errors: { id: number; ref: string; error: string }[]
}> {
  const recipient = env.NOTIFICATION_EMAIL ?? 'mfs326467@gmail.com'
  const apiKey    = env.RESEND_API_KEY ?? ''

  const now    = Date.now()
  const h24    = now + 24 * 3600 * 1000
  const h48    = now + 48 * 3600 * 1000

  // Fetch upcoming interventions not yet fully notified
  // We look at scheduled_date within the next 48 h
  const rows = await env.DB.prepare(`
    SELECT id, title, reference_num, type, priority, status,
           client, site, city, equipment, notes,
           technician_name, scheduled_date,
           email_sent_24h, email_sent_48h
    FROM interventions
    WHERE scheduled_date IS NOT NULL
      AND status NOT IN ('resolved','cancelled')
      AND (email_sent_48h = 0 OR email_sent_24h = 0)
      AND datetime(scheduled_date) >= datetime('now')
      AND datetime(scheduled_date) <= datetime('now', '+48 hours')
    ORDER BY scheduled_date ASC
  `).all<any>()

  const sent:   { id: number; ref: string; horizon: string }[] = []
  const errors: { id: number; ref: string; error: string }[]   = []

  for (const row of rows.results) {
    const targetMs = new Date(row.scheduled_date as string).getTime()
    const diffMs   = targetMs - now
    const diffH    = diffMs / (1000 * 3600)

    // Determine which notification(s) to send
    const tasks: Array<{ horizon: '24h' | '48h'; column: string; alreadySent: number }> = []

    if (diffH <= 24 && !row.email_sent_24h) {
      tasks.push({ horizon: '24h', column: 'email_sent_24h', alreadySent: row.email_sent_24h })
    }
    if (diffH > 24 && diffH <= 48 && !row.email_sent_48h) {
      tasks.push({ horizon: '48h', column: 'email_sent_48h', alreadySent: row.email_sent_48h })
    }
    // Edge-case: row just crossed the 24h boundary but 48h was never sent — skip 48h, only send 24h
    if (diffH <= 24 && !row.email_sent_48h) {
      // mark 48h as sent too (skip that email, too late)
      await env.DB.prepare(`UPDATE interventions SET email_sent_48h = 1 WHERE id = ?`).bind(row.id).run()
    }

    for (const task of tasks) {
      const { subject, html } = buildEmailHtml(row, task.horizon)
      const result = await sendResendEmail(apiKey, recipient, subject, html)

      if (result.ok) {
        // Mark flag in DB
        await env.DB.prepare(
          `UPDATE interventions SET ${task.column} = 1, updated_at = datetime('now') WHERE id = ?`
        ).bind(row.id).run()
        sent.push({ id: row.id as number, ref: row.reference_num ?? row.title, horizon: task.horizon })
      } else {
        errors.push({ id: row.id as number, ref: row.reference_num ?? row.title, error: result.error ?? 'unknown' })
      }
    }
  }

  return { checked: rows.results.length, sent, errors }
}

/* ─────────────────────────────────────────────────────────────
   HTTP ROUTES
   ───────────────────────────────────────────────────────────── */

/** Manual trigger — GET /api/notifications/check
 *  Useful for testing without waiting for the cron */
notifApp.get('/check', async (c) => {
  const result = await runNotificationCheck(c.env)
  return c.json({
    ok: true,
    timestamp: new Date().toISOString(),
    ...result,
  })
})

/** Preview upcoming — GET /api/notifications/preview
 *  Returns interventions that WOULD receive a notification */
notifApp.get('/preview', async (c) => {
  const rows = await c.env.DB.prepare(`
    SELECT id, title, reference_num, type, status,
           client, technician_name, scheduled_date,
           email_sent_24h, email_sent_48h,
           ROUND((julianday(scheduled_date) - julianday('now')) * 24, 1) as hours_until
    FROM interventions
    WHERE scheduled_date IS NOT NULL
      AND status NOT IN ('resolved','cancelled')
      AND datetime(scheduled_date) >= datetime('now')
      AND datetime(scheduled_date) <= datetime('now', '+48 hours')
    ORDER BY scheduled_date ASC
  `).all<any>()

  return c.json({
    ok: true,
    count: rows.results.length,
    interventions: rows.results.map((r: any) => ({
      ...r,
      will_send_48h: r.hours_until > 24 && !r.email_sent_48h,
      will_send_24h: r.hours_until <= 24 && !r.email_sent_24h,
    }))
  })
})

/** Reset flags — POST /api/notifications/reset/:id
 *  Lets you re-test without touching the DB manually */
notifApp.post('/reset/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare(
    `UPDATE interventions SET email_sent_24h = 0, email_sent_48h = 0 WHERE id = ?`
  ).bind(id).run()
  return c.json({ ok: true, reset: Number(id) })
})

/** Status — GET /api/notifications/status
 *  Shows all notification flags */
notifApp.get('/status', async (c) => {
  const rows = await c.env.DB.prepare(`
    SELECT id, reference_num, title, scheduled_date, status,
           email_sent_24h, email_sent_48h,
           ROUND((julianday(scheduled_date) - julianday('now')) * 24, 1) as hours_until
    FROM interventions
    WHERE scheduled_date IS NOT NULL
    ORDER BY scheduled_date ASC
  `).all<any>()
  return c.json({ ok: true, data: rows.results })
})

export default notifApp
