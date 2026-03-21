import { Hono } from 'hono'

type Bindings = { DB: D1Database }
const app = new Hono<{ Bindings: Bindings }>()

// Helper: construit la clause WHERE + AND pour une condition additionnelle
function buildWhere(conditions: string[]): string {
  return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
}

function buildWhereAnd(conditions: string[], extraCondition: string): string {
  const all = [...conditions, extraCondition]
  return `WHERE ${all.join(' AND ')}`
}

// GET /api/kpi — KPIs calculés dynamiquement
app.get('/', async (c) => {
  const { date_from, date_to, city, technician_id, technician_name, client } = c.req.query()

  const conditions: string[] = []
  const params: any[] = []
  if (date_from)       { conditions.push("start_date >= ?");              params.push(date_from) }
  if (date_to)         { conditions.push("start_date <= ?");              params.push(date_to + ' 23:59:59') }
  if (city)            { conditions.push("city LIKE ?");                  params.push(`%${city}%`) }
  if (technician_id)   { conditions.push("technician_id = ?");            params.push(technician_id) }
  if (technician_name) { conditions.push("technician_name LIKE ?");       params.push(`%${technician_name}%`) }
  if (client)          { conditions.push("client LIKE ?");                params.push(`%${client}%`) }

  const where = buildWhere(conditions)
  const whereCorrectif = buildWhereAnd(conditions, "type = 'corrective'")
  const whereCity = buildWhereAnd(conditions, "city IS NOT NULL")
  const whereTech = buildWhereAnd(conditions, "technician_name IS NOT NULL")

  // Lire les paramètres utilisateur depuis settings
  const settingsRows = await c.env.DB.prepare(
    `SELECT key, value FROM settings WHERE key IN ('mtbf_total_machines','mtbf_total_hours_per_year')`
  ).all<{ key: string; value: string }>()
  const settingsMap: Record<string, string> = {}
  for (const row of settingsRows.results) settingsMap[row.key] = row.value

  const totalMachines      = parseFloat(settingsMap['mtbf_total_machines']        || '1')
  const totalHoursPerYear  = parseFloat(settingsMap['mtbf_total_hours_per_year']  || '8760')

  // KPIs principaux (interventions correctives)
  const stats = await c.env.DB.prepare(`
    SELECT
      COUNT(*) as total_interventions,
      SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_count,
      SUM(CASE WHEN status IN ('in_progress','pending') THEN 1 ELSE 0 END) as in_progress_count,
      SUM(CASE WHEN status = 'planned' THEN 1 ELSE 0 END) as planned_count,
      SUM(CASE WHEN type = 'preventive' THEN 1 ELSE 0 END) as preventive_count,
      SUM(CASE WHEN type = 'corrective' THEN 1 ELSE 0 END) as corrective_count,
      SUM(CASE WHEN downtime = 1 THEN 1 ELSE 0 END) as downtime_count,
      SUM(CASE WHEN priority = 'critical' THEN 1 ELSE 0 END) as critical_count,
      SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_count,
      ROUND(AVG(CASE WHEN status = 'resolved' AND duration_real > 0 THEN duration_real
                     WHEN status = 'resolved' AND duration_hours > 0 THEN duration_hours END), 2) as avg_repair_time,
      ROUND(SUM(CASE WHEN status = 'resolved' THEN COALESCE(duration_real, duration_hours, 0) ELSE 0 END), 2) as total_repair_hours,
      ROUND(AVG(CASE WHEN quality_score > 0 THEN quality_score END), 1) as avg_quality,
      SUM(CASE WHEN recurring = 1 THEN 1 ELSE 0 END) as recurring_count
    FROM interventions ${where}
  `).bind(...params).first<any>()

  // Compter les interventions préventives depuis le planning_preventif
  // Chaque ligne = 1 plan, on compte le nombre de mois cochés (mois_1..mois_12) comme occurrences préventives
  // Filtres appliqués : client, technician (pas de ville/date car planning_preventif n'a pas ces champs)
  const planningConditions: string[] = []
  const planningParams: any[] = []
  if (client) { planningConditions.push("client LIKE ?"); planningParams.push(`%${client}%`) }

  const planningWhere = planningConditions.length > 0 ? `WHERE ${planningConditions.join(' AND ')}` : ''

  const preventifStats = await c.env.DB.prepare(`
    SELECT
      COUNT(*) as plan_count,
      SUM(
        mois_1 + mois_2 + mois_3 + mois_4 + mois_5 + mois_6 +
        mois_7 + mois_8 + mois_9 + mois_10 + mois_11 + mois_12
      ) as total_occurrences,
      SUM(CASE WHEN fait = 1 THEN 1 ELSE 0 END) as fait_count,
      SUM(CASE WHEN fait = 0 THEN 1 ELSE 0 END) as non_fait_count
    FROM planning_preventif ${planningWhere}
  `).bind(...planningParams).first<any>()

  // Total préventif = occurrences planifiées dans le calendrier
  const preventiveFromPlanning = preventifStats?.total_occurrences || 0
  // Ajouter au compteur de preventive_count déjà dans interventions
  const totalPreventive = (stats?.preventive_count || 0) + preventiveFromPlanning
  const totalCorrective = stats?.corrective_count || 0
  const grandTotal = (stats?.total_interventions || 0) + preventiveFromPlanning

  // MTTR : Temps moyen de réparation (en heures) — préférer duration_real
  const mttr = stats?.avg_repair_time || 0

  // Taux de résolution (basé sur correctives uniquement)
  const resolutionRate = totalCorrective > 0
    ? parseFloat(((( stats?.resolved_count || 0) / totalCorrective) * 100).toFixed(1))
    : 0

  // % Préventif vs Correctif (sur grand total)
  const preventivePct = grandTotal > 0
    ? parseFloat(((totalPreventive / grandTotal) * 100).toFixed(1))
    : 0
  const correctivePct = grandTotal > 0
    ? parseFloat(((totalCorrective / grandTotal) * 100).toFixed(1))
    : 0

  // MTBF (Mean Time Between Failures)
  const mtbfData = await c.env.DB.prepare(`
    SELECT 
      COUNT(*) as failure_count,
      MIN(CASE WHEN failure_date IS NOT NULL THEN failure_date ELSE created_at END) as first_failure,
      MAX(CASE WHEN failure_date IS NOT NULL THEN failure_date ELSE created_at END) as last_failure,
      SUM(duration_hours) as total_downtime_hours
    FROM interventions ${whereCorrectif}
  `).bind(...params).first<any>()

  let mtbf = 0
  if (mtbfData && mtbfData.failure_count >= 1) {
    // Méthode 1 : si on a un historique de dates → on utilise la période réelle
    if (mtbfData.failure_count > 1 && mtbfData.first_failure && mtbfData.last_failure) {
      const first = new Date(mtbfData.first_failure).getTime()
      const last  = new Date(mtbfData.last_failure).getTime()
      const periodHours  = (last - first) / (1000 * 3600)
      const totalDowntime = mtbfData.total_downtime_hours || 0
      const uptime = periodHours - totalDowntime
      if (uptime > 0) {
        mtbf = parseFloat((uptime / mtbfData.failure_count).toFixed(1))
      }
    }
    // Méthode 2 (paramètres utilisateur) : MTBF = (heures totales - heures d'arrêt) / nombre de pannes
    // On applique si l'utilisateur a configuré un nombre de machines > 1 OU des heures > 8760 par défaut
    if (mtbf === 0 || totalMachines > 1 || totalHoursPerYear !== 8760) {
      const totalAvailableHours = totalHoursPerYear * totalMachines
      const totalDowntime       = mtbfData.total_downtime_hours || 0
      const uptime              = totalAvailableHours - totalDowntime
      const failures            = mtbfData.failure_count || 1
      if (uptime > 0 && failures > 0) {
        mtbf = parseFloat((uptime / failures).toFixed(1))
      }
    }
  }

  // Disponibilité = (MTBF / (MTBF + MTTR)) * 100
  let availability = 100
  if (mtbf > 0 && mttr > 0) {
    availability = parseFloat(((mtbf / (mtbf + mttr)) * 100).toFixed(1))
    if (availability > 100) availability = 100
    if (availability < 0) availability = 0
  }

  // Répartition par ville
  const byCity = await c.env.DB.prepare(`
    SELECT city, COUNT(*) as count
    FROM interventions ${whereCity}
    GROUP BY city
    ORDER BY count DESC
    LIMIT 10
  `).bind(...params).all()

  // Répartition par mois (12 derniers mois) — toujours sans filtre de date pour avoir l'historique
  const monthConditions: string[] = ["created_at >= datetime('now', '-12 months')"]
  if (city) monthConditions.push("city LIKE ?")
  if (technician_id) monthConditions.push("technician_id = ?")
  const monthParams: any[] = []
  if (city) monthParams.push(`%${city}%`)
  if (technician_id) monthParams.push(technician_id)

  const byMonth = await c.env.DB.prepare(`
    SELECT 
      strftime('%Y-%m', created_at) as month,
      COUNT(*) as total,
      SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
      SUM(CASE WHEN type = 'preventive' THEN 1 ELSE 0 END) as preventive,
      SUM(CASE WHEN type = 'corrective' THEN 1 ELSE 0 END) as corrective
    FROM interventions
    WHERE ${monthConditions.join(' AND ')}
    GROUP BY month
    ORDER BY month ASC
  `).bind(...monthParams).all()

  // Top techniciens
  const topTechnicians = await c.env.DB.prepare(`
    SELECT 
      technician_name,
      technician_id,
      COUNT(*) as total,
      SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
      ROUND(AVG(duration_hours), 2) as avg_duration,
      ROUND(
        CASE WHEN COUNT(*) > 0 
          THEN SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)
          ELSE 0
        END, 1
      ) as resolution_rate
    FROM interventions ${whereTech}
    GROUP BY technician_name, technician_id
    ORDER BY total DESC
    LIMIT 5
  `).bind(...params).all()

  // Répartition par priorité
  const byPriority = await c.env.DB.prepare(`
    SELECT priority, COUNT(*) as count
    FROM interventions ${where}
    GROUP BY priority
    ORDER BY count DESC
  `).bind(...params).all()

  // Répartition par status
  const byStatus = await c.env.DB.prepare(`
    SELECT status, COUNT(*) as count
    FROM interventions ${where}
    GROUP BY status
    ORDER BY count DESC
  `).bind(...params).all()

  // Top clients
  const byClient = await c.env.DB.prepare(`
    SELECT client, COUNT(*) as total,
      SUM(CASE WHEN status='resolved' THEN 1 ELSE 0 END) as resolved,
      ROUND(AVG(CASE WHEN quality_score > 0 THEN quality_score END), 1) as avg_quality
    FROM interventions
    WHERE client IS NOT NULL ${conditions.length ? 'AND ' + conditions.join(' AND ') : ''}
    GROUP BY client ORDER BY total DESC LIMIT 10
  `).bind(...params).all()

  // Top équipements en panne
  const byEquipment = await c.env.DB.prepare(`
    SELECT equipment, COUNT(*) as total,
      SUM(CASE WHEN downtime=1 THEN 1 ELSE 0 END) as with_downtime
    FROM interventions
    WHERE equipment IS NOT NULL ${conditions.length ? 'AND ' + conditions.join(' AND ') : ''}
    GROUP BY equipment ORDER BY total DESC LIMIT 8
  `).bind(...params).all()

  // Répartition récurrentes vs non récurrentes
  const recurringStats = await c.env.DB.prepare(`
    SELECT
      SUM(CASE WHEN recurring=1 THEN 1 ELSE 0 END) as recurring,
      SUM(CASE WHEN recurring=0 OR recurring IS NULL THEN 1 ELSE 0 END) as non_recurring
    FROM interventions ${where}
  `).bind(...params).first<any>()

  return c.json({
    kpis: {
      total_interventions: grandTotal,
      resolved_count: stats?.resolved_count || 0,
      in_progress_count: stats?.in_progress_count || 0,
      planned_count: stats?.planned_count || 0,
      preventive_count: totalPreventive,
      corrective_count: totalCorrective,
      preventive_from_planning: preventiveFromPlanning,
      plan_count: preventifStats?.plan_count || 0,
      fait_count: preventifStats?.fait_count || 0,
      downtime_count: stats?.downtime_count || 0,
      critical_count: stats?.critical_count || 0,
      high_count: stats?.high_count || 0,
      mttr,
      mtbf,
      availability,
      resolution_rate: resolutionRate,
      preventive_pct: preventivePct,
      corrective_pct: correctivePct,
      total_repair_hours: stats?.total_repair_hours || 0,
      avg_quality: stats?.avg_quality || 0,
      recurring_count: stats?.recurring_count || 0,
    },
    charts: {
      by_city: byCity.results,
      by_month: byMonth.results,
      top_technicians: topTechnicians.results,
      by_priority: byPriority.results,
      by_status: byStatus.results,
      by_client: byClient.results,
      by_equipment: byEquipment.results,
      recurring: recurringStats,
    }
  })
})

export default app
