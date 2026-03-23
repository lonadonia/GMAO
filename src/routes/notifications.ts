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
        from: 'GMAO PPrime <onboarding@resend.dev>',
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
   — Destinataire : responsable maintenance (pas technicien)
   — Champs : client, date, type, priorité uniquement
   ───────────────────────────────────────────────────────────── */
function buildEmailHtml(
  intervention: any,
  horizon: '24h' | '48h'
): { subject: string; html: string } {
  const isUrgent    = horizon === '24h'
  const accentColor = isUrgent ? '#ef4444' : '#f59e0b'
  const accentLight = isUrgent ? 'rgba(239,68,68,0.12)'  : 'rgba(245,158,11,0.12)'
  const accentBorder= isUrgent ? 'rgba(239,68,68,0.35)'  : 'rgba(245,158,11,0.35)'
  const bannerText  = isUrgent
    ? '⚠️  Intervention dans moins de 24 heures'
    : '🔔  Rappel — Intervention dans moins de 48 heures'
  const badgeLabel  = isUrgent ? 'URGENT — 24h' : 'RAPPEL — 48h'
  const badgeBg     = isUrgent ? '#ef4444'       : '#f59e0b'

  /* type label + color */
  const typeLabels: Record<string, string> = {
    corrective:   'Corrective',
    preventive:   'Préventive',
    installation: 'Installation',
  }
  const typeBadgeBg: Record<string, string> = {
    corrective:   'rgba(239,68,68,0.15)',
    preventive:   'rgba(59,130,246,0.15)',
    installation: 'rgba(139,92,246,0.15)',
  }
  const typeBadgeColor: Record<string, string> = {
    corrective:   '#f87171',
    preventive:   '#60a5fa',
    installation: '#c084fc',
  }
  const typeLabel = typeLabels[intervention.type]  ?? capitalize(intervention.type)
  const typeBg    = typeBadgeBg[intervention.type]    ?? 'rgba(107,114,128,0.15)'
  const typeClr   = typeBadgeColor[intervention.type] ?? '#9ca3af'

  /* priority label + color */
  const prioLabels: Record<string, string> = {
    critical: 'Critique', high: 'Haute', medium: 'Moyenne', low: 'Basse',
  }
  const prioBg: Record<string, string> = {
    critical: 'rgba(239,68,68,0.15)', high: 'rgba(249,115,22,0.15)',
    medium:   'rgba(245,158,11,0.15)', low: 'rgba(34,197,94,0.15)',
  }
  const prioClr: Record<string, string> = {
    critical: '#f87171', high: '#fb923c', medium: '#fbbf24', low: '#4ade80',
  }
  const prio    = intervention.priority ?? 'medium'
  const prioLbl = prioLabels[prio] ?? capitalize(prio)
  const prioBgV = prioBg[prio]     ?? 'rgba(107,114,128,0.15)'
  const prioClrV= prioClr[prio]    ?? '#9ca3af'

  const subject = `[PPrime GMAO] ${badgeLabel} — ${intervention.reference_num ?? intervention.title} | ${intervention.client ?? 'Client inconnu'}`

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#0f1117;
             font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#0f1117;padding:40px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0"
             style="max-width:560px;width:100%">

        <!-- ── TOP BADGE ── -->
        <tr>
          <td style="padding-bottom:16px;text-align:center">
            <span style="display:inline-block;background:${badgeBg};color:#fff;
                         font-size:11px;font-weight:800;letter-spacing:1.2px;
                         text-transform:uppercase;padding:5px 16px;border-radius:20px">
              ${badgeLabel}
            </span>
          </td>
        </tr>

        <!-- ── HEADER BANNER ── -->
        <tr>
          <td style="background:${accentColor};border-radius:14px 14px 0 0;
                     padding:24px 32px;text-align:center">
            <div style="font-size:20px;font-weight:800;color:#fff;
                        letter-spacing:-0.3px;line-height:1.3">
              ${bannerText}
            </div>
            <div style="font-size:12px;color:rgba(255,255,255,0.75);margin-top:6px">
              Notification automatique — PPrime GMAO
            </div>
          </td>
        </tr>

        <!-- ── BODY ── -->
        <tr>
          <td style="background:#1a1d2e;padding:28px 32px;
                     border:1px solid #2d2f45;border-top:none">

            <!-- Ref + titre -->
            <div style="margin-bottom:24px">
              <span style="background:#252840;color:#a5b4fc;font-size:10px;font-weight:700;
                           padding:3px 10px;border-radius:20px;letter-spacing:.6px;
                           text-transform:uppercase">
                ${escapeHtml(intervention.reference_num ?? 'Réf. N/A')}
              </span>
              <div style="font-size:18px;font-weight:700;color:#f1f5f9;
                          margin-top:10px;line-height:1.35">
                ${escapeHtml(intervention.title)}
              </div>
            </div>

            <!-- ── 4 INFO CARDS ── -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border-collapse:collapse;margin-bottom:8px">

              <!-- Client -->
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #252840">
                  <div style="display:flex;align-items:center;gap:10px">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px;height:32px;background:rgba(59,130,246,0.12);
                                   border-radius:8px;text-align:center;vertical-align:middle">
                          <span style="font-size:14px">🏢</span>
                        </td>
                        <td style="padding-left:12px">
                          <div style="font-size:10px;color:#6b7280;font-weight:600;
                                      text-transform:uppercase;letter-spacing:.5px">Client</div>
                          <div style="font-size:14px;font-weight:700;color:#f1f5f9;margin-top:2px">
                            ${escapeHtml(intervention.client ?? '—')}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>

              <!-- Date prévue -->
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #252840">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:32px;height:32px;background:${accentLight};
                                 border:1px solid ${accentBorder};
                                 border-radius:8px;text-align:center;vertical-align:middle">
                        <span style="font-size:14px">📅</span>
                      </td>
                      <td style="padding-left:12px">
                        <div style="font-size:10px;color:#6b7280;font-weight:600;
                                    text-transform:uppercase;letter-spacing:.5px">Date prévue</div>
                        <div style="font-size:14px;font-weight:700;color:${accentColor};margin-top:2px">
                          ${formatDate(intervention.scheduled_date)}
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Type -->
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #252840">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:32px;height:32px;background:${typeBg};
                                 border-radius:8px;text-align:center;vertical-align:middle">
                        <span style="font-size:14px">🔧</span>
                      </td>
                      <td style="padding-left:12px;vertical-align:middle">
                        <div style="font-size:10px;color:#6b7280;font-weight:600;
                                    text-transform:uppercase;letter-spacing:.5px">Type</div>
                        <div style="margin-top:4px">
                          <span style="background:${typeBg};color:${typeClr};
                                       font-size:12px;font-weight:700;
                                       padding:3px 10px;border-radius:6px">
                            ${typeLabel}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Priorité -->
              <tr>
                <td style="padding:10px 0">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:32px;height:32px;background:${prioBgV};
                                 border-radius:8px;text-align:center;vertical-align:middle">
                        <span style="font-size:14px">🚦</span>
                      </td>
                      <td style="padding-left:12px;vertical-align:middle">
                        <div style="font-size:10px;color:#6b7280;font-weight:600;
                                    text-transform:uppercase;letter-spacing:.5px">Priorité</div>
                        <div style="margin-top:4px">
                          <span style="background:${prioBgV};color:${prioClrV};
                                       font-size:12px;font-weight:700;
                                       padding:3px 10px;border-radius:6px">
                            ${prioLbl}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>

            <!-- ── CTA ── -->
            <div style="margin-top:28px;text-align:center">
              <a href="https://pprime-gmao.pages.dev"
                 style="display:inline-block;background:${accentColor};color:#fff;
                        font-weight:700;font-size:14px;padding:13px 36px;
                        border-radius:9px;text-decoration:none;letter-spacing:.3px">
                Voir l'intervention →
              </a>
            </div>

          </td>
        </tr>

        <!-- ── FOOTER ── -->
        <tr>
          <td style="background:#13151f;border:1px solid #2d2f45;border-top:none;
                     border-radius:0 0 14px 14px;padding:16px 32px;text-align:center">
            <div style="font-size:11px;color:#4b5563;line-height:1.7">
              Cet email est destiné au responsable maintenance PPrime.<br/>
              Envoyé automatiquement — ne pas répondre. —
              <a href="https://pprime-gmao.pages.dev"
                 style="color:#6366f1;text-decoration:none">pprime-gmao.pages.dev</a>
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
