/* GMAO - Application Frontend
 * Architecture SPA vanilla JS
 * Toutes les données viennent du backend API
 */

// ============================================================
// AUTH — Système de connexion simple
// ============================================================
const AUTH = {
  CREDENTIALS: { email: 'admin@gmao.com', password: '1234' },
  KEY: 'gmao_isAuthenticated',
  isLoggedIn() { return localStorage.getItem(this.KEY) === 'true' },
  login(email, password) {
    if (email === this.CREDENTIALS.email && password === this.CREDENTIALS.password) {
      localStorage.setItem(this.KEY, 'true')
      return true
    }
    return false
  },
  logout() {
    localStorage.removeItem(this.KEY)
    showLoginPage()
  },
  guard() {
    if (!this.isLoggedIn()) { showLoginPage(); return false }
    return true
  }
}

// ─── Page de connexion ────────────────────────────────────────
function showLoginPage() {
  document.getElementById('app').innerHTML = `
    <div style="
      min-height:100vh;width:100vw;
      position:fixed;top:0;left:0;z-index:9999;
      display:flex;overflow:hidden;
      font-family:'Segoe UI',system-ui,sans-serif;
    ">
      <style>
        @keyframes loginSlideIn {
          from { opacity:0; transform:translateX(32px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes loginImgZoom {
          from { transform: scale(1); }
          to   { transform: scale(1.07); }
        }
        @keyframes floatBadge {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-6px); }
        }
        @keyframes scanLine {
          0%   { top:-100%; }
          100% { top:110%; }
        }
        #login-email::placeholder, #login-password::placeholder { color:#94a3b8; }
        #login-email, #login-password {
          font-family:'Segoe UI',system-ui,sans-serif;
          transition:border-color .2s,box-shadow .2s;
        }
        #login-email:focus, #login-password:focus {
          outline:none;
          border-color:#7c3aed !important;
          box-shadow:0 0 0 3px rgba(124,58,237,.15) !important;
        }
        #login-btn:hover {
          background:linear-gradient(135deg,#5b21b6 0%,#7c3aed 100%) !important;
          box-shadow:0 10px 36px rgba(124,58,237,.55) !important;
          transform:translateY(-2px) !important;
        }
        #login-btn:active { transform:scale(.98) !important; }
        .login-feature-item:hover { background:rgba(124,58,237,.12) !important; }
      </style>

      <!-- ═══════════════════════════════════════
           PANNEAU GAUCHE — image + branding
      ═══════════════════════════════════════ -->
      <div style="
        flex:1;position:relative;overflow:hidden;
        display:none;
      " id="login-left-panel">
        <!-- Image technicien avec tablette -->
        <div style="
          position:absolute;inset:0;
          background-image:url('/static/login-bg.jpg');
          background-size:cover;
          background-position:center 30%;
          animation:loginImgZoom 22s ease-in-out infinite alternate;
        "></div>

        <!-- Overlay dégradé sombre depuis le bas + gauche -->
        <div style="
          position:absolute;inset:0;
          background:linear-gradient(
            160deg,
            rgba(10,8,30,0.25) 0%,
            rgba(15,12,40,0.45) 40%,
            rgba(10,8,35,0.85) 100%
          );
        "></div>

        <!-- Ligne de scan animée subtile -->
        <div style="
          position:absolute;left:0;right:0;height:2px;
          background:linear-gradient(90deg,transparent,rgba(124,58,237,.4),transparent);
          animation:scanLine 8s linear infinite;
          pointer-events:none;
        "></div>

        <!-- Contenu branding bas-gauche -->
        <div style="position:absolute;bottom:0;left:0;right:0;padding:2.5rem 2.8rem">

          <!-- Badge "Système actif" -->
          <div style="
            display:inline-flex;align-items:center;gap:.5rem;
            background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.3);
            border-radius:20px;padding:.3rem .9rem;margin-bottom:1.2rem;
            animation:floatBadge 3s ease-in-out infinite;
          ">
            <span style="width:6px;height:6px;border-radius:50%;background:#34d399;
                         box-shadow:0 0 6px #34d399;display:inline-block"></span>
            <span style="font-size:.65rem;font-weight:700;color:#6ee7b7;text-transform:uppercase;letter-spacing:.8px">
              Système en ligne
            </span>
          </div>

          <!-- Titre principal -->
          <h2 style="
            font-size:2rem;font-weight:900;color:#f8fafc;
            line-height:1.15;letter-spacing:-.6px;margin:0 0 .7rem;
          ">
            Gestion de<br>
            <span style="
              background:linear-gradient(90deg,#a78bfa,#60a5fa);
              -webkit-background-clip:text;-webkit-text-fill-color:transparent;
              background-clip:text;
            ">Maintenance</span><br>
            Assistée
          </h2>

          <!-- Description -->
          <p style="font-size:.82rem;color:rgba(203,213,225,.75);line-height:1.65;margin:0 0 1.6rem;max-width:340px">
            Pilotez vos interventions, équipements et techniciens depuis une plateforme unifiée conçue pour l'industrie.
          </p>

          <!-- Features liste -->
          <div style="display:flex;flex-direction:column;gap:.5rem">
            ${[
              ['fa-bolt','Interventions en temps réel'],
              ['fa-shield-alt','Maintenance préventive intelligente'],
              ['fa-chart-line','Rapports & KPIs avancés'],
              ['fa-file-alt','Comptes rendus PDF automatisés'],
            ].map(([icon, label]) => `
              <div class="login-feature-item" style="
                display:flex;align-items:center;gap:.65rem;
                padding:.4rem .7rem;border-radius:8px;
                background:rgba(255,255,255,.05);
                transition:background .2s;
              ">
                <i class="fas ${icon}" style="color:#a78bfa;font-size:.75rem;width:14px;text-align:center"></i>
                <span style="font-size:.75rem;color:rgba(226,232,240,.85);font-weight:500">${label}</span>
              </div>`
            ).join('')}
          </div>

          <!-- Signature -->
          <div style="margin-top:1.6rem;padding-top:1.1rem;border-top:1px solid rgba(255,255,255,.1);
                      display:flex;align-items:center;gap:.75rem">
            <img src="/static/logo-pprime-real.png" alt="PPrime"
                 style="height:28px;width:auto;filter:brightness(1.2);opacity:.9" />
            <div>
              <div style="font-size:.72rem;font-weight:700;color:rgba(226,232,240,.8)">PPrime</div>
              <div style="font-size:.6rem;color:rgba(148,163,184,.55)">Plateforme GMAO v1.0</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════
           PANNEAU DROITE — formulaire login
      ═══════════════════════════════════════ -->
      <div style="
        width:100%;max-width:480px;
        background:#ffffff;
        display:flex;flex-direction:column;justify-content:center;
        padding:2.8rem 3rem;
        position:relative;overflow-y:auto;
        box-shadow:-20px 0 60px rgba(0,0,0,.18);
        animation:loginSlideIn .5s cubic-bezier(.22,.68,0,1.2);
        flex-shrink:0;
      " id="login-right-panel">

        <!-- Fond très léger texture -->
        <div style="
          position:absolute;inset:0;pointer-events:none;
          background:radial-gradient(ellipse at 80% 10%,rgba(124,58,237,.04) 0%,transparent 60%),
                     radial-gradient(ellipse at 20% 90%,rgba(59,130,246,.04) 0%,transparent 60%);
        "></div>

        <div style="position:relative;max-width:360px;width:100%;margin:0 auto">

          <!-- Logo -->
          <div style="text-align:center;margin-bottom:.9rem">
            <img src="/static/logo-pprime-real.png" alt="PPrime"
                 style="height:56px;width:auto;object-fit:contain;display:inline-block;
                        filter:drop-shadow(0 2px 8px rgba(124,58,237,.15))" />
          </div>

          <!-- Badge plateforme -->
          <div style="text-align:center;margin-bottom:1.6rem">
            <span style="
              display:inline-flex;align-items:center;gap:.4rem;
              background:linear-gradient(90deg,rgba(124,58,237,.08),rgba(79,70,229,.1));
              border:1px solid rgba(124,58,237,.22);
              border-radius:20px;padding:.3rem .95rem;
              font-size:.63rem;font-weight:700;
              color:#7c3aed;text-transform:uppercase;letter-spacing:.9px;
            ">
              <i class="fas fa-tablet-alt" style="font-size:.6rem"></i>
              PPrime — Plateforme GMAO v1.0
            </span>
          </div>

          <!-- Titre -->
          <div style="margin-bottom:1.6rem">
            <h1 style="font-size:1.75rem;font-weight:800;color:#0f172a;margin:0 0 .3rem;letter-spacing:-.5px">
              Connexion
            </h1>
            <p style="font-size:.82rem;color:#64748b;margin:0;line-height:1.55">
              Accédez à votre espace de gestion —
              <span style="color:#7c3aed;font-weight:600">sécurisé et performant.</span>
            </p>
          </div>

          <!-- Séparateur -->
          <div style="height:1px;background:linear-gradient(90deg,rgba(124,58,237,.2),#e2e8f0,transparent);margin-bottom:1.6rem"></div>

          <!-- Formulaire -->
          <form id="login-form" onsubmit="handleLogin(event)">

            <!-- Email -->
            <div style="margin-bottom:1.1rem">
              <label style="display:block;font-size:.73rem;font-weight:600;color:#374151;margin-bottom:.45rem;
                            display:flex;align-items:center;gap:.4rem">
                <i class="fas fa-user" style="color:#7c3aed;font-size:.65rem"></i>
                Identifiant
              </label>
              <div style="position:relative">
                <input type="email" id="login-email" required autocomplete="email"
                  placeholder="admin@gmao.com"
                  style="
                    width:100%;padding:.82rem 1rem .82rem 1rem;
                    border-radius:11px;
                    background:#f8fafc;
                    border:1.5px solid #e2e8f0;
                    color:#0f172a;font-size:.88rem;
                    box-sizing:border-box;
                  "
                />
              </div>
            </div>

            <!-- Password -->
            <div style="margin-bottom:.7rem">
              <label style="display:block;font-size:.73rem;font-weight:600;color:#374151;margin-bottom:.45rem;
                            display:flex;align-items:center;gap:.4rem">
                <i class="fas fa-lock" style="color:#7c3aed;font-size:.65rem"></i>
                Mot de passe
              </label>
              <div style="position:relative">
                <input type="password" id="login-password" required autocomplete="current-password"
                  placeholder="••••••••"
                  style="
                    width:100%;padding:.82rem 3rem .82rem 1rem;
                    border-radius:11px;
                    background:#f8fafc;
                    border:1.5px solid #e2e8f0;
                    color:#0f172a;font-size:.88rem;
                    box-sizing:border-box;letter-spacing:.1em;
                  "
                />
                <button type="button" onclick="toggleLoginPwd()"
                  style="
                    position:absolute;right:12px;top:50%;transform:translateY(-50%);
                    background:none;border:none;color:#9ca3af;cursor:pointer;
                    padding:4px;font-size:.9rem;transition:color .2s;
                  "
                  onmouseover="this.style.color='#7c3aed'"
                  onmouseout="this.style.color='#9ca3af'">
                  <i class="fas fa-eye" id="login-pwd-eye"></i>
                </button>
              </div>
            </div>

            <!-- Erreur -->
            <div id="login-error" style="
              display:none;align-items:center;gap:.6rem;
              background:#fef2f2;border:1px solid #fecaca;
              border-radius:9px;padding:.65rem .9rem;margin-bottom:.9rem;
              color:#dc2626;font-size:.78rem;
            ">
              <i class="fas fa-exclamation-circle" style="flex-shrink:0"></i>
              <span>Identifiant ou mot de passe incorrect.</span>
            </div>

            <!-- Bouton connexion -->
            <button type="submit" id="login-btn" style="
              width:100%;padding:.92rem;border:none;border-radius:12px;
              background:linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%);
              color:white;font-size:.9rem;font-weight:700;cursor:pointer;
              box-shadow:0 6px 24px rgba(124,58,237,.38);
              transition:all .25s ease;
              display:flex;align-items:center;justify-content:center;gap:.6rem;
              letter-spacing:.3px;margin-top:.9rem;
            ">
              <i class="fas fa-sign-in-alt"></i> S'identifier
            </button>
          </form>

          <!-- Séparateur bas -->
          <div style="height:1px;background:linear-gradient(90deg,transparent,#e2e8f0,transparent);margin:1.6rem 0 1.2rem"></div>

          <!-- Footer -->
          <div style="text-align:center">
            <div style="font-size:.65rem;color:#94a3b8;margin-bottom:.2rem">
              © 2026 PPrime — Plus rapide. Plus sûr. Meilleur.
            </div>
            <div style="font-size:.62rem;color:#cbd5e1">
              Réalisé par <span style="color:#7c3aed;font-weight:700">Mohcine Banaoui</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  `

  // Afficher le panneau gauche seulement sur grand écran
  const applyLayout = () => {
    const leftPanel  = document.getElementById('login-left-panel')
    const rightPanel = document.getElementById('login-right-panel')
    if (!leftPanel || !rightPanel) return
    if (window.innerWidth >= 900) {
      leftPanel.style.display  = 'block'
      rightPanel.style.maxWidth = '480px'
    } else {
      leftPanel.style.display  = 'none'
      rightPanel.style.maxWidth = '100%'
      rightPanel.style.width   = '100%'
    }
  }
  applyLayout()
  window.addEventListener('resize', applyLayout)
  setTimeout(() => document.getElementById('login-email')?.focus(), 200)
}

function toggleLoginPwd() {
  const input = document.getElementById('login-password')
  const eye   = document.getElementById('login-pwd-eye')
  if (!input) return
  if (input.type === 'password') {
    input.type = 'text'
    eye.className = 'fas fa-eye-slash'
  } else {
    input.type = 'password'
    eye.className = 'fas fa-eye'
  }
}

function handleLogin(e) {
  e.preventDefault()
  const email    = document.getElementById('login-email').value.trim()
  const password = document.getElementById('login-password').value
  const btn      = document.getElementById('login-btn')
  const errDiv   = document.getElementById('login-error')

  // Loading state
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...'
  btn.disabled  = true
  errDiv.style.display = 'none'

  setTimeout(() => {
    if (AUTH.login(email, password)) {
      btn.innerHTML = '<i class="fas fa-check"></i> Connecté !'
      btn.style.background = 'linear-gradient(135deg,#059669,#10b981)'
      setTimeout(() => { initApp() }, 600)
    } else {
      errDiv.style.display = 'flex'
      btn.innerHTML  = '<i class="fas fa-sign-in-alt"></i> Se connecter'
      btn.disabled   = false
      // Shake animation
      const form = document.getElementById('login-form')
      form.style.animation = 'none'
      form.style.transform = 'translateX(6px)'
      setTimeout(() => { form.style.transform = 'translateX(-6px)' }, 80)
      setTimeout(() => { form.style.transform = 'translateX(4px)'  }, 160)
      setTimeout(() => { form.style.transform = 'translateX(0)'    }, 240)
    }
  }, 500)
}

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
  compteRendus: '/api/compte-rendus',
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

// Returns a stable color for a technician name
function getTechColor(name) {
  const palette = ['#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f59e0b','#10b981','#ef4444','#6366f1','#f97316','#06b6d4']
  if (!name) return palette[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffff
  return palette[hash % palette.length]
}

// Returns uppercase initials from a name string
function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

/**
 * Format MTBF hours into a human-readable string.
 * - < 48h   → hours  (ex: "36h")
 * - < 720h  → days   (ex: "12j")
 * - ≥ 720h  → months (ex: "2.5 mois")
 * Returns { value, unit, raw_hours }
 */
function formatMtbf(hours) {
  if (!hours || hours === 0) return { value: '0', unit: 'h', raw_hours: 0 }
  const h = parseFloat(hours)
  if (h < 48) {
    return { value: h.toFixed(1), unit: 'h', raw_hours: h.toFixed(0) }
  } else if (h < 720) {
    const days = h / 24
    return { value: days.toFixed(1), unit: 'j', raw_hours: h.toFixed(0) }
  } else {
    const months = h / 720
    return { value: months.toFixed(1), unit: 'mois', raw_hours: h.toFixed(0) }
  }
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
      <div class="sidebar-logo" id="logo-wrapper" style="display:none">
        <div id="logo-slot"></div>
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
        <div class="nav-item ${state.currentPage==='compte-rendus'?'active':''}" onclick="navigate('compte-rendus')">
          <i class="fas fa-file-alt"></i> Comptes Rendus
        </div>
        <div class="nav-section-title">Automatisation</div>
        <div class="nav-item ${state.currentPage==='notifications'?'active':''}" onclick="navigate('notifications')">
          <i class="fas fa-bell"></i> Notifications
          <span id="nav-badge-notifications" class="nav-badge" style="display:none"></span>
        </div>
        <div class="nav-section-title">Système</div>
        <div class="nav-item ${state.currentPage==='settings'?'active':''}" onclick="navigate('settings')">
          <i class="fas fa-sliders-h"></i> Paramètres
        </div>
      </nav>
      <div class="sidebar-footer" style="padding:0">
        <!-- Bouton Déconnexion -->
        <button onclick="AUTH.logout()" style="
          width:100%;display:flex;align-items:center;gap:.6rem;
          padding:.65rem 1.1rem;margin-bottom:.5rem;
          background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.18);
          border-radius:10px;color:#fca5a5;font-size:.75rem;font-weight:600;
          cursor:pointer;transition:all .2s;
        "
        onmouseover="this.style.background='rgba(239,68,68,.18)';this.style.borderColor='rgba(239,68,68,.35)'"
        onmouseout="this.style.background='rgba(239,68,68,.08)';this.style.borderColor='rgba(239,68,68,.18)'">
          <i class="fas fa-sign-out-alt" style="font-size:.8rem"></i>
          Déconnexion
        </button>
        <!-- Info version -->
        <div style="padding:.2rem .3rem .4rem .3rem">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
            <i class="fas fa-circle" style="color:var(--accent-green);font-size:0.5rem"></i>
            <span style="font-weight:700;font-size:.68rem;color:var(--text-primary)">PPrime — GMAO v1.0</span>
          </div>
          <div style="font-size:.6rem;color:var(--text-secondary);padding-left:13px">Mohcine Banaoui</div>
        </div>
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
  if (!AUTH.guard()) return
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
    'compte-rendus': renderCompteRendus,
    settings:      renderSettings,
    notifications: renderNotifications,
  }
  if (pages[page]) pages[page]()
}

// ============================================================
// DASHBOARD
// ============================================================
async function renderDashboard() {
  // Pré-charger techniciens et clients pour les selects
  if (!state.technicians.data.length) {
    try { const d = await http.get(API.technicians); state.technicians.data = d.data || [] } catch(e) {}
  }
  if (!state.clients.data.length) {
    try { const d = await http.get(API.clients); state.clients.data = d.data || [] } catch(e) {}
  }

  // Options techniciens
  const techOptions = state.technicians.data
    .map(t => `<option value="${escHtml(t.name)}">${escHtml(t.name)}</option>`)
    .join('')

  // Options clients
  const clientOptions = state.clients.data
    .map(c => `<option value="${escHtml(c.name)}">${escHtml(c.name)}</option>`)
    .join('')

  // Restaurer filtres sauvegardés
  const f = state.kpi.filters

  const container = document.getElementById('page-container')
  // Date/heure dynamique
  const now = new Date()
  const dayNames = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
  const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  const dateStr = `${dayNames[now.getDay()]} ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`
  const timeStr = now.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})

  container.innerHTML = `

    <!-- ══════════════════════════════════════════════════════
         HERO HEADER — GMAO PPrime Dashboard — Split technician
    ══════════════════════════════════════════════════════ -->
    <style>
      @keyframes heroScanLine {
        0%   { transform: translateY(-100%); opacity: 0; }
        10%  { opacity: 1; }
        90%  { opacity: 1; }
        100% { transform: translateY(1200%); opacity: 0; }
      }
      @keyframes heroPulse {
        0%,100% { opacity:.6; transform:scale(1); }
        50%     { opacity:1; transform:scale(1.15); }
      }
      @keyframes heroFadeUp {
        from { opacity:0; transform:translateY(18px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes statCount {
        from { opacity:0; transform:translateY(10px); }
        to   { opacity:1; transform:translateY(0); }
      }
    </style>
    <div id="dashboard-hero" style="
      background: linear-gradient(135deg, #060e1f 0%, #0a1a38 35%, #0d2347 65%, #071224 100%);
      border-radius: 20px;
      margin-bottom: 1.5rem;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(59,130,246,0.18);
      box-shadow: 0 8px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04);
      min-height: 210px;
    ">
      <!-- Accent top line -->
      <div style="position:absolute;top:0;left:0;right:0;height:2px;
                  background:linear-gradient(90deg,transparent 0%,#1d4ed8 20%,#3b82f6 50%,#6366f1 80%,transparent 100%);
                  pointer-events:none;z-index:2"></div>

      <!-- Grid overlay subtle -->
      <div style="position:absolute;inset:0;pointer-events:none;z-index:1;
        background-image: repeating-linear-gradient(0deg,rgba(59,130,246,0.025) 0px,rgba(59,130,246,0.025) 1px,transparent 1px,transparent 40px),
                          repeating-linear-gradient(90deg,rgba(59,130,246,0.025) 0px,rgba(59,130,246,0.025) 1px,transparent 1px,transparent 40px)">
      </div>

      <!-- Glow blob top-left -->
      <div style="position:absolute;top:-80px;left:-40px;width:300px;height:300px;border-radius:50%;
                  background:radial-gradient(circle,rgba(37,99,235,0.18) 0%,transparent 70%);
                  pointer-events:none;z-index:1"></div>
      <!-- Glow blob bottom center -->
      <div style="position:absolute;bottom:-60px;left:35%;width:250px;height:250px;border-radius:50%;
                  background:radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%);
                  pointer-events:none;z-index:1"></div>

      <!-- Scan line animation -->
      <div style="position:absolute;top:0;left:0;right:0;height:1px;
                  background:linear-gradient(90deg,transparent,rgba(96,165,250,0.6),transparent);
                  animation:heroScanLine 6s linear infinite;pointer-events:none;z-index:2"></div>

      <!-- LAYOUT: Left content + Right technician image -->
      <div style="position:relative;z-index:3;display:flex;align-items:stretch;min-height:210px">

        <!-- ─── LEFT PANEL ─── -->
        <div style="flex:1;padding:1.75rem 2rem;display:flex;flex-direction:column;justify-content:space-between;animation:heroFadeUp .5s ease both">

          <!-- Top row: logo + badges + buttons -->
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap">
            <div style="display:flex;align-items:center;gap:1.25rem">
              <img src="/static/logo-pprime-real.png" alt="PPrime"
                   style="height:52px;width:auto;filter:drop-shadow(0 2px 18px rgba(59,130,246,.55))" />
              <div style="width:1px;height:48px;background:linear-gradient(to bottom,transparent,rgba(255,255,255,.15),transparent)"></div>
              <div>
                <div style="display:flex;align-items:center;gap:.45rem;margin-bottom:5px;flex-wrap:wrap">
                  <span style="background:rgba(37,99,235,.2);border:1px solid rgba(59,130,246,.35);
                               color:#93c5fd;font-size:.58rem;font-weight:800;text-transform:uppercase;
                               letter-spacing:1.2px;padding:3px 10px;border-radius:30px">
                    GMAO — PPrime
                  </span>
                  <span style="background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.28);
                               color:#6ee7b7;font-size:.58rem;font-weight:700;padding:3px 9px;border-radius:30px;
                               display:flex;align-items:center;gap:3px">
                    <span style="width:5px;height:5px;border-radius:50%;background:#34d399;animation:heroPulse 2s infinite;display:inline-block"></span>
                    Système actif
                  </span>
                </div>
                <h1 style="font-size:1.6rem;font-weight:900;color:#f8fafc;line-height:1.05;
                           letter-spacing:-.6px;margin:0 0 6px 0">
                  Tableau de Bord
                  <span style="background:linear-gradient(90deg,#3b82f6,#818cf8);
                               -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                               background-clip:text;font-weight:900"> Maintenance</span>
                </h1>
                <div style="display:flex;align-items:center;gap:.6rem">
                  <span style="font-size:.68rem;color:rgba(148,163,184,.75)">
                    <i class="fas fa-calendar-day" style="margin-right:4px;color:#60a5fa"></i>${dateStr}
                  </span>
                  <span style="color:rgba(148,163,184,.2)">•</span>
                  <span style="font-size:.68rem;color:rgba(148,163,184,.75)">
                    <i class="fas fa-clock" style="margin-right:4px;color:#818cf8"></i>${timeStr}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div style="display:flex;gap:.45rem;flex-shrink:0;margin-top:.15rem">
              <button class="btn btn-ghost btn-sm" onclick="resetKpiFilters()" title="Réinitialiser"
                style="border:1px solid rgba(255,255,255,.1);color:rgba(148,163,184,.7);border-radius:9px">
                <i class="fas fa-filter-circle-xmark"></i>
              </button>
              <button onclick="reloadKPI()" style="
                background:linear-gradient(135deg,#1d4ed8 0%,#4f46e5 100%);
                border:none;color:white;border-radius:9px;padding:.45rem 1.1rem;
                font-size:.75rem;font-weight:700;cursor:pointer;
                display:flex;align-items:center;gap:.4rem;
                box-shadow:0 4px 16px rgba(37,99,235,.45);
                transition:all .2s;
              " onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 20px rgba(37,99,235,.55)'"
                 onmouseout="this.style.transform='none';this.style.boxShadow='0 4px 16px rgba(37,99,235,.45)'">
                <i class="fas fa-sync-alt"></i> Actualiser
              </button>
            </div>
          </div>

          <!-- Bottom row: filters -->
          <div style="
            margin-top:1.15rem;padding-top:1rem;
            border-top:1px solid rgba(255,255,255,.06);
            display:flex;flex-wrap:wrap;gap:.45rem;align-items:center;
          ">
            <span style="font-size:.62rem;font-weight:800;text-transform:uppercase;letter-spacing:.9px;
                         color:rgba(148,163,184,.4);margin-right:.2rem">
              <i class="fas fa-sliders-h" style="margin-right:4px"></i>Filtres
            </span>
            <div style="display:flex;align-items:center;gap:.3rem">
              <i class="fas fa-calendar-alt" style="color:rgba(148,163,184,.35);font-size:.68rem"></i>
              <input type="date" id="kpi-date-from" class="input input-sm"
                     style="width:135px;background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.09);color:#f1f5f9;border-radius:7px"
                     value="${f.date_from||''}" onchange="reloadKPI()" title="Date début">
            </div>
            <span style="color:rgba(148,163,184,.35);font-size:.7rem">→</span>
            <div style="display:flex;align-items:center;gap:.3rem">
              <input type="date" id="kpi-date-to" class="input input-sm"
                     style="width:135px;background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.09);color:#f1f5f9;border-radius:7px"
                     value="${f.date_to||''}" onchange="reloadKPI()" title="Date fin">
            </div>
            <div style="width:1px;height:16px;background:rgba(255,255,255,.08)"></div>
            <div style="display:flex;align-items:center;gap:.3rem">
              <i class="fas fa-user-cog" style="color:rgba(148,163,184,.35);font-size:.68rem"></i>
              <select id="kpi-technician" class="select input-sm"
                      style="width:145px;background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.09);color:#f1f5f9;border-radius:7px"
                      onchange="reloadKPI()">
                <option value="">Tous techniciens</option>
                ${techOptions}
              </select>
            </div>
            <div style="width:1px;height:16px;background:rgba(255,255,255,.08)"></div>
            <div style="display:flex;align-items:center;gap:.3rem">
              <i class="fas fa-map-marker-alt" style="color:rgba(148,163,184,.35);font-size:.68rem"></i>
              <input type="text" id="kpi-city" class="input input-sm"
                     style="width:120px;background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.09);color:#f1f5f9;border-radius:7px"
                     placeholder="Ville..." value="${f.city||''}" oninput="debounceKpiFilter()" title="Ville">
            </div>
            <div style="display:flex;align-items:center;gap:.3rem">
              <i class="fas fa-building" style="color:rgba(148,163,184,.35);font-size:.68rem"></i>
              <select id="kpi-client" class="select input-sm"
                      style="width:148px;background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.09);color:#f1f5f9;border-radius:7px"
                      onchange="reloadKPI()">
                <option value="">Tous clients</option>
                ${clientOptions}
              </select>
            </div>
            <div id="kpi-active-badge"></div>
          </div>
        </div>

      </div>
    </div>

    <div class="page-content">
      <div id="planning-alerts-banner"></div>
      <div id="kpi-section">
        <div class="loading-overlay"><span class="loader"></span> Chargement des KPIs...</div>
      </div>
    </div>
  `
  await loadKPI()
  loadPlanningAlerts()
}

/* ── PLANNING ALERTS BANNER — affichage dashboard ── */
async function loadPlanningAlerts() {
  const banner = document.getElementById('planning-alerts-banner')
  if (!banner) return
  try {
    const today = new Date()
    const yyyy  = today.getFullYear()
    const mm    = String(today.getMonth() + 1).padStart(2, '0')
    const cal   = await http.get(`/api/planning/calendar/${yyyy}/${mm}`)

    // Plans de maintenance du mois courant avec notification_date définie
    const plans = cal.maintenance_plans || []
    const todayStr = today.toISOString().split('T')[0]

    // Catégoriser : aujourd'hui, dans 7j, dans 30j
    const alerts = plans
      .filter(p => p.active && p.notification_date)
      .map(p => {
        const nd   = p.notification_date?.split('T')[0]
        const diff = Math.round((new Date(nd) - today) / 86400000)
        return { ...p, notification_date_str: nd, diff }
      })
      .filter(p => p.diff >= -1 && p.diff <= 30)
      .sort((a, b) => a.diff - b.diff)

    if (alerts.length === 0) { banner.innerHTML = ''; return }

    const items = alerts.map(p => {
      const isToday    = p.diff === 0
      const isPast     = p.diff < 0
      const isUrgent   = p.diff <= 1
      const isSoon     = p.diff <= 7

      const dotColor   = isPast ? '#6b7280' : isToday ? '#ef4444' : isUrgent ? '#f97316' : isSoon ? '#f59e0b' : '#6366f1'
      const bg         = isPast ? 'rgba(107,114,128,0.07)' : isToday ? 'rgba(239,68,68,0.09)' : isUrgent ? 'rgba(249,115,22,0.08)' : isSoon ? 'rgba(245,158,11,0.07)' : 'rgba(99,102,241,0.07)'
      const border     = isPast ? 'rgba(107,114,128,0.2)' : isToday ? 'rgba(239,68,68,0.3)' : isUrgent ? 'rgba(249,115,22,0.25)' : isSoon ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.2)'

      const timeLabel  = isPast   ? `<span style="color:#6b7280;font-size:0.65rem">Passé</span>`
                       : isToday  ? `<span style="color:#ef4444;font-weight:800;font-size:0.72rem">Aujourd'hui</span>`
                       : p.diff === 1 ? `<span style="color:#f97316;font-weight:700;font-size:0.72rem">Demain</span>`
                       : `<span style="color:${dotColor};font-weight:700;font-size:0.72rem">J-${p.diff}</span>`

      const startInfo  = p.start_date
        ? `${formatDate(p.start_date)} ${p.start_time ? 'à ' + p.start_time : ''}`
        : (p.next_date ? formatDate(p.next_date) : '—')

      const emails = (p.notification_emails || '').split(',').map(e => e.trim()).filter(Boolean)

      return `
        <div style="display:flex;align-items:flex-start;gap:10px;
                    background:${bg};border:1px solid ${border};border-left:3px solid ${dotColor};
                    border-radius:8px;padding:9px 12px;min-width:260px;max-width:340px;flex-shrink:0">
          <!-- dot -->
          <div style="width:8px;height:8px;border-radius:50%;background:${dotColor};
                      margin-top:4px;flex-shrink:0;
                      ${isToday ? 'box-shadow:0 0 6px '+dotColor : ''}"></div>
          <div style="min-width:0;flex:1">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:6px">
              <div style="font-size:0.78rem;font-weight:700;color:var(--text-primary);
                          white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                ${escHtml(p.title)}
              </div>
              ${timeLabel}
            </div>
            <div style="font-size:0.68rem;color:var(--text-secondary);margin-top:3px;line-height:1.5">
              <span style="color:var(--text-secondary)"><i class="fas fa-calendar-alt" style="margin-right:3px;opacity:.6"></i>${startInfo}</span>
            </div>
            ${emails.length > 0 ? `
            <div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:3px">
              ${emails.map(em => `<span style="background:rgba(245,158,11,0.12);color:#fbbf24;
                font-size:0.62rem;font-weight:600;padding:1px 7px;border-radius:20px">${escHtml(em)}</span>`).join('')}
            </div>` : ''}
          </div>
        </div>`
    }).join('')

    banner.innerHTML = `
      <div style="margin-bottom:1rem">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <i class="fas fa-calendar-check" style="color:var(--accent-yellow);font-size:0.85rem"></i>
          <span style="font-size:0.75rem;font-weight:700;color:var(--text-primary);text-transform:uppercase;letter-spacing:.5px">
            Alertes Planning
          </span>
          <span style="background:rgba(245,158,11,0.15);color:#fbbf24;font-size:0.65rem;
                       font-weight:700;padding:1px 8px;border-radius:20px">${alerts.length}</span>
        </div>
        <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;
                    scrollbar-width:thin;scrollbar-color:var(--border) transparent">
          ${items}
        </div>
      </div>`
  } catch(e) {
    // silently fail — dashboard still works without alerts
  }
}

async function reloadKPI() {
  const dateFrom   = document.getElementById('kpi-date-from')?.value
  const dateTo     = document.getElementById('kpi-date-to')?.value
  const technician = document.getElementById('kpi-technician')?.value
  const city       = document.getElementById('kpi-city')?.value?.trim()
  const client     = document.getElementById('kpi-client')?.value

  state.kpi.filters = {}
  if (dateFrom)   state.kpi.filters.date_from        = dateFrom
  if (dateTo)     state.kpi.filters.date_to          = dateTo
  if (technician) state.kpi.filters.technician_name  = technician
  if (city)       state.kpi.filters.city             = city
  if (client)     state.kpi.filters.client           = client

  // Badge filtres actifs
  const activeCount = Object.keys(state.kpi.filters).length
  const badge = document.getElementById('kpi-active-badge')
  if (badge) {
    badge.innerHTML = activeCount > 0
      ? `<span style="background:var(--accent-blue);color:#fff;font-size:0.65rem;
                      padding:2px 8px;border-radius:20px;font-weight:600">
           ${activeCount} filtre${activeCount>1?'s':''} actif${activeCount>1?'s':''}
         </span>`
      : ''
  }

  await loadKPI()
}

function resetKpiFilters() {
  const ids = ['kpi-date-from','kpi-date-to','kpi-city']
  ids.forEach(id => { const el = document.getElementById(id); if(el) el.value = '' })
  const selects = ['kpi-technician','kpi-client']
  selects.forEach(id => { const el = document.getElementById(id); if(el) el.value = '' })
  state.kpi.filters = {}
  loadKPI()
}

// debounce pour le champ texte ville
let _kpiFilterTimer = null
function debounceKpiFilter() {
  clearTimeout(_kpiFilterTimer)
  _kpiFilterTimer = setTimeout(() => reloadKPI(), 400)
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
        <div class="kpi-label"><i class="fas fa-chart-area"></i> MTBF global</div>
        ${(() => { const f = formatMtbf(kpis.mtbf || 0); return `<div class="kpi-value">${kpis.mtbf ? f.value : '—'}<span class="kpi-unit"> ${kpis.mtbf ? f.unit : ''}</span></div>` })()}
        <div class="kpi-trend">Temps moyen entre pannes</div>
      </div>
      <div class="kpi-card" style="--kpi-color:var(--accent-green)">
        <i class="fas fa-signal kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-heartbeat"></i> Disponibilité</div>
        <div class="kpi-value">${kpis.availability}<span class="kpi-unit">%</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${kpis.availability}%;background:var(--accent-green)"></div></div>
      </div>
      <div class="kpi-card" style="--kpi-color:var(--accent-orange);padding-bottom:0.75rem">
        <i class="fas fa-tools kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-tools"></i> Corrective / Préventive</div>
        <!-- deux compteurs côte à côte -->
        <div style="display:flex;gap:0.75rem;margin-top:0.5rem;align-items:flex-end">
          <div style="flex:1;text-align:center;background:rgba(248,113,113,0.1);
                      border:1px solid rgba(248,113,113,0.25);border-radius:8px;padding:0.4rem 0.25rem">
            <div style="font-size:1.6rem;font-weight:800;color:#f87171;line-height:1">
              ${kpis.corrective_count}
            </div>
            <div style="font-size:0.6rem;color:rgba(255,255,255,0.5);margin-top:3px;letter-spacing:.5px">
              CORRECTIVE
            </div>
          </div>
          <div style="flex:1;text-align:center;background:rgba(52,211,153,0.1);
                      border:1px solid rgba(52,211,153,0.25);border-radius:8px;padding:0.4rem 0.25rem">
            <div style="font-size:1.6rem;font-weight:800;color:#34d399;line-height:1">
              ${kpis.preventive_count}
            </div>
            <div style="font-size:0.6rem;color:rgba(255,255,255,0.5);margin-top:3px;letter-spacing:.5px">
              PRÉVENTIVE
            </div>
          </div>
        </div>
        <!-- barre de proportion -->
        <div style="margin-top:0.6rem;height:4px;border-radius:2px;background:rgba(255,255,255,0.08);overflow:hidden">
          <div style="height:100%;width:${kpis.corrective_pct}%;background:#f87171;border-radius:2px;
                      transition:width .4s"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:0.6rem;
                    color:rgba(255,255,255,0.4);margin-top:3px">
          <span>${kpis.corrective_pct}% correctif</span>
          <span>${kpis.preventive_pct}% préventif</span>
        </div>
        ${kpis.preventive_from_planning > 0 ? `
        <div style="margin-top:0.4rem;font-size:0.6rem;color:rgba(52,211,153,0.6);
                    text-align:center;border-top:1px solid rgba(52,211,153,0.1);padding-top:0.3rem">
          <i class="fas fa-calendar-check"></i>
          ${kpis.preventive_from_planning} depuis le planning (${kpis.plan_count} plans)
        </div>` : ''}
      </div>
      <div class="kpi-card" style="--kpi-color:var(--accent-red)">
        <i class="fas fa-power-off kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-exclamation-triangle"></i> Arrêts machine</div>
        <div class="kpi-value">${kpis.downtime_count}</div>
        <div class="kpi-trend">Interventions avec arrêt production</div>
      </div>
      <div class="kpi-card" style="--kpi-color:var(--accent-red)">
        <i class="fas fa-fire kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-exclamation"></i> Critiques / Hautes</div>
        <div class="kpi-value">${kpis.critical_count + kpis.high_count}</div>
        <div class="kpi-trend">${kpis.critical_count} critiques · ${kpis.high_count} hautes</div>
      </div>
      <div class="kpi-card" style="--kpi-color:var(--accent-orange)">
        <i class="fas fa-hourglass-half kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-clock"></i> Temps d'attente moyen</div>
        <div class="kpi-value">${kpis.avg_wait_hours ? kpis.avg_wait_hours : '–'}<span class="kpi-unit"> h</span></div>
        <div class="kpi-trend">Panne → début d'intervention${kpis.wait_sample_count > 0 ? ` · ${kpis.wait_sample_count} cas` : ''}</div>
      </div>
      <div class="kpi-card" style="--kpi-color:var(--accent-green)">
        <i class="fas fa-star kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-award"></i> Note qualité moyenne</div>
        <div class="kpi-value">${kpis.avg_quality || '–'}<span class="kpi-unit"> /10</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${(kpis.avg_quality||0)*10}%;background:var(--accent-green)"></div></div>
      </div>
      <div class="kpi-card" style="--kpi-color:var(--accent-yellow)">
        <i class="fas fa-redo kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-sync"></i> Pannes récurrentes</div>
        <div class="kpi-value">${kpis.recurring_count}</div>
        <div class="kpi-trend">sur ${kpis.total_interventions} interventions</div>
      </div>
      <div class="kpi-card" style="--kpi-color:var(--accent-blue)">
        <i class="fas fa-calendar-alt kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-clipboard-list"></i> Plans actifs</div>
        <div class="kpi-value">${kpis.plan_count || 0}</div>
        <div class="kpi-trend">Plans de maintenance programmés</div>
      </div>
      <div class="kpi-card" style="--kpi-color:var(--accent-green)">
        <i class="fas fa-calendar-check kpi-icon"></i>
        <div class="kpi-label"><i class="fas fa-check-circle"></i> Plans exécutés</div>
        <div class="kpi-value">${kpis.fait_count || 0}</div>
        <div class="kpi-trend">${kpis.plan_count > 0 ? Math.round(((kpis.fait_count||0)/kpis.plan_count)*100) : 0}% des plans réalisés</div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════
         CHARTS — Blue Premium Dashboard
    ═══════════════════════════════════════ -->
    <style>
      .chart-card-premium {
        background: linear-gradient(145deg, rgba(13,22,50,0.95) 0%, rgba(17,30,65,0.9) 100%);
        border: 1px solid rgba(37,99,235,0.22);
        border-radius: 16px;
        padding: 1.3rem 1.5rem;
        position: relative;
        overflow: hidden;
        transition: border-color .25s, box-shadow .25s, transform .2s;
        backdrop-filter: blur(4px);
      }
      .chart-card-premium:hover {
        border-color: rgba(59,130,246,0.45);
        box-shadow: 0 8px 32px rgba(37,99,235,0.18);
        transform: translateY(-2px);
      }
      .chart-card-premium::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 2px;
        background: linear-gradient(90deg, transparent, rgba(59,130,246,0.7), rgba(99,102,241,0.5), transparent);
        pointer-events: none;
      }
      .chart-card-premium .cc-glow {
        position: absolute; top: -40px; right: -40px;
        width: 130px; height: 130px; border-radius: 50%;
        background: radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%);
        pointer-events: none;
      }
      .chart-card-premium .cc-dot-grid {
        position: absolute; bottom: 0; left: 0;
        width: 80px; height: 80px;
        background-image: radial-gradient(circle, rgba(59,130,246,0.12) 1px, transparent 1px);
        background-size: 10px 10px;
        pointer-events: none; opacity: .6;
      }
      .cc-tag {
        display: inline-flex; align-items: center; gap: 4px;
        font-size: .6rem; font-weight: 800; text-transform: uppercase;
        letter-spacing: .9px; color: #60a5fa;
        background: rgba(37,99,235,.12); border: 1px solid rgba(59,130,246,.2);
        border-radius: 20px; padding: 2px 9px; margin-bottom: 4px;
      }
      .cc-title {
        font-size: .9rem; font-weight: 700; color: #f1f5f9;
        letter-spacing: -.2px;
      }
      .cc-title span {
        font-size: .7rem; color: rgba(148,163,184,.6); font-weight: 400;
      }
    </style>
    <div class="chart-grid">

      <!-- 1. Mensuel wide -->
      <div class="chart-card-premium wide">
        <div class="cc-glow"></div>
        <div class="cc-dot-grid"></div>
        <!-- Corner accent -->
        <div style="position:absolute;bottom:0;right:0;width:100px;height:100px;
                    background:radial-gradient(circle at 100% 100%,rgba(99,102,241,0.12) 0%,transparent 70%);
                    pointer-events:none"></div>
        <div style="position:relative;display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.1rem">
          <div>
            <div class="cc-tag"><i class="fas fa-chart-line"></i> Vue mensuelle</div>
            <div class="cc-title">Interventions par mois <span>— 12 derniers mois</span></div>
          </div>
          <div style="display:flex;gap:.35rem;flex-shrink:0">
            <span style="font-size:.62rem;padding:3px 10px;
                         background:rgba(37,99,235,.2);border:1px solid rgba(59,130,246,.3);
                         color:#60a5fa;border-radius:20px;font-weight:800;
                         animation:heroPulse 2s infinite;display:flex;align-items:center;gap:4px">
              <span style="width:5px;height:5px;border-radius:50%;background:#3b82f6;display:inline-block"></span>LIVE
            </span>
          </div>
        </div>
        <canvas id="chart-monthly" height="88"></canvas>
      </div>

      <!-- 2. Statut donut -->
      <div class="chart-card-premium">
        <div class="cc-glow" style="background:radial-gradient(circle,rgba(52,211,153,0.14) 0%,transparent 70%)"></div>
        <div class="cc-dot-grid"></div>
        <div style="position:relative;margin-bottom:.9rem">
          <div class="cc-tag" style="color:#6ee7b7;background:rgba(52,211,153,.1);border-color:rgba(52,211,153,.22)">
            <i class="fas fa-circle-half-stroke"></i> Répartition
          </div>
          <div class="cc-title">Statut des interventions</div>
        </div>
        <canvas id="chart-status" height="180"></canvas>
      </div>

      <!-- 3. Priorité donut -->
      <div class="chart-card-premium">
        <div class="cc-glow" style="background:radial-gradient(circle,rgba(99,102,241,0.16) 0%,transparent 70%)"></div>
        <div class="cc-dot-grid"></div>
        <div style="position:relative;margin-bottom:.9rem">
          <div class="cc-tag" style="color:#a5b4fc;background:rgba(99,102,241,.1);border-color:rgba(99,102,241,.22)">
            <i class="fas fa-exclamation-triangle"></i> Criticité
          </div>
          <div class="cc-title">Priorité des interventions</div>
        </div>
        <canvas id="chart-priority" height="180"></canvas>
      </div>

      <!-- 4. Top villes -->
      <div class="chart-card-premium">
        <div class="cc-glow" style="background:radial-gradient(circle,rgba(14,165,233,0.16) 0%,transparent 70%)"></div>
        <div class="cc-dot-grid"></div>
        <div style="position:relative;margin-bottom:.9rem">
          <div class="cc-tag" style="color:#7dd3fc;background:rgba(14,165,233,.1);border-color:rgba(14,165,233,.22)">
            <i class="fas fa-map-marker-alt"></i> Géographie
          </div>
          <div class="cc-title">Top villes</div>
        </div>
        <canvas id="chart-cities" height="180"></canvas>
      </div>

      <!-- 5. Performance techniciens -->
      <div class="chart-card-premium">
        <div class="cc-glow"></div>
        <div class="cc-dot-grid"></div>
        <div style="position:relative;margin-bottom:.9rem">
          <div class="cc-tag"><i class="fas fa-user-cog"></i> Ressources humaines</div>
          <div class="cc-title">Performance techniciens</div>
        </div>
        <canvas id="chart-technicians" height="180"></canvas>
      </div>

      <!-- 6. Top clients -->
      <div class="chart-card-premium">
        <div class="cc-glow" style="background:radial-gradient(circle,rgba(56,189,248,0.14) 0%,transparent 70%)"></div>
        <div class="cc-dot-grid"></div>
        <div style="position:relative;margin-bottom:.9rem">
          <div class="cc-tag" style="color:#7dd3fc;background:rgba(56,189,248,.1);border-color:rgba(56,189,248,.22)">
            <i class="fas fa-building"></i> Clientèle
          </div>
          <div class="cc-title">Top clients</div>
        </div>
        <canvas id="chart-clients" height="180"></canvas>
      </div>

      <!-- 7. Équipements en panne -->
      <div class="chart-card-premium">
        <div class="cc-glow" style="background:radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 70%)"></div>
        <div class="cc-dot-grid"></div>
        <div style="position:relative;margin-bottom:.9rem">
          <div class="cc-tag" style="color:#a5b4fc;background:rgba(99,102,241,.1);border-color:rgba(99,102,241,.22)">
            <i class="fas fa-cogs"></i> Matériel
          </div>
          <div class="cc-title">Équipements en panne</div>
        </div>
        <canvas id="chart-equipment" height="180"></canvas>
      </div>

    </div>

    <!-- ═══════════════════════════════════════════════════
         SECTION TECHNICIENS — temps moyen + ranking
    ═══════════════════════════════════════════════════ -->
    <div style="margin-top:1.5rem;padding:0 0.25rem">
      <div style="font-weight:700;font-size:0.9rem;color:var(--text-primary);margin-bottom:1rem;display:flex;align-items:center;gap:8px">
        <i class="fas fa-users-cog" style="color:var(--accent-blue)"></i>
        Analyse par technicien
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">

        <!-- Temps moyen par technicien -->
        <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:10px;padding:1.1rem 1.25rem">
          <div style="font-weight:600;font-size:0.8rem;color:var(--text-primary);margin-bottom:0.9rem;display:flex;align-items:center;gap:7px">
            <i class="fas fa-stopwatch" style="color:var(--accent-yellow)"></i>
            Temps moyen de réparation par technicien
          </div>
          ${(charts.avg_time_per_tech||[]).length === 0
            ? `<div style="text-align:center;padding:1.5rem;color:var(--text-secondary);font-size:0.78rem;opacity:0.5">Données insuffisantes</div>`
            : (charts.avg_time_per_tech||[]).map((t, idx) => {
                const maxTime = Math.max(...(charts.avg_time_per_tech||[]).map(x => x.avg_repair_time || 0), 1)
                const pct = t.avg_repair_time ? Math.min(100, (t.avg_repair_time / maxTime) * 100) : 0
                const barColor = pct < 40 ? '#34d399' : pct < 70 ? '#fbbf24' : '#f87171'
                const initials = (t.technician_name||'?').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
                const techColor = getTechColor(t.technician_name)
                return `
                  <div style="margin-bottom:0.85rem">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                      <div style="width:26px;height:26px;border-radius:50%;background:${techColor};display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700;color:#fff;flex-shrink:0">${initials}</div>
                      <div style="flex:1;font-size:0.78rem;font-weight:600;color:var(--text-primary)">${escHtml(t.technician_name||'—')}</div>
                      <div style="font-size:0.75rem;font-weight:700;color:${barColor}">${t.avg_repair_time != null ? t.avg_repair_time + 'h' : '—'}</div>
                      <div style="font-size:0.65rem;color:var(--text-secondary)">${t.total} interv.</div>
                    </div>
                    <div style="height:5px;background:var(--bg-primary);border-radius:3px;overflow:hidden">
                      <div style="height:100%;width:${pct}%;background:${barColor};border-radius:3px;transition:width 0.4s"></div>
                    </div>
                  </div>`
              }).join('')
          }
          <div style="margin-top:0.5rem;padding-top:0.6rem;border-top:1px solid var(--border);font-size:0.68rem;color:var(--text-secondary);display:flex;align-items:center;gap:12px">
            <span style="color:#34d399">■</span> Rapide (&lt;40%)
            <span style="color:#fbbf24">■</span> Moyen
            <span style="color:#f87171">■</span> Long (&gt;70%)
          </div>
        </div>

        <!-- Ranking technicien (score composite) -->
        <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:10px;padding:1.1rem 1.25rem">
          <div style="font-weight:600;font-size:0.8rem;color:var(--text-primary);margin-bottom:0.9rem;display:flex;align-items:center;gap:7px">
            <i class="fas fa-trophy" style="color:#fbbf24"></i>
            Classement techniciens
            <span style="font-size:0.65rem;color:var(--text-secondary);margin-left:auto;font-weight:400">Résolution 40% · Qualité 30% · Rapidité 30%</span>
          </div>
          ${(charts.tech_ranking||[]).length === 0
            ? `<div style="text-align:center;padding:1.5rem;color:var(--text-secondary);font-size:0.78rem;opacity:0.5">Données insuffisantes</div>`
            : (charts.tech_ranking||[]).map((t, idx) => {
                const medals = ['🥇','🥈','🥉']
                const medal = medals[idx] || `<span style="color:var(--text-secondary);font-size:0.8rem">#${idx+1}</span>`
                const score = t.composite_score || 0
                const scoreColor = score >= 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171'
                const initials = (t.technician_name||'?').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
                const techColor = getTechColor(t.technician_name)
                return `
                  <div style="display:flex;align-items:center;gap:9px;padding:0.6rem 0.5rem;margin-bottom:0.3rem;border-radius:8px;background:${idx===0?'rgba(251,191,36,0.06)':idx===1?'rgba(148,163,184,0.06)':idx===2?'rgba(205,127,50,0.06)':'transparent'}">
                    <div style="font-size:${idx<3?'1.1rem':'0.8rem'};width:24px;text-align:center;flex-shrink:0">${medal}</div>
                    <div style="width:28px;height:28px;border-radius:50%;background:${techColor};display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;color:#fff;flex-shrink:0">${initials}</div>
                    <div style="flex:1;min-width:0">
                      <div style="font-size:0.8rem;font-weight:600;color:var(--text-primary)">${escHtml(t.technician_name||'—')}</div>
                      <div style="font-size:0.65rem;color:var(--text-secondary);margin-top:1px">
                        ${t.total} interv. · ${t.resolution_rate||0}% résol. · ${t.avg_quality ? t.avg_quality+'/10' : '—'}
                      </div>
                    </div>
                    <div style="text-align:right;flex-shrink:0">
                      <div style="font-size:1rem;font-weight:800;color:${scoreColor};line-height:1">${score}</div>
                      <div style="font-size:0.6rem;color:var(--text-secondary);margin-top:1px">score</div>
                    </div>
                  </div>`
              }).join('')
          }
        </div>

        <!-- Temps d'attente par technicien -->
        <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:10px;padding:1.1rem 1.25rem;grid-column:1/-1">
          <div style="font-weight:600;font-size:0.8rem;color:var(--text-primary);margin-bottom:0.9rem;display:flex;align-items:center;gap:7px">
            <i class="fas fa-hourglass-start" style="color:var(--accent-orange)"></i>
            Temps d'attente par technicien
            <span style="font-size:0.65rem;color:var(--text-secondary);margin-left:auto;font-weight:400">Délai moyen panne → début intervention</span>
          </div>
          ${(charts.wait_time_per_tech||[]).filter(t => t.avg_wait_hours != null && t.sample_count > 0).length === 0
            ? `<div style="text-align:center;padding:1rem;color:var(--text-secondary);font-size:0.78rem;opacity:0.5">
                <i class="fas fa-info-circle" style="margin-right:4px"></i>
                Données insuffisantes (les interventions doivent avoir une date de panne ET une date de début)
               </div>`
            : `<div style="display:flex;gap:1.5rem;flex-wrap:wrap">
                ${(charts.wait_time_per_tech||[]).filter(t => t.avg_wait_hours != null && t.sample_count > 0).map(t => {
                  const initials = (t.technician_name||'?').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
                  const techColor = getTechColor(t.technician_name)
                  const h = t.avg_wait_hours || 0
                  const waitColor = h < 4 ? '#34d399' : h < 12 ? '#fbbf24' : '#f87171'
                  return `
                    <div style="display:flex;align-items:center;gap:10px;background:var(--bg-primary);border:1px solid var(--border);border-radius:8px;padding:0.6rem 0.85rem;min-width:180px;flex:1">
                      <div style="width:32px;height:32px;border-radius:50%;background:${techColor};display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;color:#fff">${initials}</div>
                      <div>
                        <div style="font-size:0.78rem;font-weight:600;color:var(--text-primary)">${escHtml(t.technician_name||'—')}</div>
                        <div style="font-size:0.68rem;color:var(--text-secondary)">${t.sample_count} cas mesurés</div>
                      </div>
                      <div style="margin-left:auto;text-align:right">
                        <div style="font-size:1.1rem;font-weight:800;color:${waitColor};line-height:1">${h.toFixed(1)}<span style="font-size:0.65rem;font-weight:400"> h</span></div>
                        <div style="font-size:0.6rem;color:${waitColor};margin-top:1px">${h < 4 ? 'Rapide' : h < 12 ? 'Acceptable' : 'Lent'}</div>
                      </div>
                    </div>`
                }).join('')}
              </div>`
          }
        </div>

        <!-- MTBF par technicien -->
        <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:10px;padding:1.1rem 1.25rem;grid-column:1/-1">
          <div style="font-weight:600;font-size:0.8rem;color:var(--text-primary);margin-bottom:0.3rem;display:flex;align-items:center;gap:7px">
            <i class="fas fa-history" style="color:var(--accent-purple)"></i>
            MTBF par technicien
            <span style="font-size:0.65rem;color:var(--text-secondary);margin-left:auto;font-weight:400">Interventions correctives uniquement · Moyenne des écarts entre pannes</span>
          </div>
          <div style="font-size:0.68rem;color:var(--text-secondary);margin-bottom:0.9rem;opacity:0.7">
            <i class="fas fa-info-circle" style="margin-right:4px"></i>
            MTBF = moyenne(date<sub>i+1</sub> − date<sub>i</sub>) sur toutes les interventions correctives du technicien. Si &lt;2 interventions → MTBF = 0
          </div>
          ${(charts.mtbf_per_tech||[]).length === 0
            ? `<div style="text-align:center;padding:1.5rem;color:var(--text-secondary);font-size:0.78rem;opacity:0.5">
                <i class="fas fa-info-circle" style="margin-right:4px"></i>
                Données insuffisantes (minimum 2 interventions correctives par technicien)
               </div>`
            : `<div style="display:flex;gap:1rem;flex-wrap:wrap">
                ${(charts.mtbf_per_tech||[]).map((t, idx) => {
                  const initials = getInitials(t.technician_name)
                  const techColor = getTechColor(t.technician_name)
                  const mtbf = t.mtbf_hours || 0
                  const fmt = formatMtbf(mtbf)
                  // Color: high MTBF = green (reliable), low = orange/red
                  const mtbfColor = mtbf === 0 ? '#6b7280'
                    : mtbf >= 720  ? '#34d399'   // ≥ 30 jours
                    : mtbf >= 168  ? '#3b82f6'   // ≥ 7 jours
                    : mtbf >= 48   ? '#fbbf24'   // ≥ 2 jours
                    : '#f87171'                   // < 48h
                  const label = mtbf === 0 ? 'Insuffisant'
                    : mtbf >= 720  ? 'Très fiable'
                    : mtbf >= 168  ? 'Fiable'
                    : mtbf >= 48   ? 'Acceptable'
                    : 'Fréquent'
                  return `
                    <div style="flex:1;min-width:200px;background:var(--bg-primary);border:1px solid var(--border);border-radius:10px;padding:0.9rem 1rem;display:flex;gap:12px;align-items:center;border-left:3px solid ${mtbfColor}">
                      <div style="width:36px;height:36px;border-radius:50%;background:${techColor};display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:#fff;flex-shrink:0">${initials}</div>
                      <div style="flex:1;min-width:0">
                        <div style="font-weight:700;font-size:0.82rem;color:var(--text-primary)">${escHtml(t.technician_name)}</div>
                        <div style="font-size:0.68rem;color:var(--text-secondary);margin-top:2px">
                          ${t.interventions_count} interv. corrective${t.interventions_count>1?'s':''}
                          ${t.interventions_count < 2 ? ' · <span style="color:#f87171">données insuffisantes</span>' : ''}
                        </div>
                      </div>
                      <div style="text-align:right;flex-shrink:0">
                        <div style="font-size:1.3rem;font-weight:800;color:${mtbfColor};line-height:1">
                          ${mtbf === 0 ? '—' : fmt.value}
                          <span style="font-size:0.65rem;font-weight:500;color:${mtbfColor}">${mtbf === 0 ? '' : fmt.unit}</span>
                        </div>
                        <div style="font-size:0.62rem;margin-top:3px;color:${mtbfColor};font-weight:600">${label}</div>
                        ${mtbf > 0 ? `<div style="font-size:0.58rem;color:var(--text-secondary);margin-top:1px">(${fmt.raw_hours}h brut)</div>` : ''}
                      </div>
                    </div>`
                }).join('')}
              </div>`
          }
          <!-- Légende des couleurs MTBF -->
          <div style="margin-top:0.85rem;padding-top:0.65rem;border-top:1px solid var(--border);display:flex;gap:1.25rem;flex-wrap:wrap;font-size:0.65rem;color:var(--text-secondary)">
            <span style="color:#34d399">■ Très fiable</span><span style="opacity:0.6">≥ 30 jours</span>
            <span style="color:#3b82f6">■ Fiable</span><span style="opacity:0.6">≥ 7 jours</span>
            <span style="color:#fbbf24">■ Acceptable</span><span style="opacity:0.6">≥ 48h</span>
            <span style="color:#f87171">■ Fréquent</span><span style="opacity:0.6">&lt; 48h</span>
            <span style="color:#6b7280">■ —</span><span style="opacity:0.6">&lt; 2 interventions</span>
          </div>
        </div>

      </div>
    </div>

    <!-- Map: Interventions par ville au Maroc -->
    <div style="
      margin-top:1.5rem;
      background:linear-gradient(145deg,var(--bg-secondary) 0%,rgba(99,132,255,0.04) 100%);
      border:1px solid rgba(99,132,255,0.15);
      border-radius:16px;overflow:hidden;
      box-shadow:0 4px 24px rgba(0,0,0,0.25);
      position:relative;
    ">
      <!-- Ligne accent top -->
      <div style="position:absolute;top:0;left:0;right:0;height:2px;
                  background:linear-gradient(90deg,transparent,#6384ff,rgba(99,132,255,.3),transparent);pointer-events:none"></div>

      <!-- Header premium -->
      <div style="
        padding:1.1rem 1.5rem;
        border-bottom:1px solid rgba(99,132,255,0.1);
        display:flex;align-items:center;justify-content:space-between;
        background:rgba(99,132,255,0.04);
      ">
        <div style="display:flex;align-items:center;gap:.75rem">
          <div style="
            width:34px;height:34px;border-radius:9px;
            background:rgba(99,132,255,0.15);border:1px solid rgba(99,132,255,0.25);
            display:flex;align-items:center;justify-content:center;
          ">
            <i class="fas fa-map-marked-alt" style="color:#6384ff;font-size:.85rem"></i>
          </div>
          <div>
            <div style="font-size:.68rem;text-transform:uppercase;letter-spacing:.8px;color:rgba(99,132,255,.7);font-weight:700">
              Géolocalisation
            </div>
            <div style="font-weight:700;font-size:.9rem;color:var(--text-primary)">
              Interventions par ville — Maroc
            </div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:.75rem">
          <span id="map-city-count" style="
            font-size:.7rem;color:#6384ff;font-weight:700;
            background:rgba(99,132,255,.1);border:1px solid rgba(99,132,255,.2);
            padding:3px 10px;border-radius:20px;
          "></span>
          <span style="
            font-size:.62rem;padding:3px 9px;
            background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.2);
            color:#34d399;border-radius:20px;font-weight:700;
            display:flex;align-items:center;gap:4px;
          ">
            <span style="width:5px;height:5px;border-radius:50%;background:#34d399;display:inline-block"></span>
            LIVE
          </span>
        </div>
      </div>

      <!-- Carte + ranking -->
      <div style="display:grid;grid-template-columns:1fr 310px;min-height:380px">
        <!-- Leaflet map -->
        <div id="city-map" style="height:380px;z-index:0"></div>
        <!-- City ranking list -->
        <div style="
          border-left:1px solid rgba(99,132,255,0.1);
          overflow-y:auto;max-height:380px;
          background:rgba(10,14,40,0.3);
        " id="city-ranking-list"></div>
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

  // Render charts + map after DOM is ready
  setTimeout(() => {
    renderCharts(kpis, charts)
    loadRecentInterventions()
    renderCityMap(charts.by_city || [])
  }, 100)
}

function renderCharts(kpis, charts) {
  // ── Configuration globale Chart.js — dark premium blue ──────
  Chart.defaults.color           = '#94a3b8'
  Chart.defaults.borderColor     = 'rgba(37,99,235,0.1)'
  Chart.defaults.font.family     = "'Segoe UI', system-ui, sans-serif"
  Chart.defaults.font.size       = 11

  // Détruire les charts existants
  Object.values(state.charts).forEach(c => { try { c.destroy() } catch(e){} })
  state.charts = {}

  // ── Palettes & helpers ──────────────────────────────────────
  const gridColor   = 'rgba(37,99,235,0.09)'
  const tickColor   = '#94a3b8'

  // Gradient factory
  const makeGrad = (ctx, color1, color2, vertical = true) => {
    const g = vertical
      ? ctx.createLinearGradient(0, 0, 0, ctx.canvas.height)
      : ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    g.addColorStop(0, color1)
    g.addColorStop(1, color2)
    return g
  }

  // Tooltip style commun
  const tooltipStyle = {
    backgroundColor: 'rgba(10,14,40,0.95)',
    borderColor: 'rgba(99,132,255,0.35)',
    borderWidth: 1,
    padding: 12,
    titleColor: '#e2e8f0',
    bodyColor: '#a0aec0',
    titleFont: { size: 12, weight: '700' },
    bodyFont: { size: 11 },
    cornerRadius: 10,
    displayColors: true,
    boxPadding: 4,
  }

  // Axes communs
  const axisStyle = {
    x: {
      grid: { color: gridColor, drawBorder: false },
      ticks: { color: tickColor, font: { size: 10 } },
      border: { display: false }
    },
    y: {
      grid: { color: gridColor, drawBorder: false },
      ticks: { color: tickColor, font: { size: 10 } },
      border: { display: false },
      beginAtZero: true
    }
  }

  // Legend style commun
  const legendStyle = {
    position: 'top',
    align: 'end',
    labels: {
      color: '#8892b0',
      font: { size: 10, weight: '600' },
      boxWidth: 10,
      boxHeight: 10,
      borderRadius: 3,
      usePointStyle: true,
      pointStyle: 'rectRounded',
      padding: 16
    }
  }

  // ════════════════════════════════════════════════════════════
  // 1. CHART MENSUEL — Area line + bars
  // ════════════════════════════════════════════════════════════
  const monthlyEl = document.getElementById('chart-monthly')
  if (monthlyEl && charts.by_month?.length > 0) {
    const ctx = monthlyEl.getContext('2d')
    const labels = charts.by_month.map(m => {
      const [y, mo] = m.month.split('-')
      return dayjs(`${y}-${mo}-01`).locale('fr').format('MMM YY')
    })
    const gradTotal      = makeGrad(ctx, 'rgba(37,99,235,0.7)', 'rgba(37,99,235,0.05)')
    const gradResolved   = makeGrad(ctx, 'rgba(56,189,248,0.45)', 'rgba(56,189,248,0.03)')
    const gradPreventive = makeGrad(ctx, 'rgba(99,102,241,0.45)', 'rgba(99,102,241,0.03)')

    state.charts.monthly = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total',
            data: charts.by_month.map(m => m.total),
            backgroundColor: 'rgba(37,99,235,0.75)',
            borderColor: '#1d4ed8',
            borderWidth: 1,
            borderRadius: { topLeft: 5, topRight: 5 },
            borderSkipped: false,
            order: 2,
          },
          {
            label: 'Résolues',
            data: charts.by_month.map(m => m.resolved),
            type: 'line',
            fill: true,
            backgroundColor: gradResolved,
            borderColor: '#38bdf8',
            borderWidth: 2.5,
            pointBackgroundColor: '#38bdf8',
            pointBorderColor: '#060e1f',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
            tension: 0.42,
            order: 1,
          },
          {
            label: 'Préventives',
            data: charts.by_month.map(m => m.preventive),
            type: 'line',
            fill: true,
            backgroundColor: gradPreventive,
            borderColor: '#818cf8',
            borderWidth: 2,
            pointBackgroundColor: '#818cf8',
            pointBorderColor: '#060e1f',
            pointBorderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 6,
            tension: 0.42,
            order: 0,
          },
        ]
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: legendStyle,
          tooltip: tooltipStyle,
        },
        scales: {
          x: { ...axisStyle.x },
          y: { ...axisStyle.y, ticks: { ...axisStyle.y.ticks, stepSize: 1 } }
        },
        animation: { duration: 900, easing: 'easeOutQuart' }
      }
    })
  } else if (monthlyEl) {
    monthlyEl.parentElement.innerHTML += `<div style="padding:2rem;text-align:center;color:#4a5568;font-size:.8rem"><i class="fas fa-chart-bar" style="font-size:2rem;display:block;margin-bottom:.5rem;opacity:.3"></i>Aucune donnée mensuelle</div>`
  }

  // ════════════════════════════════════════════════════════════
  // 2. STATUS — Donut premium
  // ════════════════════════════════════════════════════════════
  const statusEl = document.getElementById('chart-status')
  if (statusEl && charts.by_status?.length > 0) {
    const colorMap = {
      resolved:    '#38bdf8',
      in_progress: '#1d4ed8',
      planned:     '#6366f1',
      cancelled:   '#1e3a5f'
    }
    const labelMap = { resolved:'Résolu', in_progress:'En cours', planned:'Planifié', cancelled:'Annulé' }
    const colors = charts.by_status.map(s => colorMap[s.status] || '#2d3758')
    state.charts.status = new Chart(statusEl, {
      type: 'doughnut',
      data: {
        labels: charts.by_status.map(s => labelMap[s.status] || s.status),
        datasets: [{
          data: charts.by_status.map(s => s.count),
          backgroundColor: colors,
          hoverBackgroundColor: colors.map(c => c + 'dd'),
          borderWidth: 0,
          borderRadius: 6,
          spacing: 3,
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: { ...legendStyle, position: 'bottom', align: 'center' },
          tooltip: {
            ...tooltipStyle,
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.parsed} (${Math.round(ctx.parsed / ctx.dataset.data.reduce((a,b)=>a+b,0) * 100)}%)`
            }
          }
        },
        animation: { animateRotate: true, duration: 900 }
      }
    })
  }

  // ════════════════════════════════════════════════════════════
  // 3. PRIORITÉ — Donut premium rose/orange
  // ════════════════════════════════════════════════════════════
  const prioEl = document.getElementById('chart-priority')
  if (prioEl && charts.by_priority?.length > 0) {
    const colorMap = { critical:'#f43f5e', high:'#fb923c', medium:'#fbbf24', low:'#34d399' }
    const labelMap = { critical:'Critique', high:'Haute', medium:'Moyenne', low:'Basse' }
    const colors   = charts.by_priority.map(p => colorMap[p.priority] || '#4a5568')
    state.charts.priority = new Chart(prioEl, {
      type: 'doughnut',
      data: {
        labels: charts.by_priority.map(p => labelMap[p.priority] || p.priority),
        datasets: [{
          data: charts.by_priority.map(p => p.count),
          backgroundColor: colors,
          hoverBackgroundColor: colors.map(c => c + 'dd'),
          borderWidth: 0,
          borderRadius: 6,
          spacing: 3,
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: { ...legendStyle, position: 'bottom', align: 'center' },
          tooltip: {
            ...tooltipStyle,
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.parsed} (${Math.round(ctx.parsed / ctx.dataset.data.reduce((a,b)=>a+b,0) * 100)}%)`
            }
          }
        },
        animation: { animateRotate: true, duration: 900 }
      }
    })
  }

  // ════════════════════════════════════════════════════════════
  // 4. TOP VILLES — Bar horizontal premium BLUE
  // ════════════════════════════════════════════════════════════
  const cityEl = document.getElementById('chart-cities')
  if (cityEl && charts.by_city?.length > 0) {
    const ctx = cityEl.getContext('2d')
    const top = charts.by_city.slice(0, 8)
    const bluePalette = [
      'rgba(59,130,246,0.85)', 'rgba(37,99,235,0.8)', 'rgba(29,78,216,0.8)',
      'rgba(96,165,250,0.75)', 'rgba(147,197,253,0.7)', 'rgba(56,189,248,0.75)',
      'rgba(14,165,233,0.72)', 'rgba(2,132,199,0.70)',
    ]
    state.charts.cities = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: top.map(c => c.city || 'N/A'),
        datasets: [{
          label: 'Interventions',
          data: top.map(c => c.count),
          backgroundColor: top.map((_, i) => bluePalette[i] || 'rgba(59,130,246,0.7)'),
          borderColor: 'rgba(59,130,246,0.3)',
          borderWidth: 1,
          borderRadius: { topRight: 6, bottomRight: 6 },
          borderSkipped: 'left',
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: tooltipStyle,
        },
        scales: {
          x: { ...axisStyle.x, beginAtZero: true, ticks: { ...axisStyle.x.ticks, stepSize: 1 } },
          y: { grid: { display: false }, ticks: { color: tickColor, font: { size: 10 }, mirror: false }, border: { display: false } }
        },
        animation: { duration: 800, easing: 'easeOutQuart' }
      }
    })
  }

  // ════════════════════════════════════════════════════════════
  // 5. PERFORMANCE TECHNICIENS — Bar groupé premium BLUE
  // ════════════════════════════════════════════════════════════
  const techEl = document.getElementById('chart-technicians')
  if (techEl && charts.top_technicians?.length > 0) {
    state.charts.technicians = new Chart(techEl, {
      type: 'bar',
      data: {
        labels: charts.top_technicians.map(t => t.technician_name || 'N/A'),
        datasets: [
          {
            label: 'Total',
            data: charts.top_technicians.map(t => t.total),
            backgroundColor: 'rgba(59,130,246,0.78)',
            borderColor: 'rgba(59,130,246,0.45)',
            borderWidth: 1,
            borderRadius: { topLeft: 5, topRight: 5 },
            borderSkipped: false,
          },
          {
            label: 'Résolues',
            data: charts.top_technicians.map(t => t.resolved),
            backgroundColor: 'rgba(96,165,250,0.65)',
            borderColor: 'rgba(96,165,250,0.4)',
            borderWidth: 1,
            borderRadius: { topLeft: 5, topRight: 5 },
            borderSkipped: false,
          },
        ]
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: legendStyle,
          tooltip: tooltipStyle,
        },
        scales: {
          x: { ...axisStyle.x },
          y: { ...axisStyle.y }
        },
        animation: { duration: 800 }
      }
    })
  }

  // ════════════════════════════════════════════════════════════
  // 6. TOP CLIENTS — Bar horizontal premium BLUE
  // ════════════════════════════════════════════════════════════
  const clientEl = document.getElementById('chart-clients')
  if (clientEl && charts.by_client?.length > 0) {
    const top = charts.by_client.slice(0, 7)
    state.charts.clients = new Chart(clientEl, {
      type: 'bar',
      data: {
        labels: top.map(c => (c.client || 'N/A').slice(0, 18)),
        datasets: [
          {
            label: 'Total',
            data: top.map(c => c.total),
            backgroundColor: 'rgba(37,99,235,0.78)',
            borderColor: 'rgba(37,99,235,0.35)',
            borderWidth: 1,
            borderRadius: { topLeft: 5, topRight: 5 },
            borderSkipped: false,
          },
          {
            label: 'Résolues',
            data: top.map(c => c.resolved),
            backgroundColor: 'rgba(56,189,248,0.68)',
            borderColor: 'rgba(56,189,248,0.35)',
            borderWidth: 1,
            borderRadius: { topLeft: 5, topRight: 5 },
            borderSkipped: false,
          },
        ]
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: legendStyle,
          tooltip: tooltipStyle,
        },
        scales: {
          x: { ...axisStyle.x },
          y: { ...axisStyle.y, ticks: { ...axisStyle.y.ticks, stepSize: 1 } }
        },
        animation: { duration: 800 }
      }
    })
  }

  // ════════════════════════════════════════════════════════════
  // 7. TOP ÉQUIPEMENTS — Bar horizontal premium BLUE
  // ════════════════════════════════════════════════════════════
  const equipEl = document.getElementById('chart-equipment')
  if (equipEl && charts.by_equipment?.length > 0) {
    const top = charts.by_equipment.slice(0, 7)
    state.charts.equipment = new Chart(equipEl, {
      type: 'bar',
      data: {
        labels: top.map(e => (e.equipment || 'N/A').slice(0, 20)),
        datasets: [
          {
            label: 'Pannes',
            data: top.map(e => e.total),
            backgroundColor: 'rgba(29,78,216,0.8)',
            borderColor: 'rgba(29,78,216,0.4)',
            borderWidth: 1,
            borderRadius: { topRight: 6, bottomRight: 6 },
            borderSkipped: 'left',
          },
          {
            label: 'Arrêts prod.',
            data: top.map(e => e.with_downtime),
            backgroundColor: 'rgba(99,102,241,0.7)',
            borderColor: 'rgba(99,102,241,0.35)',
            borderWidth: 1,
            borderRadius: { topRight: 6, bottomRight: 6 },
            borderSkipped: 'left',
          },
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: legendStyle,
          tooltip: tooltipStyle,
        },
        scales: {
          x: { ...axisStyle.x, beginAtZero: true },
          y: { grid: { display: false }, ticks: { color: tickColor, font: { size: 10 } }, border: { display: false } }
        },
        animation: { duration: 800 }
      }
    })
  }
}

// ============================================================
// CITY MAP — Leaflet.js — Interventions par ville au Maroc
// ============================================================

// Coordonnées des principales villes marocaines
const MOROCCO_CITIES_GEO = {
  'agadir':          [30.4278, -9.5981],
  'casablanca':      [33.5731, -7.5898],
  'rabat':           [34.0209, -6.8416],
  'fès':             [34.0181,  -5.0078],
  'fes':             [34.0181,  -5.0078],
  'marrakech':       [31.6295, -7.9811],
  'tanger':          [35.7595, -5.8340],
  'meknes':          [33.8935, -5.5473],
  'oujda':           [34.6814, -1.9086],
  'kénitra':         [34.2610, -6.5802],
  'kenitra':         [34.2610, -6.5802],
  'tétouan':         [35.5785, -5.3684],
  'tetouan':         [35.5785, -5.3684],
  'safi':            [32.2994, -9.2372],
  'el jadida':       [33.2316, -8.5007],
  'beni mellal':     [32.3372, -6.3498],
  'nador':           [35.1740, -2.9287],
  'settat':          [33.0011, -7.6167],
  'berrechid':       [33.2655, -7.5893],
  'khouribga':       [32.8811, -6.9063],
  'ouarzazate':      [30.9335, -6.9370],
  'laayoune':        [27.1536, -13.2033],
  'dakhla':          [23.6847, -15.9572],
  'essaouira':       [31.5125, -9.7700],
  'ifrane':          [33.5228, -5.1128],
  'khemisset':       [33.8239, -6.0659],
  'errachidia':      [31.9314, -4.4249],
  'guelmim':         [28.9864, -10.0572],
  'guélmim':         [28.9864, -10.0572],
  'taroudant':       [30.4702, -8.8774],
  'tiznit':          [29.6974, -9.7316],
  'azrou':           [33.4341, -5.2228],
  'taza':            [34.2100, -4.0100],
  'al hoceima':      [35.2517, -3.9372],
  'larache':         [35.1932, -6.1561],
  'sidi kacem':      [34.2231, -5.7071],
  'sidi slimane':    [34.2639, -5.9244],
  'souk el arbaa':   [34.6987, -5.9893],
  'berkane':         [34.9200, -2.3200],
  'taourirt':        [34.4076, -2.8938],
  'figuig':          [32.1095,  1.2293],
  'midelt':          [32.6800, -4.7300],
  'tinghir':         [31.5228, -5.5325],
  'zagora':          [30.3322, -5.8380],
  'chefchaouen':     [35.1688, -5.2686],
  'moulay idriss':   [34.0567, -5.5264],
  'ifni':            [29.3797, -10.1729],
  'tan tan':         [28.4380, -11.1030],
  'sidi ifni':       [29.3797, -10.1729],
  'ait melloul':     [30.3350, -9.4980],
  'inezgane':        [30.3558, -9.5394],
  'dcheira':         [30.3811, -9.5372],
  'temara':          [33.9283, -6.9166],
  'sale':            [34.0531, -6.7985],
  'salé':            [34.0531, -6.7985],
}

function getCityCoords(cityName) {
  if (!cityName) return null
  const key = cityName.trim().toLowerCase()
    .replace(/é/g,'e').replace(/è/g,'e').replace(/ê/g,'e')
    .replace(/â/g,'a').replace(/î/g,'i').replace(/ô/g,'o').replace(/û/g,'u')
    .replace(/ç/g,'c')
  // Exact match
  if (MOROCCO_CITIES_GEO[key]) return MOROCCO_CITIES_GEO[key]
  // Normalized key
  const normKey = cityName.trim().toLowerCase()
  if (MOROCCO_CITIES_GEO[normKey]) return MOROCCO_CITIES_GEO[normKey]
  // Partial match
  for (const [k, v] of Object.entries(MOROCCO_CITIES_GEO)) {
    if (k.includes(key) || key.includes(k)) return v
  }
  return null
}

let _leafletMap = null

function renderCityMap(cityData) {
  const mapEl  = document.getElementById('city-map')
  const listEl = document.getElementById('city-ranking-list')
  if (!mapEl || !listEl) return

  // Villes avec coordonnées
  const cities = cityData
    .map(c => ({ ...c, coords: getCityCoords(c.city) }))
    .filter(c => c.coords)

  // Counter header
  const countEl = document.getElementById('map-city-count')
  if (countEl) {
    const totalInterv = cityData.reduce((s, c) => s + c.count, 0)
    countEl.textContent = `${cityData.length} ville${cityData.length > 1 ? 's' : ''} · ${totalInterv} intervention${totalInterv > 1 ? 's' : ''}`
  }

  // Détruire l'ancienne carte
  if (_leafletMap) { _leafletMap.remove(); _leafletMap = null }

  // Init Leaflet — centré Maroc
  _leafletMap = L.map('city-map', {
    center:          [31.0, -6.5],
    zoom:            5,
    zoomControl:     false,
    scrollWheelZoom: false,
    attributionControl: true,
  })

  // Zoom control positionné à droite en bas
  L.control.zoom({ position: 'bottomright' }).addTo(_leafletMap)

  // Tile dark premium (CartoDB Positron Dark)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '<span style="font-size:.6rem;opacity:.4">Leaflet | © OpenStreetMap © CARTO</span>',
    subdomains: 'abcd',
    maxZoom: 18,
  }).addTo(_leafletMap)

  if (!cities.length) {
    listEl.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                  height:100%;padding:2.5rem 1.5rem;text-align:center">
        <i class="fas fa-map-marked-alt" style="font-size:2rem;color:rgba(99,132,255,.25);display:block;margin-bottom:.75rem"></i>
        <p style="font-size:.78rem;color:rgba(148,163,184,.4);margin:0">Aucune ville géolocalisable</p>
      </div>`
    return
  }

  const maxCount = Math.max(...cities.map(c => c.count))
  const total    = cityData.reduce((s, c) => s + c.count, 0)

  // Palette de couleurs premium selon intensité
  function markerColor(count) {
    const r = count / maxCount
    if (r >= 0.8) return { fill: '#f43f5e', glow: 'rgba(244,63,94,0.5)' }
    if (r >= 0.55) return { fill: '#fb923c', glow: 'rgba(251,146,60,0.45)' }
    if (r >= 0.3) return { fill: '#fbbf24', glow: 'rgba(251,191,36,0.4)' }
    return { fill: '#6384ff', glow: 'rgba(99,132,255,0.4)' }
  }

  // Markers avec halo pulsant (DivIcon)
  cities.forEach(c => {
    const col    = markerColor(c.count)
    const radius = Math.round(10 + (c.count / maxCount) * 24)
    const pct    = total > 0 ? ((c.count / total) * 100).toFixed(1) : '0.0'

    const icon = L.divIcon({
      className: '',
      iconSize:  [radius * 2, radius * 2],
      iconAnchor:[radius, radius],
      html: `
        <div style="
          width:${radius*2}px;height:${radius*2}px;
          border-radius:50%;
          background:${col.fill};
          border:2px solid rgba(255,255,255,0.25);
          box-shadow:0 0 0 4px ${col.glow}, 0 0 18px ${col.glow};
          display:flex;align-items:center;justify-content:center;
          font-size:${radius > 18 ? '0.7' : '0.6'}rem;
          font-weight:800;color:#fff;
          cursor:pointer;
          transition:transform .15s;
        " title="${c.city} — ${c.count} interventions">
          ${c.count}
        </div>`
    })

    const marker = L.marker(c.coords, { icon }).addTo(_leafletMap)

    // Popup dark premium
    marker.bindPopup(`
      <div style="
        font-family:'Segoe UI',sans-serif;
        background:#0a0e28;color:#e2e8f0;
        border-radius:10px;min-width:160px;
        padding:0;overflow:hidden;
      ">
        <div style="
          padding:.6rem .9rem;
          background:linear-gradient(135deg,rgba(99,132,255,.15),rgba(99,132,255,.05));
          border-bottom:1px solid rgba(99,132,255,.15);
        ">
          <div style="font-size:.65rem;text-transform:uppercase;letter-spacing:.8px;color:rgba(99,132,255,.8);font-weight:700;margin-bottom:2px">
            <i class="fas fa-map-marker-alt" style="margin-right:4px"></i>Ville
          </div>
          <div style="font-weight:800;font-size:.95rem;color:#f8fafc">${c.city}</div>
        </div>
        <div style="padding:.6rem .9rem">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem">
            <span style="font-size:.7rem;color:rgba(148,163,184,.7)">Interventions</span>
            <span style="font-size:1.1rem;font-weight:800;color:${col.fill}">${c.count}</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:.7rem;color:rgba(148,163,184,.7)">Part du total</span>
            <span style="font-size:.8rem;font-weight:700;color:rgba(255,255,255,.7)">${pct}%</span>
          </div>
          <div style="margin-top:.5rem;height:3px;border-radius:2px;background:rgba(255,255,255,.08)">
            <div style="height:100%;width:${pct}%;background:${col.fill};border-radius:2px"></div>
          </div>
        </div>
      </div>
    `, {
      maxWidth: 220,
      className: 'map-popup-dark',
    })

    marker.on('mouseover', function() { this.openPopup() })
  })

  // CSS popup dark (injecté une seule fois)
  if (!document.getElementById('map-popup-style')) {
    const style = document.createElement('style')
    style.id = 'map-popup-style'
    style.textContent = `
      .map-popup-dark .leaflet-popup-content-wrapper {
        background:#0a0e28 !important;
        border:1px solid rgba(99,132,255,0.25) !important;
        border-radius:12px !important;
        box-shadow:0 8px 32px rgba(0,0,0,.6), 0 0 0 1px rgba(99,132,255,0.15) !important;
        padding:0 !important;
        overflow:hidden !important;
      }
      .map-popup-dark .leaflet-popup-content {
        margin:0 !important;
        border-radius:12px !important;
        overflow:hidden !important;
      }
      .map-popup-dark .leaflet-popup-tip-container { display:none }
      .leaflet-control-zoom a {
        background:rgba(10,14,40,0.92) !important;
        border:1px solid rgba(99,132,255,0.2) !important;
        color:#a0aec0 !important;
        border-radius:8px !important;
      }
      .leaflet-control-zoom a:hover {
        background:rgba(99,132,255,0.15) !important;
        color:#6384ff !important;
      }
      .leaflet-control-zoom {
        border:none !important;
        box-shadow:0 4px 16px rgba(0,0,0,0.4) !important;
      }
      .leaflet-control-attribution {
        background:rgba(10,14,40,0.7) !important;
        color:rgba(148,163,184,.4) !important;
        font-size:.55rem !important;
        border-radius:6px 0 0 0 !important;
      }
      .leaflet-control-attribution a { color:rgba(99,132,255,.5) !important; }
    `
    document.head.appendChild(style)
  }

  // ── Ranking list premium ───────────────────────────────────
  const palette = ['#f43f5e','#fb923c','#fbbf24','#6384ff','#a78bfa','#34d399','#06b6d4','#ec4899']

  listEl.innerHTML = `
    <div style="padding:.75rem 1rem .4rem;border-bottom:1px solid rgba(99,132,255,.08)">
      <div style="font-size:.62rem;text-transform:uppercase;letter-spacing:.8px;color:rgba(99,132,255,.6);font-weight:700">
        <i class="fas fa-trophy" style="margin-right:5px"></i>Classement
      </div>
    </div>
    ${cityData.map((c, idx) => {
      const pct     = total > 0 ? ((c.count / total) * 100).toFixed(1) : '0.0'
      const col     = palette[idx % palette.length]
      const hasCoord= !!getCityCoords(c.city)
      const coords  = getCityCoords(c.city)
      const medal   = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null
      return `
        <div style="
          display:flex;align-items:center;gap:.7rem;
          padding:.7rem 1rem;
          border-bottom:1px solid rgba(99,132,255,.07);
          cursor:${hasCoord ? 'pointer' : 'default'};
          transition:background .15s;
        "
        onmouseover="this.style.background='rgba(99,132,255,.07)'"
        onmouseout="this.style.background='transparent'"
        ${hasCoord && coords ? `onclick="flyToCity('${c.city.replace(/'/g,"\\'")}',${coords[0]},${coords[1]})"` : ''}>

          <!-- Rang -->
          <div style="
            width:26px;height:26px;border-radius:7px;
            background:${col}22;border:1px solid ${col}44;
            display:flex;align-items:center;justify-content:center;
            font-weight:800;font-size:.72rem;color:${col};flex-shrink:0;
          ">${medal || (idx + 1)}</div>

          <!-- Nom + barre -->
          <div style="flex:1;min-width:0">
            <div style="
              font-weight:600;font-size:.8rem;
              color:var(--text-primary);
              white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
              display:flex;align-items:center;gap:.35rem;
            ">
              ${escHtml(c.city)}
              ${!hasCoord ? '<i class="fas fa-question-circle" style="font-size:.6rem;color:rgba(148,163,184,.3)" title="Coordonnées inconnues"></i>' : ''}
            </div>
            <div style="margin-top:.35rem;height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden">
              <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,${col},${col}88);border-radius:2px;transition:width .5s .1s"></div>
            </div>
          </div>

          <!-- Valeurs -->
          <div style="text-align:right;flex-shrink:0">
            <div style="font-weight:800;font-size:.88rem;color:${col};line-height:1">${c.count}</div>
            <div style="font-size:.62rem;color:rgba(148,163,184,.5);margin-top:2px">${pct}%</div>
          </div>
        </div>`
    }).join('')}
  `
}

function flyToCity(name, lat, lng) {
  if (!_leafletMap) return
  _leafletMap.flyTo([lat, lng], 9, { duration: 1.4, easeLinearity: 0.25 })
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
        ${data.data.map(t => {
          const total     = t.total_interventions || 0
          const assistant = t.assistant_interventions || 0
          const resolved  = t.resolved_count || 0
          const rate      = t.resolution_rate || 0
          const quality   = t.avg_quality || 0
          const duration  = t.avg_duration || 0
          const rateColor = rate >= 75 ? 'var(--accent-green)' : rate >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)'
          return `
          <div class="tech-card">
            <!-- Header -->
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

            <!-- Stats grid 2x2 -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:0.75rem">

              <!-- Interventions responsable -->
              <div style="background:var(--bg-primary);border-radius:8px;padding:0.65rem;text-align:center;
                          border:1px solid rgba(79,158,248,0.15)">
                <div style="font-size:1.5rem;font-weight:800;color:var(--accent-blue);line-height:1">${total}</div>
                <div style="font-size:0.6rem;color:var(--text-secondary);text-transform:uppercase;
                            letter-spacing:.5px;margin-top:3px">Interventions</div>
                ${assistant > 0 ? `<div style="font-size:0.6rem;color:rgba(79,158,248,0.5);margin-top:2px">
                  +${assistant} assistant</div>` : ''}
              </div>

              <!-- Taux de résolution -->
              <div style="background:var(--bg-primary);border-radius:8px;padding:0.65rem;text-align:center;
                          border:1px solid rgba(52,211,153,0.15)">
                <div style="font-size:1.5rem;font-weight:800;color:${rateColor};line-height:1">${rate}%</div>
                <div style="font-size:0.6rem;color:var(--text-secondary);text-transform:uppercase;
                            letter-spacing:.5px;margin-top:3px">Résolution</div>
                <div style="font-size:0.6rem;color:rgba(255,255,255,0.3);margin-top:2px">
                  ${resolved}/${total} résolues</div>
              </div>

              <!-- Note qualité -->
              <div style="background:var(--bg-primary);border-radius:8px;padding:0.65rem;text-align:center;
                          border:1px solid rgba(251,191,36,0.15)">
                <div style="font-size:1.5rem;font-weight:800;color:var(--accent-yellow);line-height:1">
                  ${quality > 0 ? quality : '—'}</div>
                <div style="font-size:0.6rem;color:var(--text-secondary);text-transform:uppercase;
                            letter-spacing:.5px;margin-top:3px">Qualité /10</div>
                ${quality > 0 ? `
                <div style="margin-top:4px;height:3px;border-radius:2px;background:rgba(255,255,255,0.08)">
                  <div style="height:100%;width:${quality*10}%;background:var(--accent-yellow);border-radius:2px"></div>
                </div>` : ''}
              </div>

              <!-- Durée moy -->
              <div style="background:var(--bg-primary);border-radius:8px;padding:0.65rem;text-align:center;
                          border:1px solid rgba(167,139,250,0.15)">
                <div style="font-size:1.5rem;font-weight:800;color:var(--accent-purple);line-height:1">
                  ${duration > 0 ? duration : '—'}</div>
                <div style="font-size:0.6rem;color:var(--text-secondary);text-transform:uppercase;
                            letter-spacing:.5px;margin-top:3px">Durée moy (h)</div>
              </div>
            </div>

            <!-- Barre résolution -->
            ${total > 0 ? `
            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.68rem;
                          color:var(--text-secondary);margin-bottom:3px">
                <span><i class="fas fa-chart-line"></i> Taux de résolution</span>
                <span style="color:${rateColor};font-weight:600">${rate}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${rate}%;background:${rateColor}"></div>
              </div>
            </div>` : `
            <div style="text-align:center;padding:0.5rem;font-size:0.72rem;
                        color:rgba(255,255,255,0.2);font-style:italic">
              Aucune intervention assignée
            </div>`}

            <!-- Contact -->
            ${t.email ? `<div style="margin-top:0.5rem;font-size:0.72rem;color:var(--text-secondary)">
              <i class="fas fa-envelope" style="width:14px;opacity:.6"></i> ${escHtml(t.email)}</div>` : ''}
            ${t.phone ? `<div style="font-size:0.72rem;color:var(--text-secondary)">
              <i class="fas fa-phone" style="width:14px;opacity:.6"></i> ${escHtml(t.phone)}</div>` : ''}
          </div>`
        }).join('')}
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
// ============================================================
// EQUIPMENT PAGE
// ============================================================
async function renderEquipment() {
  const container = document.getElementById('page-container')
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 style="font-size:1.2rem;font-weight:700;display:flex;align-items:center;gap:8px">
          <i class="fas fa-cogs" style="color:var(--accent-blue)"></i>
          Équipements
          <span id="eq-count-badge" style="background:var(--accent-blue);color:#fff;font-size:0.7rem;padding:2px 8px;border-radius:999px;font-weight:600">…</span>
        </h1>
        <p style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px">Parc machines et équipements</p>
      </div>
      <button class="btn btn-primary" onclick="openEquipmentModal()">
        <i class="fas fa-plus"></i> Ajouter équipement
      </button>
    </div>

    <!-- Filter bar -->
    <div style="background:var(--bg-secondary);border-bottom:1px solid var(--border);padding:0.75rem 1.5rem;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
      <input id="eq-search" type="text" class="input input-sm" placeholder="🔍 Nom / référence..." style="width:220px" oninput="debounceEqLoad()">
      <select id="eq-filter-category" class="select input-sm" style="width:160px" onchange="loadEquipment()">
        <option value="">Catégorie</option>
      </select>
      <select id="eq-filter-client" class="select input-sm" style="width:180px" onchange="loadEquipment()">
        <option value="">Tous les clients</option>
        ${(state.clients?.data||[]).map(c=>`<option value="${escHtml(c.name)}">${escHtml(c.name)}</option>`).join('')}
      </select>
      <input id="eq-filter-city" type="text" class="input input-sm" placeholder="Ville…" style="width:130px" oninput="debounceEqLoad()">
      <select id="eq-filter-status" class="select input-sm" style="width:150px" onchange="loadEquipment()">
        <option value="">Tous les statuts</option>
        <option value="operational">Opérationnel</option>
        <option value="out_of_service">Hors service</option>
        <option value="maintenance">En maintenance</option>
      </select>
      <button class="btn btn-ghost btn-sm" onclick="resetEqFilters()" id="eq-reset-btn" style="display:none">
        <i class="fas fa-times"></i> Réinitialiser
      </button>
    </div>

    <div class="page-content">
      <div id="equipment-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem;padding:1.25rem 1.5rem">
        <div class="loading-overlay"><span class="loader"></span></div>
      </div>
    </div>
  `
  // Populate category options after load
  await loadEquipment()
}

let _eqDebTimer = null
function debounceEqLoad() {
  clearTimeout(_eqDebTimer)
  _eqDebTimer = setTimeout(loadEquipment, 350)
}

function resetEqFilters() {
  document.getElementById('eq-search').value = ''
  document.getElementById('eq-filter-category').value = ''
  document.getElementById('eq-filter-client').value = ''
  document.getElementById('eq-filter-city').value = ''
  document.getElementById('eq-filter-status').value = ''
  loadEquipment()
}

async function loadEquipment() {
  const el = document.getElementById('equipment-grid')
  if (!el) return

  const q        = document.getElementById('eq-search')?.value || ''
  const category = document.getElementById('eq-filter-category')?.value || ''
  const client   = document.getElementById('eq-filter-client')?.value || ''
  const city     = document.getElementById('eq-filter-city')?.value || ''
  const status   = document.getElementById('eq-filter-status')?.value || ''

  // Show/hide reset button
  const activeFilters = [q, category, client, city, status].filter(Boolean).length
  const resetBtn = document.getElementById('eq-reset-btn')
  if (resetBtn) resetBtn.style.display = activeFilters > 0 ? '' : 'none'

  try {
    const params = new URLSearchParams()
    if (q)        params.set('q', q)
    if (category) params.set('category', category)
    if (client)   params.set('client', client)
    if (city)     params.set('city', city)
    if (status)   params.set('status', status)
    const url = `${API.equipment}${params.toString() ? '?' + params.toString() : ''}`
    const data = await http.get(url)
    state.equipment.data = data.data || []

    // Update count badge
    const badge = document.getElementById('eq-count-badge')
    if (badge) badge.textContent = state.equipment.data.length

    // Populate category dropdown dynamically
    const catSel = document.getElementById('eq-filter-category')
    if (catSel && catSel.options.length <= 1) {
      const cats = [...new Set(state.equipment.data.map(e => e.category).filter(Boolean))]
      cats.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c; catSel.appendChild(o) })
    }

    if (!state.equipment.data.length) {
      el.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-secondary)">
          <i class="fas fa-cogs" style="font-size:2.5rem;opacity:0.3;display:block;margin-bottom:1rem"></i>
          <p style="font-size:0.95rem">Aucun équipement trouvé</p>
        </div>`
      return
    }
    el.innerHTML = state.equipment.data.map(eq => renderEquipmentCard(eq)).join('')
  } catch(e) {
    el.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-secondary)"><i class="fas fa-exclamation-circle"></i><p>Erreur de chargement</p></div>`
  }
}

function renderEquipmentCard(eq) {
  const statusConfig = {
    operational:   { label: 'Opérationnel',   color: '#16a34a', bg: 'rgba(22,163,74,0.12)',  icon: 'fa-check-circle' },
    out_of_service:{ label: 'Hors service',    color: '#dc2626', bg: 'rgba(220,38,38,0.12)',  icon: 'fa-times-circle' },
    maintenance:   { label: 'En maintenance',  color: '#ca8a04', bg: 'rgba(202,138,4,0.12)',  icon: 'fa-tools' },
  }
  const sc = statusConfig[eq.status] || statusConfig.operational
  const categoryColor = getCategoryColor(eq.category)

  return `
    <div class="eq-card" style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:10px;overflow:hidden;cursor:pointer;transition:all 0.18s;display:flex;flex-direction:column"
         onclick="openEquipmentDetail(${eq.id})"
         onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,0.15)'"
         onmouseleave="this.style.transform='';this.style.boxShadow=''">
      <!-- Card top accent -->
      <div style="height:4px;background:${categoryColor}"></div>
      <div style="padding:1rem;flex:1;display:flex;flex-direction:column;gap:0.6rem">
        <!-- Header row -->
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:0.92rem;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${escHtml(eq.name)}">${escHtml(eq.name)}</div>
            ${eq.reference ? `<div style="font-size:0.72rem;color:var(--text-secondary);margin-top:2px;font-family:monospace">${escHtml(eq.reference)}</div>` : ''}
          </div>
          <span style="background:${sc.bg};color:${sc.color};font-size:0.68rem;font-weight:600;padding:3px 8px;border-radius:999px;white-space:nowrap;flex-shrink:0">
            <i class="fas ${sc.icon}" style="margin-right:3px"></i>${sc.label}
          </span>
        </div>

        <!-- Category chip -->
        ${eq.category ? `
          <div style="display:inline-flex;align-items:center;gap:5px;background:${categoryColor}22;color:${categoryColor};font-size:0.7rem;font-weight:600;padding:3px 9px;border-radius:5px;align-self:flex-start">
            <i class="fas fa-tag" style="font-size:0.65rem"></i>${escHtml(eq.category)}
          </div>` : ''}

        <!-- Info rows -->
        <div style="display:flex;flex-direction:column;gap:5px;margin-top:2px">
          ${eq.client ? `
            <div style="display:flex;align-items:center;gap:6px;font-size:0.75rem;color:var(--text-secondary)">
              <i class="fas fa-building" style="width:14px;color:var(--accent-blue);opacity:0.8"></i>
              <span style="color:var(--text-primary);font-weight:500">${escHtml(eq.client)}</span>
            </div>` : ''}
          ${eq.city ? `
            <div style="display:flex;align-items:center;gap:6px;font-size:0.75rem;color:var(--text-secondary)">
              <i class="fas fa-map-marker-alt" style="width:14px;color:var(--accent-orange);opacity:0.8"></i>
              <span>${escHtml(eq.city)}</span>
            </div>` : ''}
          ${eq.location ? `
            <div style="display:flex;align-items:center;gap:6px;font-size:0.75rem;color:var(--text-secondary)">
              <i class="fas fa-map-pin" style="width:14px;opacity:0.6"></i>
              <span>${escHtml(eq.location)}</span>
            </div>` : ''}
        </div>
      </div>

      <!-- Card footer -->
      <div style="padding:0.55rem 1rem;border-top:1px solid var(--border);background:var(--bg-tertiary,var(--bg-primary));display:flex;align-items:center;justify-content:space-between">
        <div style="font-size:0.7rem;color:var(--text-secondary)">
          ${eq.last_maintenance_date
            ? `<i class="fas fa-wrench" style="margin-right:4px;color:var(--accent-blue)"></i>Maint.: ${prettyDate(eq.last_maintenance_date)}`
            : eq.installation_date
              ? `<i class="fas fa-calendar-plus" style="margin-right:4px;opacity:0.5"></i>Inst.: ${prettyDate(eq.installation_date)}`
              : `<span style="opacity:0.4">Pas de date</span>`}
        </div>
        <div style="display:flex;gap:4px" onclick="event.stopPropagation()">
          <button class="btn btn-ghost btn-sm btn-icon" title="Modifier" onclick="openEquipmentModal(${eq.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm btn-icon" title="Supprimer" onclick="confirmDeleteEquipment(${eq.id},'${escHtml(eq.name)}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `
}

function getCategoryColor(cat) {
  if (!cat) return '#6b7280'
  const map = {
    'pompe': '#2563eb', 'pump': '#2563eb',
    'compresseur': '#7c3aed', 'variateur': '#0891b2',
    'électrique': '#ca8a04', 'electrique': '#ca8a04',
    'moteur': '#ea580c', 'coffret': '#16a34a',
    'hydraulique': '#0284c7', 'pneumatique': '#6d28d9',
  }
  const key = cat.toLowerCase()
  for (const [k, v] of Object.entries(map)) if (key.includes(k)) return v
  // Generate stable color from string
  let h = 0; for (let i=0;i<cat.length;i++) h = (h*31+cat.charCodeAt(i))&0xffff
  const hue = h % 360
  return `hsl(${hue},55%,45%)`
}

async function openEquipmentDetail(id) {
  let eq, interventions
  try {
    eq = await http.get(`${API.equipment}/${id}`)
    const r = await http.get(`${API.interventions}?q=${encodeURIComponent(eq.name)}&limit=50`)
    interventions = r.data || []
  } catch(e) { showToast('Erreur de chargement', 'error'); return }

  const sc = { operational:{l:'Opérationnel',c:'#16a34a',ic:'fa-check-circle'}, out_of_service:{l:'Hors service',c:'#dc2626',ic:'fa-times-circle'}, maintenance:{l:'En maintenance',c:'#ca8a04',ic:'fa-tools'} }
  const s = sc[eq.status] || sc.operational
  const catColor = getCategoryColor(eq.category)

  const modal = document.getElementById('modal-container')
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal modal-lg" style="max-width:680px">
        <div class="modal-header" style="background:var(--bg-secondary);border-bottom:1px solid var(--border);padding:1.25rem 1.5rem">
          <div style="display:flex;align-items:center;gap:12px;flex:1;min-width:0">
            <div style="width:44px;height:44px;border-radius:10px;background:${catColor}22;display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <i class="fas fa-cog" style="color:${catColor};font-size:1.2rem"></i>
            </div>
            <div style="min-width:0">
              <div style="font-weight:700;font-size:1rem;color:var(--text-primary)">${escHtml(eq.name)}</div>
              <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap">
                ${eq.reference ? `<span style="font-size:0.7rem;background:var(--bg-primary);border:1px solid var(--border);padding:1px 7px;border-radius:4px;font-family:monospace;color:var(--text-secondary)">${escHtml(eq.reference)}</span>` : ''}
                ${eq.category ? `<span style="font-size:0.7rem;background:${catColor}22;color:${catColor};padding:1px 8px;border-radius:4px;font-weight:600">${escHtml(eq.category)}</span>` : ''}
                <span style="font-size:0.7rem;background:${s.c}22;color:${s.c};padding:1px 8px;border-radius:999px;font-weight:600"><i class="fas ${s.ic}" style="margin-right:3px"></i>${s.l}</span>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0">
            <button class="btn btn-ghost btn-sm" onclick="openEquipmentModal(${eq.id})"><i class="fas fa-edit"></i> Modifier</button>
            <button class="btn btn-ghost btn-sm btn-icon" onclick="closeModalAll()"><i class="fas fa-times"></i></button>
          </div>
        </div>
        <div class="modal-body" style="padding:1.25rem 1.5rem;overflow-y:auto;max-height:65vh">
          <!-- Info grid -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
            ${infoBlock('fa-building','Client', eq.client || '—')}
            ${infoBlock('fa-map-marker-alt','Ville', eq.city || '—')}
            ${infoBlock('fa-map-pin','Emplacement', eq.location || '—')}
            ${infoBlock('fa-calendar-plus','Date d\'installation', prettyDate(eq.installation_date) || '—')}
            ${infoBlock('fa-wrench','Dernière maintenance', prettyDate(eq.last_maintenance_date) || '—')}
          </div>
          ${eq.notes ? `
            <div style="background:var(--bg-primary);border:1px solid var(--border);border-radius:8px;padding:0.85rem 1rem;margin-bottom:1.5rem;font-size:0.82rem;color:var(--text-secondary);line-height:1.6">
              <div style="font-weight:600;color:var(--text-primary);margin-bottom:4px"><i class="fas fa-sticky-note" style="margin-right:5px;color:var(--accent-blue)"></i>Notes</div>
              ${escHtml(eq.notes)}
            </div>` : ''}

          <!-- Interventions -->
          <div style="margin-top:0.5rem">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:0.75rem">
              <span style="font-weight:700;font-size:0.88rem;color:var(--text-primary)"><i class="fas fa-tools" style="margin-right:6px;color:var(--accent-orange)"></i>Interventions</span>
              <span style="background:var(--accent-orange);color:#fff;font-size:0.68rem;padding:2px 8px;border-radius:999px;font-weight:600">${interventions.length}</span>
            </div>
            ${!interventions.length ? `<div style="text-align:center;padding:1.5rem;color:var(--text-secondary);font-size:0.82rem;opacity:0.6"><i class="fas fa-inbox" style="display:block;font-size:1.5rem;margin-bottom:6px"></i>Aucune intervention liée</div>` :
              interventions.map(i => {
                const sc2 = {resolved:'#16a34a',in_progress:'#2563eb',planned:'#7c3aed',cancelled:'#6b7280'}
                const sl2 = {resolved:'Résolu',in_progress:'En cours',planned:'Planifié',cancelled:'Annulé'}
                const pc2 = {critical:'#dc2626',high:'#ea580c',medium:'#ca8a04',low:'#16a34a'}
                return `
                  <div style="display:flex;align-items:center;gap:10px;padding:0.6rem 0;border-bottom:1px solid var(--border)" onclick="openInterventionDetail(${JSON.stringify(i).replace(/"/g,'&quot;')})">
                    <div style="width:8px;height:8px;border-radius:50%;background:${pc2[i.priority]||'#6b7280'};flex-shrink:0"></div>
                    <div style="flex:1;min-width:0">
                      <div style="font-size:0.78rem;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escHtml(i.title)}</div>
                      <div style="font-size:0.68rem;color:var(--text-secondary);margin-top:2px">${escHtml(i.reference||'')} • ${prettyDate(i.start_date||i.failure_date)}</div>
                    </div>
                    <span style="font-size:0.68rem;background:${sc2[i.status]||'#6b7280'}22;color:${sc2[i.status]||'#6b7280'};padding:2px 8px;border-radius:999px;font-weight:600;flex-shrink:0">${sl2[i.status]||i.status}</span>
                  </div>`
              }).join('')}
          </div>
        </div>
      </div>
    </div>
  `
}

function infoBlock(icon, label, value) {
  return `
    <div style="background:var(--bg-primary);border:1px solid var(--border);border-radius:8px;padding:0.7rem 0.9rem">
      <div style="font-size:0.68rem;color:var(--text-secondary);margin-bottom:3px;text-transform:uppercase;letter-spacing:0.04em">
        <i class="fas ${icon}" style="margin-right:4px;opacity:0.6"></i>${label}
      </div>
      <div style="font-size:0.82rem;font-weight:600;color:var(--text-primary)">${value}</div>
    </div>`
}

async function openEquipmentModal(id = null) {
  let eq = null
  if (id) { try { eq = await http.get(`${API.equipment}/${id}`) } catch(e) { showToast('Erreur', 'error'); return } }

  // Build client options
  const clientOpts = (state.clients?.data||[]).map(c =>
    `<option value="${escHtml(c.name)}" ${eq?.client===c.name?'selected':''}>${escHtml(c.name)}</option>`
  ).join('')

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
                <input type="text" name="category" class="input" placeholder="Ex: Pompe, Variateur, Compresseur..." value="${escHtml(eq?.category||'')}">
              </div>
              <div class="form-group">
                <label class="form-label">Statut</label>
                <select name="status" class="select">
                  <option value="operational" ${(eq?.status||'operational')==='operational'?'selected':''}>Opérationnel</option>
                  <option value="maintenance" ${eq?.status==='maintenance'?'selected':''}>En maintenance</option>
                  <option value="out_of_service" ${eq?.status==='out_of_service'?'selected':''}>Hors service</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Client</label>
                <select name="client" class="select">
                  <option value="">— Sélectionner —</option>
                  ${clientOpts}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Ville</label>
                <input type="text" name="city" class="input" placeholder="Ville" value="${escHtml(eq?.city||'')}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Emplacement</label>
                <input type="text" name="location" class="input" placeholder="Bâtiment, atelier, salle..." value="${escHtml(eq?.location||'')}">
              </div>
              <div class="form-group">
                <label class="form-label">Date d'installation</label>
                <input type="date" name="installation_date" class="input" value="${eq?.installation_date?.split('T')[0]||''}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Dernière maintenance</label>
              <input type="date" name="last_maintenance_date" class="input" value="${eq?.last_maintenance_date?.split('T')[0]||''}">
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
  if (!data.last_maintenance_date) delete data.last_maintenance_date
  if (!data.client) delete data.client
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
          <p style="color:var(--text-secondary)">Supprimer <strong>"${escHtml(name)}"</strong> ? Cette action est irréversible.</p>
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
        <h1 style="font-size:1.2rem;font-weight:700"><i class="fas fa-calendar-alt" style="color:var(--accent-blue);margin-right:8px"></i>Planning</h1>
        <p style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px">Gestion du planning de maintenance</p>
      </div>
      <div style="display:flex;gap:0.5rem;align-items:center">
        <button class="btn btn-primary" onclick="openPlanModal()">
          <i class="fas fa-plus"></i> Nouveau plan
        </button>
      </div>
    </div>
    <div class="page-content">
      <div class="table-card">
        <div id="plans-list"><div class="loading-overlay"><span class="loader"></span></div></div>
      </div>
    </div>
  `
  loadPlansList()
}

function togglePreventifSection() {
  const sec = document.getElementById('section-preventif')
  const btn = document.getElementById('btn-toggle-gantt')
  if (!sec) return
  const hidden = sec.style.display === 'none'
  sec.style.display = hidden ? '' : 'none'
  if (btn) btn.innerHTML = hidden
    ? '<i class="fas fa-table"></i> Planning Contractuel'
    : '<i class="fas fa-table"></i> Afficher Contractuel'
}

// switchPlanningTab kept for compatibility (no-op now)
function switchPlanningTab(tab) {}

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
    const payload = res.data || {}
    const rows  = payload.data || (Array.isArray(payload) ? payload : [])
    const stats = payload.stats || {}

    // KPI STRIP premium
    const statsEl = document.getElementById('preventif-stats')
    if (statsEl) {
      const pct = stats.total > 0 ? Math.round((stats.fait_count/stats.total)*100) : 0
      const kpiCard = (icon, val, lbl, col, bg) =>
        `<div style="background:${bg};border:1px solid ${col}33;border-radius:10px;padding:0.8rem 1rem;
                    display:flex;align-items:center;gap:0.75rem;position:relative;overflow:hidden">
           <div style="width:36px;height:36px;border-radius:8px;background:${col}22;border:1px solid ${col}44;
                       display:flex;align-items:center;justify-content:center;flex-shrink:0">
             <i class="fas fa-${icon}" style="color:${col};font-size:1rem"></i>
           </div>
           <div>
             <div style="font-size:1.4rem;font-weight:800;color:${col};line-height:1">${val}</div>
             <div style="font-size:0.68rem;color:var(--text-secondary);margin-top:2px;white-space:nowrap">${lbl}</div>
           </div>
         </div>`
      statsEl.innerHTML =
        kpiCard('list-check',   stats.total||0,          'Total 2026',      '#3b82f6','rgba(59,130,246,0.06)') +
        kpiCard('check-circle', stats.fait_count||0,     'Réalisées',       '#22c55e','rgba(34,197,94,0.06)') +
        kpiCard('clock',        stats.en_attente_count||0,'En attente',     '#f59e0b','rgba(245,158,11,0.06)') +
        kpiCard('file-contract',stats.contrats||0,       'Contrats',        '#60a5fa','rgba(96,165,250,0.06)') +
        kpiCard('file-invoice', stats.bons_commande||0,  'Bons commande',   '#a78bfa','rgba(167,139,250,0.06)') +
        `<div style="background:rgba(29,78,216,0.06);border:1px solid rgba(29,78,216,0.2);border-radius:10px;
                    padding:0.8rem 1rem;display:flex;flex-direction:column;justify-content:center;gap:6px">
           <div style="display:flex;justify-content:space-between;align-items:center">
             <span style="font-size:0.72rem;color:var(--text-secondary)">Avancement global 2026</span>
             <strong style="font-size:1rem;font-weight:800;color:${pct>=80?'#22c55e':pct>=40?'#f59e0b':'#ef4444'}">${pct}%</strong>
           </div>
           <div style="height:8px;background:var(--bg-secondary);border-radius:4px;overflow:hidden">
             <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#1d4ed8,#22c55e);border-radius:4px;transition:width .6s ease"></div>
           </div>
         </div>`
    }

    const counter = document.getElementById('preventif-counter')
    if (counter) counter.textContent = `${rows.length} entrée${rows.length>1?'s':''}`

    if (!rows.length) {
      el.innerHTML = `<div class="empty-state"><i class="fas fa-calendar-check"></i><p>Aucun planning préventif trouvé</p></div>`
      return
    }

    // ============================================================
    // TABLEAU GANTT PREMIUM avec dates exactes
    // ============================================================
    const currentMonth = new Date().getMonth() + 1
    const currentDay   = new Date().getDate()
    const currentYear  = new Date().getFullYear()

    const JOURS_COURT = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
    const FREQ_CFG = {
      'Trimestrielle': { color:'#22c55e', bg:'rgba(34,197,94,0.1)',  icon:'fa-rotate',    label:'Trim.' },
      'Semestrielle':  { color:'#3b82f6', bg:'rgba(59,130,246,0.1)', icon:'fa-rotate',    label:'Sem.'  },
      'Annuelle':      { color:'#f59e0b', bg:'rgba(245,158,11,0.1)', icon:'fa-calendar-day',label:'Ann.' }
    }

    el.innerHTML = `
      <div style="overflow-x:auto;">
        <table style="min-width:1280px;border-collapse:collapse">
          <thead>
            <tr style="background:linear-gradient(90deg,rgba(15,23,42,0.9),rgba(15,23,42,0.7))">
              <th style="min-width:90px;padding:10px 12px;text-align:left;font-size:0.7rem;font-weight:600;
                         color:var(--text-secondary);border-bottom:2px solid rgba(59,130,246,0.3);
                         position:sticky;left:0;background:rgba(10,16,35,0.98);z-index:2">Nature</th>
              <th style="min-width:220px;padding:10px 12px;text-align:left;font-size:0.7rem;font-weight:600;
                         color:var(--text-secondary);border-bottom:2px solid rgba(59,130,246,0.3)">Client / Description</th>
              <th style="min-width:90px;padding:10px 8px;text-align:center;font-size:0.7rem;font-weight:600;
                         color:var(--text-secondary);border-bottom:2px solid rgba(59,130,246,0.3)">Fréquence</th>
              <th style="min-width:110px;padding:10px 8px;text-align:center;font-size:0.7rem;font-weight:600;
                         color:#60a5fa;border-bottom:2px solid rgba(59,130,246,0.3)">Date planifiée</th>
              ${MOIS_LABELS.map((m,i) => {
                const isCur = (i+1) === currentMonth
                return `<th style="width:48px;padding:8px 2px;text-align:center;font-size:0.63rem;
                           font-weight:${isCur?'800':'600'};
                           color:${isCur?'#60a5fa':'var(--text-secondary)'};
                           border-bottom:2px solid ${isCur?'rgba(59,130,246,0.6)':'rgba(59,130,246,0.2)'};
                           background:${isCur?'rgba(59,130,246,0.06)':''};
                           ${isCur?'border-top:2px solid rgba(59,130,246,0.4)':''}
                           ">${m}${isCur?'<div style="font-size:0.5rem;color:#60a5fa;margin-top:1px">▼</div>':''}</th>`
              }).join('')}
              <th style="min-width:80px;padding:10px 8px;text-align:center;font-size:0.7rem;font-weight:600;
                         color:var(--text-secondary);border-bottom:2px solid rgba(59,130,246,0.3)">Statut</th>
              <th style="min-width:70px;padding:10px 8px;text-align:center;font-size:0.7rem;font-weight:600;
                         color:var(--text-secondary);border-bottom:2px solid rgba(59,130,246,0.3)">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((r, rowIdx) => {
              const isContrat = r.nature === 'Contrat de maintenance'
              const fCfg = FREQ_CFG[r.frequence] || { color:'#94a3b8', bg:'rgba(148,163,184,0.1)', icon:'fa-calendar', label:r.frequence }
              const rowBg = rowIdx%2===0 ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)'

              // Date planifiée
              let dateLabel = '—', jourLabel = '', dateTip = ''
              if (r.date_planifiee) {
                const dp = new Date(r.date_planifiee + 'T00:00:00')
                const dd = dp.getDate()
                const mm = dp.getMonth()+1
                const jj = JOURS_COURT[dp.getDay()]
                dateLabel = `${String(dd).padStart(2,'0')}/${String(mm).padStart(2,'0')}`
                jourLabel = jj
                const isToday = dd===currentDay && mm===currentMonth && dp.getFullYear()===currentYear
                const isPast  = dp < new Date(currentYear,currentMonth-1,currentDay)
                dateTip = isToday ? '🟢 Aujourd\'hui' : isPast ? '🔴 Passée' : '🔵 À venir'
              }

              const moisCells = Array.from({length:12},(_,i) => {
                const mKey = `mois_${i+1}`
                const planned = r[mKey] === 1
                const isCur   = (i+1) === currentMonth

                if (!planned) return `<td style="text-align:center;padding:0 2px;
                  background:${isCur?'rgba(59,130,246,0.04)':''};
                  border-right:${isCur?'1px solid rgba(59,130,246,0.15)':'1px solid rgba(255,255,255,0.03)'}"></td>`

                // Déterminer la couleur selon état
                let dotColor, dotBg, dotIcon, dotTitle
                if (r.fait) {
                  dotColor='#22c55e'; dotBg='rgba(34,197,94,0.15)'; dotIcon='✓'; dotTitle='Réalisée'
                } else if ((i+1) < currentMonth) {
                  dotColor='#ef4444'; dotBg='rgba(239,68,68,0.15)'; dotIcon='!'; dotTitle='En retard'
                } else if ((i+1) === currentMonth) {
                  dotColor='#f59e0b'; dotBg='rgba(245,158,11,0.2)'; dotIcon='●'; dotTitle='Ce mois'
                } else {
                  dotColor='#3b82f6'; dotBg='rgba(59,130,246,0.15)'; dotIcon='●'; dotTitle='Planifiée'
                }

                // Afficher le jour du mois si date_planifiee disponible
                let dayNum = ''
                if (r.date_planifiee) {
                  const dp = new Date(r.date_planifiee+'T00:00:00')
                  if (dp.getMonth()+1 === i+1) dayNum = String(dp.getDate()).padStart(2,'0')
                }

                return `<td style="text-align:center;padding:6px 2px;
                  background:${isCur?'rgba(59,130,246,0.04)':'${rowBg}'};
                  border-right:${isCur?'1px solid rgba(59,130,246,0.2)':'1px solid rgba(255,255,255,0.03)'}">
                  <div style="width:34px;height:34px;border-radius:8px;
                    background:${dotBg};border:1.5px solid ${dotColor}44;
                    display:inline-flex;flex-direction:column;align-items:center;
                    justify-content:center;cursor:pointer;transition:all .2s;
                    box-shadow:${r.fait?'0 0 6px '+dotColor+'40':''}"
                    title="${dotTitle} — ${MOIS_FULL[i]}${dayNum?' ('+dayNum+')':''}"
                    onclick="toggleFait(${r.id},${r.fait})"
                    onmouseenter="this.style.transform='scale(1.15)';this.style.borderColor='${dotColor}'"
                    onmouseleave="this.style.transform='scale(1)';this.style.borderColor='${dotColor}44'">
                    <span style="font-size:0.7rem;font-weight:800;color:${dotColor}">${dotIcon}</span>
                    ${dayNum?`<span style="font-size:0.48rem;color:${dotColor};opacity:0.8;margin-top:-2px">${dayNum}</span>`:''}
                  </div>
                </td>`
              }).join('')

              return `
                <tr style="background:${rowBg};border-bottom:1px solid rgba(255,255,255,0.04);
                           transition:background .15s;${r.fait?'opacity:0.65':''}"
                    onmouseenter="this.style.background='rgba(59,130,246,0.06)'"
                    onmouseleave="this.style.background='${rowBg}'">

                  <!-- Nature badge -->
                  <td style="padding:10px 12px;position:sticky;left:0;background:rgba(10,16,35,0.96);z-index:1">
                    <div style="display:inline-flex;align-items:center;gap:5px;padding:3px 8px;
                      border-radius:6px;
                      background:${isContrat?'rgba(59,130,246,0.12)':'rgba(167,139,250,0.12)'};
                      border:1px solid ${isContrat?'rgba(59,130,246,0.25)':'rgba(167,139,250,0.25)'}">
                      <i class="fas ${isContrat?'fa-file-contract':'fa-file-invoice'}" 
                         style="font-size:0.6rem;color:${isContrat?'#60a5fa':'#a78bfa'}"></i>
                      <span style="font-size:0.6rem;font-weight:700;
                        color:${isContrat?'#60a5fa':'#a78bfa'}">
                        ${isContrat?'Contrat':'BdC'}
                      </span>
                    </div>
                  </td>

                  <!-- Client / Description -->
                  <td style="padding:10px 12px">
                    <div style="font-weight:700;font-size:0.82rem;color:var(--text-primary);margin-bottom:2px">
                      ${escHtml(r.client)}
                    </div>
                    <div style="font-size:0.68rem;color:var(--text-muted);line-height:1.3">
                      ${escHtml(r.description.length>60?r.description.slice(0,60)+'…':r.description)}
                    </div>
                  </td>

                  <!-- Fréquence -->
                  <td style="padding:10px 8px;text-align:center">
                    <div style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;
                      border-radius:6px;background:${fCfg.bg};border:1px solid ${fCfg.color}33">
                      <i class="fas ${fCfg.icon}" style="font-size:0.58rem;color:${fCfg.color}"></i>
                      <span style="font-size:0.62rem;font-weight:700;color:${fCfg.color}">${fCfg.label}</span>
                    </div>
                  </td>

                  <!-- Date planifiée -->
                  <td style="padding:10px 8px;text-align:center">
                    ${r.date_planifiee ? `
                    <div style="display:inline-flex;flex-direction:column;align-items:center;gap:1px">
                      <div style="font-size:0.78rem;font-weight:800;color:#60a5fa;font-variant-numeric:tabular-nums">
                        ${dateLabel}
                      </div>
                      <div style="font-size:0.6rem;font-weight:600;padding:1px 5px;border-radius:4px;
                        background:rgba(96,165,250,0.1);color:#60a5fa;border:1px solid rgba(96,165,250,0.2)">
                        ${jourLabel}
                      </div>
                    </div>` : '<span style="color:var(--text-muted);font-size:0.7rem">—</span>'}
                  </td>

                  ${moisCells}

                  <!-- Statut -->
                  <td style="padding:10px 8px;text-align:center">
                    ${r.fait
                      ? `<div style="display:inline-flex;align-items:center;gap:4px;padding:3px 9px;
                           border-radius:6px;background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.3)">
                           <i class="fas fa-check" style="font-size:0.6rem;color:#22c55e"></i>
                           <span style="font-size:0.65rem;font-weight:700;color:#22c55e">Fait</span>
                         </div>`
                      : `<div style="display:inline-flex;align-items:center;gap:4px;padding:3px 9px;
                           border-radius:6px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25)">
                           <i class="fas fa-clock" style="font-size:0.6rem;color:#f59e0b"></i>
                           <span style="font-size:0.65rem;font-weight:600;color:#f59e0b">En attente</span>
                         </div>`
                    }
                  </td>

                  <!-- Actions -->
                  <td style="padding:10px 8px;text-align:center">
                    <div style="display:flex;gap:4px;justify-content:center">
                      <button class="btn btn-ghost btn-sm btn-icon" onclick="openPreventifModal(${r.id})"
                        title="Modifier" style="width:28px;height:28px;border-radius:6px">
                        <i class="fas fa-pen" style="font-size:0.65rem"></i>
                      </button>
                      <button class="btn btn-danger btn-sm btn-icon" onclick="confirmDeletePreventif(${r.id},'${escHtml(r.client)}')"
                        title="Supprimer" style="width:28px;height:28px;border-radius:6px">
                        <i class="fas fa-trash" style="font-size:0.65rem"></i>
                      </button>
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
      const resPayload = res.data || {}
      const resRows = resPayload.data || (Array.isArray(resPayload) ? resPayload : [])
      entry = resRows.find(r => r.id === id) || null
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

    // Planning préventif contractuel — utilise date_planifiee exacte (lun/jeu calculés)
    const contractItems = preventifData.data || []
    contractItems.forEach(item => {
      let targetDay = null

      if (item.date_planifiee) {
        // Utiliser la date précise calculée par l'algorithme de scheduling
        const dp = new Date(item.date_planifiee + 'T00:00:00')
        if (dp.getFullYear() === year && dp.getMonth() + 1 === month) {
          targetDay = dp.getDate()
        }
      }

      // Fallback : si pas de date_planifiee, prendre le 1er lundi du mois
      if (targetDay === null) {
        const dInMonth = new Date(year, month, 0).getDate()
        for (let d = 1; d <= dInMonth; d++) {
          const dow = new Date(year, month-1, d).getDay()
          if (dow === 1) { targetDay = d; break }
        }
        targetDay = targetDay || 1
      }

      if (!events[targetDay]) events[targetDay] = []
      events[targetDay].push({
        ...item,
        kind: item.nature === 'Bon de commande' ? 'bdc' : 'contrat',
        source: 'preventif',
        displayName: item.client,
        tooltip: `[${item.nature}] — ${item.date_planifiee || ''}\n${item.description}\nClient : ${item.client}\nFréquence : ${item.frequence}`
      })
    })

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
    // Pour le préventif contractuel, filtrer par date_planifiee du jour exact
    const prev_payload = prev.data || {}
    const prevItems = prev_payload.data || (Array.isArray(prev_payload) ? prev_payload : [])
    prevItems.forEach(item => {
      let itemDay = null
      if (item.date_planifiee) {
        const dp = new Date(item.date_planifiee + 'T00:00:00')
        if (dp.getFullYear() === year && dp.getMonth() + 1 === month) {
          itemDay = dp.getDate()
        }
      }
      if (itemDay === day) {
        const nature_s = item.nature === 'Bon de commande' ? 'BdC' : 'Contrat'
        const jours = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
        const jourLabel = item.date_planifiee ? jours[new Date(item.date_planifiee+'T00:00:00').getDay()] : ''
        items.push({
          label: item.client,
          sub: `${nature_s} — ${item.frequence} — ${jourLabel} ${day}/${month < 10 ? '0'+month : month}/${year}`,
          sub2: item.description,
          color: item.nature === 'Bon de commande' ? 'var(--accent-purple)' : 'var(--accent-blue)',
          icon: item.nature === 'Bon de commande' ? '📋' : '📄'
        })
      }
    })
    if (!body) return
    if (!items.length) {
      body.innerHTML = `<p style="color:var(--text-secondary);text-align:center;padding:1rem">Aucune intervention enregistrée ce jour</p>`
      return
    }
    body.innerHTML = items.map(it => `
      <div style="display:flex;gap:0.75rem;align-items:flex-start;padding:0.75rem 0;border-bottom:1px solid var(--border)">
        <span style="font-size:1.3rem;flex-shrink:0;margin-top:2px">${it.icon}</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:0.88rem;color:${it.color}">${escHtml(it.label||'—')}</div>
          <div style="font-size:0.72rem;color:var(--text-secondary);margin-top:2px">${escHtml(it.sub||'')}</div>
          ${it.sub2 ? `<div style="font-size:0.7rem;color:var(--text-muted);margin-top:3px;font-style:italic">${escHtml(it.sub2)}</div>` : ''}
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
  renderCalendar()
}
function nextMonth() {
  state.planning.currentMonth++
  if (state.planning.currentMonth > 12) { state.planning.currentMonth = 1; state.planning.currentYear++ }
  renderCalendar()
}
function goToday() {
  const n = new Date()
  state.planning.currentYear = n.getFullYear()
  state.planning.currentMonth = n.getMonth() + 1
  renderCalendar()
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

            <!-- ── DATE + HEURE DE DÉBUT ── -->
            <div style="background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.2);
                        border-radius:8px;padding:14px 16px;margin-bottom:12px">
              <div style="font-size:0.72rem;font-weight:700;color:var(--accent-blue);
                          text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px">
                <i class="fas fa-calendar-check" style="margin-right:6px"></i>Date & heure de début
              </div>
              <div class="form-row">
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label">Date de début</label>
                  <input type="date" name="start_date" class="input"
                         value="${plan?.start_date?.split('T')[0]||''}">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label">Heure de début</label>
                  <input type="time" name="start_time" class="input"
                         value="${plan?.start_time||'08:00'}">
                </div>
              </div>
            </div>

            <!-- ── NOTIFICATIONS EMAIL ── -->
            <div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2);
                        border-radius:8px;padding:14px 16px;margin-bottom:12px">
              <div style="font-size:0.72rem;font-weight:700;color:var(--accent-yellow);
                          text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px">
                <i class="fas fa-bell" style="margin-right:6px"></i>Notifications email
              </div>
              <div class="form-row">
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label">Date de notification <span style="color:var(--text-secondary);font-weight:400">(envoi email ce jour)</span></label>
                  <input type="date" name="notification_date" class="input"
                         value="${plan?.notification_date?.split('T')[0]||''}">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label">Emails destinataires</label>
                  <!-- Tags container -->
                  <div id="email-tags-box"
                       style="min-height:38px;background:var(--bg-primary);border:1px solid var(--border);
                              border-radius:6px;padding:4px 8px;display:flex;flex-wrap:wrap;
                              gap:5px;align-items:center;cursor:text"
                       onclick="document.getElementById('email-tag-input').focus()">
                    ${(plan?.notification_emails||'mfs326467@gmail.com').split(',').map(e=>e.trim()).filter(Boolean).map(e=>`
                      <span class="email-tag" data-email="${escHtml(e)}"
                            style="display:inline-flex;align-items:center;gap:4px;
                                   background:rgba(245,158,11,0.15);color:#fbbf24;
                                   font-size:0.72rem;font-weight:600;padding:2px 8px;
                                   border-radius:20px;white-space:nowrap">
                        ${escHtml(e)}
                        <span onclick="removeEmailTag(this)" style="cursor:pointer;opacity:0.7;
                               font-size:0.8rem;line-height:1">×</span>
                      </span>`).join('')}
                    <input id="email-tag-input" type="email" autocomplete="off"
                           placeholder="+ Ajouter un email"
                           style="border:none;outline:none;background:transparent;
                                  color:var(--text-primary);font-size:0.78rem;
                                  min-width:160px;flex:1;padding:2px 4px"
                           onkeydown="handleEmailTagKey(event)"
                           onblur="addEmailTagFromInput()">
                  </div>
                  <!-- hidden input that holds the CSV value for the form -->
                  <input type="hidden" name="notification_emails" id="notification_emails_hidden"
                         value="${escHtml(plan?.notification_emails||'mfs326467@gmail.com')}">
                  <div style="margin-top:5px;font-size:0.68rem;color:var(--text-secondary)">
                    Appuyer sur <kbd style="background:var(--bg-secondary);border:1px solid var(--border);
                    border-radius:3px;padding:0 4px;font-size:0.65rem">Entrée</kbd> ou
                    <kbd style="background:var(--bg-secondary);border:1px solid var(--border);
                    border-radius:3px;padding:0 4px;font-size:0.65rem">,</kbd> pour confirmer
                  </div>
                </div>
              </div>
              <div style="margin-top:8px;font-size:0.7rem;color:var(--text-secondary);
                          display:flex;align-items:center;gap:6px">
                <i class="fas fa-info-circle" style="color:var(--accent-yellow);opacity:0.7"></i>
                Le cron vérifie chaque heure — l'email sera envoyé automatiquement à la date choisie.
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

/* ── EMAIL TAGS helpers (modal planning) ── */
function syncEmailHidden() {
  const box = document.getElementById('email-tags-box')
  const hidden = document.getElementById('notification_emails_hidden')
  if (!box || !hidden) return
  const tags = [...box.querySelectorAll('.email-tag')].map(t => t.dataset.email)
  hidden.value = tags.join(',') || 'mfs326467@gmail.com'
}

function addEmailTag(email) {
  const e = email.trim().toLowerCase()
  if (!e || !e.includes('@')) return
  const box = document.getElementById('email-tags-box')
  if (!box) return
  // avoid duplicates
  if ([...box.querySelectorAll('.email-tag')].some(t => t.dataset.email === e)) return
  const input = document.getElementById('email-tag-input')
  const tag = document.createElement('span')
  tag.className = 'email-tag'
  tag.dataset.email = e
  tag.style.cssText = 'display:inline-flex;align-items:center;gap:4px;background:rgba(245,158,11,0.15);color:#fbbf24;font-size:0.72rem;font-weight:600;padding:2px 8px;border-radius:20px;white-space:nowrap'
  tag.innerHTML = `${e}<span onclick="removeEmailTag(this)" style="cursor:pointer;opacity:0.7;font-size:0.8rem;line-height:1;margin-left:2px">×</span>`
  box.insertBefore(tag, input)
  if (input) input.value = ''
  syncEmailHidden()
}

function removeEmailTag(x) {
  x.parentElement.remove()
  syncEmailHidden()
}

function handleEmailTagKey(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addEmailTagFromInput()
  } else if (e.key === 'Backspace' && !e.target.value) {
    const box = document.getElementById('email-tags-box')
    if (!box) return
    const tags = box.querySelectorAll('.email-tag')
    if (tags.length) tags[tags.length - 1].remove()
    syncEmailHidden()
  }
}

function addEmailTagFromInput() {
  const input = document.getElementById('email-tag-input')
  if (input && input.value.trim()) addEmailTag(input.value)
}

async function savePlan(e, id) {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(e.target))
  data.duration_hours = parseFloat(data.duration_hours) || 1
  if (!data.technician_id) { delete data.technician_id; delete data.technician_name }
  if (!data.last_done_date) delete data.last_done_date
  if (!data.start_date) delete data.start_date
  if (!data.notification_date) delete data.notification_date
  if (!data.notification_emails) data.notification_emails = 'mfs326467@gmail.com'
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
// COMPTES RENDUS — Module gestion des comptes rendus
// ============================================================
async function renderCompteRendus() {
  const container = document.getElementById('page-container')

  // ─── Pré-chargement techniciens pour les filtres ───────────
  if (!state.technicians.data.length) {
    try { const d = await http.get(API.technicians); state.technicians.data = d.data || [] } catch(e) {}
  }
  const techOpts = state.technicians.data
    .map(t => `<option value="${escHtml(t.name)}">${escHtml(t.name)}</option>`)
    .join('')

  const now = new Date()
  const dayNames = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
  const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  const dateStr = `${dayNames[now.getDay()]} ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`

  container.innerHTML = `

    <!-- ══════════════════════════════════════════════════════
         HERO HEADER — Comptes Rendus
    ══════════════════════════════════════════════════════ -->
    <div style="
      background: linear-gradient(135deg, #0f172a 0%, #1a1040 40%, #0f2a4a 70%, #0a1628 100%);
      border-radius: 16px;
      padding: 1.6rem 2rem;
      margin-bottom: 1.5rem;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(139,92,246,0.18);
      box-shadow: 0 4px 32px rgba(0,0,0,0.4);
    ">
      <!-- Décorations background -->
      <div style="position:absolute;top:-60px;right:-40px;width:200px;height:200px;border-radius:50%;
                  background:radial-gradient(circle,rgba(139,92,246,0.13) 0%,transparent 70%);pointer-events:none"></div>
      <div style="position:absolute;bottom:-40px;left:30%;width:160px;height:160px;border-radius:50%;
                  background:radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%);pointer-events:none"></div>
      <div style="position:absolute;top:0;left:0;right:0;height:2px;
                  background:linear-gradient(90deg,transparent,#8b5cf6,#3b82f6,transparent);pointer-events:none"></div>

      <div style="position:relative;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap">

        <!-- Gauche : icône + titre -->
        <div style="display:flex;align-items:center;gap:1.2rem">
          <div style="width:52px;height:52px;border-radius:14px;
                      background:linear-gradient(135deg,rgba(139,92,246,.25),rgba(59,130,246,.2));
                      border:1px solid rgba(139,92,246,.35);
                      display:flex;align-items:center;justify-content:center;flex-shrink:0;
                      box-shadow:0 4px 16px rgba(139,92,246,.2)">
            <i class="fas fa-file-alt" style="font-size:1.35rem;color:#a78bfa"></i>
          </div>
          <div>
            <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:5px;flex-wrap:wrap">
              <span style="background:rgba(139,92,246,.18);border:1px solid rgba(139,92,246,.3);
                           color:#c4b5fd;font-size:.6rem;font-weight:700;text-transform:uppercase;
                           letter-spacing:1px;padding:2px 9px;border-radius:20px">
                GMAO — PPrime
              </span>
              <span style="background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.25);
                           color:#6ee7b7;font-size:.6rem;font-weight:700;padding:2px 8px;border-radius:20px">
                <i class="fas fa-circle" style="font-size:.4rem;margin-right:3px"></i> Actif
              </span>
            </div>
            <h1 style="font-size:1.45rem;font-weight:800;color:#f8fafc;line-height:1.1;letter-spacing:-.4px;margin:0 0 4px 0">
              Comptes Rendus
              <span style="background:linear-gradient(90deg,#a78bfa,#60a5fa);
                           -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                           background-clip:text"> d'Interventions</span>
            </h1>
            <div style="font-size:.7rem;color:rgba(148,163,184,.7)">
              <i class="fas fa-calendar-day" style="margin-right:4px;color:#a78bfa"></i>${dateStr}
            </div>
          </div>
        </div>

        <!-- Droite : bouton + refresh -->
        <div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap">
          <button onclick="loadCR()" style="
            background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);
            color:rgba(148,163,184,.8);border-radius:9px;padding:.45rem .85rem;font-size:.78rem;
            font-weight:600;cursor:pointer;display:flex;align-items:center;gap:.4rem;
            transition:all .2s;
          " onmouseover="this.style.background='rgba(255,255,255,.13)'" onmouseout="this.style.background='rgba(255,255,255,.07)'">
            <i class="fas fa-sync-alt"></i>
          </button>
          <button onclick="openCRModal(null)" style="
            background:linear-gradient(135deg,#7c3aed,#4f46e5);border:none;
            color:white;border-radius:10px;padding:.55rem 1.3rem;font-size:.82rem;
            font-weight:700;cursor:pointer;display:flex;align-items:center;gap:.5rem;
            box-shadow:0 3px 14px rgba(124,58,237,.4);transition:opacity .2s;
          " onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
            <i class="fas fa-plus"></i> Nouveau CR
          </button>
        </div>
      </div>

      <!-- KPI stats dans le hero -->
      <div id="cr-hero-stats" style="
        margin-top:1.2rem;padding-top:1rem;
        border-top:1px solid rgba(255,255,255,.07);
        display:flex;gap:1rem;flex-wrap:wrap;align-items:center;
      ">
        <div style="display:flex;align-items:center;gap:.5rem;background:rgba(255,255,255,.05);
                    border:1px solid rgba(255,255,255,.09);border-radius:10px;padding:.45rem 1rem">
          <i class="fas fa-spinner fa-spin" style="color:rgba(148,163,184,.5);font-size:.75rem"></i>
          <span style="font-size:.72rem;color:rgba(148,163,184,.6)">Chargement stats...</span>
        </div>
      </div>
    </div>

    <div class="page-content">

      <!-- ── Barre filtres avancée ────────────────────────────── -->
      <div style="
        background:var(--bg-secondary);border:1px solid var(--border);
        border-radius:12px;padding:1rem 1.25rem;margin-bottom:1.25rem;
        display:flex;flex-wrap:wrap;gap:.65rem;align-items:center;
      ">
        <!-- Recherche texte -->
        <div style="position:relative;flex:1;min-width:200px;max-width:280px">
          <i class="fas fa-search" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text-secondary);font-size:.78rem;pointer-events:none"></i>
          <input type="text" id="cr-search" class="input input-sm" style="padding-left:30px;width:100%"
            placeholder="Titre, client, équipement..." oninput="debounceCR()">
        </div>

        <!-- Séparateur -->
        <div style="width:1px;height:24px;background:var(--border)"></div>

        <!-- Statut -->
        <select id="cr-status" class="select input-sm" style="width:145px" onchange="loadCR()">
          <option value="">Tous statuts</option>
          <option value="draft">✏️ Brouillon</option>
          <option value="finalized">✅ Finalisé</option>
        </select>

        <!-- Résultat -->
        <select id="cr-result" class="select input-sm" style="width:145px" onchange="loadCR()">
          <option value="">Tous résultats</option>
          <option value="resolved">✅ Résolu</option>
          <option value="partial">⚠️ Partiel</option>
          <option value="pending">🔴 En attente</option>
        </select>

        <!-- Type -->
        <select id="cr-type-filter" class="select input-sm" style="width:145px" onchange="loadCR()">
          <option value="">Tous types</option>
          <option value="corrective">🔧 Corrective</option>
          <option value="preventive">🛡 Préventive</option>
        </select>

        <!-- Technicien -->
        <select id="cr-tech-filter" class="select input-sm" style="width:160px" onchange="loadCR()">
          <option value="">Tous techniciens</option>
          ${techOpts}
        </select>

        <!-- Date début -->
        <input type="date" id="cr-date-from" class="input input-sm" style="width:140px" onchange="loadCR()" title="Date début">

        <!-- Date fin -->
        <input type="date" id="cr-date-to" class="input input-sm" style="width:140px" onchange="loadCR()" title="Date fin">

        <!-- Vue toggle -->
        <div style="margin-left:auto;display:flex;gap:.3rem">
          <button id="cr-view-cards" onclick="setCRView('cards')" title="Vue cartes" style="
            background:rgba(139,92,246,.2);border:1px solid rgba(139,92,246,.4);
            color:#a78bfa;border-radius:7px;padding:.35rem .65rem;font-size:.82rem;cursor:pointer;
          "><i class="fas fa-th-large"></i></button>
          <button id="cr-view-table" onclick="setCRView('table')" title="Vue tableau" style="
            background:var(--bg-primary);border:1px solid var(--border);
            color:var(--text-secondary);border-radius:7px;padding:.35rem .65rem;font-size:.82rem;cursor:pointer;
          "><i class="fas fa-table"></i></button>
        </div>

        <!-- Réinitialiser -->
        <button class="btn btn-ghost btn-sm" onclick="clearCRFilters()" title="Réinitialiser">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Liste / tableau -->
      <div id="cr-list"><div class="loading-overlay"><span class="loader"></span> Chargement...</div></div>
    </div>
  `
  // Vue par défaut : cartes
  window._crView = window._crView || 'cards'
  await loadCR()
  loadCRHeroStats()
}

// Vue toggle
function setCRView(view) {
  window._crView = view
  const btnCards = document.getElementById('cr-view-cards')
  const btnTable = document.getElementById('cr-view-table')
  if (btnCards && btnTable) {
    if (view === 'cards') {
      btnCards.style.background  = 'rgba(139,92,246,.2)'
      btnCards.style.borderColor = 'rgba(139,92,246,.4)'
      btnCards.style.color       = '#a78bfa'
      btnTable.style.background  = 'var(--bg-primary)'
      btnTable.style.borderColor = 'var(--border)'
      btnTable.style.color       = 'var(--text-secondary)'
    } else {
      btnTable.style.background  = 'rgba(139,92,246,.2)'
      btnTable.style.borderColor = 'rgba(139,92,246,.4)'
      btnTable.style.color       = '#a78bfa'
      btnCards.style.background  = 'var(--bg-primary)'
      btnCards.style.borderColor = 'var(--border)'
      btnCards.style.color       = 'var(--text-secondary)'
    }
  }
  loadCR()
}

// ─── KPI stats hero ────────────────────────────────────────────
async function loadCRHeroStats() {
  const box = document.getElementById('cr-hero-stats')
  if (!box) return
  try {
    let url = `${API.compteRendus}?limit=500`
    const data = await http.get(url)
    const rows = data.data || []
    const total     = rows.length
    const finalized = rows.filter(r => r.status === 'finalized').length
    const draft     = rows.filter(r => r.status === 'draft').length
    const resolved  = rows.filter(r => r.result === 'resolved').length
    const partial   = rows.filter(r => r.result === 'partial').length
    const pending   = rows.filter(r => r.result === 'pending').length
    const resRate   = total > 0 ? Math.round((resolved / total) * 100) : 0
    const statItem = (icon, color, label, value) => `
      <div style="display:flex;align-items:center;gap:.55rem;background:rgba(255,255,255,.05);
                  border:1px solid rgba(255,255,255,.09);border-radius:10px;padding:.45rem 1rem">
        <i class="fas ${icon}" style="color:${color};font-size:.85rem"></i>
        <div>
          <div style="font-size:1rem;font-weight:800;color:${color};line-height:1">${value}</div>
          <div style="font-size:.6rem;color:rgba(148,163,184,.6);text-transform:uppercase;letter-spacing:.5px">${label}</div>
        </div>
      </div>`
    box.innerHTML =
      statItem('fa-file-alt',     '#a78bfa', 'Total CR',     total)    +
      statItem('fa-check-circle', '#34d399', 'Finalisés',    finalized) +
      statItem('fa-edit',         '#fbbf24', 'Brouillons',   draft)    +
      statItem('fa-thumbs-up',    '#34d399', 'Résolus',      resolved) +
      statItem('fa-exclamation-triangle','#fbbf24','Partiels', partial) +
      statItem('fa-times-circle', '#f87171', 'En attente',   pending)  +
      `<div style="display:flex;align-items:center;gap:.55rem;background:rgba(52,211,153,.08);
                  border:1px solid rgba(52,211,153,.18);border-radius:10px;padding:.45rem 1rem">
        <i class="fas fa-percentage" style="color:#34d399;font-size:.85rem"></i>
        <div>
          <div style="font-size:1rem;font-weight:800;color:#34d399;line-height:1">${resRate}%</div>
          <div style="font-size:.6rem;color:rgba(148,163,184,.6);text-transform:uppercase;letter-spacing:.5px">Taux résolution</div>
        </div>
      </div>`
  } catch(e) {
    box.innerHTML = `<span style="font-size:.72rem;color:rgba(148,163,184,.4)">Stats indisponibles</span>`
  }
}

let crDebounce = null
function debounceCR() { clearTimeout(crDebounce); crDebounce = setTimeout(loadCR, 350) }
function clearCRFilters() {
  const ids = ['cr-search','cr-status','cr-result','cr-type-filter','cr-tech-filter','cr-date-from','cr-date-to']
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = '' })
  loadCR()
}

async function loadCR() {
  const q       = document.getElementById('cr-search')?.value || ''
  const status  = document.getElementById('cr-status')?.value || ''
  const result  = document.getElementById('cr-result')?.value || ''
  const type    = document.getElementById('cr-type-filter')?.value || ''
  const tech    = document.getElementById('cr-tech-filter')?.value || ''
  const dateFrom= document.getElementById('cr-date-from')?.value || ''
  const dateTo  = document.getElementById('cr-date-to')?.value || ''
  const list    = document.getElementById('cr-list')
  if (!list) return
  list.innerHTML = '<div class="loading-overlay"><span class="loader"></span></div>'
  try {
    let url = `${API.compteRendus}?limit=100`
    if (q)        url += `&q=${encodeURIComponent(q)}`
    if (status)   url += `&status=${encodeURIComponent(status)}`
    if (result)   url += `&result=${encodeURIComponent(result)}`
    if (type)     url += `&intervention_type=${encodeURIComponent(type)}`
    if (tech)     url += `&technician_name=${encodeURIComponent(tech)}`
    if (dateFrom) url += `&date_from=${encodeURIComponent(dateFrom)}`
    if (dateTo)   url += `&date_to=${encodeURIComponent(dateTo)}`
    const data = await http.get(url)
    const rows = data.data || []
    if (rows.length === 0) {
      list.innerHTML = `
        <div style="
          text-align:center;padding:4rem 2rem;
          background:var(--bg-secondary);border:1px solid var(--border);
          border-radius:14px;
        ">
          <div style="width:64px;height:64px;border-radius:50%;
                      background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.2);
                      display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem">
            <i class="fas fa-file-alt" style="font-size:1.6rem;color:rgba(139,92,246,.5)"></i>
          </div>
          <p style="font-size:.9rem;font-weight:600;color:var(--text-primary);margin:0 0 .4rem">Aucun compte rendu trouvé</p>
          <p style="font-size:.78rem;color:var(--text-secondary);margin:0 0 1.25rem">Créez votre premier rapport d'intervention</p>
          <button class="btn btn-primary btn-sm" onclick="openCRModal(null)">
            <i class="fas fa-plus"></i> Créer le premier
          </button>
        </div>`
      return
    }
    const view = window._crView || 'cards'
    if (view === 'table') {
      list.innerHTML = crTableView(rows)
    } else {
      list.innerHTML = `<div style="display:grid;gap:.85rem">${rows.map(r => crCard(r)).join('')}</div>`
    }
  } catch(e) {
    list.innerHTML = `
      <div style="padding:2.5rem;text-align:center;color:#f87171;background:rgba(248,113,113,.05);border:1px solid rgba(248,113,113,.15);border-radius:12px">
        <i class="fas fa-exclamation-triangle" style="font-size:1.5rem;display:block;margin-bottom:.75rem"></i>
        <p style="margin:0;font-size:.85rem">Erreur de chargement des comptes rendus</p>
      </div>`
  }
}

// ─── Vue tableau ───────────────────────────────────────────────
function crTableView(rows) {
  const rowsHtml = rows.map(r => {
    const statusColor = r.status === 'finalized' ? '#34d399' : '#fbbf24'
    const statusLabel = r.status === 'finalized' ? 'Finalisé' : 'Brouillon'
    const resultColor = { resolved:'#34d399', partial:'#fbbf24', pending:'#f87171' }[r.result] || '#94a3b8'
    const resultLabel = { resolved:'Résolu', partial:'Partiel', pending:'En attente' }[r.result] || r.result
    const typeLabel   = r.intervention_type === 'preventive' ? '🛡 Préventive' : '🔧 Corrective'
    return `
      <tr style="border-bottom:1px solid var(--border);transition:background .15s"
          onmouseover="this.style.background='rgba(139,92,246,.05)'"
          onmouseout="this.style.background='transparent'">
        <td style="padding:.65rem 1rem;font-size:.78rem;max-width:220px">
          <div style="font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escHtml(r.title)}</div>
          ${r.reference_num ? `<div style="font-size:.65rem;color:var(--text-secondary);font-family:monospace">${escHtml(r.reference_num)}</div>` : ''}
        </td>
        <td style="padding:.65rem .75rem;font-size:.75rem;color:var(--text-secondary)">${r.client ? escHtml(r.client) : '—'}</td>
        <td style="padding:.65rem .75rem;font-size:.75rem;color:var(--text-secondary)">${r.technician_name ? escHtml(r.technician_name) : '—'}</td>
        <td style="padding:.65rem .75rem;font-size:.73rem;color:var(--text-secondary)">${r.intervention_date ? formatDate(r.intervention_date) : '—'}</td>
        <td style="padding:.65rem .75rem;font-size:.73rem;white-space:nowrap">${typeLabel}</td>
        <td style="padding:.65rem .75rem">
          <span style="background:rgba(255,255,255,.06);color:${resultColor};font-size:.65rem;font-weight:700;padding:2px 9px;border-radius:20px;border:1px solid ${resultColor}33">
            ${resultLabel}
          </span>
        </td>
        <td style="padding:.65rem .75rem">
          <span style="color:${statusColor};font-size:.65rem;font-weight:700">
            ${r.status === 'finalized' ? '✅' : '✏️'} ${statusLabel}
          </span>
        </td>
        <td style="padding:.65rem .75rem;font-size:.73rem;color:var(--text-secondary)">${r.duration_hours ? r.duration_hours + 'h' : '—'}</td>
        <td style="padding:.65rem .75rem">
          <div style="display:flex;gap:.35rem">
            <button class="btn btn-ghost btn-sm" title="Aperçu PDF" onclick="printCR(${r.id})" style="padding:.25rem .45rem;font-size:.72rem"><i class="fas fa-print"></i></button>
            <button class="btn btn-ghost btn-sm" title="Modifier"   onclick="openCRModal(${r.id})" style="padding:.25rem .45rem;font-size:.72rem"><i class="fas fa-edit"></i></button>
            ${r.status === 'draft' ? `<button class="btn btn-ghost btn-sm" title="Finaliser" onclick="finalizeCR(${r.id})" style="padding:.25rem .45rem;font-size:.72rem;color:#34d399"><i class="fas fa-check"></i></button>` : ''}
            <button class="btn btn-ghost btn-sm" title="Supprimer" onclick="deleteCR(${r.id},'${escHtml(r.title).replace(/'/g,"\\'")}'')" style="padding:.25rem .45rem;font-size:.72rem;color:#f87171"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>`
  }).join('')
  return `
    <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:12px;overflow:hidden">
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="border-bottom:2px solid var(--border);background:rgba(139,92,246,.06)">
              <th style="padding:.7rem 1rem;text-align:left;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text-secondary)">Titre</th>
              <th style="padding:.7rem .75rem;text-align:left;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text-secondary)">Client</th>
              <th style="padding:.7rem .75rem;text-align:left;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text-secondary)">Technicien</th>
              <th style="padding:.7rem .75rem;text-align:left;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text-secondary)">Date</th>
              <th style="padding:.7rem .75rem;text-align:left;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text-secondary)">Type</th>
              <th style="padding:.7rem .75rem;text-align:left;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text-secondary)">Résultat</th>
              <th style="padding:.7rem .75rem;text-align:left;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text-secondary)">Statut</th>
              <th style="padding:.7rem .75rem;text-align:left;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text-secondary)">Durée</th>
              <th style="padding:.7rem .75rem;text-align:left;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text-secondary)">Actions</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    </div>`
}

function crCard(r) {
  const isFinalized = r.status === 'finalized'
  const statusBadge = isFinalized
    ? `<span style="background:rgba(52,211,153,.12);color:#34d399;font-size:.63rem;font-weight:700;padding:2px 9px;border-radius:20px;border:1px solid rgba(52,211,153,.25)"><i class="fas fa-check-circle" style="margin-right:3px"></i>Finalisé</span>`
    : `<span style="background:rgba(251,191,36,.1);color:#fbbf24;font-size:.63rem;font-weight:700;padding:2px 9px;border-radius:20px;border:1px solid rgba(251,191,36,.25)"><i class="fas fa-edit" style="margin-right:3px"></i>Brouillon</span>`
  const resultConfig = {
    resolved: { color:'#34d399', bg:'rgba(52,211,153,.1)',  border:'rgba(52,211,153,.2)',  label:'Résolu',     icon:'fa-check-circle' },
    partial:  { color:'#fbbf24', bg:'rgba(251,191,36,.1)',  border:'rgba(251,191,36,.2)',  label:'Partiel',    icon:'fa-exclamation-triangle' },
    pending:  { color:'#f87171', bg:'rgba(248,113,113,.1)', border:'rgba(248,113,113,.2)', label:'En attente', icon:'fa-times-circle' },
  }
  const rc = resultConfig[r.result] || { color:'#94a3b8', bg:'rgba(148,163,184,.1)', border:'rgba(148,163,184,.2)', label: r.result, icon:'fa-circle' }
  const typeLabel = r.intervention_type === 'preventive'
    ? `<span style="font-size:.63rem;color:#a78bfa"><i class="fas fa-shield-alt" style="margin-right:3px"></i>Préventive</span>`
    : `<span style="font-size:.63rem;color:#60a5fa"><i class="fas fa-tools" style="margin-right:3px"></i>Corrective</span>`
  const photoIcon = r.photo_count > 0
    ? `<span style="font-size:.65rem;color:#60a5fa"><i class="fas fa-camera" style="margin-right:3px"></i>${r.photo_count} photo${r.photo_count>1?'s':''}</span>`
    : ''
  const qualityBadge = r.quality_rating
    ? `<span style="font-size:.63rem;color:#fbbf24"><i class="fas fa-star" style="margin-right:3px"></i>${r.quality_rating}/10</span>`
    : ''
  // Couleur bordure gauche selon résultat
  const borderAccent = rc.color
  return `
    <div style="
      background:var(--bg-secondary);
      border:1px solid var(--border);
      border-left:3px solid ${borderAccent};
      border-radius:12px;padding:1.1rem 1.25rem;
      transition:all .2s;position:relative;overflow:hidden;
    "
    onmouseover="this.style.borderColor='${borderAccent}';this.style.boxShadow='0 4px 20px rgba(0,0,0,.15)'"
    onmouseout="this.style.borderColor='var(--border)';this.style.borderLeftColor='${borderAccent}';this.style.boxShadow='none'">

      <!-- Accent déco -->
      <div style="position:absolute;top:0;right:0;width:80px;height:80px;border-radius:0 12px 0 0;
                  background:radial-gradient(circle at top right,${rc.bg},transparent 70%);pointer-events:none"></div>

      <div style="position:relative;display:flex;align-items:flex-start;justify-content:space-between;gap:1rem">
        <div style="flex:1;min-width:0">

          <!-- Badges ligne 1 -->
          <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;margin-bottom:.55rem">
            ${statusBadge}
            <span style="background:${rc.bg};color:${rc.color};font-size:.63rem;font-weight:700;padding:2px 9px;border-radius:20px;border:1px solid ${rc.border}">
              <i class="fas ${rc.icon}" style="margin-right:3px"></i>${rc.label}
            </span>
            ${typeLabel}
            ${r.reference_num ? `<span style="font-size:.62rem;color:var(--text-secondary);font-family:monospace;opacity:.7">${escHtml(r.reference_num)}</span>` : ''}
          </div>

          <!-- Titre -->
          <div style="font-weight:700;font-size:.92rem;color:var(--text-primary);
                      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
                      margin-bottom:.5rem">${escHtml(r.title)}</div>

          <!-- Méta infos -->
          <div style="display:flex;gap:.85rem;flex-wrap:wrap;align-items:center">
            ${r.client ? `<span style="font-size:.72rem;color:var(--text-secondary)"><i class="fas fa-building" style="margin-right:4px;color:#60a5fa;opacity:.8"></i>${escHtml(r.client)}</span>` : ''}
            ${r.technician_name ? `<span style="font-size:.72rem;color:var(--text-secondary)"><i class="fas fa-user-cog" style="margin-right:4px;color:#a78bfa;opacity:.8"></i>${escHtml(r.technician_name)}</span>` : ''}
            ${r.intervention_date ? `<span style="font-size:.72rem;color:var(--text-secondary)"><i class="fas fa-calendar" style="margin-right:4px;color:#fbbf24;opacity:.8"></i>${formatDate(r.intervention_date)}</span>` : ''}
            ${r.duration_hours ? `<span style="font-size:.72rem;color:var(--text-secondary)"><i class="fas fa-clock" style="margin-right:4px;opacity:.6"></i>${r.duration_hours}h</span>` : ''}
            ${r.city ? `<span style="font-size:.72rem;color:var(--text-secondary)"><i class="fas fa-map-marker-alt" style="margin-right:4px;opacity:.6"></i>${escHtml(r.city)}</span>` : ''}
            ${photoIcon}
            ${qualityBadge}
          </div>
        </div>

        <!-- Actions -->
        <div style="display:flex;flex-direction:column;gap:.35rem;align-items:flex-end;flex-shrink:0">
          <div style="display:flex;gap:.35rem">
            <button class="btn btn-ghost btn-sm" title="Aperçu / Imprimer PDF" onclick="printCR(${r.id})"
              style="padding:.3rem .55rem;font-size:.75rem;color:#60a5fa">
              <i class="fas fa-print"></i>
            </button>
            <button class="btn btn-ghost btn-sm" title="Modifier" onclick="openCRModal(${r.id})"
              style="padding:.3rem .55rem;font-size:.75rem">
              <i class="fas fa-edit"></i>
            </button>
            ${r.status === 'draft' ? `
            <button class="btn btn-ghost btn-sm" title="Finaliser" onclick="finalizeCR(${r.id})"
              style="padding:.3rem .55rem;font-size:.75rem;color:#34d399">
              <i class="fas fa-check"></i>
            </button>` : ''}
            <button class="btn btn-ghost btn-sm" title="Supprimer" onclick="deleteCR(${r.id}, '${escHtml(r.title).replace(/'/g,"\\'")}' )"
              style="padding:.3rem .55rem;font-size:.75rem;color:#f87171">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          ${r.created_at ? `<span style="font-size:.62rem;color:var(--text-secondary);opacity:.5">${formatDate(r.created_at)}</span>` : ''}
        </div>
      </div>
    </div>
  `
}

// ─── OPEN MODAL ────────────────────────────────────────────────
async function openCRModal(id) {
  let cr = null
  let interventions = []
  try { const d = await http.get(`${API.interventions}?limit=100`); interventions = d.data || [] } catch(e) {}

  if (id) {
    try { cr = await http.get(`${API.compteRendus}/${id}`) } catch(e) { showToast('Erreur de chargement','error'); return }
  }

  const today = new Date().toISOString().split('T')[0]
  const intOptions = interventions.map(i =>
    `<option value="${i.id}" data-client="${escHtml(i.client||'')}" data-tech="${escHtml(i.technician_name||'')}" data-equip="${escHtml(i.equipment||'')}" data-city="${escHtml(i.city||'')}" data-type="${i.type||'corrective'}" data-priority="${i.priority||'medium'}" data-ref="${escHtml(i.reference_num||'')}" ${cr && cr.intervention_id==i.id?'selected':''}>${escHtml(i.reference_num||'#'+i.id)} — ${escHtml(i.title)} (${escHtml(i.client||'—')})</option>`
  ).join('')

  const photosHtml = cr && cr.photos && cr.photos.length > 0
    ? cr.photos.map(p => `
        <div id="existing-photo-${p.id}" style="position:relative;display:inline-block">
          <img src="" data-photo-id="${p.id}" data-report-id="${id}" onclick="loadPhotoFull(this)"
            style="width:80px;height:80px;object-fit:cover;border-radius:8px;border:1px solid var(--border);cursor:pointer"
            title="${escHtml(p.caption||p.filename||'')}" />
          <button onclick="deleteExistingPhoto(${p.id},${id})" style="position:absolute;top:-5px;right:-5px;background:#f87171;border:none;border-radius:50%;width:18px;height:18px;font-size:.6rem;cursor:pointer;color:white;display:flex;align-items:center;justify-content:center">✕</button>
        </div>`).join('')
    : ''

  const partsList = cr && cr.parts_used ? (typeof cr.parts_used === 'string' ? JSON.parse(cr.parts_used) : cr.parts_used) : []

  document.getElementById('modal-container').innerHTML = `
    <div class="modal-overlay active" id="cr-modal-overlay" onclick="if(event.target===this)closeCRModal()">
      <div class="modal" style="max-width:780px;max-height:90vh;overflow-y:auto" onclick="event.stopPropagation()">
        <div class="modal-header">
          <span class="modal-title"><i class="fas fa-file-alt" style="margin-right:8px;color:var(--accent-blue)"></i>${id ? 'Modifier' : 'Nouveau'} Compte Rendu</span>
          <button class="modal-close" onclick="closeCRModal()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body" style="padding:1.5rem">
          <form id="cr-form" onsubmit="saveCR(event,${id||'null'})">

            <!-- Lier à une intervention -->
            <div style="background:rgba(59,130,246,.07);border:1px solid rgba(59,130,246,.2);border-radius:10px;padding:1rem;margin-bottom:1.25rem">
              <label class="form-label" style="font-size:.75rem;font-weight:700;color:var(--accent-blue);text-transform:uppercase;letter-spacing:.5px">
                <i class="fas fa-link"></i> Lier à une intervention
              </label>
              <select id="cr-intervention" class="select" style="width:100%" onchange="autofillCR(this)">
                <option value="">— Sélectionner une intervention (optionnel) —</option>
                ${intOptions}
              </select>
            </div>

            <!-- Infos rapport -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
              <div style="grid-column:1/-1">
                <label class="form-label">Titre du compte rendu *</label>
                <input type="text" id="cr-title" class="input" required placeholder="Ex: CR Maintenance pompe — Site A" value="${escHtml(cr?.title||'')}">
              </div>
              <div>
                <label class="form-label">Client</label>
                <input type="text" id="cr-client" class="input" placeholder="Nom du client" value="${escHtml(cr?.client||'')}">
              </div>
              <div>
                <label class="form-label">Technicien</label>
                <input type="text" id="cr-tech" class="input" placeholder="Nom du technicien" value="${escHtml(cr?.technician_name||'')}">
              </div>
              <div>
                <label class="form-label">Équipement</label>
                <input type="text" id="cr-equip" class="input" placeholder="Ex: Pompe HP-200" value="${escHtml(cr?.equipment||'')}">
              </div>
              <div>
                <label class="form-label">Ville / Site</label>
                <input type="text" id="cr-city" class="input" placeholder="Casablanca — Site A" value="${escHtml(cr?.city||'')}">
              </div>
              <div>
                <label class="form-label">Date d'intervention</label>
                <input type="date" id="cr-date" class="input" value="${cr?.intervention_date||today}">
              </div>
              <div>
                <label class="form-label">Durée (heures)</label>
                <input type="number" id="cr-duration" class="input" step="0.5" min="0" placeholder="0" value="${cr?.duration_hours||''}">
              </div>
              <div>
                <label class="form-label">Type</label>
                <select id="cr-type" class="select">
                  <option value="corrective" ${(!cr||cr.intervention_type==='corrective')?'selected':''}>Corrective</option>
                  <option value="preventive" ${cr?.intervention_type==='preventive'?'selected':''}>Préventive</option>
                </select>
              </div>
              <div>
                <label class="form-label">Priorité</label>
                <select id="cr-priority" class="select">
                  <option value="low"      ${cr?.priority==='low'     ?'selected':''}>Basse</option>
                  <option value="medium"   ${(!cr||cr.priority==='medium')  ?'selected':''}>Moyenne</option>
                  <option value="high"     ${cr?.priority==='high'    ?'selected':''}>Haute</option>
                  <option value="critical" ${cr?.priority==='critical'?'selected':''}>Critique</option>
                </select>
              </div>
              <div>
                <label class="form-label">Résultat</label>
                <select id="cr-result" class="select">
                  <option value="resolved" ${(!cr||cr.result==='resolved')?'selected':''}>✅ Résolu</option>
                  <option value="partial"  ${cr?.result==='partial'?'selected':''}>⚠️ Partiel</option>
                  <option value="pending"  ${cr?.result==='pending'?'selected':''}>🔴 En attente</option>
                </select>
              </div>
              <div>
                <label class="form-label">Note qualité (1-10)</label>
                <input type="number" id="cr-quality" class="input" min="1" max="10" placeholder="8" value="${cr?.quality_rating||''}">
              </div>
            </div>

            <!-- Travaux -->
            <div style="margin-bottom:1rem">
              <label class="form-label">Travaux effectués *</label>
              <textarea id="cr-work" class="input" rows="4" placeholder="Décrivez les travaux réalisés, les étapes effectuées..." style="resize:vertical;font-family:inherit">${escHtml(cr?.work_performed||'')}</textarea>
            </div>
            <div style="margin-bottom:1rem">
              <label class="form-label">Observations / Constats</label>
              <textarea id="cr-obs" class="input" rows="3" placeholder="Observations terrain, anomalies constatées..." style="resize:vertical;font-family:inherit">${escHtml(cr?.observations||'')}</textarea>
            </div>
            <div style="margin-bottom:1rem">
              <label class="form-label">Recommandations</label>
              <textarea id="cr-reco" class="input" rows="2" placeholder="Actions préventives recommandées pour le futur..." style="resize:vertical;font-family:inherit">${escHtml(cr?.recommendations||'')}</textarea>
            </div>

            <!-- Pièces utilisées -->
            <div style="margin-bottom:1rem">
              <label class="form-label">Pièces / Matériaux utilisés</label>
              <div id="parts-container" style="display:flex;flex-direction:column;gap:.4rem">
                ${partsList.map((p,i) => crPartRow(p, i)).join('')}
              </div>
              <button type="button" class="btn btn-ghost btn-sm" style="margin-top:.5rem" onclick="addCRPart()">
                <i class="fas fa-plus"></i> Ajouter une pièce
              </button>
            </div>

            <!-- Signature client -->
            <div style="margin-bottom:1.25rem">
              <label class="form-label">Signature / Validation client</label>
              <input type="text" id="cr-signature" class="input" placeholder="Nom du responsable client ayant validé" value="${escHtml(cr?.client_signature||'')}">
            </div>

            <!-- Photos -->
            <div style="margin-bottom:1.5rem">
              <label class="form-label"><i class="fas fa-camera" style="margin-right:6px;color:var(--accent-blue)"></i>Photos (max 5)</label>
              <!-- Photos existantes -->
              ${photosHtml ? `<div id="existing-photos" style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:.5rem">${photosHtml}</div>` : ''}
              <!-- Upload zone -->
              <div id="cr-drop-zone" onclick="document.getElementById('cr-photos-input').click()"
                style="border:2px dashed var(--border);border-radius:10px;padding:1.5rem;text-align:center;cursor:pointer;
                       transition:border-color .2s;color:var(--text-secondary);font-size:.8rem"
                ondragover="event.preventDefault();this.style.borderColor='var(--accent-blue)'"
                ondragleave="this.style.borderColor='var(--border)'"
                ondrop="handleCRDrop(event)">
                <i class="fas fa-cloud-upload-alt" style="font-size:1.8rem;opacity:.4;display:block;margin-bottom:.5rem"></i>
                Cliquez ou glissez des photos ici<br>
                <span style="font-size:.7rem;opacity:.6">JPG, PNG, WEBP — max 2 Mo par photo</span>
              </div>
              <input type="file" id="cr-photos-input" accept="image/*" multiple style="display:none" onchange="handleCRPhotos(this.files)">
              <div id="cr-photos-preview" style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.5rem"></div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:.75rem;padding-top:1rem;border-top:1px solid var(--border)">
              <button type="button" class="btn btn-ghost" onclick="closeCRModal()">Annuler</button>
              <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${id ? 'Enregistrer' : 'Créer'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
  // Lazy-load existing photos
  if (cr && cr.photos && cr.photos.length > 0) {
    cr.photos.forEach(p => {
      http.get(`${API.compteRendus}/${id}/photos/${p.id}`).then(data => {
        const img = document.querySelector(`img[data-photo-id="${p.id}"]`)
        if (img && data.data_url) img.src = data.data_url
      }).catch(()=>{})
    })
  }
}

// Parts management
let _crPartIdx = 0
function crPartRow(p = {}, i = null) {
  const idx = i !== null ? i : _crPartIdx++
  return `<div id="part-row-${idx}" style="display:flex;gap:.5rem;align-items:center">
    <input type="text" class="input" style="flex:2" placeholder="Désignation" value="${escHtml(p.name||'')}">
    <input type="text" class="input" style="flex:1;max-width:90px" placeholder="Qté" value="${escHtml(p.qty||'')}">
    <input type="text" class="input" style="flex:1;max-width:100px" placeholder="Réf / Code" value="${escHtml(p.ref||'')}">
    <button type="button" onclick="document.getElementById('part-row-${idx}').remove()" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:1rem;padding:4px">✕</button>
  </div>`
}
function addCRPart() {
  const c = document.getElementById('parts-container')
  const div = document.createElement('div')
  div.innerHTML = crPartRow({}, _crPartIdx++)
  c.appendChild(div.firstElementChild)
}

// Autofill from intervention
function autofillCR(sel) {
  const opt = sel.options[sel.selectedIndex]
  if (!opt || !opt.value) return
  const set = (id, val) => { const el = document.getElementById(id); if(el && val) el.value = val }
  set('cr-client',   opt.dataset.client)
  set('cr-tech',     opt.dataset.tech)
  set('cr-equip',    opt.dataset.equip)
  set('cr-city',     opt.dataset.city)
  set('cr-type',     opt.dataset.type)
  set('cr-priority', opt.dataset.priority)
  const titleEl = document.getElementById('cr-title')
  if (titleEl && !titleEl.value) titleEl.value = `CR — ${opt.text.split('—').slice(1).join('—').trim().substring(0,60)}`
}

// Photo handling
const _crNewPhotos = []
function handleCRPhotos(files) {
  const preview = document.getElementById('cr-photos-preview')
  Array.from(files).slice(0, 5 - _crNewPhotos.length).forEach(file => {
    if (file.size > 2.5 * 1024 * 1024) { showToast(`${file.name} trop lourd (max 2Mo)`, 'warning'); return }
    const reader = new FileReader()
    reader.onload = e => {
      const dataUrl = e.target.result
      _crNewPhotos.push({ filename: file.name, caption: '', data_url: dataUrl, size_bytes: file.size })
      const idx = _crNewPhotos.length - 1
      const div = document.createElement('div')
      div.style.cssText = 'position:relative;display:inline-block'
      div.innerHTML = `<img src="${dataUrl}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;border:1px solid var(--accent-blue)">
        <input type="text" placeholder="Légende" style="width:80px;font-size:.6rem;background:var(--bg-secondary);border:1px solid var(--border);border-radius:4px;padding:2px 4px;color:var(--text-primary);margin-top:2px" onchange="_crNewPhotos[${idx}].caption=this.value">
        <button type="button" onclick="this.parentElement.remove();_crNewPhotos.splice(${idx},1)" style="position:absolute;top:-5px;right:-5px;background:#f87171;border:none;border-radius:50%;width:18px;height:18px;font-size:.6rem;cursor:pointer;color:white">✕</button>`
      preview.appendChild(div)
    }
    reader.readAsDataURL(file)
  })
}
function handleCRDrop(event) {
  event.preventDefault()
  document.getElementById('cr-drop-zone').style.borderColor = 'var(--border)'
  handleCRPhotos(event.dataTransfer.files)
}

async function loadPhotoFull(img) {
  const photoId  = img.dataset.photoId
  const reportId = img.dataset.reportId
  if (!photoId || !reportId) return
  try {
    const data = await http.get(`${API.compteRendus}/${reportId}/photos/${photoId}`)
    const w = window.open()
    w.document.write(`<img src="${data.data_url}" style="max-width:100%;height:auto">`)
  } catch(e) {}
}

async function deleteExistingPhoto(photoId, reportId) {
  if (!confirm('Supprimer cette photo ?')) return
  try {
    await http.delete(`${API.compteRendus}/${reportId}/photos/${photoId}`)
    document.getElementById(`existing-photo-${photoId}`)?.remove()
    showToast('Photo supprimée', 'success')
  } catch(e) { showToast('Erreur', 'error') }
}

function closeCRModal() {
  document.getElementById('modal-container').innerHTML = ''
  _crNewPhotos.length = 0
}

// ─── SAVE ──────────────────────────────────────────────────────
async function saveCR(e, id) {
  e.preventDefault()
  // Collect parts
  const parts = []
  document.querySelectorAll('#parts-container > div').forEach(row => {
    const inputs = row.querySelectorAll('input')
    if (inputs[0] && inputs[0].value.trim()) {
      parts.push({ name: inputs[0].value.trim(), qty: inputs[1]?.value||'', ref: inputs[2]?.value||'' })
    }
  })
  const intSel = document.getElementById('cr-intervention')
  const payload = {
    intervention_id:   intSel?.value || null,
    title:             document.getElementById('cr-title').value.trim(),
    client:            document.getElementById('cr-client').value.trim(),
    technician_name:   document.getElementById('cr-tech').value.trim(),
    equipment:         document.getElementById('cr-equip').value.trim(),
    city:              document.getElementById('cr-city').value.trim(),
    intervention_date: document.getElementById('cr-date').value,
    duration_hours:    parseFloat(document.getElementById('cr-duration').value) || 0,
    intervention_type: document.getElementById('cr-type').value,
    priority:          document.getElementById('cr-priority').value,
    result:            document.getElementById('cr-result').value,
    quality_rating:    parseInt(document.getElementById('cr-quality').value) || null,
    work_performed:    document.getElementById('cr-work').value.trim(),
    observations:      document.getElementById('cr-obs').value.trim(),
    recommendations:   document.getElementById('cr-reco').value.trim(),
    client_signature:  document.getElementById('cr-signature').value.trim(),
    parts_used:        parts,
    photos:            [..._crNewPhotos],
    status:            'draft'
  }
  // auto-set reference_num from intervention
  if (intSel?.value) {
    const opt = intSel.options[intSel.selectedIndex]
    const ref = opt?.dataset?.ref
    if (ref) payload.reference_num = ref
  }
  try {
    if (id) { await http.put(`${API.compteRendus}/${id}`, payload); showToast('Compte rendu mis à jour', 'success') }
    else     { await http.post(API.compteRendus, payload);          showToast('Compte rendu créé', 'success') }
    closeCRModal()
    await loadCR()
  } catch(err) { showToast('Erreur lors de la sauvegarde', 'error') }
}

// ─── FINALIZE ──────────────────────────────────────────────────
async function finalizeCR(id) {
  if (!confirm('Finaliser ce compte rendu ? Il ne pourra plus être modifié.')) return
  try {
    await http.post(`${API.compteRendus}/${id}/finalize`, {})
    showToast('Rapport finalisé ✅', 'success')
    await loadCR()
  } catch(e) { showToast('Erreur', 'error') }
}

// ─── DELETE ────────────────────────────────────────────────────
async function deleteCR(id, title) {
  if (!confirm(`Supprimer le compte rendu "${title}" ?`)) return
  try {
    await http.delete(`${API.compteRendus}/${id}`)
    showToast('Compte rendu supprimé', 'success')
    await loadCR()
  } catch(e) { showToast('Erreur', 'error') }
}

// ─── PRINT / PDF ───────────────────────────────────────────────
async function printCR(id) {
  showToast('Chargement du rapport...', 'info')
  try {
    const cr = await http.get(`${API.compteRendus}/${id}`)
    // Load photos
    const photoImgs = []
    if (cr.photos && cr.photos.length > 0) {
      for (const p of cr.photos) {
        try {
          const data = await http.get(`${API.compteRendus}/${id}/photos/${p.id}`)
          photoImgs.push({ src: data.data_url, caption: p.caption || p.filename || '' })
        } catch(e) {}
      }
    }
    const resultColor = { resolved:'#16a34a', partial:'#d97706', pending:'#dc2626' }
    const priorityColor = { low:'#64748b', medium:'#3b82f6', high:'#f59e0b', critical:'#ef4444' }
    const typeLabel = cr.intervention_type === 'preventive' ? 'Préventive' : 'Corrective'
    const prioLabel = { low:'Basse', medium:'Moyenne', high:'Haute', critical:'Critique' }[cr.priority] || cr.priority
    const parts = cr.parts_used ? (typeof cr.parts_used==='string'?JSON.parse(cr.parts_used):cr.parts_used) : []
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>CR — ${cr.title}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#1e293b;background:#fff;padding:0}
  @page{size:A4 portrait;margin:15mm 12mm 12mm 12mm}
  .page{width:100%;max-width:780px;margin:0 auto}
  /* Header */
  .header{background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);color:white;padding:18px 22px;border-radius:0 0 12px 12px;margin-bottom:18px}
  .header-top{display:flex;justify-content:space-between;align-items:flex-start}
  .header h1{font-size:1.15rem;font-weight:700;margin:0}
  .header .ref{font-size:.75rem;opacity:.7;margin-top:3px;font-family:monospace}
  .badge{display:inline-block;padding:2px 10px;border-radius:20px;font-size:.7rem;font-weight:700;border:1px solid rgba(255,255,255,.3)}
  /* Section titles */
  .section{margin-bottom:14px}
  .section-title{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#64748b;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:8px}
  /* Info grid */
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 14px}
  .info-item{display:flex;flex-direction:column;gap:1px}
  .info-label{font-size:.65rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px}
  .info-value{font-size:.82rem;font-weight:600;color:#1e293b}
  /* Content blocks */
  .content-block{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;margin-bottom:8px;font-size:.82rem;line-height:1.6;color:#334155;white-space:pre-wrap;word-break:break-word}
  /* Parts table */
  table{width:100%;border-collapse:collapse;font-size:.78rem}
  th{background:#f1f5f9;padding:5px 8px;text-align:left;font-weight:700;font-size:.68rem;text-transform:uppercase;letter-spacing:.5px;color:#64748b;border-bottom:2px solid #e2e8f0}
  td{padding:5px 8px;border-bottom:1px solid #f1f5f9}
  tr:last-child td{border:none}
  /* Photos */
  .photos-grid{display:flex;flex-wrap:wrap;gap:8px}
  .photo-item{text-align:center}
  .photo-item img{width:160px;height:130px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0}
  .photo-caption{font-size:.65rem;color:#64748b;margin-top:3px;max-width:160px}
  /* Footer */
  .footer{margin-top:20px;padding-top:12px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:flex-end}
  .signature-box{border:1px solid #e2e8f0;border-radius:8px;padding:8px 14px;min-width:200px;min-height:60px;text-align:center;font-size:.7rem;color:#94a3b8}
  .result-chip{display:inline-block;padding:3px 12px;border-radius:20px;font-size:.75rem;font-weight:700}
  @media print{.no-print{display:none}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="header-top">
      <div>
        <div style="font-size:.72rem;opacity:.6;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">PPrime — GMAO</div>
        <h1>${cr.title}</h1>
        ${cr.reference_num ? `<div class="ref">${cr.reference_num}</div>` : ''}
      </div>
      <div style="text-align:right">
        <span class="badge" style="background:${resultColor[cr.result]||'#64748b'};margin-bottom:4px">
          ${cr.result==='resolved'?'✓ Résolu':cr.result==='partial'?'⚠ Partiel':'● En attente'}
        </span>
        <div style="font-size:.68rem;opacity:.65;margin-top:4px">${cr.status==='finalized'?'Rapport finalisé':'Brouillon'}</div>
      </div>
    </div>
  </div>

  <!-- Informations -->
  <div class="section">
    <div class="section-title">📋 Informations de l'intervention</div>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Client</span><span class="info-value">${cr.client||'—'}</span></div>
      <div class="info-item"><span class="info-label">Date</span><span class="info-value">${cr.intervention_date||'—'}</span></div>
      <div class="info-item"><span class="info-label">Équipement</span><span class="info-value">${cr.equipment||'—'}</span></div>
      <div class="info-item"><span class="info-label">Lieu</span><span class="info-value">${cr.city||'—'}</span></div>
      <div class="info-item"><span class="info-label">Type</span><span class="info-value">${typeLabel}</span></div>
      <div class="info-item"><span class="info-label">Priorité</span><span class="info-value" style="color:${priorityColor[cr.priority]||'#64748b'}">${prioLabel}</span></div>
      <div class="info-item"><span class="info-label">Durée</span><span class="info-value">${cr.duration_hours||0} h</span></div>
      ${cr.quality_rating ? `<div class="info-item"><span class="info-label">Note qualité</span><span class="info-value">${cr.quality_rating}/10</span></div>` : ''}
    </div>
  </div>

  <!-- Travaux -->
  <div class="section">
    <div class="section-title">🔧 Travaux effectués</div>
    <div class="content-block">${cr.work_performed||'Non renseigné'}</div>
  </div>

  ${cr.observations ? `<div class="section"><div class="section-title">👁 Observations</div><div class="content-block">${cr.observations}</div></div>` : ''}
  ${cr.recommendations ? `<div class="section"><div class="section-title">💡 Recommandations</div><div class="content-block">${cr.recommendations}</div></div>` : ''}

  <!-- Pièces -->
  ${parts.length > 0 ? `
  <div class="section">
    <div class="section-title">🔩 Pièces / Matériaux utilisés</div>
    <table>
      <tr><th>Désignation</th><th>Quantité</th><th>Référence</th></tr>
      ${parts.map(p => `<tr><td>${p.name||'—'}</td><td>${p.qty||'—'}</td><td style="font-family:monospace;font-size:.73rem">${p.ref||'—'}</td></tr>`).join('')}
    </table>
  </div>` : ''}

  <!-- Photos -->
  ${photoImgs.length > 0 ? `
  <div class="section">
    <div class="section-title">📷 Photos</div>
    <div class="photos-grid">
      ${photoImgs.map(p => `<div class="photo-item"><img src="${p.src}"><div class="photo-caption">${p.caption}</div></div>`).join('')}
    </div>
  </div>` : ''}

  <!-- Footer signatures -->
  <div class="footer">
    <div>
      <div style="font-size:.7rem;color:#94a3b8;margin-bottom:6px">Rédigé par</div>
      <div style="font-size:.82rem;font-weight:600">${cr.created_by||'Mohcine Banaoui'}</div>
      <div style="font-size:.7rem;color:#94a3b8;margin-top:3px">Généré le ${new Date().toLocaleDateString('fr-FR')}</div>
    </div>
    <div class="signature-box">
      ${cr.client_signature ? `<div style="font-size:.75rem;font-weight:600;color:#1e293b;margin-top:10px">${cr.client_signature}</div><div style="font-size:.65rem;color:#94a3b8;margin-top:3px">Validé par le client</div>` : `<div style="margin-top:14px">Signature client</div>`}
    </div>
  </div>

  <div class="no-print" style="text-align:center;margin-top:25px">
    <button onclick="window.print()" style="background:#1e3a5f;color:white;border:none;padding:10px 28px;border-radius:8px;font-size:.9rem;cursor:pointer;font-weight:600">
      <span style="margin-right:6px">🖨</span> Imprimer / Enregistrer PDF
    </button>
  </div>
</div>
</body>
</html>`
    const w = window.open('', '_blank')
    w.document.write(html)
    w.document.close()
  } catch(err) { showToast('Erreur lors de la génération', 'error') }
}

// ============================================================
// NOTIFICATIONS — Centre de notifications automatiques
// ============================================================
async function renderNotifications() {
  const pc = document.getElementById('page-container')
  pc.innerHTML = `
    <div class="page-header">
      <div>
        <h1 style="font-size:1.2rem;font-weight:700;display:flex;align-items:center;gap:8px">
          <i class="fas fa-bell" style="color:var(--accent-yellow)"></i>
          Notifications automatiques
        </h1>
        <p style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px">
          Emails envoyés automatiquement pour les interventions dans les 24h / 48h
        </p>
      </div>
      <button class="btn-primary" onclick="triggerNotifCheck()" id="btn-trigger-check" style="gap:6px">
        <i class="fas fa-paper-plane"></i> Lancer la vérification maintenant
      </button>
    </div>

    <!-- Info banner -->
    <div style="background:linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08));
                border:1px solid rgba(99,102,241,0.25);border-radius:10px;padding:1rem 1.25rem;
                margin-bottom:1.25rem;display:flex;gap:12px;align-items:flex-start">
      <i class="fas fa-info-circle" style="color:#818cf8;margin-top:2px;flex-shrink:0"></i>
      <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.6">
        <strong style="color:var(--text-primary)">Comment ça fonctionne :</strong><br/>
        Le système vérifie automatiquement <strong>chaque heure</strong> (cron trigger Cloudflare) les interventions planifiées.<br/>
        • <span style="color:#f59e0b">●</span> <strong>48h avant</strong> : email de rappel envoyé une seule fois.<br/>
        • <span style="color:#ef4444">●</span> <strong>24h avant</strong> : email urgent envoyé une seule fois.<br/>
        Destinataire : <code style="background:rgba(255,255,255,0.05);padding:1px 6px;border-radius:4px;color:#a5b4fc">mfs326467@gmail.com</code>
      </div>
    </div>

    <!-- Result box -->
    <div id="notif-result" style="display:none;margin-bottom:1.25rem"></div>

    <!-- Two panels: preview + status -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem" id="notif-panels">
      <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:10px;padding:1.1rem 1.25rem">
        <div style="font-weight:600;font-size:0.82rem;color:var(--text-primary);margin-bottom:1rem;
                    display:flex;align-items:center;gap:7px">
          <i class="fas fa-clock" style="color:var(--accent-yellow)"></i>
          Interventions à notifier (prochaines 48h)
        </div>
        <div id="notif-preview-content">
          <div style="text-align:center;padding:2rem;color:var(--text-secondary);font-size:0.78rem;opacity:0.6">
            <i class="fas fa-sync fa-spin" style="margin-right:6px"></i> Chargement…
          </div>
        </div>
      </div>
      <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:10px;padding:1.1rem 1.25rem">
        <div style="font-weight:600;font-size:0.82rem;color:var(--text-primary);margin-bottom:1rem;
                    display:flex;align-items:center;gap:7px">
          <i class="fas fa-history" style="color:var(--accent-purple)"></i>
          Statut de toutes les notifications
        </div>
        <div id="notif-status-content">
          <div style="text-align:center;padding:2rem;color:var(--text-secondary);font-size:0.78rem;opacity:0.6">
            <i class="fas fa-sync fa-spin" style="margin-right:6px"></i> Chargement…
          </div>
        </div>
      </div>
    </div>

    <!-- Cron info -->
    <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:10px;
                padding:1rem 1.25rem">
      <div style="font-weight:600;font-size:0.82rem;color:var(--text-primary);margin-bottom:0.75rem;
                  display:flex;align-items:center;gap:7px">
        <i class="fas fa-robot" style="color:var(--accent-green)"></i>
        Cron trigger Cloudflare
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:0.75rem">
        ${[
          { icon:'fas fa-clock', label:'Fréquence', value:'Chaque heure (0 * * * *)', color:'var(--accent-yellow)' },
          { icon:'fas fa-envelope', label:'Destinataire', value:'mfs326467@gmail.com', color:'var(--accent-blue)' },
          { icon:'fas fa-paper-plane', label:'Service email', value:'Resend API', color:'var(--accent-purple)' },
          { icon:'fas fa-shield-alt', label:'Anti-doublon', value:'email_sent_24h / email_sent_48h', color:'var(--accent-green)' },
        ].map(item => `
          <div style="background:var(--bg-primary);border:1px solid var(--border);border-radius:8px;
                      padding:0.75rem 1rem;display:flex;gap:10px;align-items:center">
            <i class="${item.icon}" style="color:${item.color};font-size:1rem;flex-shrink:0"></i>
            <div>
              <div style="font-size:0.65rem;color:var(--text-secondary);text-transform:uppercase;
                          letter-spacing:.5px;font-weight:600">${item.label}</div>
              <div style="font-size:0.78rem;color:var(--text-primary);font-weight:500;margin-top:2px">${item.value}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  `
  // Load data
  loadNotifPreview()
  loadNotifStatus()
}

async function loadNotifPreview() {
  try {
    const data = await http.get('/api/notifications/preview')
    const box = document.getElementById('notif-preview-content')
    if (!box) return
    if (!data.interventions || data.interventions.length === 0) {
      box.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-secondary);font-size:0.78rem;opacity:0.6">
        <i class="fas fa-check-circle" style="color:var(--accent-green);margin-right:6px"></i>
        Aucune intervention à notifier dans les 48h
      </div>`
      return
    }
    box.innerHTML = data.interventions.map(i => {
      const h = parseFloat(i.hours_until) || 0
      const isUrgent = h <= 24
      const color = isUrgent ? '#ef4444' : '#f59e0b'
      const label = isUrgent ? `⚠️ ${h.toFixed(1)}h` : `🔔 ${h.toFixed(1)}h`
      const will24 = i.will_send_24h ? '<span style="background:rgba(239,68,68,0.15);color:#f87171;padding:1px 6px;border-radius:4px;font-size:0.65rem;font-weight:600">EMAIL 24h</span>' : ''
      const will48 = i.will_send_48h ? '<span style="background:rgba(245,158,11,0.15);color:#fbbf24;padding:1px 6px;border-radius:4px;font-size:0.65rem;font-weight:600">EMAIL 48h</span>' : ''
      const done24 = i.email_sent_24h ? '<span style="background:rgba(52,211,153,0.1);color:#34d399;padding:1px 6px;border-radius:4px;font-size:0.65rem">✓ 24h</span>' : ''
      const done48 = i.email_sent_48h ? '<span style="background:rgba(52,211,153,0.1);color:#34d399;padding:1px 6px;border-radius:4px;font-size:0.65rem">✓ 48h</span>' : ''
      return `
        <div style="border:1px solid var(--border);border-left:3px solid ${color};border-radius:8px;
                    padding:0.7rem 0.85rem;margin-bottom:0.6rem;background:var(--bg-primary)">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
            <div style="min-width:0">
              <div style="font-weight:600;font-size:0.82rem;color:var(--text-primary);
                          white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                ${escHtml(i.reference_num || i.title)}
              </div>
              <div style="font-size:0.72rem;color:var(--text-secondary);margin-top:2px">
                ${escHtml(i.client||'—')} · ${escHtml(i.technician_name||'—')}
              </div>
              <div style="font-size:0.7rem;color:var(--text-secondary);margin-top:2px">
                ${formatDate(i.scheduled_date)}
              </div>
            </div>
            <div style="flex-shrink:0;text-align:right">
              <div style="font-size:1rem;font-weight:800;color:${color}">${label}</div>
              <div style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap;justify-content:flex-end">
                ${will48}${will24}${done48}${done24}
              </div>
            </div>
          </div>
          <div style="margin-top:6px;text-align:right">
            <button onclick="resetNotifFlags(${i.id})"
              style="font-size:0.65rem;color:var(--text-secondary);background:none;border:1px solid var(--border);
                     border-radius:4px;padding:2px 8px;cursor:pointer;opacity:0.7"
              title="Réinitialiser les flags pour re-tester">
              <i class="fas fa-redo" style="margin-right:3px"></i>Reset flags
            </button>
          </div>
        </div>`
    }).join('')
  } catch(e) {
    const box = document.getElementById('notif-preview-content')
    if (box) box.innerHTML = `<div style="color:#f87171;font-size:0.78rem;padding:1rem">Erreur : ${e.message}</div>`
  }
}

async function loadNotifStatus() {
  try {
    const data = await http.get('/api/notifications/status')
    const box = document.getElementById('notif-status-content')
    if (!box) return
    if (!data.data || data.data.length === 0) {
      box.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-secondary);font-size:0.78rem;opacity:0.6">
        Aucune intervention avec date planifiée
      </div>`
      return
    }
    const rows = data.data.map(i => {
      const h = i.hours_until
      const timeLabel = h == null ? '—' : h < 0 ? `<span style="color:#6b7280">passé</span>` :
        h <= 24 ? `<span style="color:#ef4444">${parseFloat(h).toFixed(0)}h</span>` :
        h <= 48 ? `<span style="color:#f59e0b">${parseFloat(h).toFixed(0)}h</span>` :
        `<span style="color:var(--text-secondary)">${parseFloat(h).toFixed(0)}h</span>`
      const b24 = i.email_sent_24h
        ? '<i class="fas fa-check-circle" style="color:#34d399" title="Email 24h envoyé"></i>'
        : '<i class="fas fa-circle" style="color:#374151;font-size:0.6rem" title="Non envoyé"></i>'
      const b48 = i.email_sent_48h
        ? '<i class="fas fa-check-circle" style="color:#34d399" title="Email 48h envoyé"></i>'
        : '<i class="fas fa-circle" style="color:#374151;font-size:0.6rem" title="Non envoyé"></i>'
      return `<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-size:0.75rem;color:var(--text-primary);font-weight:600">
          ${escHtml(i.reference_num||i.title||'—')}
        </td>
        <td style="padding:7px 8px;font-size:0.72rem;color:var(--text-secondary)">${timeLabel}</td>
        <td style="padding:7px 8px;text-align:center">${b48}</td>
        <td style="padding:7px 8px;text-align:center">${b24}</td>
      </tr>`
    }).join('')
    box.innerHTML = `
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:1px solid var(--border)">
            <th style="padding:6px 8px;font-size:0.68rem;color:var(--text-secondary);
                       text-align:left;font-weight:600;text-transform:uppercase;letter-spacing:.4px">Référence</th>
            <th style="padding:6px 8px;font-size:0.68rem;color:var(--text-secondary);
                       text-align:left;font-weight:600;text-transform:uppercase;letter-spacing:.4px">Dans</th>
            <th style="padding:6px 8px;font-size:0.68rem;color:var(--text-secondary);
                       text-align:center;font-weight:600;text-transform:uppercase;letter-spacing:.4px">48h</th>
            <th style="padding:6px 8px;font-size:0.68rem;color:var(--text-secondary);
                       text-align:center;font-weight:600;text-transform:uppercase;letter-spacing:.4px">24h</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`
  } catch(e) {
    const box = document.getElementById('notif-status-content')
    if (box) box.innerHTML = `<div style="color:#f87171;font-size:0.78rem;padding:1rem">Erreur : ${e.message}</div>`
  }
}

async function triggerNotifCheck() {
  const btn = document.getElementById('btn-trigger-check')
  const result = document.getElementById('notif-result')
  if (!btn || !result) return
  btn.disabled = true
  btn.innerHTML = '<i class="fas fa-sync fa-spin"></i> Vérification en cours…'
  result.style.display = 'none'
  try {
    const data = await http.get('/api/notifications/check')
    const hasSent   = data.sent   && data.sent.length   > 0
    const hasErrors = data.errors && data.errors.length > 0
    const color = hasErrors ? '#ef4444' : hasSent ? '#34d399' : '#6b7280'
    result.style.display = 'block'
    result.innerHTML = `
      <div style="background:rgba(${hasErrors?'239,68,68':'52,211,153'},0.08);
                  border:1px solid rgba(${hasErrors?'239,68,68':'52,211,153'},0.25);
                  border-radius:10px;padding:1rem 1.25rem">
        <div style="font-weight:700;font-size:0.85rem;color:${color};margin-bottom:0.5rem;display:flex;gap:8px;align-items:center">
          <i class="fas fa-${hasErrors?'exclamation-triangle':'check-circle'}"></i>
          Résultat de la vérification — ${new Date().toLocaleTimeString('fr-FR')}
        </div>
        <div style="font-size:0.78rem;color:var(--text-secondary);line-height:1.8">
          <span>📋 Interventions vérifiées : <strong style="color:var(--text-primary)">${data.checked}</strong></span><br/>
          <span>📧 Emails envoyés : <strong style="color:#34d399">${data.sent ? data.sent.length : 0}</strong>
            ${hasSent ? ' — ' + data.sent.map(s => `<span style="background:rgba(52,211,153,0.1);padding:1px 6px;border-radius:4px;font-size:0.7rem">${s.ref} (${s.horizon})</span>`).join(' ') : ''}
          </span><br/>
          ${hasErrors ? `<span>❌ Erreurs : <strong style="color:#ef4444">${data.errors.length}</strong> — 
            ${data.errors.map(e => `<span style="color:#f87171">${e.ref}: ${escHtml(e.error)}</span>`).join(', ')}
          </span>` : ''}
          ${!hasSent && !hasErrors ? '<span style="opacity:0.7">Aucun email à envoyer pour l\'instant.</span>' : ''}
        </div>
      </div>`
    // Refresh panels
    loadNotifPreview()
    loadNotifStatus()
  } catch(e) {
    result.style.display = 'block'
    result.innerHTML = `<div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);
      border-radius:10px;padding:1rem;color:#f87171;font-size:0.8rem">
      <i class="fas fa-exclamation-triangle" style="margin-right:6px"></i>
      Erreur : ${escHtml(e.message)}
    </div>`
  } finally {
    btn.disabled = false
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Lancer la vérification maintenant'
  }
}

async function resetNotifFlags(id) {
  try {
    await http.post(`/api/notifications/reset/${id}`, {})
    showToast('Flags réinitialisés', 'success')
    loadNotifPreview()
    loadNotifStatus()
  } catch(e) {
    showToast('Erreur : ' + e.message, 'error')
  }
}

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
function initApp() {
  dayjs.locale('fr')
  renderApp()
  navigate('dashboard')
  setTimeout(initLogoFromSettings, 200)
}

document.addEventListener('DOMContentLoaded', () => {
  if (!AUTH.isLoggedIn()) {
    showLoginPage()
  } else {
    initApp()
  }
})
