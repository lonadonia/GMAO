/* GMAO - Application Frontend
 * Architecture SPA vanilla JS
 * Toutes les données viennent du backend API
 */

// ============================================================
// CONFIGURATION
// ============================================================
const API = {
  base: '/api',
  interventions: '/api/interventions',
  technicians: '/api/technicians',
  equipment: '/api/equipment',
  clients: '/api/clients',
  planning: '/api/planning',
  planningPreventif: '/api/planning/preventif',
  kpi: '/api/kpi',
  settings: '/api/settings',
}

// ============================================================
// STATE GLOBAL
// ============================================================
const state = {
  currentPage: 'dashboard',
  interventions: { data: [], total: 0, page: 1, pages: 1, loading: false, filters: {} },
  technicians: { data: [], loading: false },
  equipment: { data: [], loading: false },
  clients: { data: [], loading: false },
  planning: { data: [], loading: false, currentYear: new Date().getFullYear(), currentMonth: new Date().getMonth() + 1 },
  kpi: { data: null, loading: false, filters: {} },
  charts: {},
}

// ============================================================
// HTTP CLIENT
// ============================================================
const http = {
  async get(url) {
    const res = await axios.get(url)
    return res.data
  },
  async post(url, data) {
    const res = await axios.post(url, data)
    return res.data
  },
  async put(url, data) {
    const res = await axios.put(url, data)
    return res.data
  },
  async delete(url) {
    const res = await axios.delete(url)
    return res.data
  }
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = 'info', duration = 3500) {
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' }
  let container = document.getElementById('toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'toast-container'
    container.className = 'toast-container'
    document.body.appendChild(container)
  }
  const toast = document.createElement('div')
  toast.className = `toast ${type}`
  toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`
  container.appendChild(toast)
  setTimeout(() => {
    toast.style.animation = 'fadeIn 0.3s ease reverse'
    setTimeout(() => toast.remove(), 300)
  }, duration)
}

// ============================================================
// HELPERS / FORMATTERS
// ============================================================
function formatDate(d) {
  if (!d) return '—'
  return dayjs(d).locale('fr').format('DD/MM/YYYY')
}

function formatDateTime(d) {
  if (!d) return '—'
  return dayjs(d).locale('fr').format('DD/MM/YYYY HH:mm')
}

function formatHours(h) {
  if (!h && h !== 0) return '—'
  const hours = parseFloat(h)
  if (hours === 0) return '0 h'
  if (hours < 1) return `${Math.round(hours * 60)} min`
  return `${hours.toFixed(1)} h`
}

function statusBadge(status) {
  const map = {
    resolved: { cls: 'badge-resolved', label: 'Résolu', icon: 'fa-check' },
    in_progress: { cls: 'badge-in_progress', label: 'En cours', icon: 'fa-spinner' },
    planned: { cls: 'badge-planned', label: 'Planifié', icon: 'fa-calendar' },
    cancelled: { cls: 'badge-cancelled', label: 'Annulé', icon: 'fa-ban' },
  }
  const s = map[status] || { cls: 'badge-planned', label: status, icon: 'fa-question' }
  return `<span class="badge ${s.cls}"><i class="fas ${s.icon}"></i> ${s.label}</span>`
}

function typeBadge(type) {
  return type === 'preventive'
    ? `<span class="badge badge-preventive"><i class="fas fa-shield-alt"></i> Préventif</span>`
    : `<span class="badge badge-corrective"><i class="fas fa-tools"></i> Correctif</span>`
}

function priorityBadge(priority) {
  const map = {
    critical: { cls: 'badge-critical', label: 'Critique' },
    high:     { cls: 'badge-high',     label: 'Haute' },
    medium:   { cls: 'badge-medium',   label: 'Moyenne' },
    low:      { cls: 'badge-low',      label: 'Basse' },
  }
  const p = map[priority] || { cls: 'badge-medium', label: priority }
  return `<span class="badge ${p.cls}">${p.label}</span>`
}

function downtimeBadge(d) {
  return d ? `<span class="badge badge-yes"><i class="fas fa-exclamation"></i> Oui</span>`
           : `<span class="badge badge-no"><i class="fas fa-check"></i> Non</span>`
}

function stars(rating) {
  const r = Math.round(parseFloat(rating) || 0)
  return `<span class="stars">${'★'.repeat(r)}${'☆'.repeat(5 - r)}</span>`
}

function initials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// ============================================================
// SIDEBAR & NAVIGATION
// ============================================================
function renderApp() {
  document.getElementById('app').innerHTML = `
    <div class="sidebar" id="sidebar">
      <!-- =============================================
           LOGO PLACEHOLDER
           Replace the content inside #logo-slot
           with your own <img>, <svg>, or HTML logo.
           Do not modify the outer wrappers.
           ============================================= -->
      <div class="sidebar-logo" id="logo-wrapper">
        <!--
          #logo-slot — logo zone
          • Par défaut : SVG PPrime intégré (qualité maximale, transparent)
          • Remplacé automatiquement si un logo est uploadé dans Paramètres
        -->
        <div id="logo-slot">
          <img src="/static/logo-pprime-white.svg"
               alt="PPrime"
               class="sidebar-logo-img"
               onerror="this.style.display='none'" />
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-title">Principal</div>
        <div class="nav-item ${state.currentPage==='dashboard'?'active':''}" onclick="navigate('dashboard')">
          <i class="fas fa-chart-line"></i> Tableau de bord
        </div>
        <div class="nav-item ${state.currentPage==='interventions'?'active':''}" onclick="navigate('interventions')">
          <i class="fas fa-hard-hat"></i> Interventions
          <span id="nav-badge-interventions" class="nav-badge" style="display:none"></span>
        </div>
        <div class="nav-section-title">Ressources</div>
        <div class="nav-item ${state.currentPage==='technicians'?'active':''}" onclick="navigate('technicians')">
          <i class="fas fa-users-cog"></i> Techniciens
        </div>
        <div class="nav-item ${state.currentPage==='equipment'?'active':''}" onclick="navigate('equipment')">
          <i class="fas fa-cogs"></i> Équipements
        </div>
        <div class="nav-item ${state.currentPage==='clients'?'active':''}" onclick="navigate('clients')">
          <i class="fas fa-building"></i> Clients
        </div>
        <div class="nav-section-title">Planification</div>
        <div class="nav-item ${state.currentPage==='planning'?'active':''}" onclick="navigate('planning')">
          <i class="fas fa-calendar-alt"></i> Planning
        </div>
        <div class="nav-section-title">Analyse</div>
        <div class="nav-item ${state.currentPage==='reports'?'active':''}" onclick="navigate('reports')">
          <i class="fas fa-chart-bar"></i> Rapports
        </div>
        <div class="nav-section-title">Système</div>
        <div class="nav-item ${state.currentPage==='settings'?'active':''}" onclick="navigate('settings')">
          <i class="fas fa-sliders-h"></i> Paramètres
        </div>
      </nav>
      <div class="sidebar-footer">
        <i class="fas fa-circle" style="color:var(--accent-green);font-size:0.6rem"></i>
        PPrime — GMAO v1.0
      </div>
    </div>
    <div class="main-content">
      <div id="page-container"></div>
    </div>
    <div id="modal-container"></div>
    <div id="toast-container" class="toast-container"></div>
  `
}

function navigate(page) {
  state.currentPage = page
  renderApp()
  const pages = {
    dashboard:     renderDashboard,
    interventions: renderInterventions,
    technicians:   renderTechnicians,
    equipment:     renderEquipment,
    clients:       renderClients,
    planning:      renderPlanning,
    reports:       renderReports,
    settings:      renderSettings,
  }
  if (pages[page]) pages[page]()
}

// ============================================================
// DASHBOARD
// ============================================================
async function renderDashboard() {
  const container = document.getElementById('page-container')
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 style="font-size:1.2rem;font-weight:700">Tableau de bord</h1>
        <p style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px">
          Vue d'ensemble — KPIs en temps réel
        </p>
      </div>
      <div style="display:flex;gap:0.5rem">
        <input type="date" id="kpi-date-from" class="input input-sm" style="width:140px" placeholder="Date début" 
               onchange="reloadKPI()">
        <input type="date" id="kpi-date-to" class="input input-sm" style="width:140px" placeholder="Date fin"
               onchange="reloadKPI()">
        <button class="btn btn-ghost btn-sm" onclick="reloadKPI()">
          <i class="fas fa-sync-alt"></i> Actualiser
        </button>
      </div>
    </div>
    <div class="page-content">
      <div id="kpi-section">
        <div class="loading-overlay"><span class="loader"></span> Chargement des KPIs...</div>
      </div>
    </div>
  `
  await loadKPI()
}

async function reloadKPI() {
  const dateFrom = document.getElementById('kpi-date-from')?.value
  const dateTo = document.getElementById('kpi-date-to')?.value
  state.kpi.filters = {}
  if (dateFrom) state.kpi.filters.date_from = dateFrom
  if (dateTo) state.kpi.filters.date_to = dateTo
  await loadKPI()
}

async function loadKPI() {
  const section = document.getElementById('kpi-section')
  if (!section) return
  section.innerHTML = `<div class="loading-overlay"><span class="loader"></span> Chargement...</div>`

  try {
    const params = new URLSearchParams(state.kpi.filters).toString()
    const data = await http.get(`${API.kpi}${params ? '?' + params : ''}`)
    state.kpi.data = data
    renderKPISection(data)
  } catch (e) {
    section.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Erreur de chargement des KPIs</p></div>`
  }
}

function renderKPISection(data) {
  const section = document.getElementById('kpi-section')
  const kpis = data.kpis
  const charts = data.charts

  section.innerHTML = `
    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card" style="--kpi-color:var(--accent-blue)">
        <i class="fas fa-list-check kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-tasks"></i> Total Interventions</div>
        <div class="kpi-value">${kpis.total_interventions}</div>
        <div class="kpi-trend">${kpis.resolved_count} résolues · ${kpis.in_progress_count} en cours</div>
      </div>
      <div class="kpi-card" style="--kpi-color:var(--accent-green)">
        <i class="fas fa-check-double kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-percentage"></i> Taux de Résolution</div>
        <div class="kpi-value">${kpis.resolution_rate}<span class="kpi-unit">%</span></div>
        <div class="kpi-trend">${kpis.resolved_count} / ${kpis.total_interventions} interventions</div>
      </div>
      <div class="kpi-card" style="--kpi-color:var(--accent-yellow)">
        <i class="fas fa-clock kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-stopwatch"></i> MTTR</div>
        <div class="kpi-value">${kpis.mttr || 0}<span class="kpi-unit"> h</span></div>
        <div class="kpi-trend">Temps moyen de réparation</div>
      </div>
      <div class="kpi-card" style="--kpi-color:var(--accent-purple)">
        <i class="fas fa-history kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-chart-area"></i> MTBF</div>
        <div class="kpi-value">${kpis.mtbf || 0}<span class="kpi-unit"> h</span></div>
        <div class="kpi-trend">Temps moyen entre pannes</div>
      </div>
      <div class="kpi-card" style="--kpi-color:var(--accent-green)">
        <i class="fas fa-signal kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-heartbeat"></i> Disponibilité</div>
        <div class="kpi-value">${kpis.availability}<span class="kpi-unit">%</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${kpis.availability}%;background:var(--accent-green)"></div></div>
      </div>
      <div class="kpi-card" style="--kpi-color:var(--accent-orange)">
        <i class="fas fa-shield-alt kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-tools"></i> Préventif / Correctif</div>
        <div class="kpi-value">${kpis.preventive_pct}<span class="kpi-unit">%</span></div>
        <div class="kpi-trend">${kpis.preventive_count} préventives · ${kpis.corrective_count} correctives</div>
      </div>
      <div class="kpi-card" style="--kpi-color:var(--accent-red)">
        <i class="fas fa-power-off kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-exclamation-triangle"></i> Arrêts machine</div>
        <div class="kpi-value">${kpis.downtime_count}</div>
        <div class="kpi-trend">Interventions avec arrêt</div>
      </div>
      <div class="kpi-card" style="--kpi-color:var(--accent-red)">
        <i class="fas fa-fire kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-exclamation"></i> Critiques / Hautes</div>
        <div class="kpi-value">${kpis.critical_count + kpis.high_count}</div>
        <div class="kpi-trend">${kpis.critical_count} critiques · ${kpis.high_count} hautes</div>
      </div>
    </div>

    <!-- Charts -->
    <div class="chart-grid">
      <div class="chart-card wide">
        <div class="chart-title"><i class="fas fa-chart-bar"></i> Interventions par mois (12 derniers mois)</div>
        <canvas id="chart-monthly" height="90"></canvas>
      </div>
      <div class="chart-card">
        <div class="chart-title"><i class="fas fa-chart-pie"></i> Statut des interventions</div>
        <canvas id="chart-status" height="180"></canvas>
      </div>
      <div class="chart-card">
        <div class="chart-title"><i class="fas fa-chart-donut"></i> Priorité des interventions</div>
        <canvas id="chart-priority" height="180"></canvas>
      </div>
      <div class="chart-card">
        <div class="chart-title"><i class="fas fa-map-marker-alt"></i> Top villes</div>
        <canvas id="chart-cities" height="180"></canvas>
      </div>
      <div class="chart-card">
        <div class="chart-title"><i class="fas fa-user-cog"></i> Performance techniciens</div>
        <canvas id="chart-technicians" height="180"></canvas>
      </div>
    </div>

    <!-- Recent interventions in progress -->
    <div class="table-card">
      <div class="table-header">
        <div class="table-title"><i class="fas fa-spinner" style="color:var(--accent-blue)"></i> Interventions en cours</div>
        <button class="btn btn-ghost btn-sm" onclick="navigate('interventions')">Voir tout <i class="fas fa-arrow-right"></i></button>
      </div>
      <div id="recent-interventions-table"></div>
    </div>
  `

  // Render charts after DOM is ready
  setTimeout(() => {
    renderCharts(kpis, charts)
    loadRecentInterventions()
  }, 100)
}

function renderCharts(kpis, charts) {
  Chart.defaults.color = '#8892b0'
  Chart.defaults.borderColor = '#2a3349'
  const gridColor = 'rgba(42,51,73,0.7)'

  // Détruire les charts existants
  Object.values(state.charts).forEach(c => { try { c.destroy() } catch(e){} })
  state.charts = {}

  // Monthly chart
  const monthlyEl = document.getElementById('chart-monthly')
  if (monthlyEl && charts.by_month?.length > 0) {
    const labels = charts.by_month.map(m => {
      const [y, mo] = m.month.split('-')
      return dayjs(`${y}-${mo}-01`).locale('fr').format('MMM YY')
    })
    state.charts.monthly = new Chart(monthlyEl, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total',
            data: charts.by_month.map(m => m.total),
            backgroundColor: 'rgba(79,158,248,0.7)',
            borderRadius: 4,
          },
          {
            label: 'Résolues',
            data: charts.by_month.map(m => m.resolved),
            backgroundColor: 'rgba(52,211,153,0.7)',
            borderRadius: 4,
          },
          {
            label: 'Préventives',
            data: charts.by_month.map(m => m.preventive),
            backgroundColor: 'rgba(167,139,250,0.7)',
            borderRadius: 4,
          },
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: {
          x: { grid: { color: gridColor } },
          y: { grid: { color: gridColor }, beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    })
  } else if (monthlyEl) {
    monthlyEl.parentElement.innerHTML += `<div class="empty-state" style="padding:1rem"><p>Aucune donnée mensuelle</p></div>`
  }

  // Status Donut
  const statusEl = document.getElementById('chart-status')
  if (statusEl && charts.by_status?.length > 0) {
    const colorMap = { resolved: '#34d399', in_progress: '#4f9ef8', planned: '#a78bfa', cancelled: '#4a5568' }
    state.charts.status = new Chart(statusEl, {
      type: 'doughnut',
      data: {
        labels: charts.by_status.map(s => ({ resolved:'Résolu', in_progress:'En cours', planned:'Planifié', cancelled:'Annulé' }[s.status] || s.status)),
        datasets: [{ data: charts.by_status.map(s => s.count), backgroundColor: charts.by_status.map(s => colorMap[s.status] || '#4a5568'), borderWidth: 0 }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } }, cutout: '65%' }
    })
  }

  // Priority donut
  const prioEl = document.getElementById('chart-priority')
  if (prioEl && charts.by_priority?.length > 0) {
    const colorMap = { critical: '#f87171', high: '#fb923c', medium: '#fbbf24', low: '#34d399' }
    state.charts.priority = new Chart(prioEl, {
      type: 'doughnut',
      data: {
        labels: charts.by_priority.map(p => ({ critical:'Critique', high:'Haute', medium:'Moyenne', low:'Basse' }[p.priority] || p.priority)),
        datasets: [{ data: charts.by_priority.map(p => p.count), backgroundColor: charts.by_priority.map(p => colorMap[p.priority] || '#4a5568'), borderWidth: 0 }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } }, cutout: '65%' }
    })
  }

  // Cities bar
  const cityEl = document.getElementById('chart-cities')
  if (cityEl && charts.by_city?.length > 0) {
    state.charts.cities = new Chart(cityEl, {
      type: 'bar',
      data: {
        labels: charts.by_city.map(c => c.city || 'N/A'),
        datasets: [{ label: 'Interventions', data: charts.by_city.map(c => c.count), backgroundColor: 'rgba(251,191,36,0.7)', borderRadius: 4 }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { color: gridColor }, beginAtZero: true }, y: { grid: { display: false } } }
      }
    })
  }

  // Technicians bar
  const techEl = document.getElementById('chart-technicians')
  if (techEl && charts.top_technicians?.length > 0) {
    state.charts.technicians = new Chart(techEl, {
      type: 'bar',
      data: {
        labels: charts.top_technicians.map(t => t.technician_name || 'N/A'),
        datasets: [
          { label: 'Total', data: charts.top_technicians.map(t => t.total), backgroundColor: 'rgba(79,158,248,0.7)', borderRadius: 4 },
          { label: 'Résolues', data: charts.top_technicians.map(t => t.resolved), backgroundColor: 'rgba(52,211,153,0.7)', borderRadius: 4 },
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor }, beginAtZero: true } }
      }
    })
  }
}

async function loadRecentInterventions() {
  try {
    const data = await http.get(`${API.interventions}?status=in_progress&limit=5`)
    const el = document.getElementById('recent-interventions-table')
    if (!el) return
    if (!data.data?.length) {
      el.innerHTML = `<div class="empty-state"><i class="fas fa-check-circle" style="color:var(--accent-green)"></i><p>Aucune intervention en cours</p></div>`
      return
    }
    el.innerHTML = `
      <div class="table-container">
        <table>
          <thead><tr>
            <th>Titre</th><th>Client</th><th>Équipement</th><th>Ville</th>
            <th>Technicien</th><th>Priorité</th><th>Date</th>
          </tr></thead>
          <tbody>
            ${data.data.map(i => `
              <tr onclick="openInterventionDetail(${i.id})" style="cursor:pointer">
                <td><strong>${escHtml(i.title)}</strong></td>
                <td class="text-secondary">${escHtml(i.client||'—')}</td>
                <td class="text-secondary">${escHtml(i.equipment||'—')}</td>
                <td class="text-secondary">${escHtml(i.city||'—')}</td>
                <td>${i.technician_name ? `<span>${escHtml(i.technician_name)}</span>` : '—'}</td>
                <td>${priorityBadge(i.priority)}</td>
                <td class="text-secondary">${formatDate(i.scheduled_date || i.created_at)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
    // Update nav badge
    const badge = document.getElementById('nav-badge-interventions')
    if (badge && data.total > 0) {
      badge.textContent = data.total
      badge.style.display = 'inline-block'
    }
  } catch(e) {}
}

function escHtml(str) {
  if (!str) return ''
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

// ============================================================
// INTERVENTIONS PAGE
// ============================================================
async function renderInterventions() {
  const container = document.getElementById('page-container')
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 style="font-size:1.2rem;font-weight:700">Interventions</h1>
        <p style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px">
          Gestion complète des interventions de maintenance
        </p>
      </div>
      <button class="btn btn-primary" onclick="openInterventionModal()">
        <i class="fas fa-plus"></i> Nouvelle intervention
      </button>
    </div>
    <div class="page-content">
      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-wrapper">
          <i class="fas fa-search"></i>
          <input type="text" id="filter-search" class="input input-sm" placeholder="Rechercher..." oninput="debounceFilter()">
        </div>
        <select id="filter-status" class="select input-sm" style="width:130px" onchange="filterInterventions()">
          <option value="">Tous statuts</option>
          <option value="in_progress">En cours</option>
          <option value="resolved">Résolu</option>
          <option value="planned">Planifié</option>
          <option value="cancelled">Annulé</option>
        </select>
        <select id="filter-type" class="select input-sm" style="width:130px" onchange="filterInterventions()">
          <option value="">Tous types</option>
          <option value="corrective">Correctif</option>
          <option value="preventive">Préventif</option>
        </select>
        <select id="filter-priority" class="select input-sm" style="width:130px" onchange="filterInterventions()">
          <option value="">Toutes priorités</option>
          <option value="critical">Critique</option>
          <option value="high">Haute</option>
          <option value="medium">Moyenne</option>
          <option value="low">Basse</option>
        </select>
        <select id="filter-technician" class="select input-sm" style="width:160px" onchange="filterInterventions()">
          <option value="">Tous techniciens</option>
        </select>
        <input type="text" id="filter-city" class="input input-sm" style="width:130px" placeholder="Ville..." oninput="debounceFilter()">
        <input type="date" id="filter-date-from" class="input input-sm" style="width:140px" onchange="filterInterventions()">
        <input type="date" id="filter-date-to" class="input input-sm" style="width:140px" onchange="filterInterventions()">
        <button class="btn btn-ghost btn-sm" onclick="clearFilters()">
          <i class="fas fa-times"></i> Effacer
        </button>
      </div>
      <!-- Table -->
      <div class="table-card">
        <div class="table-header">
          <div class="table-title" id="interventions-count">Chargement...</div>
        </div>
        <div id="interventions-table-body">
          <div class="loading-overlay"><span class="loader"></span> Chargement...</div>
        </div>
        <div id="interventions-pagination" class="pagination-info"></div>
      </div>
    </div>
  `
  await loadTechniciansForFilter()
  await loadInterventions()
}

let filterDebounce = null
function debounceFilter() {
  clearTimeout(filterDebounce)
  filterDebounce = setTimeout(() => filterInterventions(), 400)
}

function clearFilters() {
  document.getElementById('filter-search').value = ''
  document.getElementById('filter-status').value = ''
  document.getElementById('filter-type').value = ''
  document.getElementById('filter-priority').value = ''
  document.getElementById('filter-technician').value = ''
  document.getElementById('filter-city').value = ''
  document.getElementById('filter-date-from').value = ''
  document.getElementById('filter-date-to').value = ''
  state.interventions.filters = {}
  state.interventions.page = 1
  loadInterventions()
}

function filterInterventions() {
  const filters = {}
  const search = document.getElementById('filter-search')?.value.trim()
  const status = document.getElementById('filter-status')?.value
  const type = document.getElementById('filter-type')?.value
  const priority = document.getElementById('filter-priority')?.value
  const techId = document.getElementById('filter-technician')?.value
  const city = document.getElementById('filter-city')?.value.trim()
  const dateFrom = document.getElementById('filter-date-from')?.value
  const dateTo = document.getElementById('filter-date-to')?.value
  if (status) filters.status = status
  if (type) filters.type = type
  if (priority) filters.priority = priority
  if (techId) filters.technician_id = techId
  if (city) filters.city = city
  if (dateFrom) filters.date_from = dateFrom
  if (dateTo) filters.date_to = dateTo
  state.interventions.filters = filters
  state.interventions.page = 1
  loadInterventions()
}

async function loadTechniciansForFilter() {
  try {
    const data = await http.get(API.technicians)
    state.technicians.data = data.data || []
    const sel = document.getElementById('filter-technician')
    if (sel) {
      data.data?.forEach(t => {
        const opt = document.createElement('option')
        opt.value = t.id
        opt.textContent = t.name
        sel.appendChild(opt)
      })
    }
  } catch(e) {}
}

async function loadInterventions() {
  const tbody = document.getElementById('interventions-table-body')
  if (!tbody) return
  tbody.innerHTML = `<div class="loading-overlay"><span class="loader"></span> Chargement...</div>`

  try {
    const params = new URLSearchParams({
      ...state.interventions.filters,
      page: state.interventions.page,
      limit: 20
    }).toString()
    const data = await http.get(`${API.interventions}?${params}`)
    state.interventions.data = data.data || []
    state.interventions.total = data.total || 0
    state.interventions.pages = data.pages || 1

    const countEl = document.getElementById('interventions-count')
    if (countEl) countEl.textContent = `${data.total} intervention${data.total !== 1 ? 's' : ''}`

    if (!data.data?.length) {
      tbody.innerHTML = `<div class="empty-state"><i class="fas fa-hard-hat"></i><p>Aucune intervention trouvée</p><p>Créez votre première intervention avec le bouton "Nouvelle intervention"</p></div>`
    } else {
      tbody.innerHTML = `
        <div class="table-container">
          <table>
            <thead><tr>
              <th>ID</th><th>Titre</th><th>Client</th><th>Équipement</th>
              <th>Ville</th><th>Type</th><th>Priorité</th><th>Statut</th>
              <th>Technicien</th><th>Durée</th><th>Arrêt</th><th>Date</th>
              <th>Actions</th>
            </tr></thead>
            <tbody>
              ${data.data.map(i => `
                <tr>
                  <td class="text-secondary">#${i.id}</td>
                  <td><strong style="cursor:pointer;color:var(--accent-blue)" onclick="openInterventionDetail(${i.id})">${escHtml(i.title)}</strong>
                  ${i.description ? `<br><small class="text-secondary">${escHtml(i.description.slice(0,50))}${i.description.length>50?'…':''}</small>` : ''}</td>
                  <td class="text-secondary">${escHtml(i.client||'—')}</td>
                  <td class="text-secondary">${escHtml(i.equipment||'—')}</td>
                  <td class="text-secondary">${escHtml(i.city||'—')}</td>
                  <td>${typeBadge(i.type)}</td>
                  <td>${priorityBadge(i.priority)}</td>
                  <td>${statusBadge(i.status)}</td>
                  <td>${i.technician_name ? escHtml(i.technician_name) : '<span class="text-secondary">—</span>'}</td>
                  <td class="text-secondary">${formatHours(i.duration_hours)}</td>
                  <td>${downtimeBadge(i.downtime)}</td>
                  <td class="text-secondary">${formatDate(i.scheduled_date || i.created_at)}</td>
                  <td>
                    <div style="display:flex;gap:4px">
                      <button class="btn btn-ghost btn-sm btn-icon" onclick="openInterventionModal(${i.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-danger btn-sm btn-icon" onclick="confirmDeleteIntervention(${i.id}, '${escHtml(i.title)}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `
    }

    // Pagination
    const paginEl = document.getElementById('interventions-pagination')
    if (paginEl) {
      const { page, pages, total } = { page: state.interventions.page, pages: data.pages, total: data.total }
      if (pages > 1) {
        paginEl.innerHTML = `
          <span>${(page-1)*20+1}–${Math.min(page*20, total)} sur ${total}</span>
          <div style="display:flex;gap:4px">
            <button class="btn btn-ghost btn-sm" ${page<=1?'disabled':''} onclick="goToPage(${page-1})">
              <i class="fas fa-chevron-left"></i>
            </button>
            <span style="font-size:0.78rem;padding:0 0.5rem;line-height:30px">Page ${page}/${pages}</span>
            <button class="btn btn-ghost btn-sm" ${page>=pages?'disabled':''} onclick="goToPage(${page+1})">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        `
      } else {
        paginEl.innerHTML = ''
      }
    }
  } catch(e) {
    tbody.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Erreur de chargement</p></div>`
  }
}

async function goToPage(page) {
  state.interventions.page = page
  await loadInterventions()
}

// ===== INTERVENTION MODAL =====
async function openInterventionModal(id = null) {
  let intervention = null
  if (id) {
    try { intervention = await http.get(`${API.interventions}/${id}`) } catch(e) { showToast('Erreur de chargement', 'error'); return }
  }

  // Load technicians for select
  if (!state.technicians.data.length) {
    try { const d = await http.get(API.technicians); state.technicians.data = d.data || [] } catch(e) {}
  }

  const techOptions = state.technicians.data.map(t =>
    `<option value="${t.id}" data-name="${escHtml(t.name)}" ${intervention?.technician_id == t.id ? 'selected' : ''}>${escHtml(t.name)}</option>`
  ).join('')

  const modal = document.getElementById('modal-container')
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal modal-lg">
        <div class="modal-header">
          <div class="modal-title">
            <i class="fas fa-${id ? 'edit' : 'plus-circle'}" style="color:var(--accent-blue)"></i>
            ${id ? 'Modifier l\'intervention' : 'Nouvelle intervention'}
          </div>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="closeModalAll()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <form id="intervention-form" onsubmit="saveIntervention(event, ${id})">
            <div class="form-row">
              <div class="form-group" style="grid-column:1/-1">
                <label class="form-label">Titre *</label>
                <input type="text" name="title" class="input" required placeholder="Description de l'intervention" value="${escHtml(intervention?.title||'')}">
              </div>
            </div>
            <div class="form-row-3">
              <div class="form-group">
                <label class="form-label">Type</label>
                <select name="type" class="select">
                  <option value="corrective" ${intervention?.type==='corrective'||!id?'selected':''}>Correctif</option>
                  <option value="preventive" ${intervention?.type==='preventive'?'selected':''}>Préventif</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Priorité</label>
                <select name="priority" class="select">
                  <option value="low" ${intervention?.priority==='low'?'selected':''}>Basse</option>
                  <option value="medium" ${intervention?.priority==='medium'||!id?'selected':''}>Moyenne</option>
                  <option value="high" ${intervention?.priority==='high'?'selected':''}>Haute</option>
                  <option value="critical" ${intervention?.priority==='critical'?'selected':''}>Critique</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Statut</label>
                <select name="status" class="select">
                  <option value="planned" ${intervention?.status==='planned'?'selected':''}>Planifié</option>
                  <option value="in_progress" ${intervention?.status==='in_progress'||!id?'selected':''}>En cours</option>
                  <option value="resolved" ${intervention?.status==='resolved'?'selected':''}>Résolu</option>
                  <option value="cancelled" ${intervention?.status==='cancelled'?'selected':''}>Annulé</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Client</label>
                <input type="text" name="client" class="input" placeholder="Nom du client" value="${escHtml(intervention?.client||'')}">
              </div>
              <div class="form-group">
                <label class="form-label">Équipement</label>
                <input type="text" name="equipment" class="input" placeholder="Nom de l'équipement" value="${escHtml(intervention?.equipment||'')}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Ville</label>
                <input type="text" name="city" class="input" placeholder="Ville" value="${escHtml(intervention?.city||'')}">
              </div>
              <div class="form-group">
                <label class="form-label">Technicien</label>
                <select name="technician_id" class="select" onchange="updateTechnicianName(this)">
                  <option value="">— Sélectionner —</option>
                  ${techOptions}
                </select>
                <input type="hidden" name="technician_name" value="${escHtml(intervention?.technician_name||'')}">
              </div>
            </div>
            <div class="form-row-3">
              <div class="form-group">
                <label class="form-label">Durée (heures)</label>
                <input type="number" name="duration_hours" class="input" step="0.5" min="0" placeholder="0" value="${intervention?.duration_hours||''}">
              </div>
              <div class="form-group">
                <label class="form-label">Arrêt machine</label>
                <select name="downtime" class="select">
                  <option value="0" ${!intervention?.downtime?'selected':''}>Non</option>
                  <option value="1" ${intervention?.downtime?'selected':''}>Oui</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Date planifiée</label>
                <input type="date" name="scheduled_date" class="input" value="${intervention?.scheduled_date?.split('T')[0]||''}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date de début</label>
                <input type="datetime-local" name="start_date" class="input" value="${intervention?.start_date?.slice(0,16)||''}">
              </div>
              <div class="form-group">
                <label class="form-label">Date de fin</label>
                <input type="datetime-local" name="end_date" class="input" value="${intervention?.end_date?.slice(0,16)||''}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Notes</label>
              <textarea name="notes" class="textarea" rows="3" placeholder="Notes supplémentaires...">${escHtml(intervention?.notes||'')}</textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="closeModalAll()">Annuler</button>
          <button class="btn btn-primary" onclick="document.getElementById('intervention-form').dispatchEvent(new Event('submit', {cancelable:true}))">
            <i class="fas fa-save"></i> ${id ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  `
}

function updateTechnicianName(sel) {
  const opt = sel.options[sel.selectedIndex]
  const nameInput = sel.form.elements['technician_name']
  if (nameInput) nameInput.value = opt.getAttribute('data-name') || ''
}

async function saveIntervention(e, id) {
  e.preventDefault()
  const form = e.target
  const data = Object.fromEntries(new FormData(form))
  data.downtime = parseInt(data.downtime)
  data.duration_hours = parseFloat(data.duration_hours) || 0
  if (!data.technician_id) { delete data.technician_id; delete data.technician_name }
  if (!data.scheduled_date) delete data.scheduled_date
  if (!data.start_date) delete data.start_date
  if (!data.end_date) delete data.end_date

  try {
    if (id) {
      await http.put(`${API.interventions}/${id}`, data)
      showToast('Intervention modifiée avec succès', 'success')
    } else {
      await http.post(API.interventions, data)
      showToast('Intervention créée avec succès', 'success')
    }
    closeModalAll()
    loadInterventions()
  } catch(err) {
    showToast(err.response?.data?.error || 'Erreur lors de la sauvegarde', 'error')
  }
}

function confirmDeleteIntervention(id, title) {
  const modal = document.getElementById('modal-container')
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" style="max-width:440px">
        <div class="modal-header">
          <div class="modal-title"><i class="fas fa-exclamation-triangle" style="color:var(--accent-red)"></i> Confirmer la suppression</div>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="closeModalAll()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <p style="color:var(--text-secondary)">Voulez-vous vraiment supprimer l'intervention :</p>
          <p style="margin:0.75rem 0;font-weight:600;color:var(--text-primary)">"${escHtml(title)}"</p>
          <p style="font-size:0.8rem;color:var(--accent-red)">Cette action est irréversible.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="closeModalAll()">Annuler</button>
          <button class="btn btn-confirm-delete" onclick="deleteIntervention(${id})">
            <i class="fas fa-trash"></i> Supprimer
          </button>
        </div>
      </div>
    </div>
  `
}

async function deleteIntervention(id) {
  try {
    await http.delete(`${API.interventions}/${id}`)
    showToast('Intervention supprimée', 'success')
    closeModalAll()
    loadInterventions()
  } catch(e) {
    showToast('Erreur lors de la suppression', 'error')
  }
}

async function openInterventionDetail(id) {
  try {
    const i = await http.get(`${API.interventions}/${id}`)
    const modal = document.getElementById('modal-container')
    modal.innerHTML = `
      <div class="modal-overlay" onclick="closeModal(event)">
        <div class="modal modal-lg">
          <div class="modal-header">
            <div class="modal-title"><i class="fas fa-info-circle" style="color:var(--accent-blue)"></i> Détail — ${escHtml(i.title)}</div>
            <button class="btn btn-ghost btn-sm btn-icon" onclick="closeModalAll()"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
              <div><div class="form-label">Statut</div>${statusBadge(i.status)}</div>
              <div><div class="form-label">Type</div>${typeBadge(i.type)}</div>
              <div><div class="form-label">Priorité</div>${priorityBadge(i.priority)}</div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
              <div><div class="form-label">Client</div><div>${escHtml(i.client||'—')}</div></div>
              <div><div class="form-label">Équipement</div><div>${escHtml(i.equipment||'—')}</div></div>
              <div><div class="form-label">Ville</div><div>${escHtml(i.city||'—')}</div></div>
              <div><div class="form-label">Technicien</div><div>${escHtml(i.technician_name||'—')}</div></div>
              <div><div class="form-label">Durée</div><div>${formatHours(i.duration_hours)}</div></div>
              <div><div class="form-label">Arrêt machine</div>${downtimeBadge(i.downtime)}</div>
              <div><div class="form-label">Date planifiée</div><div>${formatDate(i.scheduled_date)}</div></div>
              <div><div class="form-label">Créée le</div><div>${formatDateTime(i.created_at)}</div></div>
            </div>
            ${i.notes ? `<div class="form-label">Notes</div><div style="background:var(--bg-primary);border:1px solid var(--border);border-radius:8px;padding:0.75rem;font-size:0.85rem;color:var(--text-secondary)">${escHtml(i.notes)}</div>` : ''}
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" onclick="closeModalAll()">Fermer</button>
            <button class="btn btn-primary" onclick="closeModalAll();openInterventionModal(${i.id})">
              <i class="fas fa-edit"></i> Modifier
            </button>
          </div>
        </div>
      </div>
    `
  } catch(e) { showToast('Erreur de chargement', 'error') }
}

// ============================================================
// TECHNICIANS PAGE
// ============================================================
async function renderTechnicians() {
  const container = document.getElementById('page-container')
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 style="font-size:1.2rem;font-weight:700">Techniciens</h1>
        <p style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px">Gestion et performance de l'équipe</p>
      </div>
      <button class="btn btn-primary" onclick="openTechnicianModal()">
        <i class="fas fa-user-plus"></i> Ajouter un technicien
      </button>
    </div>
    <div class="page-content">
      <div id="technicians-grid">
        <div class="loading-overlay"><span class="loader"></span> Chargement...</div>
      </div>
    </div>
  `
  await loadTechnicians()
}

async function loadTechnicians() {
  const grid = document.getElementById('technicians-grid')
  if (!grid) return
  try {
    const data = await http.get(API.technicians)
    state.technicians.data = data.data || []
    if (!data.data?.length) {
      grid.innerHTML = `<div class="empty-state"><i class="fas fa-users-cog"></i><p>Aucun technicien enregistré</p><p>Ajoutez votre premier technicien</p></div>`
      return
    }
    grid.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem">
        ${data.data.map(t => `
          <div class="tech-card">
            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem">
              <div class="tech-avatar">${initials(t.name)}</div>
              <div style="flex:1">
                <div style="font-weight:700;color:var(--text-primary)">${escHtml(t.name)}</div>
                <div style="font-size:0.75rem;color:var(--text-secondary)">${escHtml(t.specialty||'Généraliste')}</div>
                ${stars(t.rating)}
              </div>
              <div style="display:flex;gap:4px">
                <button class="btn btn-ghost btn-sm btn-icon" onclick="openTechnicianModal(${t.id})" title="Modifier"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm btn-icon" onclick="confirmDeleteTechnician(${t.id},'${escHtml(t.name)}')" title="Supprimer"><i class="fas fa-trash"></i></button>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
              <div style="background:var(--bg-primary);border-radius:8px;padding:0.65rem;text-align:center">
                <div style="font-size:1.3rem;font-weight:700;color:var(--accent-blue)">${t.total_interventions||0}</div>
                <div style="font-size:0.68rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.06em">Interventions</div>
              </div>
              <div style="background:var(--bg-primary);border-radius:8px;padding:0.65rem;text-align:center">
                <div style="font-size:1.3rem;font-weight:700;color:var(--accent-green)">${t.resolution_rate||0}%</div>
                <div style="font-size:0.68rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.06em">Résolution</div>
              </div>
            </div>
            ${t.total_interventions > 0 ? `
            <div style="margin-top:0.75rem">
              <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--text-secondary);margin-bottom:3px">
                <span>Taux de résolution</span><span>${t.resolution_rate||0}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${t.resolution_rate||0}%;background:${(t.resolution_rate||0)>75?'var(--accent-green)':(t.resolution_rate||0)>50?'var(--accent-yellow)':'var(--accent-red)'}"></div>
              </div>
            </div>` : ''}
            ${t.email ? `<div style="margin-top:0.6rem;font-size:0.75rem;color:var(--text-secondary)"><i class="fas fa-envelope" style="width:14px"></i> ${escHtml(t.email)}</div>` : ''}
            ${t.phone ? `<div style="font-size:0.75rem;color:var(--text-secondary)"><i class="fas fa-phone" style="width:14px"></i> ${escHtml(t.phone)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `
  } catch(e) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Erreur de chargement</p></div>`
  }
}

async function openTechnicianModal(id = null) {
  let tech = null
  if (id) {
    try { tech = await http.get(`${API.technicians}/${id}`) } catch(e) { showToast('Erreur', 'error'); return }
  }
  const modal = document.getElementById('modal-container')
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" style="max-width:480px">
        <div class="modal-header">
          <div class="modal-title"><i class="fas fa-user-cog" style="color:var(--accent-blue)"></i> ${id ? 'Modifier' : 'Ajouter'} un technicien</div>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="closeModalAll()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <form id="tech-form" onsubmit="saveTechnician(event,${id})">
            <div class="form-group">
              <label class="form-label">Nom complet *</label>
              <input type="text" name="name" class="input" required placeholder="Prénom NOM" value="${escHtml(tech?.name||'')}">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="input" placeholder="email@exemple.com" value="${escHtml(tech?.email||'')}">
              </div>
              <div class="form-group">
                <label class="form-label">Téléphone</label>
                <input type="text" name="phone" class="input" placeholder="+33 6..." value="${escHtml(tech?.phone||'')}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Spécialité</label>
                <input type="text" name="specialty" class="input" placeholder="Ex: Électricité, CVC..." value="${escHtml(tech?.specialty||'')}">
              </div>
              <div class="form-group">
                <label class="form-label">Note (0-5)</label>
                <input type="number" name="rating" class="input" min="0" max="5" step="0.5" placeholder="0" value="${tech?.rating||''}">
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="closeModalAll()">Annuler</button>
          <button class="btn btn-primary" onclick="document.getElementById('tech-form').dispatchEvent(new Event('submit',{cancelable:true}))">
            <i class="fas fa-save"></i> ${id ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  `
}

async function saveTechnician(e, id) {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(e.target))
  data.rating = parseFloat(data.rating) || 0
  try {
    if (id) { await http.put(`${API.technicians}/${id}`, data); showToast('Technicien modifié', 'success') }
    else { await http.post(API.technicians, data); showToast('Technicien ajouté', 'success') }
    closeModalAll()
    loadTechnicians()
  } catch(err) { showToast(err.response?.data?.error || 'Erreur', 'error') }
}

function confirmDeleteTechnician(id, name) {
  const modal = document.getElementById('modal-container')
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" style="max-width:440px">
        <div class="modal-header">
          <div class="modal-title"><i class="fas fa-exclamation-triangle" style="color:var(--accent-red)"></i> Supprimer le technicien</div>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="closeModalAll()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <p style="color:var(--text-secondary)">Supprimer <strong style="color:var(--text-primary)">"${escHtml(name)}"</strong> ?</p>
          <p style="font-size:0.8rem;color:var(--accent-yellow);margin-top:0.5rem"><i class="fas fa-info-circle"></i> Les interventions associées ne seront pas supprimées.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="closeModalAll()">Annuler</button>
          <button class="btn btn-confirm-delete" onclick="deleteTechnician(${id})"><i class="fas fa-trash"></i> Supprimer</button>
        </div>
      </div>
    </div>
  `
}

async function deleteTechnician(id) {
  try {
    await http.delete(`${API.technicians}/${id}`)
    showToast('Technicien supprimé', 'success')
    closeModalAll()
    loadTechnicians()
  } catch(e) { showToast('Erreur', 'error') }
}

// ============================================================
// EQUIPMENT PAGE
// ============================================================
async function renderEquipment() {
  const container = document.getElementById('page-container')
  container.innerHTML = `
    <div class="page-header">
      <div><h1 style="font-size:1.2rem;font-weight:700">Équipements</h1>
      <p style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px">Parc machines et équipements</p></div>
      <button class="btn btn-primary" onclick="openEquipmentModal()"><i class="fas fa-plus"></i> Ajouter équipement</button>
    </div>
    <div class="page-content">
      <div class="table-card">
        <div class="table-header">
          <div class="table-title" id="equipment-count">Chargement...</div>
        </div>
        <div id="equipment-table">
          <div class="loading-overlay"><span class="loader"></span></div>
        </div>
      </div>
    </div>
  `
  await loadEquipment()
}

async function loadEquipment() {
  const el = document.getElementById('equipment-table')
  if (!el) return
  try {
    const data = await http.get(API.equipment)
    state.equipment.data = data.data || []
    document.getElementById('equipment-count').textContent = `${data.data.length} équipement${data.data.length!==1?'s':''}`
    if (!data.data.length) {
      el.innerHTML = `<div class="empty-state"><i class="fas fa-cogs"></i><p>Aucun équipement enregistré</p></div>`
      return
    }
    el.innerHTML = `
      <div class="table-container">
        <table>
          <thead><tr><th>Nom</th><th>Référence</th><th>Catégorie</th><th>Client</th><th>Ville</th><th>Lieu</th><th>Statut</th><th>Installation</th><th>Actions</th></tr></thead>
          <tbody>
            ${data.data.map(eq => `
              <tr>
                <td><strong>${escHtml(eq.name)}</strong></td>
                <td class="text-secondary">${escHtml(eq.reference||'—')}</td>
                <td class="text-secondary">${escHtml(eq.category||'—')}</td>
                <td class="text-secondary">${escHtml(eq.client||'—')}</td>
                <td class="text-secondary">${escHtml(eq.city||'—')}</td>
                <td class="text-secondary">${escHtml(eq.location||'—')}</td>
                <td>${eq.status === 'operational' ? `<span class="badge badge-resolved">Opérationnel</span>` : `<span class="badge badge-corrective">Hors service</span>`}</td>
                <td class="text-secondary">${formatDate(eq.installation_date)}</td>
                <td>
                  <div style="display:flex;gap:4px">
                    <button class="btn btn-ghost btn-sm btn-icon" onclick="openEquipmentModal(${eq.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm btn-icon" onclick="confirmDeleteEquipment(${eq.id},'${escHtml(eq.name)}')"><i class="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
  } catch(e) { el.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Erreur de chargement</p></div>` }
}

async function openEquipmentModal(id = null) {
  let eq = null
  if (id) { try { eq = await http.get(`${API.equipment}/${id}`) } catch(e) { showToast('Erreur', 'error'); return } }
  const modal = document.getElementById('modal-container')
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal modal-lg">
        <div class="modal-header">
          <div class="modal-title"><i class="fas fa-cogs" style="color:var(--accent-blue)"></i> ${id?'Modifier':'Ajouter'} un équipement</div>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="closeModalAll()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <form id="equipment-form" onsubmit="saveEquipment(event,${id})">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Nom *</label>
                <input type="text" name="name" class="input" required placeholder="Nom de l'équipement" value="${escHtml(eq?.name||'')}">
              </div>
              <div class="form-group">
                <label class="form-label">Référence</label>
                <input type="text" name="reference" class="input" placeholder="Réf. fabricant" value="${escHtml(eq?.reference||'')}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Catégorie</label>
                <input type="text" name="category" class="input" placeholder="Ex: Compresseur, CVC..." value="${escHtml(eq?.category||'')}">
              </div>
              <div class="form-group">
                <label class="form-label">Statut</label>
                <select name="status" class="select">
                  <option value="operational" ${eq?.status!=='out_of_service'?'selected':''}>Opérationnel</option>
                  <option value="out_of_service" ${eq?.status==='out_of_service'?'selected':''}>Hors service</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Client</label>
                <input type="text" name="client" class="input" placeholder="Nom du client" value="${escHtml(eq?.client||'')}">
              </div>
              <div class="form-group">
                <label class="form-label">Ville</label>
                <input type="text" name="city" class="input" placeholder="Ville" value="${escHtml(eq?.city||'')}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Emplacement</label>
                <input type="text" name="location" class="input" placeholder="Bâtiment, atelier..." value="${escHtml(eq?.location||'')}">
              </div>
              <div class="form-group">
                <label class="form-label">Date d'installation</label>
                <input type="date" name="installation_date" class="input" value="${eq?.installation_date||''}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Notes</label>
              <textarea name="notes" class="textarea" rows="2" placeholder="Informations supplémentaires...">${escHtml(eq?.notes||'')}</textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="closeModalAll()">Annuler</button>
          <button class="btn btn-primary" onclick="document.getElementById('equipment-form').dispatchEvent(new Event('submit',{cancelable:true}))">
            <i class="fas fa-save"></i> ${id?'Enregistrer':'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  `
}

async function saveEquipment(e, id) {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(e.target))
  if (!data.installation_date) delete data.installation_date
  try {
    if (id) { await http.put(`${API.equipment}/${id}`, data); showToast('Équipement modifié', 'success') }
    else { await http.post(API.equipment, data); showToast('Équipement ajouté', 'success') }
    closeModalAll(); loadEquipment()
  } catch(err) { showToast(err.response?.data?.error || 'Erreur', 'error') }
}

function confirmDeleteEquipment(id, name) {
  const modal = document.getElementById('modal-container')
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" style="max-width:440px">
        <div class="modal-header">
          <div class="modal-title"><i class="fas fa-exclamation-triangle" style="color:var(--accent-red)"></i> Supprimer l'équipement</div>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="closeModalAll()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <p style="color:var(--text-secondary)">Supprimer <strong>"${escHtml(name)}"</strong> ?</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="closeModalAll()">Annuler</button>
          <button class="btn btn-confirm-delete" onclick="deleteEquipment(${id})"><i class="fas fa-trash"></i> Supprimer</button>
        </div>
      </div>
    </div>
  `
}

async function deleteEquipment(id) {
  try { await http.delete(`${API.equipment}/${id}`); showToast('Équipement supprimé', 'success'); closeModalAll(); loadEquipment() }
  catch(e) { showToast('Erreur', 'error') }
}

// ============================================================
// CLIENTS PAGE
// ============================================================
async function renderClients() {
  const container = document.getElementById('page-container')
  container.innerHTML = `
    <div class="page-header">
      <div><h1 style="font-size:1.2rem;font-weight:700">Clients</h1>
      <p style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px">Gestion du portefeuille clients</p></div>
      <button class="btn btn-primary" onclick="openClientModal()"><i class="fas fa-plus"></i> Ajouter client</button>
    </div>
    <div class="page-content">
      <div class="table-card">
        <div class="table-header"><div class="table-title" id="clients-count">Chargement...</div></div>
        <div id="clients-table"><div class="loading-overlay"><span class="loader"></span></div></div>
      </div>
    </div>
  `
  await loadClients()
}

async function loadClients() {
  const el = document.getElementById('clients-table')
  if (!el) return
  try {
    const data = await http.get(API.clients)
    state.clients.data = data.data || []
    document.getElementById('clients-count').textContent = `${data.data.length} client${data.data.length!==1?'s':''}`
    if (!data.data.length) {
      el.innerHTML = `<div class="empty-state"><i class="fas fa-building"></i><p>Aucun client enregistré</p></div>`
      return
    }
    el.innerHTML = `
      <div class="table-container">
        <table>
          <thead><tr><th>Nom</th><th>Contact</th><th>Email</th><th>Téléphone</th><th>Ville</th><th>Adresse</th><th>Actions</th></tr></thead>
          <tbody>
            ${data.data.map(c => `
              <tr>
                <td><strong>${escHtml(c.name)}</strong></td>
                <td class="text-secondary">${escHtml(c.contact_name||'—')}</td>
                <td class="text-secondary">${c.email ? `<a href="mailto:${escHtml(c.email)}" style="color:var(--accent-blue)">${escHtml(c.email)}</a>` : '—'}</td>
                <td class="text-secondary">${escHtml(c.phone||'—')}</td>
                <td class="text-secondary">${escHtml(c.city||'—')}</td>
                <td class="text-secondary">${escHtml(c.address||'—')}</td>
                <td>
                  <div style="display:flex;gap:4px">
                    <button class="btn btn-ghost btn-sm btn-icon" onclick="openClientModal(${c.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm btn-icon" onclick="confirmDeleteClient(${c.id},'${escHtml(c.name)}')"><i class="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
  } catch(e) { el.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Erreur</p></div>` }
}

async function openClientModal(id = null) {
  let client = null
  if (id) { try { client = await http.get(`${API.clients}/${id}`) } catch(e) { showToast('Erreur', 'error'); return } }
  const modal = document.getElementById('modal-container')
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" style="max-width:520px">
        <div class="modal-header">
          <div class="modal-title"><i class="fas fa-building" style="color:var(--accent-blue)"></i> ${id?'Modifier':'Ajouter'} un client</div>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="closeModalAll()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <form id="client-form" onsubmit="saveClient(event,${id})">
            <div class="form-group">
              <label class="form-label">Nom de l'entreprise *</label>
              <input type="text" name="name" class="input" required placeholder="Nom" value="${escHtml(client?.name||'')}">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Contact</label>
                <input type="text" name="contact_name" class="input" placeholder="Prénom NOM" value="${escHtml(client?.contact_name||'')}">
              </div>
              <div class="form-group">
                <label class="form-label">Téléphone</label>
                <input type="text" name="phone" class="input" placeholder="+33..." value="${escHtml(client?.phone||'')}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="input" placeholder="email@exemple.com" value="${escHtml(client?.email||'')}">
              </div>
              <div class="form-group">
                <label class="form-label">Ville</label>
                <input type="text" name="city" class="input" placeholder="Ville" value="${escHtml(client?.city||'')}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Adresse</label>
              <input type="text" name="address" class="input" placeholder="Adresse complète" value="${escHtml(client?.address||'')}">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="closeModalAll()">Annuler</button>
          <button class="btn btn-primary" onclick="document.getElementById('client-form').dispatchEvent(new Event('submit',{cancelable:true}))">
            <i class="fas fa-save"></i> ${id?'Enregistrer':'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  `
}

async function saveClient(e, id) {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(e.target))
  try {
    if (id) { await http.put(`${API.clients}/${id}`, data); showToast('Client modifié', 'success') }
    else { await http.post(API.clients, data); showToast('Client ajouté', 'success') }
    closeModalAll(); loadClients()
  } catch(err) { showToast(err.response?.data?.error || 'Erreur', 'error') }
}

function confirmDeleteClient(id, name) {
  const modal = document.getElementById('modal-container')
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" style="max-width:440px">
        <div class="modal-header">
          <div class="modal-title"><i class="fas fa-exclamation-triangle" style="color:var(--accent-red)"></i> Supprimer le client</div>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="closeModalAll()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body"><p style="color:var(--text-secondary)">Supprimer <strong>"${escHtml(name)}"</strong> ?</p></div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="closeModalAll()">Annuler</button>
          <button class="btn btn-confirm-delete" onclick="deleteClient(${id})"><i class="fas fa-trash"></i> Supprimer</button>
        </div>
      </div>
    </div>
  `
}

async function deleteClient(id) {
  try { await http.delete(`${API.clients}/${id}`); showToast('Client supprimé', 'success'); closeModalAll(); loadClients() }
  catch(e) { showToast('Erreur', 'error') }
}

// ============================================================
// PLANNING PAGE
// ============================================================
async function renderPlanning() {
  const container = document.getElementById('page-container')
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 style="font-size:1.2rem;font-weight:700">Planning</h1>
        <p style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px">Planning préventif 2026 &amp; calendrier de maintenance</p>
      </div>
      <div style="display:flex;gap:0.5rem">
        <button class="btn btn-ghost btn-sm" id="btn-tab-preventif" onclick="switchPlanningTab('preventif')">
          <i class="fas fa-file-contract"></i> Préventif Contractuel
        </button>
        <button class="btn btn-ghost btn-sm" id="btn-tab-calendar" onclick="switchPlanningTab('calendar')">
          <i class="fas fa-calendar-alt"></i> Calendrier
        </button>
        <button class="btn btn-primary" id="btn-add-plan" onclick="openPlanModal()" style="display:none">
          <i class="fas fa-plus"></i> Nouveau plan
        </button>
        <button class="btn btn-primary" id="btn-add-preventif" onclick="openPreventifModal()">
          <i class="fas fa-plus"></i> Ajouter
        </button>
      </div>
    </div>
    <div class="page-content">
      <!-- ===== ONGLET : PLANNING PRÉVENTIF CONTRACTUEL ===== -->
      <div id="tab-preventif">
        <!-- Stats bar -->
        <div id="preventif-stats" style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem"></div>

        <!-- Filtres -->
        <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:1rem;flex-wrap:wrap">
          <select id="filter-nature" class="select" style="width:200px;height:32px;font-size:0.78rem" onchange="loadPreventifTable()">
            <option value="">Toutes les natures</option>
            <option value="Contrat de maintenance">Contrat de maintenance</option>
            <option value="Bon de commande">Bon de commande</option>
          </select>
          <select id="filter-frequence" class="select" style="width:160px;height:32px;font-size:0.78rem" onchange="loadPreventifTable()">
            <option value="">Toutes fréquences</option>
            <option value="Annuelle">Annuelle</option>
            <option value="Semestrielle">Semestrielle</option>
            <option value="Trimestrielle">Trimestrielle</option>
          </select>
          <select id="filter-fait" class="select" style="width:150px;height:32px;font-size:0.78rem" onchange="loadPreventifTable()">
            <option value="">Tous les statuts</option>
            <option value="true">✓ Fait</option>
            <option value="false">✗ Non fait</option>
          </select>
          <input type="text" id="filter-client" class="input" style="width:200px;height:32px;font-size:0.78rem" placeholder="🔍 Rechercher client..." oninput="loadPreventifTable()">
        </div>

        <!-- Tableau Gantt annuel -->
        <div class="table-card">
          <div class="table-header">
            <div class="table-title"><i class="fas fa-file-contract" style="color:var(--accent-blue)"></i> Planning Préventif 2026</div>
            <div id="preventif-counter" style="font-size:0.75rem;color:var(--text-secondary)"></div>
          </div>
          <div id="preventif-table"><div class="loading-overlay"><span class="loader"></span></div></div>
        </div>
      </div>

      <!-- ===== ONGLET : CALENDRIER ===== -->
      <div id="tab-calendar" style="display:none">
        <!-- Calendar Navigation -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem">
          <div style="display:flex;gap:0.5rem;align-items:center">
            <button class="btn btn-ghost btn-sm" onclick="prevMonth()"><i class="fas fa-chevron-left"></i></button>
            <span id="calendar-title" style="font-size:1rem;font-weight:700;min-width:170px;text-align:center"></span>
            <button class="btn btn-ghost btn-sm" onclick="nextMonth()"><i class="fas fa-chevron-right"></i></button>
            <button class="btn btn-ghost btn-sm" onclick="goToday()"><i class="fas fa-crosshairs"></i> Aujourd'hui</button>
          </div>
          <!-- Légende étendue -->
          <div style="display:flex;gap:0.4rem;align-items:center;flex-wrap:wrap">
            <span class="calendar-event preventive" style="padding:3px 8px;font-size:0.68rem">🔧 Préventif</span>
            <span class="calendar-event corrective" style="padding:3px 8px;font-size:0.68rem">⚠️ Correctif</span>
            <span class="calendar-event contrat" style="padding:3px 8px;font-size:0.68rem">📄 Contrat</span>
            <span class="calendar-event bdc" style="padding:3px 8px;font-size:0.68rem">📋 Bon de commande</span>
          </div>
        </div>

        <!-- Résumé du mois -->
        <div id="calendar-month-summary" style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.75rem;min-height:28px;flex-wrap:wrap"></div>

        <!-- Grille calendrier -->
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:1rem;margin-bottom:1.5rem">
          <div class="calendar-grid" id="calendar-grid">
            <div class="loading-overlay" style="grid-column:1/-1"><span class="loader"></span></div>
          </div>
        </div>

        <!-- Plans de maintenance existants -->
        <div class="table-card">
          <div class="table-header">
            <div class="table-title"><i class="fas fa-list" style="color:var(--accent-green)"></i> Plans de maintenance préventive</div>
          </div>
          <div id="plans-list"><div class="loading-overlay"><span class="loader"></span></div></div>
        </div>
      </div>
    </div>
  `

  // Démarrer sur l'onglet préventif
  switchPlanningTab('preventif')
}

function switchPlanningTab(tab) {
  document.getElementById('tab-preventif').style.display = tab === 'preventif' ? '' : 'none'
  document.getElementById('tab-calendar').style.display  = tab === 'calendar'  ? '' : 'none'
  document.getElementById('btn-add-preventif').style.display = tab === 'preventif' ? '' : 'none'
  document.getElementById('btn-add-plan').style.display       = tab === 'calendar'  ? '' : 'none'

  const btnP = document.getElementById('btn-tab-preventif')
  const btnC = document.getElementById('btn-tab-calendar')
  if (btnP) { btnP.className = tab==='preventif' ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm' }
  if (btnC) { btnC.className = tab==='calendar'  ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm' }

  if (tab === 'preventif') loadPreventifTable()
  if (tab === 'calendar')  { renderCalendar(); loadPlansList() }
}

// ============================================================
// PLANNING PRÉVENTIF CONTRACTUEL
// ============================================================
const MOIS_LABELS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']
const MOIS_FULL   = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

async function loadPreventifTable() {
  const el = document.getElementById('preventif-table')
  if (!el) return

  const nature    = document.getElementById('filter-nature')?.value    || ''
  const frequence = document.getElementById('filter-frequence')?.value || ''
  const fait      = document.getElementById('filter-fait')?.value      || ''
  const client    = document.getElementById('filter-client')?.value    || ''

  let url = `${API.planningPreventif}?annee=2026`
  if (nature)    url += `&nature=${encodeURIComponent(nature)}`
  if (frequence) url += `&frequence=${encodeURIComponent(frequence)}`
  if (fait)      url += `&fait=${fait}`
  if (client)    url += `&client=${encodeURIComponent(client)}`

  el.innerHTML = '<div class="loading-overlay"><span class="loader"></span></div>'

  try {
    const res = await http.get(url)
    const rows  = res.data || []
    const stats = res.stats || {}

    // Stats bar
    const statsEl = document.getElementById('preventif-stats')
    if (statsEl) {
      const pct = stats.total > 0 ? Math.round((stats.fait_count/stats.total)*100) : 0
      statsEl.innerHTML = `
        <div class="stat-mini"><span class="stat-mini-val">${stats.total||0}</span><span class="stat-mini-lbl">Total</span></div>
        <div class="stat-mini" style="color:var(--accent-green)"><span class="stat-mini-val">${stats.fait_count||0}</span><span class="stat-mini-lbl">Fait ✓</span></div>
        <div class="stat-mini" style="color:var(--accent-yellow)"><span class="stat-mini-val">${stats.en_attente_count||0}</span><span class="stat-mini-lbl">En attente</span></div>
        <div class="stat-mini" style="color:var(--accent-blue)"><span class="stat-mini-val">${stats.contrats||0}</span><span class="stat-mini-lbl">Contrats</span></div>
        <div class="stat-mini" style="color:var(--accent-purple)"><span class="stat-mini-val">${stats.bons_commande||0}</span><span class="stat-mini-lbl">Bons commande</span></div>
        <div style="flex:1"></div>
        <div style="display:flex;align-items:center;gap:0.75rem;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:0.5rem 1rem">
          <span style="font-size:0.75rem;color:var(--text-secondary)">Avancement 2026</span>
          <div style="width:120px;height:8px;background:var(--bg-secondary);border-radius:4px;overflow:hidden">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,var(--accent-blue),var(--accent-green));border-radius:4px;transition:width .4s"></div>
          </div>
          <strong style="font-size:0.85rem;color:${pct>=80?'var(--accent-green)':pct>=40?'var(--accent-yellow)':'var(--accent-red)'}">${pct}%</strong>
        </div>
      `
    }

    const counter = document.getElementById('preventif-counter')
    if (counter) counter.textContent = `${rows.length} entrée${rows.length>1?'s':''}`

    if (!rows.length) {
      el.innerHTML = `<div class="empty-state"><i class="fas fa-calendar-check"></i><p>Aucun planning préventif trouvé</p></div>`
      return
    }

    // Tableau avec colonne par mois (style Gantt)
    const currentMonth = new Date().getMonth() + 1

    el.innerHTML = `
      <div style="overflow-x:auto">
        <table style="min-width:1200px">
          <thead>
            <tr>
              <th style="min-width:140px">Nature</th>
              <th style="min-width:260px">Description / Intervention</th>
              <th style="min-width:180px">Client</th>
              <th style="min-width:110px;text-align:center">Fréquence</th>
              ${MOIS_LABELS.map((m,i) => {
                const isCurrent = (i+1) === currentMonth
                return `<th style="width:52px;text-align:center;font-size:0.68rem;padding:6px 4px;${isCurrent?'color:var(--accent-blue);background:rgba(79,158,248,0.06)':''}">${m}</th>`
              }).join('')}
              <th style="min-width:80px;text-align:center">Statut</th>
              <th style="min-width:60px;text-align:center">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => {
              const isContrat = r.nature === 'Contrat de maintenance'
              const natureBadge = isContrat
                ? `<span class="badge" style="background:rgba(79,158,248,0.12);color:var(--accent-blue);border:1px solid rgba(79,158,248,0.2);font-size:0.6rem;white-space:nowrap">Contrat</span>`
                : `<span class="badge" style="background:rgba(167,139,250,0.12);color:var(--accent-purple);border:1px solid rgba(167,139,250,0.2);font-size:0.6rem;white-space:nowrap">Bon de commande</span>`

              const freqColor = {
                'Trimestrielle':'var(--accent-green)',
                'Semestrielle': 'var(--accent-blue)',
                'Annuelle':     'var(--accent-yellow)'
              }[r.frequence] || 'var(--text-secondary)'

              const moisCells = Array.from({length:12},(_,i) => {
                const mKey = `mois_${i+1}`
                const planned = r[mKey] === 1
                const isCurrent = (i+1) === currentMonth
                if (!planned) return `<td style="text-align:center;background:${isCurrent?'rgba(79,158,248,0.04)':''}"></td>`
                const color = r.fait
                  ? 'var(--accent-green)'
                  : (i+1) < currentMonth ? 'var(--accent-red)' : 'var(--accent-blue)'
                const icon  = r.fait ? '✓' : '●'
                return `<td style="text-align:center;background:${isCurrent?'rgba(79,158,248,0.06)':''}">
                  <div style="width:28px;height:28px;border-radius:50%;background:${color}22;border:2px solid ${color};display:inline-flex;align-items:center;justify-content:center;font-size:0.65rem;color:${color};font-weight:700;cursor:pointer" 
                       title="${MOIS_FULL[i]} — ${r.client}"
                       onclick="toggleFait(${r.id},${r.fait})">${icon}</div>
                </td>`
              }).join('')

              return `
                <tr style="${r.fait ? 'opacity:0.7' : ''}">
                  <td>${natureBadge}</td>
                  <td>
                    <div style="font-size:0.78rem;color:var(--text-primary);line-height:1.4">${escHtml(r.description.length>65?r.description.slice(0,65)+'…':r.description)}</div>
                  </td>
                  <td>
                    <div style="font-weight:600;font-size:0.78rem;color:var(--text-primary)">${escHtml(r.client)}</div>
                  </td>
                  <td style="text-align:center">
                    <span style="font-size:0.68rem;font-weight:600;color:${freqColor}">${r.frequence}</span>
                  </td>
                  ${moisCells}
                  <td style="text-align:center">
                    ${r.fait
                      ? `<span style="color:var(--accent-green);font-size:0.7rem;font-weight:700">✓ Fait</span>`
                      : `<span style="color:var(--accent-yellow);font-size:0.7rem">En attente</span>`
                    }
                  </td>
                  <td style="text-align:center">
                    <div style="display:flex;gap:3px;justify-content:center">
                      <button class="btn btn-ghost btn-sm btn-icon" onclick="openPreventifModal(${r.id})" title="Modifier"><i class="fas fa-edit"></i></button>
                      <button class="btn btn-danger btn-sm btn-icon" onclick="confirmDeletePreventif(${r.id},'${escHtml(r.client)}')" title="Supprimer"><i class="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      </div>
    `
  } catch(e) {
    el.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Erreur de chargement</p></div>`
  }
}

async function toggleFait(id, currentFait) {
  try {
    await http.patch ? 
      axios.patch(`${API.planningPreventif}/${id}/fait`) :
      axios({ method:'PATCH', url:`${API.planningPreventif}/${id}/fait` })
    loadPreventifTable()
    showToast(currentFait ? 'Marqué Non fait' : 'Marqué Fait ✓', 'success')
  } catch(e) { showToast('Erreur', 'error') }
}

async function openPreventifModal(id = null) {
  let entry = null
  if (id) {
    try { 
      const res = await http.get(`${API.planningPreventif}?annee=2026`)
      entry = res.data?.find(r => r.id === id) || null
    } catch(e) {}
  }

  const moisChecks = MOIS_FULL.map((m, i) => {
    const k = `mois_${i+1}`
    const checked = entry?.[k] === 1
    return `<label style="display:flex;align-items:center;gap:4px;font-size:0.75rem;cursor:pointer;user-select:none">
      <input type="checkbox" name="${k}" value="1" ${checked?'checked':''} style="accent-color:var(--accent-blue)">
      <span>${m.slice(0,3)}</span>
    </label>`
  }).join('')

  const modal = document.getElementById('modal-container')
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal modal-lg">
        <div class="modal-header">
          <div class="modal-title"><i class="fas fa-file-contract" style="color:var(--accent-blue)"></i> ${id?'Modifier':'Nouvelle'} intervention préventive</div>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="closeModalAll()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <form id="preventif-form" onsubmit="savePreventif(event,${id||'null'})">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Nature *</label>
                <select name="nature" class="select">
                  <option value="Contrat de maintenance" ${!entry||entry.nature==='Contrat de maintenance'?'selected':''}>Contrat de maintenance</option>
                  <option value="Bon de commande" ${entry?.nature==='Bon de commande'?'selected':''}>Bon de commande</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Fréquence *</label>
                <select name="frequence" class="select" onchange="autoSelectMois(this)">
                  <option value="Annuelle"      ${!entry||entry.frequence==='Annuelle'?'selected':''}>Annuelle</option>
                  <option value="Semestrielle"  ${entry?.frequence==='Semestrielle'?'selected':''}>Semestrielle</option>
                  <option value="Trimestrielle" ${entry?.frequence==='Trimestrielle'?'selected':''}>Trimestrielle</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Client *</label>
              <input type="text" name="client" class="input" required placeholder="Nom du client" value="${escHtml(entry?.client||'')}">
            </div>
            <div class="form-group">
              <label class="form-label">Description de l'intervention *</label>
              <textarea name="description" class="textarea" rows="2" required placeholder="Ex: Entretien du poste de transformation et des tableaux électriques">${escHtml(entry?.description||'')}</textarea>
            </div>
            <div class="form-group">
              <label class="form-label" style="margin-bottom:0.5rem">Mois planifiés <span style="font-size:0.7rem;color:var(--text-muted)">(cocher les mois d'intervention)</span></label>
              <div id="mois-grid" style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px 12px;padding:10px 14px;background:var(--bg-secondary);border-radius:8px;border:1px solid var(--border)">
                ${moisChecks}
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Statut</label>
                <select name="fait" class="select">
                  <option value="0" ${!entry?.fait?'selected':''}>✗ Non fait</option>
                  <option value="1" ${entry?.fait?'selected':''}>✓ Fait</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Notes</label>
                <input type="text" name="notes" class="input" placeholder="Remarques..." value="${escHtml(entry?.notes||'')}">
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="closeModalAll()">Annuler</button>
          <button class="btn btn-primary" onclick="document.getElementById('preventif-form').dispatchEvent(new Event('submit',{cancelable:true}))">
            <i class="fas fa-save"></i> ${id?'Enregistrer':'Créer'}
          </button>
        </div>
      </div>
    </div>
  `
}

function autoSelectMois(sel) {
  const freq = sel.value
  const form = sel.closest('form')
  // Décocher tous
  for (let i=1;i<=12;i++) {
    const cb = form.querySelector(`[name="mois_${i}"]`)
    if (cb) cb.checked = false
  }
  // Cocher selon fréquence
  if (freq === 'Annuelle')      { [6].forEach(m => { const cb = form.querySelector(`[name="mois_${m}"]`); if(cb) cb.checked=true }) }
  if (freq === 'Semestrielle')  { [6,12].forEach(m => { const cb = form.querySelector(`[name="mois_${m}"]`); if(cb) cb.checked=true }) }
  if (freq === 'Trimestrielle') { [3,6,9,12].forEach(m => { const cb = form.querySelector(`[name="mois_${m}"]`); if(cb) cb.checked=true }) }
}

async function savePreventif(e, id) {
  e.preventDefault()
  const fd = new FormData(e.target)
  const data = {
    nature:      fd.get('nature'),
    description: fd.get('description'),
    client:      fd.get('client'),
    frequence:   fd.get('frequence'),
    fait:        parseInt(fd.get('fait')) || 0,
    notes:       fd.get('notes') || null,
    annee:       2026,
  }
  for (let i=1;i<=12;i++) data[`mois_${i}`] = fd.get(`mois_${i}`) === '1' ? 1 : 0

  try {
    if (id) { await axios.put(`${API.planningPreventif}/${id}`, data); showToast('Modifié ✓', 'success') }
    else    { await axios.post(API.planningPreventif, data);           showToast('Créé ✓', 'success') }
    closeModalAll()
    loadPreventifTable()
  } catch(err) { showToast(err.response?.data?.error || 'Erreur', 'error') }
}

function confirmDeletePreventif(id, client) {
  const modal = document.getElementById('modal-container')
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" style="max-width:440px">
        <div class="modal-header">
          <div class="modal-title"><i class="fas fa-exclamation-triangle" style="color:var(--accent-red)"></i> Supprimer l'entrée</div>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="closeModalAll()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body"><p style="color:var(--text-secondary)">Supprimer le planning préventif de <strong>"${escHtml(client)}"</strong> ?</p></div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="closeModalAll()">Annuler</button>
          <button class="btn btn-confirm-delete" onclick="deletePreventif(${id})"><i class="fas fa-trash"></i> Supprimer</button>
        </div>
      </div>
    </div>
  `
}

async function deletePreventif(id) {
  try {
    await axios.delete(`${API.planningPreventif}/${id}`)
    showToast('Supprimé', 'success')
    closeModalAll()
    loadPreventifTable()
  } catch(e) { showToast('Erreur', 'error') }
}



async function renderCalendar() {
  const { currentYear: year, currentMonth: month } = state.planning
  const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  const titleEl = document.getElementById('calendar-title')
  if (titleEl) titleEl.textContent = `${monthNames[month-1]} ${year}`

  const grid = document.getElementById('calendar-grid')
  if (!grid) return
  grid.innerHTML = `<div class="loading-overlay" style="grid-column:1/-1"><span class="loader"></span></div>`

  try {
    // Charger en parallèle : plans maintenance + interventions planifiées + préventif contractuel du mois
    const [calData, preventifData] = await Promise.all([
      http.get(`${API.planning}/calendar/${year}/${month}`),
      http.get(`${API.planningPreventif}/mois/${month}`).catch(() => ({ data: [] }))
    ])

    // Build events map
    const events = {}

    // Plans de maintenance existants
    calData.maintenance_plans?.forEach(p => {
      const day = parseInt(p.next_date?.split('T')[0]?.split('-')[2] || p.next_date?.split('-')[2])
      if (!day || isNaN(day)) return
      if (!events[day]) events[day] = []
      events[day].push({ ...p, kind: 'preventive', source: 'plan' })
    })

    // Interventions correctives planifiées
    calData.planned_interventions?.forEach(i => {
      const day = parseInt(i.scheduled_date?.split('T')[0]?.split('-')[2] || i.scheduled_date?.split('-')[2])
      if (!day || isNaN(day)) return
      if (!events[day]) events[day] = []
      events[day].push({ ...i, kind: 'corrective', source: 'intervention' })
    })

    // Planning préventif contractuel — distribués sur les jours ouvrés du mois
    // (on les place sur le 1er jour ouvré de chaque semaine du mois par groupe)
    const contractItems = preventifData.data || []
    if (contractItems.length > 0) {
      // Trouver tous les lundis du mois
      const mondays = []
      for (let d = 1; d <= new Date(year, month, 0).getDate(); d++) {
        const dow = new Date(year, month-1, d).getDay()
        if (dow === 1) mondays.push(d) // Lundi
      }
      // Répartir les contrats sur les lundis disponibles
      contractItems.forEach((item, idx) => {
        const targetDay = mondays[idx % mondays.length] || 1
        if (!events[targetDay]) events[targetDay] = []
        events[targetDay].push({
          ...item,
          kind: item.nature === 'Bon de commande' ? 'bdc' : 'contrat',
          source: 'preventif',
          displayName: item.client,
          tooltip: `[${item.nature}] ${item.description} — ${item.client}`
        })
      })
    }

    const daysInMonth = new Date(year, month, 0).getDate()
    const firstDay = new Date(year, month - 1, 1).getDay()
    const startOffset = (firstDay === 0 ? 6 : firstDay - 1)
    const today = new Date()

    // Compteurs pour le résumé
    let totalPreventif = 0, totalCorrectif = 0, totalContrats = 0

    const dayHeaders = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
    let html = dayHeaders.map(d => `<div class="calendar-day-header">${d}</div>`).join('')

    // Empty cells before month start
    for (let i = 0; i < startOffset; i++) html += `<div class="calendar-day other-month"></div>`

    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === d
      const isPast  = new Date(year, month-1, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const dayEvents = events[d] || []

      dayEvents.forEach(e => {
        if (e.source === 'preventif') totalContrats++
        else if (e.kind === 'preventive') totalPreventif++
        else totalCorrectif++
      })

      const MAX_VISIBLE = 2
      const visibleEvents = dayEvents.slice(0, MAX_VISIBLE)
      const hiddenCount = dayEvents.length - MAX_VISIBLE

      html += `<div class="calendar-day ${isToday ? 'today' : ''} ${isPast && !isToday ? 'past-day' : ''}">
        <div class="calendar-day-number">${d}</div>
        ${visibleEvents.map(e => {
          const raw = e.displayName || e.equipment_name || e.client || e.title || '—'
          const shortName = escHtml(raw.length > 16 ? raw.slice(0,16)+'…' : raw)
          const tooltip   = escHtml(e.tooltip || e.title || e.description || raw)
          const cls = e.source === 'preventif'
            ? (e.kind === 'bdc' ? 'calendar-event bdc' : 'calendar-event contrat')
            : `calendar-event ${e.kind}`
          const icon = e.source === 'preventif'
            ? (e.kind === 'bdc' ? '📋' : '📄')
            : e.kind === 'preventive' ? '🔧' : '⚠️'
          return `<div class="${cls}" title="${tooltip}">${icon} ${shortName}</div>`
        }).join('')}
        ${hiddenCount > 0 ? `
          <div class="cal-more" onclick="showDayDetail(${d},${month},${year})">
            +${hiddenCount} autre${hiddenCount>1?'s':''}
          </div>` : ''}
        ${dayEvents.length > 0 ? `<div class="cal-dot-row">${dayEvents.map(e => {
          const c = e.source==='preventif' ? (e.kind==='bdc'?'var(--accent-purple)':'var(--accent-blue)')
                  : e.kind==='preventive' ? 'var(--accent-green)' : 'var(--accent-yellow)'
          return `<span style="width:5px;height:5px;border-radius:50%;background:${c};display:inline-block"></span>`
        }).join('')}</div>` : ''}
      </div>`
    }

    // Fill remaining cells
    const totalCells = startOffset + daysInMonth
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
    for (let i = 0; i < remaining; i++) html += `<div class="calendar-day other-month"></div>`

    grid.innerHTML = html

    // Mettre à jour le résumé du mois
    const summaryEl = document.getElementById('calendar-month-summary')
    if (summaryEl) {
      const total = totalPreventif + totalCorrectif + totalContrats
      summaryEl.innerHTML = total === 0
        ? `<span style="color:var(--text-muted);font-size:0.75rem">Aucune intervention ce mois</span>`
        : `
          ${totalPreventif > 0 ? `<span class="cal-badge cal-badge-prev">🔧 ${totalPreventif} Préventif</span>` : ''}
          ${totalCorrectif > 0 ? `<span class="cal-badge cal-badge-corr">⚠️ ${totalCorrectif} Correctif</span>` : ''}
          ${totalContrats  > 0 ? `<span class="cal-badge cal-badge-cont">📄 ${totalContrats} Contrat/BDC</span>` : ''}
        `
    }

  } catch(e) {
    console.error(e)
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-calendar-times"></i><p>Erreur de chargement</p></div>`
  }
}

// Afficher le détail d'un jour (popup)
function showDayDetail(day, month, year) {
  const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  // Récupérer tous les events du jour depuis le DOM ou refaire un fetch
  // Simple: recharger en filtrant
  const modal = document.getElementById('modal-container')
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" style="max-width:500px">
        <div class="modal-header">
          <div class="modal-title"><i class="fas fa-calendar-day" style="color:var(--accent-blue)"></i> ${day} ${monthNames[month-1]} ${year}</div>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="closeModalAll()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body" id="day-detail-body">
          <div class="loading-overlay"><span class="loader"></span></div>
        </div>
      </div>
    </div>
  `
  // Charger les données du mois et filtrer le jour
  Promise.all([
    http.get(`${API.planning}/calendar/${year}/${month}`),
    http.get(`${API.planningPreventif}/mois/${month}`).catch(() => ({ data: [] }))
  ]).then(([cal, prev]) => {
    const items = []
    cal.maintenance_plans?.forEach(p => {
      const d = parseInt(p.next_date?.split('T')[0]?.split('-')[2] || 0)
      if (d === day) items.push({ label: p.title || p.equipment_name, sub: `Préventif — ${p.frequency||''}`, color: 'var(--accent-green)', icon: '🔧' })
    })
    cal.planned_interventions?.forEach(i => {
      const d = parseInt(i.scheduled_date?.split('T')[0]?.split('-')[2] || 0)
      if (d === day) items.push({ label: i.title || i.client, sub: `Correctif planifié — ${i.city||''}`, color: 'var(--accent-yellow)', icon: '⚠️' })
    })
    // Pour le préventif on ne filtre pas par jour exact (distribué)
    const body = document.getElementById('day-detail-body')
    if (!body) return
    if (!items.length) {
      body.innerHTML = `<p style="color:var(--text-secondary);text-align:center;padding:1rem">Aucune intervention enregistrée ce jour</p>`
      return
    }
    body.innerHTML = items.map(it => `
      <div style="display:flex;gap:0.75rem;align-items:flex-start;padding:0.6rem 0;border-bottom:1px solid var(--border)">
        <span style="font-size:1.2rem">${it.icon}</span>
        <div>
          <div style="font-weight:600;font-size:0.85rem;color:${it.color}">${escHtml(it.label||'—')}</div>
          <div style="font-size:0.72rem;color:var(--text-secondary)">${escHtml(it.sub||'')}</div>
        </div>
      </div>
    `).join('')
  })
}

async function loadPlansList() {
  const el = document.getElementById('plans-list')
  if (!el) return
  try {
    const data = await http.get(`${API.planning}?active=true`)
    if (!data.data?.length) {
      el.innerHTML = `<div class="empty-state"><i class="fas fa-calendar-plus"></i><p>Aucun plan de maintenance</p><p>Ajoutez votre premier plan ou importez depuis le module d'import</p></div>`
      return
    }

    // Regrouper par client pour afficher le total
    const byClient = {}
    data.data.forEach(p => {
      const client = p.equipment_name || 'Non assigné'
      if (!byClient[client]) byClient[client] = 0
      byClient[client]++
    })

    // Statistiques rapides
    const freqStats = {}
    data.data.forEach(p => { freqStats[p.frequency] = (freqStats[p.frequency]||0)+1 })

    el.innerHTML = `
      <!-- Stats rapides -->
      <div style="display:flex;gap:1rem;padding:0.75rem 1.25rem;border-bottom:1px solid var(--border);flex-wrap:wrap">
        <div style="font-size:0.78rem;color:var(--text-secondary)">
          <strong style="color:var(--text-primary);font-size:1rem">${data.data.length}</strong> plans actifs
        </div>
        ${Object.entries(freqStats).map(([f,n]) =>
          `<div style="font-size:0.78rem"><span class="badge badge-preventive" style="font-size:0.65rem">${formatFrequency(f)}</span> <strong>${n}</strong></div>`
        ).join('')}
        <div style="margin-left:auto;font-size:0.78rem;color:var(--text-secondary)">
          <strong style="color:var(--text-primary)">${Object.keys(byClient).length}</strong> clients
        </div>
      </div>
      <div class="table-container">
        <table>
          <thead><tr>
            <th>#</th>
            <th>Nature / Description</th>
            <th>Client</th>
            <th>Fréquence</th>
            <th>Prochaine date</th>
            <th>Technicien</th>
            <th>Durée</th>
            <th>Priorité</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            ${data.data.map((p, idx) => {
              // Extraire nature du titre (avant " — ")
              const titleParts = p.title.split(' — ')
              const nature = titleParts[0] || p.title
              const descFromTitle = titleParts.slice(1).join(' — ')
              const displayDesc = p.description || descFromTitle

              // Badge type de contrat
              const isContrat = nature.toLowerCase().includes('contrat')
              const isBDC = nature.toLowerCase().includes('bon de commande') || nature.toLowerCase().includes('bon')
              const contractBadge = isContrat
                ? `<span class="badge" style="background:rgba(79,158,248,0.12);color:var(--accent-blue);border:1px solid rgba(79,158,248,0.25);font-size:0.6rem">Contrat</span>`
                : isBDC
                ? `<span class="badge" style="background:rgba(167,139,250,0.12);color:var(--accent-purple);border:1px solid rgba(167,139,250,0.25);font-size:0.6rem">BDC</span>`
                : ''

              return `
              <tr>
                <td class="text-secondary" style="font-size:0.7rem">${idx+1}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:2px">
                    ${contractBadge}
                  </div>
                  <div style="font-size:0.82rem;color:var(--text-primary)">${escHtml(displayDesc.slice(0,70))}${displayDesc.length>70?'…':''}</div>
                </td>
                <td>
                  <div style="font-weight:600;font-size:0.8rem;color:var(--text-primary)">${escHtml(p.equipment_name||'—')}</div>
                </td>
                <td><span class="badge badge-preventive">${formatFrequency(p.frequency)}</span></td>
                <td>
                  <div style="font-size:0.82rem;font-weight:600;color:${isDateSoon(p.next_date)?'var(--accent-yellow)':'var(--text-primary)'}">${formatDate(p.next_date)}</div>
                  ${isDateSoon(p.next_date) ? '<div style="font-size:0.65rem;color:var(--accent-yellow)"><i class="fas fa-clock"></i> Bientôt</div>' : ''}
                </td>
                <td class="text-secondary">${escHtml(p.technician_name||'—')}</td>
                <td class="text-secondary">${formatHours(p.duration_hours)}</td>
                <td>${priorityBadge(p.priority)}</td>
                <td>
                  <div style="display:flex;gap:4px">
                    <button class="btn btn-ghost btn-sm btn-icon" onclick="openPlanModal(${p.id})" title="Modifier"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm btn-icon" onclick="confirmDeletePlan(${p.id},'${escHtml(p.equipment_name||p.title)}')" title="Supprimer"><i class="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>`
            }).join('')}
          </tbody>
        </table>
      </div>
    `
  } catch(e) { el.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Erreur de chargement</p></div>` }
}

function isDateSoon(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  const diff = (d - now) / (1000 * 3600 * 24)
  return diff >= 0 && diff <= 30
}

function formatFrequency(f) {
  return { daily:'Quotidien', weekly:'Hebdo', monthly:'Mensuel', quarterly:'Trimestriel', yearly:'Annuel' }[f] || f
}

function prevMonth() {
  state.planning.currentMonth--
  if (state.planning.currentMonth < 1) { state.planning.currentMonth = 12; state.planning.currentYear-- }
  renderCalendar(); loadPlansList()
}
function nextMonth() {
  state.planning.currentMonth++
  if (state.planning.currentMonth > 12) { state.planning.currentMonth = 1; state.planning.currentYear++ }
  renderCalendar(); loadPlansList()
}
function goToday() {
  const n = new Date()
  state.planning.currentYear = n.getFullYear()
  state.planning.currentMonth = n.getMonth() + 1
  renderCalendar(); loadPlansList()
}

async function openPlanModal(id = null) {
  let plan = null
  if (id) { try { plan = await http.get(`${API.planning}/${id}`) } catch(e) { showToast('Erreur', 'error'); return } }
  if (!state.technicians.data.length) {
    try { const d = await http.get(API.technicians); state.technicians.data = d.data || [] } catch(e) {}
  }
  const techOptions = state.technicians.data.map(t =>
    `<option value="${t.id}" data-name="${escHtml(t.name)}" ${plan?.technician_id == t.id ? 'selected' : ''}>${escHtml(t.name)}</option>`
  ).join('')

  const modal = document.getElementById('modal-container')
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal modal-lg">
        <div class="modal-header">
          <div class="modal-title"><i class="fas fa-calendar-plus" style="color:var(--accent-blue)"></i> ${id?'Modifier':'Nouveau'} plan de maintenance</div>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="closeModalAll()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <form id="plan-form" onsubmit="savePlan(event,${id})">
            <div class="form-group">
              <label class="form-label">Titre *</label>
              <input type="text" name="title" class="input" required placeholder="Ex: Révision mensuelle compresseur A" value="${escHtml(plan?.title||'')}">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Équipement</label>
                <input type="text" name="equipment_name" class="input" placeholder="Nom de l'équipement" value="${escHtml(plan?.equipment_name||'')}">
              </div>
              <div class="form-group">
                <label class="form-label">Technicien</label>
                <select name="technician_id" class="select" onchange="updateTechnicianName(this)">
                  <option value="">— Sélectionner —</option>
                  ${techOptions}
                </select>
                <input type="hidden" name="technician_name" value="${escHtml(plan?.technician_name||'')}">
              </div>
            </div>
            <div class="form-row-3">
              <div class="form-group">
                <label class="form-label">Fréquence</label>
                <select name="frequency" class="select">
                  <option value="daily" ${plan?.frequency==='daily'?'selected':''}>Quotidien</option>
                  <option value="weekly" ${plan?.frequency==='weekly'?'selected':''}>Hebdomadaire</option>
                  <option value="monthly" ${plan?.frequency==='monthly'||!id?'selected':''}>Mensuel</option>
                  <option value="quarterly" ${plan?.frequency==='quarterly'?'selected':''}>Trimestriel</option>
                  <option value="yearly" ${plan?.frequency==='yearly'?'selected':''}>Annuel</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Prochaine date *</label>
                <input type="date" name="next_date" class="input" required value="${plan?.next_date?.split('T')[0]||''}">
              </div>
              <div class="form-group">
                <label class="form-label">Priorité</label>
                <select name="priority" class="select">
                  <option value="low" ${plan?.priority==='low'?'selected':''}>Basse</option>
                  <option value="medium" ${plan?.priority==='medium'||!id?'selected':''}>Moyenne</option>
                  <option value="high" ${plan?.priority==='high'?'selected':''}>Haute</option>
                  <option value="critical" ${plan?.priority==='critical'?'selected':''}>Critique</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Durée estimée (heures)</label>
                <input type="number" name="duration_hours" class="input" step="0.5" min="0" placeholder="1" value="${plan?.duration_hours||''}">
              </div>
              <div class="form-group">
                <label class="form-label">Dernière réalisation</label>
                <input type="date" name="last_done_date" class="input" value="${plan?.last_done_date?.split('T')[0]||''}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea name="description" class="textarea" rows="2" placeholder="Description des tâches...">${escHtml(plan?.description||'')}</textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="closeModalAll()">Annuler</button>
          <button class="btn btn-primary" onclick="document.getElementById('plan-form').dispatchEvent(new Event('submit',{cancelable:true}))">
            <i class="fas fa-save"></i> ${id?'Enregistrer':'Créer'}
          </button>
        </div>
      </div>
    </div>
  `
}

async function savePlan(e, id) {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(e.target))
  data.duration_hours = parseFloat(data.duration_hours) || 1
  if (!data.technician_id) { delete data.technician_id; delete data.technician_name }
  if (!data.last_done_date) delete data.last_done_date
  try {
    if (id) { await http.put(`${API.planning}/${id}`, data); showToast('Plan modifié', 'success') }
    else { await http.post(API.planning, data); showToast('Plan créé', 'success') }
    closeModalAll(); renderCalendar(); loadPlansList()
  } catch(err) { showToast(err.response?.data?.error || 'Erreur', 'error') }
}

function confirmDeletePlan(id, title) {
  const modal = document.getElementById('modal-container')
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" style="max-width:440px">
        <div class="modal-header">
          <div class="modal-title"><i class="fas fa-exclamation-triangle" style="color:var(--accent-red)"></i> Supprimer le plan</div>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="closeModalAll()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body"><p style="color:var(--text-secondary)">Supprimer <strong>"${escHtml(title)}"</strong> ?</p></div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="closeModalAll()">Annuler</button>
          <button class="btn btn-confirm-delete" onclick="deletePlan(${id})"><i class="fas fa-trash"></i> Supprimer</button>
        </div>
      </div>
    </div>
  `
}

async function deletePlan(id) {
  try { await http.delete(`${API.planning}/${id}`); showToast('Plan supprimé', 'success'); closeModalAll(); renderCalendar(); loadPlansList() }
  catch(e) { showToast('Erreur', 'error') }
}

// ============================================================
// REPORTS PAGE
// ============================================================
async function renderReports() {
  const container = document.getElementById('page-container')
  container.innerHTML = `
    <div class="page-header">
      <div><h1 style="font-size:1.2rem;font-weight:700">Rapports</h1>
      <p style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px">Analyse détaillée et export</p></div>
    </div>
    <div class="page-content">
      <!-- Filters -->
      <div class="filters-bar">
        <div><label class="form-label" style="margin-bottom:0;margin-right:0.5rem">Période :</label></div>
        <input type="date" id="rpt-date-from" class="input input-sm" style="width:145px" onchange="loadReport()">
        <input type="date" id="rpt-date-to" class="input input-sm" style="width:145px" onchange="loadReport()">
        <input type="text" id="rpt-city" class="input input-sm" style="width:130px" placeholder="Ville..." oninput="debounceReport()">
        <select id="rpt-technician" class="select input-sm" style="width:170px" onchange="loadReport()">
          <option value="">Tous techniciens</option>
        </select>
        <button class="btn btn-primary btn-sm" onclick="loadReport()">
          <i class="fas fa-chart-bar"></i> Générer
        </button>
        <button class="btn btn-ghost btn-sm" onclick="clearReportFilters()">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div id="report-content">
        <div class="loading-overlay"><span class="loader"></span> Génération du rapport...</div>
      </div>
    </div>
  `
  await loadTechniciansForReport()
  await loadReport()
}

async function loadTechniciansForReport() {
  try {
    const data = await http.get(API.technicians)
    const sel = document.getElementById('rpt-technician')
    if (sel) {
      data.data?.forEach(t => {
        const opt = document.createElement('option')
        opt.value = t.id
        opt.textContent = t.name
        sel.appendChild(opt)
      })
    }
  } catch(e) {}
}

let reportDebounce = null
function debounceReport() {
  clearTimeout(reportDebounce)
  reportDebounce = setTimeout(() => loadReport(), 500)
}

function clearReportFilters() {
  document.getElementById('rpt-date-from').value = ''
  document.getElementById('rpt-date-to').value = ''
  document.getElementById('rpt-city').value = ''
  document.getElementById('rpt-technician').value = ''
  loadReport()
}

async function loadReport() {
  const el = document.getElementById('report-content')
  if (!el) return
  el.innerHTML = `<div class="loading-overlay"><span class="loader"></span> Génération...</div>`

  const params = new URLSearchParams()
  const dateFrom = document.getElementById('rpt-date-from')?.value
  const dateTo = document.getElementById('rpt-date-to')?.value
  const city = document.getElementById('rpt-city')?.value.trim()
  const techId = document.getElementById('rpt-technician')?.value
  if (dateFrom) params.append('date_from', dateFrom)
  if (dateTo) params.append('date_to', dateTo)
  if (city) params.append('city', city)
  if (techId) params.append('technician_id', techId)

  try {
    const data = await http.get(`${API.kpi}?${params.toString()}`)
    const kpis = data.kpis
    const charts = data.charts

    el.innerHTML = `
      <!-- KPI Summary Cards -->
      <div class="kpi-grid" style="margin-bottom:1.5rem">
        <div class="kpi-card" style="--kpi-color:var(--accent-blue)">
          <div class="kpi-label">Total</div>
          <div class="kpi-value">${kpis.total_interventions}</div>
          <div class="kpi-trend">interventions</div>
        </div>
        <div class="kpi-card" style="--kpi-color:var(--accent-green)">
          <div class="kpi-label">Résolues</div>
          <div class="kpi-value">${kpis.resolved_count}</div>
          <div class="kpi-trend">${kpis.resolution_rate}% résolution</div>
        </div>
        <div class="kpi-card" style="--kpi-color:var(--accent-yellow)">
          <div class="kpi-label">MTTR</div>
          <div class="kpi-value">${kpis.mttr || 0}<span class="kpi-unit">h</span></div>
          <div class="kpi-trend">temps moyen réparation</div>
        </div>
        <div class="kpi-card" style="--kpi-color:var(--accent-purple)">
          <div class="kpi-label">MTBF</div>
          <div class="kpi-value">${kpis.mtbf || 0}<span class="kpi-unit">h</span></div>
          <div class="kpi-trend">temps entre pannes</div>
        </div>
        <div class="kpi-card" style="--kpi-color:var(--accent-green)">
          <div class="kpi-label">Disponibilité</div>
          <div class="kpi-value">${kpis.availability}<span class="kpi-unit">%</span></div>
          <div class="progress-bar"><div class="progress-fill" style="width:${kpis.availability}%;background:var(--accent-green)"></div></div>
        </div>
        <div class="kpi-card" style="--kpi-color:var(--accent-orange)">
          <div class="kpi-label">Préventif</div>
          <div class="kpi-value">${kpis.preventive_pct}<span class="kpi-unit">%</span></div>
          <div class="kpi-trend">${kpis.preventive_count} sur ${kpis.total_interventions}</div>
        </div>
      </div>

      <!-- Technician Performance Table -->
      <div class="table-card" style="margin-bottom:1.5rem">
        <div class="table-header"><div class="table-title"><i class="fas fa-user-cog" style="color:var(--accent-blue)"></i> Performance par technicien</div></div>
        ${charts.top_technicians?.length ? `
          <div class="table-container">
            <table>
              <thead><tr><th>Technicien</th><th>Interventions</th><th>Résolues</th><th>Taux résolution</th><th>Durée moy.</th></tr></thead>
              <tbody>
                ${charts.top_technicians.map(t => `
                  <tr>
                    <td><strong>${escHtml(t.technician_name||'N/A')}</strong></td>
                    <td>${t.total}</td>
                    <td>${t.resolved}</td>
                    <td>
                      <div style="display:flex;align-items:center;gap:0.5rem">
                        <div class="progress-bar" style="width:80px">
                          <div class="progress-fill" style="width:${t.resolution_rate||0}%;background:${(t.resolution_rate||0)>75?'var(--accent-green)':(t.resolution_rate||0)>50?'var(--accent-yellow)':'var(--accent-red)'}"></div>
                        </div>
                        <span>${t.resolution_rate||0}%</span>
                      </div>
                    </td>
                    <td>${formatHours(t.avg_duration)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `<div class="empty-state"><p>Aucun technicien assigné</p></div>`}
      </div>

      <!-- City breakdown -->
      <div class="table-card">
        <div class="table-header"><div class="table-title"><i class="fas fa-map-marker-alt" style="color:var(--accent-blue)"></i> Répartition par ville</div></div>
        ${charts.by_city?.length ? `
          <div class="table-container">
            <table>
              <thead><tr><th>Ville</th><th>Interventions</th><th>Part</th></tr></thead>
              <tbody>
                ${charts.by_city.map(c => `
                  <tr>
                    <td><strong>${escHtml(c.city||'N/A')}</strong></td>
                    <td>${c.count}</td>
                    <td>
                      <div style="display:flex;align-items:center;gap:0.5rem">
                        <div class="progress-bar" style="width:100px">
                          <div class="progress-fill" style="width:${kpis.total_interventions>0?(c.count/kpis.total_interventions*100).toFixed(0):0}%;background:var(--accent-blue)"></div>
                        </div>
                        <span>${kpis.total_interventions > 0 ? (c.count/kpis.total_interventions*100).toFixed(1) : 0}%</span>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `<div class="empty-state"><p>Aucune donnée par ville</p></div>`}
      </div>
    `
  } catch(e) {
    el.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Erreur de génération du rapport</p></div>`
  }
}

// ============================================================
// MODAL HELPERS
// ============================================================
function closeModal(e) {
  if (e.target.classList.contains('modal-overlay')) closeModalAll()
}
function closeModalAll() {
  const m = document.getElementById('modal-container')
  if (m) m.innerHTML = ''
}

// ============================================================
// LOGO STUDIO — removed, placeholder only
// To add your logo: replace the content of #logo-slot in renderApp()
// ============================================================
/*
function renderLogoStudio() {
  // Load saved prefs or defaults
  const prefs = JSON.parse(localStorage.getItem('pprime_logo_prefs') || '{}');
  const cfg = {
    bar1H:      prefs.bar1H      ?? 42,
    bar2H:      prefs.bar2H      ?? 48,
    barW:       prefs.barW       ?? 8,
    barGap:     prefs.barGap     ?? 7,
    barRx:      prefs.barRx      ?? 4,
    colorTop:   prefs.colorTop   ?? '#6dc4f5',
    colorBot:   prefs.colorBot   ?? '#ffffff',
    titleSize:  prefs.titleSize  ?? 27,
    titleColor: prefs.titleColor ?? '#ffffff',
    tagSize:    prefs.tagSize    ?? 7,
    tagColor:   prefs.tagColor   ?? '#6dc4f5',
    tagSpacing: prefs.tagSpacing ?? 3.0,
    logoH:      prefs.logoH      ?? 48,
  };

  const pc = document.getElementById('page-container');
  pc.innerHTML = `
  <div class="page-header">
    <h1><i class="fas fa-paint-brush" style="color:var(--accent-blue)"></i> Logo Studio</h1>
    <p style="color:var(--text-secondary);margin-top:0.3rem">Personnalise le logo PPrime directement depuis l\'interface</p>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">

    <!-- LEFT: Controls -->
    <div style="display:flex;flex-direction:column;gap:1rem;">

      <!-- Icon section -->
      <div class="card">
        <div class="card-header"><span class="card-title"><i class="fas fa-sliders-h"></i> Icône — Barres</span></div>
        <div class="card-body" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">

          <label class="ls-label">Hauteur barre gauche
            <div class="ls-row">
              <input type="range" min="20" max="60" value="${cfg.bar1H}" oninput="lsUpdate('bar1H',+this.value);lsRefresh()" />
              <span id="v-bar1H" class="ls-val">${cfg.bar1H}px</span>
            </div>
          </label>

          <label class="ls-label">Hauteur barre droite
            <div class="ls-row">
              <input type="range" min="20" max="60" value="${cfg.bar2H}" oninput="lsUpdate('bar2H',+this.value);lsRefresh()" />
              <span id="v-bar2H" class="ls-val">${cfg.bar2H}px</span>
            </div>
          </label>

          <label class="ls-label">Largeur barres
            <div class="ls-row">
              <input type="range" min="4" max="16" value="${cfg.barW}" oninput="lsUpdate('barW',+this.value);lsRefresh()" />
              <span id="v-barW" class="ls-val">${cfg.barW}px</span>
            </div>
          </label>

          <label class="ls-label">Espacement
            <div class="ls-row">
              <input type="range" min="3" max="20" value="${cfg.barGap}" oninput="lsUpdate('barGap',+this.value);lsRefresh()" />
              <span id="v-barGap" class="ls-val">${cfg.barGap}px</span>
            </div>
          </label>

          <label class="ls-label">Arrondi coins (rx)
            <div class="ls-row">
              <input type="range" min="0" max="8" value="${cfg.barRx}" oninput="lsUpdate('barRx',+this.value);lsRefresh()" />
              <span id="v-barRx" class="ls-val">${cfg.barRx}px</span>
            </div>
          </label>

          <label class="ls-label">Hauteur logo sidebar
            <div class="ls-row">
              <input type="range" min="24" max="72" value="${cfg.logoH}" oninput="lsUpdate('logoH',+this.value);lsRefresh()" />
              <span id="v-logoH" class="ls-val">${cfg.logoH}px</span>
            </div>
          </label>

        </div>
      </div>

      <!-- Colors -->
      <div class="card">
        <div class="card-header"><span class="card-title"><i class="fas fa-palette"></i> Couleurs</span></div>
        <div class="card-body" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">

          <label class="ls-label">Gradient haut
            <div class="ls-row">
              <input type="color" value="${cfg.colorTop}" oninput="lsUpdate('colorTop',this.value);lsRefresh()" style="width:40px;height:32px;border:none;background:none;cursor:pointer;" />
              <span id="v-colorTop" class="ls-val">${cfg.colorTop}</span>
            </div>
          </label>

          <label class="ls-label">Gradient bas
            <div class="ls-row">
              <input type="color" value="${cfg.colorBot}" oninput="lsUpdate('colorBot',this.value);lsRefresh()" style="width:40px;height:32px;border:none;background:none;cursor:pointer;" />
              <span id="v-colorBot" class="ls-val">${cfg.colorBot}</span>
            </div>
          </label>

          <label class="ls-label">Couleur titre
            <div class="ls-row">
              <input type="color" value="${cfg.titleColor}" oninput="lsUpdate('titleColor',this.value);lsRefresh()" style="width:40px;height:32px;border:none;background:none;cursor:pointer;" />
              <span id="v-titleColor" class="ls-val">${cfg.titleColor}</span>
            </div>
          </label>

          <label class="ls-label">Couleur tagline
            <div class="ls-row">
              <input type="color" value="${cfg.tagColor}" oninput="lsUpdate('tagColor',this.value);lsRefresh()" style="width:40px;height:32px;border:none;background:none;cursor:pointer;" />
              <span id="v-tagColor" class="ls-val">${cfg.tagColor}</span>
            </div>
          </label>

        </div>
      </div>

      <!-- Typography -->
      <div class="card">
        <div class="card-header"><span class="card-title"><i class="fas fa-font"></i> Typographie</span></div>
        <div class="card-body" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">

          <label class="ls-label">Taille titre
            <div class="ls-row">
              <input type="range" min="16" max="42" value="${cfg.titleSize}" oninput="lsUpdate('titleSize',+this.value);lsRefresh()" />
              <span id="v-titleSize" class="ls-val">${cfg.titleSize}px</span>
            </div>
          </label>

          <label class="ls-label">Taille tagline
            <div class="ls-row">
              <input type="range" min="5" max="14" value="${cfg.tagSize}" oninput="lsUpdate('tagSize',+this.value);lsRefresh()" />
              <span id="v-tagSize" class="ls-val">${cfg.tagSize}px</span>
            </div>
          </label>

          <label class="ls-label">Espacement lettres tagline
            <div class="ls-row">
              <input type="range" min="0" max="8" step="0.5" value="${cfg.tagSpacing}" oninput="lsUpdate('tagSpacing',+this.value);lsRefresh()" />
              <span id="v-tagSpacing" class="ls-val">${cfg.tagSpacing}px</span>
            </div>
          </label>

        </div>
      </div>

      <!-- Actions -->
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="lsSave()"><i class="fas fa-save"></i> Appliquer & Sauvegarder</button>
        <button class="btn btn-ghost" onclick="lsReset()"><i class="fas fa-undo"></i> Réinitialiser</button>
        <button class="btn btn-ghost" onclick="lsDownload()"><i class="fas fa-download"></i> Télécharger SVG</button>
      </div>

    </div>

    <!-- RIGHT: Preview -->
    <div style="display:flex;flex-direction:column;gap:1rem;">

      <!-- Dark preview -->
      <div class="card">
        <div class="card-header"><span class="card-title"><i class="fas fa-eye"></i> Aperçu — fond sombre</span></div>
        <div class="card-body" style="background:#0f1923;border-radius:8px;display:flex;align-items:center;justify-content:center;min-height:120px;">
          <div id="preview-dark"></div>
        </div>
      </div>

      <!-- Light preview -->
      <div class="card">
        <div class="card-header"><span class="card-title"><i class="fas fa-eye"></i> Aperçu — fond clair</span></div>
        <div class="card-body" style="background:#e8ecf0;border-radius:8px;display:flex;align-items:center;justify-content:center;min-height:120px;">
          <div id="preview-light"></div>
        </div>
      </div>

      <!-- Sidebar preview -->
      <div class="card">
        <div class="card-header"><span class="card-title"><i class="fas fa-columns"></i> Aperçu — sidebar</span></div>
        <div class="card-body" style="background:#131d2a;border-radius:8px;display:flex;align-items:center;padding:1rem 1.5rem;">
          <div id="preview-sidebar"></div>
        </div>
      </div>

      <!-- SVG Code -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="fas fa-code"></i> Code SVG</span>
          <button class="btn btn-ghost btn-sm" onclick="lsCopyCode()"><i class="fas fa-copy"></i> Copier</button>
        </div>
        <div class="card-body">
          <textarea id="svg-code-output" readonly style="width:100%;height:180px;background:#0a1520;color:#7ec8f4;font-family:monospace;font-size:0.72rem;border:1px solid var(--border);border-radius:6px;padding:0.75rem;resize:vertical;"></textarea>
        </div>
      </div>

    </div>
  </div>
  `;

  lsRefresh();
}

// ---- Logo Studio helpers ----
window._lsCfg = JSON.parse(localStorage.getItem('pprime_logo_prefs') || '{}');
const _lsDef = { bar1H:42, bar2H:48, barW:8, barGap:7, barRx:4, colorTop:'#6dc4f5', colorBot:'#ffffff', titleSize:27, titleColor:'#ffffff', tagSize:7, tagColor:'#6dc4f5', tagSpacing:3.0, logoH:48 };

function lsUpdate(key, val) {
  window._lsCfg[key] = val;
  const el = document.getElementById('v-'+key);
  if (el) {
    if (typeof val === 'string' && val.startsWith('#')) el.textContent = val;
    else el.textContent = val + (key.endsWith('Spacing') ? 'px' : key === 'logoH' || key.endsWith('Size') || key.endsWith('H') || key.endsWith('W') || key === 'barGap' || key === 'barRx' ? 'px' : '');
  }
}

function _lsBuildSVG(cfg, withBg) {
  const vH = 72;
  const vW = 280;
  // Bars share same bottom: anchor at y=vH-10=62
  const bottom = 62;
  const b1y = bottom - cfg.bar1H;
  const b2y = bottom - cfg.bar2H;
  const b2x = 4 + cfg.barW + cfg.barGap;
  const textX = b2x + cfg.barW + 10;
  const midY  = (b2y + bottom) / 2;  // center of taller bar
  const tagY  = midY + cfg.titleSize * 0.55 + cfg.tagSize + 2;

  const bg = withBg
    ? `<rect width="${vW}" height="${vH}" rx="6" fill="#0f2a44"/>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vW} ${vH}" width="${vW}" height="${vH}" role="img" aria-label="PPrime – Power Your Future">
  <defs>
    <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${cfg.colorTop}"/>
      <stop offset="100%" stop-color="${cfg.colorBot}"/>
    </linearGradient>
  </defs>
  ${bg}
  <rect x="4" y="${b1y}" width="${cfg.barW}" height="${cfg.bar1H}" rx="${cfg.barRx}" fill="url(#lg)"/>
  <rect x="${b2x}" y="${b2y}" width="${cfg.barW}" height="${cfg.bar2H}" rx="${cfg.barRx}" fill="url(#lg)"/>
  <text x="${textX}" y="${midY}" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="${cfg.titleSize}" font-weight="800" fill="${cfg.titleColor}" dominant-baseline="middle" letter-spacing="0.3">PPrime</text>
  <text x="${textX+1}" y="${tagY}" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="${cfg.tagSize}" font-weight="400" fill="${cfg.tagColor}" letter-spacing="${cfg.tagSpacing}">POWER YOUR FUTURE</text>
</svg>`;
}

function lsRefresh() {
  const cfg = Object.assign({}, _lsDef, window._lsCfg);
  const svgDark  = _lsBuildSVG(cfg, true);
  const svgClean = _lsBuildSVG(cfg, false);

  const pd = document.getElementById('preview-dark');
  const pl = document.getElementById('preview-light');
  const ps = document.getElementById('preview-sidebar');
  const code = document.getElementById('svg-code-output');

  if (pd) pd.innerHTML = svgDark;
  if (pl) pl.innerHTML = svgClean;
  if (ps) {
    ps.innerHTML = `<img src="data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgClean)))}" style="height:${cfg.logoH}px;width:auto;" />`;
  }
  if (code) code.value = svgClean;
}

function lsSave() {
  const cfg = Object.assign({}, _lsDef, window._lsCfg);
  localStorage.setItem('pprime_logo_prefs', JSON.stringify(cfg));
  // Patch live sidebar logo
  const sidebarImg = document.querySelector('.sidebar-logo img');
  if (sidebarImg) {
    const svgClean = _lsBuildSVG(cfg, false);
    const b64 = btoa(unescape(encodeURIComponent(svgClean)));
    sidebarImg.src = 'data:image/svg+xml;base64,' + b64;
    sidebarImg.style.height = cfg.logoH + 'px';
  }
  showToast('✅ Logo appliqué et sauvegardé !', 'success');
}

function lsReset() {
  window._lsCfg = {};
  localStorage.removeItem('pprime_logo_prefs');
  navigate('logo-studio');
  showToast('Logo réinitialisé aux valeurs par défaut', 'info');
}

function lsDownload() {
  const cfg = Object.assign({}, _lsDef, window._lsCfg);
  const svg = _lsBuildSVG(cfg, false);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'logo-pprime.svg';
  a.click();
  URL.revokeObjectURL(url);
  showToast('SVG téléchargé !', 'success');
}

function lsCopyCode() {
  const code = document.getElementById('svg-code-output');
  if (code) {
    navigator.clipboard.writeText(code.value).then(() => showToast('Code SVG copié !', 'success'));
  }
}
*/ // end logo-studio block

// Apply saved logo on every page load
// (stub — logo studio removed, placeholder active)
function applyLogoPrefs() { /* no-op */ }
/*
  To restore logo studio, uncomment the block above.
*/

// ============================================================
// PARAMÈTRES
// ============================================================
async function renderSettings() {
  const pc = document.getElementById('page-container')
  pc.innerHTML = `
  <div class="page-header">
    <h1><i class="fas fa-sliders-h" style="color:var(--accent-blue)"></i> Paramètres</h1>
    <p style="color:var(--text-secondary);margin-top:0.3rem">Configuration générale de l'application</p>
  </div>
  <div id="settings-body" style="display:flex;flex-direction:column;gap:1.5rem;">
    <div style="text-align:center;padding:2rem;color:var(--text-secondary)">
      <i class="fas fa-spinner fa-spin" style="font-size:1.5rem"></i><br>Chargement…
    </div>
  </div>`

  // Charger les settings depuis l'API
  let cfg = {}
  try {
    cfg = await http.get(API.settings)
  } catch(e) {
    cfg = {}
  }

  const logoData         = cfg.logo_data              || ''
  const companyName      = cfg.company_name            || ''
  const totalMachines    = cfg.mtbf_total_machines     || '1'
  const totalHours       = cfg.mtbf_total_hours_per_year || '8760'

  document.getElementById('settings-body').innerHTML = `

    <!-- === LOGO === -->
    <div class="card">
      <div class="card-header">
        <span class="card-title"><i class="fas fa-image"></i> Logo de l'entreprise</span>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:start;">

          <!-- Upload zone -->
          <div>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:1rem;">
              Téléchargez votre logo (PNG, JPG ou SVG). Il sera affiché dans la sidebar et sauvegardé.
            </p>
            <div id="logo-drop-zone" class="logo-drop-zone" onclick="document.getElementById('logo-file-input').click()" ondragover="event.preventDefault()" ondrop="handleLogoDrop(event)">
              <i class="fas fa-cloud-upload-alt" style="font-size:2rem;color:var(--accent-blue);margin-bottom:0.5rem;"></i>
              <div style="font-size:0.85rem;color:var(--text-secondary);">Cliquez ou glissez votre logo ici</div>
              <div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.3rem;">PNG · JPG · SVG — max 5 MB</div>
            </div>
            <input type="file" id="logo-file-input" accept="image/*,.svg" style="display:none" onchange="handleLogoFile(this.files[0])"/>
            <div style="display:flex;gap:0.75rem;margin-top:1rem;flex-wrap:wrap;">
              <button class="btn btn-primary btn-sm" onclick="saveLogoSetting()"><i class="fas fa-save"></i> Appliquer le logo</button>
              <button class="btn btn-ghost btn-sm" onclick="removeLogoSetting()"><i class="fas fa-trash"></i> Supprimer</button>
            </div>
          </div>

          <!-- Preview -->
          <div>
            <div style="font-size:0.78rem;color:var(--text-secondary);margin-bottom:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Aperçu sidebar</div>
            <div style="background:#0f1923;border-radius:8px;padding:1.2rem 1.5rem;border:1px solid var(--border);display:flex;align-items:center;min-height:80px;">
              <div id="logo-preview-box">
                ${logoData
                  ? `<img src="${logoData}" style="max-height:48px;width:auto;display:block;" />`
                  : `<div class="logo-placeholder" style="width:180px;"><span class="logo-placeholder-text">LOGO HERE</span></div>`
                }
              </div>
            </div>
            <div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.5rem;">
              <i class="fas fa-info-circle"></i> Le logo remplace automatiquement le placeholder dans la sidebar.
            </div>
          </div>
        </div>

        <!-- Company name -->
        <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--border);">
          <label style="font-size:0.82rem;color:var(--text-secondary);font-weight:600;display:block;margin-bottom:0.5rem;">Nom de l'entreprise</label>
          <div style="display:flex;gap:0.75rem;align-items:center;">
            <input type="text" id="settings-company-name" class="form-input" value="${escHtml(companyName)}" placeholder="ex: PPrime" style="max-width:320px;" />
            <button class="btn btn-primary btn-sm" onclick="saveGeneralSettings()"><i class="fas fa-save"></i> Sauvegarder</button>
          </div>
        </div>
      </div>
    </div>

    <!-- === MTBF & DISPONIBILITÉ : paramètres de calcul === -->
    <div class="card">
      <div class="card-header">
        <span class="card-title"><i class="fas fa-chart-area"></i> Paramètres de calcul — MTBF & Disponibilité</span>
      </div>
      <div class="card-body">

        <!-- Bandeau info : ces KPIs sont automatiques -->
        <div style="background:rgba(74,158,255,0.07);border:1px solid rgba(74,158,255,0.2);border-radius:8px;padding:1rem;margin-bottom:1.5rem;font-size:0.82rem;color:var(--text-secondary);line-height:1.8;">
          <div style="font-weight:700;color:var(--accent-blue);margin-bottom:0.6rem;"><i class="fas fa-info-circle"></i> Calcul automatique</div>
          <div><i class="fas fa-check-circle" style="color:var(--accent-green);margin-right:6px"></i><b style="color:var(--text-primary)">MTTR</b> — calculé automatiquement depuis la durée moyenne des interventions résolues saisies.</div>
          <div style="margin-top:0.3rem"><i class="fas fa-check-circle" style="color:var(--accent-green);margin-right:6px"></i><b style="color:var(--text-primary)">MTBF</b> = (Heures totales disponibles − Heures d'arrêt) ÷ Nombre de pannes correctives</div>
          <div style="margin-top:0.3rem"><i class="fas fa-check-circle" style="color:var(--accent-green);margin-right:6px"></i><b style="color:var(--text-primary)">Disponibilité</b> = MTBF ÷ (MTBF + MTTR) × 100</div>
          <div style="margin-top:0.6rem;padding:0.5rem 0.75rem;background:rgba(255,255,255,0.04);border-radius:6px;font-size:0.76rem;color:var(--text-muted)">
            <i class="fas fa-lightbulb" style="color:var(--accent-yellow)"></i> Ces valeurs se mettent à jour en temps réel selon les interventions saisies. Aucune saisie manuelle requise.
          </div>
        </div>

        <!-- Paramètres du parc machine -->
        <div style="font-size:0.82rem;font-weight:700;color:var(--text-primary);margin-bottom:1rem;"><i class="fas fa-industry" style="color:var(--accent-purple)"></i> Paramètres du parc machine</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">

          <div>
            <label class="form-label">
              <i class="fas fa-cogs" style="color:var(--accent-blue)"></i> Nombre de machines / équipements
            </label>
            <input type="number" id="settings-machines" class="form-input" min="1" max="9999" value="${escHtml(totalMachines)}" oninput="updateSettingsSummary()" />
            <div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.3rem;">Nombre total d'équipements dans votre parc</div>
          </div>

          <div>
            <label class="form-label">
              <i class="fas fa-clock" style="color:var(--accent-purple)"></i> Heures de fonctionnement / machine / an
            </label>
            <input type="number" id="settings-hours" class="form-input" min="1" max="8760" value="${escHtml(totalHours)}" oninput="updateSettingsSummary()" />
            <div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.3rem;">Utilisé pour calculer les heures disponibles totales</div>
          </div>

        </div>

        <!-- Raccourcis heures -->
        <div style="margin-top:1rem;">
          <div style="font-size:0.73rem;color:var(--text-muted);margin-bottom:0.5rem;font-weight:600;">Raccourcis heures/an :</div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn btn-ghost btn-sm" onclick="setHours(8760)">8 760 h &nbsp;<span style="opacity:0.55;font-size:0.68rem">(24h/7j)</span></button>
            <button class="btn btn-ghost btn-sm" onclick="setHours(6240)">6 240 h &nbsp;<span style="opacity:0.55;font-size:0.68rem">(3×8h/5j)</span></button>
            <button class="btn btn-ghost btn-sm" onclick="setHours(4160)">4 160 h &nbsp;<span style="opacity:0.55;font-size:0.68rem">(2×8h/5j)</span></button>
            <button class="btn btn-ghost btn-sm" onclick="setHours(2080)">2 080 h &nbsp;<span style="opacity:0.55;font-size:0.68rem">(1×8h/5j)</span></button>
          </div>
        </div>

        <!-- Résumé live -->
        <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--border);">
          <div style="font-size:0.73rem;color:var(--text-secondary);margin-bottom:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;"><i class="fas fa-calculator"></i> Récapitulatif</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;">
            <div class="settings-calc-card">
              <div class="settings-calc-label">Heures totales parc / an</div>
              <div class="settings-calc-value" id="calc-total-hours">—</div>
            </div>
            <div class="settings-calc-card">
              <div class="settings-calc-label">Machines configurées</div>
              <div class="settings-calc-value" id="calc-machines">—</div>
            </div>
            <div class="settings-calc-card">
              <div class="settings-calc-label">h / machine / an</div>
              <div class="settings-calc-value" id="calc-hours-per">—</div>
            </div>
          </div>
        </div>

        <div style="display:flex;gap:0.75rem;margin-top:1.5rem;">
          <button class="btn btn-primary" onclick="saveMtbfSettings()">
            <i class="fas fa-save"></i> Sauvegarder
          </button>
          <button class="btn btn-ghost" onclick="navigate('dashboard')">
            <i class="fas fa-chart-line"></i> Voir le dashboard
          </button>
        </div>
      </div>
    </div>

  `

  // Init événements
  updateSettingsSummary()

  // Restaurer le logo en mémoire si existant
  if (window._pendingLogoData) {
    updateLogoPreview(window._pendingLogoData)
  }
}

// ---- Settings helpers ----

function updateSettingsSummary() {
  const m = parseFloat(document.getElementById('settings-machines')?.value || '1') || 1
  const h = parseFloat(document.getElementById('settings-hours')?.value   || '8760') || 8760
  const total = m * h
  const calcTotal = document.getElementById('calc-total-hours')
  const calcM     = document.getElementById('calc-machines')
  const calcH     = document.getElementById('calc-hours-per')
  if (calcTotal) calcTotal.textContent = total.toLocaleString('fr-FR') + ' h'
  if (calcM)     calcM.textContent     = m.toString()
  if (calcH)     calcH.textContent     = h.toLocaleString('fr-FR') + ' h'
}

function setHours(h) {
  const el = document.getElementById('settings-hours')
  if (el) { el.value = h; updateSettingsSummary() }
}

async function saveMtbfSettings() {
  const m = document.getElementById('settings-machines')?.value || '1'
  const h = document.getElementById('settings-hours')?.value   || '8760'
  try {
    await http.put(API.settings, {
      mtbf_total_machines: m,
      mtbf_total_hours_per_year: h,
    })
    showToast('✅ Paramètres MTBF sauvegardés — dashboard mis à jour', 'success')
  } catch(e) {
    showToast('Erreur lors de la sauvegarde', 'error')
  }
}

async function saveGeneralSettings() {
  const name = document.getElementById('settings-company-name')?.value || ''
  try {
    await http.put(API.settings, { company_name: name })
    showToast('✅ Nom de l\'entreprise sauvegardé', 'success')
  } catch(e) {
    showToast('Erreur lors de la sauvegarde', 'error')
  }
}

// Logo handlers
function handleLogoFile(file) {
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    showToast('Fichier trop volumineux (max 5 MB)', 'error')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    window._pendingLogoData = e.target.result
    updateLogoPreview(window._pendingLogoData)
  }
  reader.readAsDataURL(file)
}

function handleLogoDrop(e) {
  e.preventDefault()
  const file = e.dataTransfer?.files?.[0]
  if (file) handleLogoFile(file)
}

function updateLogoPreview(dataUrl) {
  const box = document.getElementById('logo-preview-box')
  if (box) box.innerHTML = `<img src="${dataUrl}" style="max-height:48px;width:auto;display:block;" />`
  const dropZone = document.getElementById('logo-drop-zone')
  if (dropZone) dropZone.style.borderColor = 'var(--accent-blue)'
}

async function saveLogoSetting() {
  const data = window._pendingLogoData
  if (!data) { showToast('Aucun logo sélectionné', 'error'); return }
  try {
    await http.put(API.settings, { logo_data: data })
    // Appliquer dans la sidebar immédiatement
    applySidebarLogo(data)
    showToast('✅ Logo sauvegardé et appliqué dans la sidebar', 'success')
    window._pendingLogoData = null
  } catch(e) {
    showToast('Erreur lors de la sauvegarde du logo', 'error')
  }
}

async function removeLogoSetting() {
  if (!confirm('Supprimer le logo ?')) return
  try {
    await http.put(API.settings, { logo_data: '' })
    window._pendingLogoData = null
    applySidebarLogo('')
    navigate('settings')
    showToast('Logo supprimé', 'success')
  } catch(e) {
    showToast('Erreur', 'error')
  }
}

function applySidebarLogo(dataUrl) {
  const slot = document.getElementById('logo-slot')
  if (!slot) return
  if (dataUrl) {
    // Logo uploadé depuis Paramètres → remplace le SVG par défaut
    slot.className = ''
    slot.style.cssText = ''
    slot.innerHTML = `<img src="${dataUrl}" alt="Logo" class="sidebar-logo-img" />`
  } else {
    // Retour au SVG PPrime par défaut (transparent, qualité vectorielle)
    slot.className = ''
    slot.style.cssText = ''
    slot.innerHTML = `<img src="/static/logo-pprime-white.svg" alt="PPrime" class="sidebar-logo-img" onerror="this.style.display='none'" />`
  }
}

// Charger et appliquer le logo au démarrage
async function initLogoFromSettings() {
  try {
    const row = await http.get(API.settings + '/logo_data')
    if (row && row.value) applySidebarLogo(row.value)
  } catch(e) { /* pas de logo configuré */ }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  dayjs.locale('fr')
  renderApp()
  navigate('dashboard')
  // Charger et appliquer le logo sauvegardé
  setTimeout(initLogoFromSettings, 200)
})
