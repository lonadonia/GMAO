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
  kpi: '/api/kpi',
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
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon"><i class="fas fa-wrench"></i></div>
        <div class="sidebar-logo-text">
          <h2>GMAO</h2>
          <span>Maintenance Pro</span>
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
      </nav>
      <div class="sidebar-footer">
        <i class="fas fa-circle" style="color:var(--accent-green);font-size:0.6rem"></i>
        Système opérationnel
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
      <div><h1 style="font-size:1.2rem;font-weight:700">Planning</h1>
      <p style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px">Calendrier de maintenance préventive</p></div>
      <button class="btn btn-primary" onclick="openPlanModal()"><i class="fas fa-plus"></i> Nouveau plan</button>
    </div>
    <div class="page-content">
      <!-- Calendar Navigation -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
        <div style="display:flex;gap:0.5rem;align-items:center">
          <button class="btn btn-ghost btn-sm" onclick="prevMonth()"><i class="fas fa-chevron-left"></i></button>
          <span id="calendar-title" style="font-size:1rem;font-weight:700;min-width:160px;text-align:center"></span>
          <button class="btn btn-ghost btn-sm" onclick="nextMonth()"><i class="fas fa-chevron-right"></i></button>
          <button class="btn btn-ghost btn-sm" onclick="goToday()">Aujourd'hui</button>
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;font-size:0.75rem;color:var(--text-secondary)">
          <span class="calendar-event preventive" style="padding:3px 8px">Préventif</span>
          <span class="calendar-event corrective" style="padding:3px 8px">Correctif planifié</span>
        </div>
      </div>

      <!-- Calendar -->
      <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:1rem;margin-bottom:1.5rem">
        <div class="calendar-grid" id="calendar-grid">
          <div class="loading-overlay" style="grid-column:1/-1"><span class="loader"></span></div>
        </div>
      </div>

      <!-- Plans List -->
      <div class="table-card">
        <div class="table-header">
          <div class="table-title"><i class="fas fa-list" style="color:var(--accent-green)"></i> Plans de maintenance préventive (2026)</div>
        </div>
        <div id="plans-list"><div class="loading-overlay"><span class="loader"></span></div></div>
      </div>
    </div>
  `
  renderCalendar()
  loadPlansList()
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
    const data = await http.get(`${API.planning}/calendar/${year}/${month}`)

    // Build events map
    const events = {}
    data.maintenance_plans?.forEach(p => {
      const day = parseInt(p.next_date?.split('T')[0]?.split('-')[2] || p.next_date?.split('-')[2])
      if (!events[day]) events[day] = []
      events[day].push({ ...p, kind: 'preventive' })
    })
    data.planned_interventions?.forEach(i => {
      const day = parseInt(i.scheduled_date?.split('T')[0]?.split('-')[2] || i.scheduled_date?.split('-')[2])
      if (!events[day]) events[day] = []
      events[day].push({ ...i, kind: 'corrective' })
    })

    const daysInMonth = new Date(year, month, 0).getDate()
    const firstDay = new Date(year, month - 1, 1).getDay()
    const startOffset = (firstDay === 0 ? 6 : firstDay - 1)
    const today = new Date()

    const dayHeaders = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
    let html = dayHeaders.map(d => `<div class="calendar-day-header">${d}</div>`).join('')

    // Empty cells before month start
    for (let i = 0; i < startOffset; i++) html += `<div class="calendar-day other-month"></div>`

    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === d
      const dayEvents = events[d] || []
      html += `<div class="calendar-day ${isToday ? 'today' : ''}">
        <div class="calendar-day-number">${d}</div>
        ${dayEvents.slice(0, 3).map(e => {
          // Pour les plans de maintenance, afficher le client (equipment_name) plutôt que le titre long
          const displayName = e.equipment_name || e.client || e.title
          const shortName = escHtml(displayName.length > 18 ? displayName.slice(0,18)+'…' : displayName)
          const tooltip = escHtml(e.title || e.description || displayName)
          return `<div class="calendar-event ${e.kind}" title="${tooltip}">${shortName}</div>`
        }).join('')}
        ${dayEvents.length > 3 ? `<div style="font-size:0.6rem;color:var(--text-muted)">+${dayEvents.length-3} autres</div>` : ''}
      </div>`
    }

    // Fill remaining cells
    const totalCells = startOffset + daysInMonth
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
    for (let i = 0; i < remaining; i++) html += `<div class="calendar-day other-month"></div>`

    grid.innerHTML = html
  } catch(e) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-calendar-times"></i><p>Erreur de chargement</p></div>`
  }
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
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  dayjs.locale('fr')
  renderApp()
  navigate('dashboard')
})
