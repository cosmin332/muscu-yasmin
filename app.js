// ============================================================
//  Muscu Yasmin – App Logic 💖
// ============================================================

// ── State ────────────────────────────────────────────────────
const state = {
  view: 'home',            // home | program | session | progress | rules
  startDate: null,
  completedSessions: {},   // { "p1_lundi_w1": true, ... }
  videoUrls: {},           // { "exercise_id": "https://..." }
  currentSession: null,    // { phaseId, session, weekNumber }
  checkedExercises: {},    // { "p1_lundi_w1_ex_id": true }
  pendingVideoExerciseId: null
};

// ── Init ─────────────────────────────────────────────────────
function init() {
  loadFromStorage();
  registerSW();
  render();
}

function loadFromStorage() {
  const sd = localStorage.getItem('ym_startDate');
  if (sd) state.startDate = new Date(sd);

  state.completedSessions = JSON.parse(localStorage.getItem('ym_completedSessions') || '{}');
  state.videoUrls         = JSON.parse(localStorage.getItem('ym_videoUrls') || '{}');
  state.checkedExercises  = JSON.parse(localStorage.getItem('ym_checkedExercises') || '{}');
}

function save() {
  if (state.startDate)
    localStorage.setItem('ym_startDate', state.startDate.toISOString());
  localStorage.setItem('ym_completedSessions', JSON.stringify(state.completedSessions));
  localStorage.setItem('ym_videoUrls',         JSON.stringify(state.videoUrls));
  localStorage.setItem('ym_checkedExercises',  JSON.stringify(state.checkedExercises));
}

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

// ── Helpers ──────────────────────────────────────────────────
function getCurrentWeek() {
  if (!state.startDate) return null;
  const now = new Date();
  const diff = Math.floor((now - state.startDate) / (1000 * 60 * 60 * 24 * 7));
  return Math.min(Math.max(diff + 1, 1), 12);
}

function getPhaseForWeek(weekNum) {
  return PROGRAM.phases.find(p => p.weekNumbers.includes(weekNum));
}

function getTodaySessionId() {
  const days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const today = days[new Date().getDay()];
  const week  = getCurrentWeek();
  if (!week) return null;
  const phase = getPhaseForWeek(week);
  if (!phase) return null;
  const session = phase.sessions.find(s => s.dayName === today);
  return session ? { session, phase, week } : null;
}

function sessionKey(phaseId, sessionId, weekNum) {
  return `p${phaseId}_${sessionId}_w${weekNum}`;
}

function isSessionDone(phaseId, sessionId, weekNum) {
  return !!state.completedSessions[sessionKey(phaseId, sessionId, weekNum)];
}

function exKey(phaseId, sessionId, weekNum, exId) {
  return `${sessionKey(phaseId, sessionId, weekNum)}_${exId}`;
}

function countDoneSessions() {
  return Object.values(state.completedSessions).filter(Boolean).length;
}

function totalSessions() {
  return 12 * 3; // 3 sessions per week × 12 weeks
}

function getQuote() {
  const idx = Math.floor(Date.now() / 86400000) % QUOTES.length;
  return QUOTES[idx];
}

function formatVolume(vol) {
  if (!vol) return '';
  switch (vol.type) {
    case 'sets_reps':
      return `${vol.sets} séries × ${vol.reps}${vol.rest ? ' — pause ' + vol.rest : ''}`;
    case 'sets_duration':
      return `${vol.sets} séries × ${vol.duration}${vol.rest ? ' — pause ' + vol.rest : ''}`;
    case 'duration':
      return `${vol.duration}${vol.note ? ' · ' + vol.note : ''}`;
    case 'interval':
      return `Total : ${vol.totalDuration}`;
    case 'circuit_reps':
      return `${vol.reps} répétitions`;
    case 'circuit_duration':
      return `${vol.duration}`;
    default:
      return '';
  }
}

function isYouTube(url) {
  return /youtube\.com|youtu\.be/.test(url);
}

function getYouTubeEmbed(url) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0&autoplay=1`;
  return url;
}

// ── Navigation ───────────────────────────────────────────────
function navigateTo(view, data) {
  state.view = view;
  if (data) state.currentSession = data;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('nav-' + view);
  if (btn) btn.classList.add('active');
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openSession(phase, session, weekNum) {
  navigateTo('session', { phase, session, weekNum });
}

// ── Render Orchestrator ──────────────────────────────────────
function render() {
  renderApp();
  renderNav();
}

function renderNav() {
  const views = ['home','program','progress','rules'];
  views.forEach(v => {
    const btn = document.getElementById('nav-' + v);
    if (btn) btn.classList.toggle('active', state.view === v);
  });
}

function renderApp() {
  const app = document.getElementById('app');
  switch (state.view) {
    case 'home':     app.innerHTML = renderHome();     break;
    case 'program':  app.innerHTML = renderProgram();  break;
    case 'session':  app.innerHTML = renderSession();  break;
    case 'progress': app.innerHTML = renderProgress(); break;
    case 'rules':    app.innerHTML = renderRules();    break;
  }
  renderNav();
}

// ══════════════════════════════════════════════════════════════
//  HOME VIEW
// ══════════════════════════════════════════════════════════════
function renderHome() {
  const week    = getCurrentWeek();
  const done    = countDoneSessions();
  const total   = totalSessions();
  const pct     = Math.round((done / total) * 100);
  const todaySess = getTodaySessionId();
  const quote   = getQuote();

  const weekLabel = week ? `Semaine ${week} / 12` : 'Pas encore commencée';
  const phase     = week ? getPhaseForWeek(week) : null;

  let todayCard = '';
  if (!state.startDate) {
    todayCard = `
      <div class="rest-card">
        <div class="rest-emoji">💖</div>
        <h3>Bienvenue Yasmin !</h3>
        <p>Clique sur <strong>Progrès</strong> pour définir ta date de départ et commencer ton programme.</p>
      </div>`;
  } else if (todaySess) {
    const { session, phase: ph, week: wk } = todaySess;
    const done2 = isSessionDone(ph.id, session.id, wk);
    const exCount = session.exercises.length;
    todayCard = `
      <div class="today-card" onclick="openSession(${JSON.stringify(ph).replace(/"/g,"'")}, ${JSON.stringify(session).replace(/"/g,"'")}, ${wk})">
        <div class="today-card-header" style="background: ${ph.gradient}">
          <div class="label">${done2 ? '✅ Séance terminée' : '📅 Séance du jour – ' + session.dayName}</div>
          <h3>${session.dayEmoji} ${session.name}</h3>
        </div>
        <div class="today-card-body">
          <div class="exercises-count">${exCount} exercice${exCount > 1 ? 's' : ''} · ${ph.name}</div>
          <button class="btn-start" onclick="event.stopPropagation(); openSessionById('${ph.id}','${session.id}',${wk})">
            ${done2 ? '🔁 Revoir' : '▶ Commencer'}
          </button>
        </div>
      </div>`;
  } else {
    todayCard = `
      <div class="rest-card">
        <div class="rest-emoji">☁️</div>
        <h3>Jour de repos</h3>
        <p>Profite bien ! Ton corps se reconstruit pendant la récupération 🌸<br>
        ${phase ? phase.restDays.find(r => {
          const days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
          return r.day.toLowerCase().includes(days[new Date().getDay()].toLowerCase());
        })?.note || '' : ''}</p>
      </div>`;
  }

  return `
    <div class="home-view">
      <div class="hero-banner">
        <div class="greeting">Bonjour, championne 💕</div>
        <h2>Mon Programme<br>Renforcement</h2>
        <div class="quote">${quote}</div>
      </div>

      ${state.startDate ? `
      <div class="progress-overview">
        <div class="section-title">Ma progression globale</div>
        <div class="week-badge">
          ${phase ? phase.emoji : '📅'} ${weekLabel}
          ${phase ? `<span class="pill pill-pink" style="font-size:.65rem">${phase.name}</span>` : ''}
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${pct}%"></div>
          </div>
        </div>
        <div class="progress-label">${done} / ${total} séances complétées · ${pct}%</div>
      </div>
      ` : ''}

      <div class="home-section-title">Aujourd'hui</div>
      ${todayCard}

      <div class="home-section-title">Les 3 phases</div>
      ${PROGRAM.phases.map(ph => `
        <div class="today-card" style="cursor:pointer" onclick="navigateTo('program')">
          <div class="today-card-header" style="background: ${ph.gradient}">
            <div class="label">${ph.weeks}</div>
            <h3>${ph.emoji} ${ph.name}</h3>
          </div>
          <div class="today-card-body">
            <div class="exercises-count">${ph.objective.substring(0,60)}…</div>
            <span class="nav-icon">›</span>
          </div>
        </div>
      `).join('')}
    </div>`;
}

function openSessionById(phaseId, sessionId, weekNum) {
  const phase   = PROGRAM.phases.find(p => p.id == phaseId);
  const session = phase.sessions.find(s => s.id === sessionId);
  openSession(phase, session, weekNum);
}

// ══════════════════════════════════════════════════════════════
//  PROGRAM VIEW
// ══════════════════════════════════════════════════════════════
function renderProgram() {
  const week = getCurrentWeek();

  const phaseHtml = PROGRAM.phases.map(phase => {
    const sessionRows = phase.sessions.map(session => {
      // Check completion across all weeks of this phase
      const doneCount = phase.weekNumbers.filter(wn =>
        isSessionDone(phase.id, session.id, wn)
      ).length;
      const totalWeeks = phase.weekNumbers.length;

      const weekTabs = phase.weekNumbers.map(wn => {
        const done = isSessionDone(phase.id, session.id, wn);
        const isCurrent = wn === week;
        return `<span class="week-tab ${done ? 'completed' : ''} ${isCurrent ? 'active' : ''}"
                  onclick="event.stopPropagation(); openSessionById('${phase.id}','${session.id}',${wn})">
                  S${wn}
                </span>`;
      }).join('');

      return `
        <div class="session-row" onclick="openSessionById('${phase.id}','${session.id}',${week || phase.weekNumbers[0]})">
          <div class="session-day-badge">
            <div class="session-day-emoji">${session.dayEmoji}</div>
            <div>${session.dayName.substring(0,3)}</div>
          </div>
          <div class="session-row-info">
            <h4>${session.name}</h4>
            <div class="session-meta">${session.exercises.length} exercice${session.exercises.length > 1 ? 's' : ''} · ${doneCount}/${totalWeeks} semaines ✓</div>
            <div class="week-tabs-wrap" style="padding:8px 0 0;background:transparent;border:none;position:static;" onclick="event.stopPropagation()">
              ${weekTabs}
            </div>
          </div>
          <div class="session-row-arrow">›</div>
        </div>`;
    }).join('');

    return `
      <div class="phase-card" id="phase-${phase.id}">
        <div class="phase-card-header" style="background: ${phase.gradient}" onclick="togglePhase(${phase.id})">
          <div class="phase-emoji-badge">${phase.emoji}</div>
          <div class="phase-info">
            <div class="phase-weeks">${phase.weeks}</div>
            <h2>${phase.name}</h2>
            <p>${phase.objective}</p>
          </div>
          <div class="phase-chevron">▾</div>
        </div>
        <div class="phase-sessions">
          ${sessionRows}
        </div>
      </div>`;
  }).join('');

  return `
    <div class="program-view">
      <div class="page-header">
        <h1>📋 Mon Programme</h1>
        <p>12 semaines · 3 phases · 36 séances</p>
      </div>
      <div style="padding: 16px 0 8px">
        ${phaseHtml}
      </div>
    </div>`;
}

function togglePhase(id) {
  const card = document.getElementById('phase-' + id);
  if (card) card.classList.toggle('open');
}

// ══════════════════════════════════════════════════════════════
//  SESSION DETAIL VIEW
// ══════════════════════════════════════════════════════════════
function renderSession() {
  if (!state.currentSession) return renderProgram();

  const { phase, session, weekNum } = state.currentSession;
  const sKey   = sessionKey(phase.id, session.id, weekNum);
  const isDone = !!state.completedSessions[sKey];

  // Count checked exercises
  const exIds     = session.exercises.map(e => e.id);
  const checkedEx = exIds.filter(id => state.checkedExercises[exKey(phase.id, session.id, weekNum, id)]);
  const pct       = exIds.length ? Math.round((checkedEx.length / exIds.length) * 100) : 0;

  // Warmup
  const warmupHtml = session.warmup ? `
    <div class="warmup-block">
      <div class="block-icon">🌡️</div>
      <div>
        <h4>Échauffement · ${session.warmup.duration} min</h4>
        <p>${session.warmup.description}</p>
      </div>
    </div>` : '';

  // Circuit banner
  const circuitHtml = session.isCircuit ? `
    <div class="circuit-banner">
      <span style="font-size:1.4rem">🔄</span>
      <div>
        <strong>Format Circuit × ${session.circuitRounds}</strong><br>
        ${session.circuitInfo}
      </div>
    </div>` : '';

  // Exercises
  const exercisesHtml = session.exercises.map(ex => renderExerciseCard(ex, phase, session, weekNum)).join('');

  // Cooldown
  const cooldownHtml = session.cooldown ? `
    <div class="cooldown-block">
      <div class="block-icon">🌸</div>
      <div>
        <h4>Retour au calme · ${session.cooldown.duration} min</h4>
        <p>${session.cooldown.description}</p>
      </div>
    </div>` : '';

  return `
    <div class="session-view">
      <!-- Hero -->
      <div class="session-hero" style="background: ${phase.gradient}">
        <button class="back-btn" onclick="navigateTo('program')">‹ Retour</button>
        <div class="phase-label">${phase.emoji} ${phase.name} · Semaine ${weekNum}</div>
        <h2>${session.name}</h2>
        <div class="session-day-tag">${session.dayEmoji} ${session.dayName}</div>
      </div>

      <!-- Progress bar -->
      <div class="session-progress-wrap">
        <div class="session-progress-label">
          <span>${checkedEx.length} / ${exIds.length} exercices</span>
          <span>${pct}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>

      <!-- Body -->
      <div class="session-body">
        ${warmupHtml}
        ${circuitHtml}
        <div class="exercises-section-label">Exercices</div>
        ${exercisesHtml}
        ${cooldownHtml}
      </div>

      <!-- Mark done -->
      <div class="mark-done-wrap">
        <button class="btn-mark-done ${isDone ? 'done' : ''}"
          onclick="markSessionDone('${phase.id}','${session.id}',${weekNum})">
          ${isDone ? '✅ Séance déjà complétée – Revoir' : '🎉 Marquer la séance comme terminée'}
        </button>
      </div>
    </div>`;
}

function renderExerciseCard(ex, phase, session, weekNum) {
  const key      = exKey(phase.id, session.id, weekNum, ex.id);
  const checked  = !!state.checkedExercises[key];
  const videoUrl = state.videoUrls[ex.id] || ex.videoUrl;
  const volText  = formatVolume(ex.volume);

  const videoBtn = videoUrl
    ? `<button class="btn-video" onclick="openVideo('${ex.id}', '${escHtml(videoUrl)}', '${escHtml(ex.name)}')">▶ Voir la vidéo</button>`
    : `<button class="btn-add-video" onclick="openAddVideo('${ex.id}')">＋ Ajouter une vidéo</button>`;

  const optionalTag = ex.volume?.optional
    ? `<span class="optional-tag">⭐ Optionnel</span>` : '';

  const intervalSteps = ex.volume?.type === 'interval' ? `
    <div class="interval-steps">
      ${ex.volume.steps.map((s, i) => `
        <div class="interval-step ${i===1?'rounds':''}${i===2?'cooldown':''}">
          <div class="interval-dot"></div>
          <div><strong>${s.label}</strong> – ${s.duration} · ${s.intensity}</div>
        </div>`).join('')}
    </div>` : '';

  return `
    <div class="exercise-card ${checked ? 'done' : ''}" id="ex-${ex.id}">
      <div class="exercise-card-top">
        <div class="exercise-check" onclick="toggleExercise('${ex.id}','${phase.id}','${session.id}',${weekNum})">
          ${checked ? '✓' : ''}
        </div>
        <div class="exercise-info">
          <h3>${ex.name}${optionalTag}</h3>
          ${volText ? `<div class="volume-badge">💪 ${volText}</div>` : ''}
        </div>
      </div>
      <div class="exercise-card-body">
        <div class="exercise-description">${ex.description}</div>
        ${ex.volume?.optionalNote ? `<div style="font-size:.78rem;color:var(--text-light);margin-top:6px;font-style:italic">ℹ️ ${ex.volume.optionalNote}</div>` : ''}
        ${intervalSteps}
      </div>
      <div class="exercise-card-footer">
        ${videoBtn}
        ${videoUrl ? `<button class="btn-add-video" onclick="openAddVideo('${ex.id}')">✏️ Modifier</button>` : ''}
      </div>
    </div>`;
}

function escHtml(str) {
  return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ── Exercise toggle ──────────────────────────────────────────
function toggleExercise(exId, phaseId, sessionId, weekNum) {
  const key = exKey(phaseId, sessionId, weekNum, exId);
  state.checkedExercises[key] = !state.checkedExercises[key];
  save();
  renderApp();
}

// ── Mark session done ────────────────────────────────────────
function markSessionDone(phaseId, sessionId, weekNum) {
  const key = sessionKey(phaseId, sessionId, weekNum);
  if (!state.completedSessions[key]) {
    state.completedSessions[key] = true;

    // Also mark all exercises done
    const phase   = PROGRAM.phases.find(p => p.id == phaseId);
    const session = phase.sessions.find(s => s.id === sessionId);
    session.exercises.forEach(ex => {
      state.checkedExercises[exKey(phaseId, sessionId, weekNum, ex.id)] = true;
    });

    save();
    showCelebration();
  }
}

// ── Video modal ──────────────────────────────────────────────
function openVideo(exId, url, title) {
  const modal = document.getElementById('videoModal');
  const container = document.getElementById('videoTitle');
  const videoWrap  = document.getElementById('videoContainer');

  if (container) container.textContent = title;

  let embedHtml = '';
  if (isYouTube(url)) {
    embedHtml = `<iframe src="${getYouTubeEmbed(url)}" frameborder="0" allowfullscreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`;
  } else {
    embedHtml = `<video src="${url}" controls autoplay></video>`;
  }

  videoWrap.innerHTML = `<div class="video-container">${embedHtml}</div>`;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const videoWrap = document.getElementById('videoContainer');
  modal.classList.add('hidden');
  videoWrap.innerHTML = '';
  document.body.style.overflow = '';
}

// ── Add / Edit video URL ─────────────────────────────────────
function openAddVideo(exId) {
  state.pendingVideoExerciseId = exId;
  const existing = state.videoUrls[exId] || '';

  const modal = document.getElementById('addVideoModal');
  const input = document.getElementById('videoUrlInput');
  input.value = existing;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => input.focus(), 200);
}

function closeAddVideoModal() {
  document.getElementById('addVideoModal').classList.add('hidden');
  document.body.style.overflow = '';
  state.pendingVideoExerciseId = null;
}

function saveVideoUrl() {
  const input = document.getElementById('videoUrlInput');
  const url   = input.value.trim();
  if (!url) {
    delete state.videoUrls[state.pendingVideoExerciseId];
  } else {
    state.videoUrls[state.pendingVideoExerciseId] = url;
  }
  save();
  closeAddVideoModal();
  renderApp();
}

// ── Celebration ──────────────────────────────────────────────
function showCelebration() {
  const week = state.currentSession?.weekNum || '';
  launchConfetti();

  const div = document.createElement('div');
  div.className = 'celebration';
  div.innerHTML = `
    <div class="celebration-card">
      <div class="celebration-emoji">🎉</div>
      <h2>Bravo Yasmin !</h2>
      <p>Séance de la semaine ${week} complétée !<br>
      Tu es une championne 💕<br><br>
      <em>${getQuote()}</em></p>
      <button class="btn-primary" onclick="this.closest('.celebration').remove()">Continuer 💪</button>
    </div>`;
  document.body.appendChild(div);

  renderApp();
}

function launchConfetti() {
  const colors = ['#FF69B4','#C9A0DC','#FFB6C1','#FFD700','#87CEEB','#FF91AF'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left: ${Math.random() * 100}vw;
        top: -12px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        border-radius: ${Math.random() > .5 ? '50%' : '2px'};
        animation-duration: ${1.5 + Math.random() * 2}s;
        animation-delay: ${Math.random() * .5}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3500);
    }, i * 30);
  }
}

// ══════════════════════════════════════════════════════════════
//  PROGRESS VIEW
// ══════════════════════════════════════════════════════════════
function renderProgress() {
  const week = getCurrentWeek();
  const done = countDoneSessions();
  const pct  = Math.round((done / totalSessions()) * 100);

  const setupSection = !state.startDate ? `
    <div class="setup-card">
      <h3>🗓️ Date de début</h3>
      <p>Entre la date à laquelle tu commences ton programme. Cela permettra à l'app de savoir quelle semaine tu es et quelle séance faire aujourd'hui !</p>
      <input type="date" id="startDateInput" class="input-date"
        value="${new Date().toISOString().split('T')[0]}"
        max="${new Date().toISOString().split('T')[0]}">
      <button class="btn-primary" onclick="setStartDate()">✨ Commencer le programme !</button>
    </div>` : `
    <div class="setup-card" style="border-color:var(--success)">
      <h3>📅 Programme en cours</h3>
      <p>Démarré le <strong>${state.startDate.toLocaleDateString('fr-FR', {day:'numeric',month:'long',year:'numeric'})}</strong>.<br>
      Semaine actuelle : <strong>${week} / 12</strong>.</p>
      <button class="btn-secondary" style="margin-top:12px" onclick="resetStartDate()">Modifier la date de début</button>
    </div>`;

  const statsRow = `
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-num">${done}</div>
        <div class="stat-label">Séances faites</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${week || '–'}</div>
        <div class="stat-label">Semaine actuelle</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${pct}%</div>
        <div class="stat-label">Complété</div>
      </div>
    </div>`;

  // 12-week grid
  const gridCells = Array.from({length: 12}, (_, i) => {
    const wn = i + 1;
    const phase = getPhaseForWeek(wn);
    const sessionsDone = phase
      ? phase.sessions.filter(s => isSessionDone(phase.id, s.id, wn)).length
      : 0;
    const totalS  = phase ? phase.sessions.length : 3;
    const isCurrent = wn === week;
    const isFuture  = week && wn > week;
    const isComplete = sessionsDone === totalS && totalS > 0;

    let cellClass = 'week-cell';
    if (isCurrent) cellClass += ' current';
    else if (isFuture) cellClass += ' future';
    else if (isComplete) cellClass += ' completed';

    const dots = phase ? phase.sessions.map(s => {
      const d = isSessionDone(phase.id, s.id, wn);
      return `<div class="week-dot ${d ? 'done' : ''}"></div>`;
    }).join('') : '';

    return `
      <div class="${cellClass}" onclick="goToWeek(${wn})">
        <div class="week-num">${wn}</div>
        <div class="week-label">${phase ? phase.emoji : ''}</div>
        <div class="week-dots">${dots}</div>
      </div>`;
  }).join('');

  return `
    <div class="progress-view">
      <div class="page-header">
        <h1>📊 Mes Progrès</h1>
        <p>Ton journal de bord sur 12 semaines</p>
      </div>
      <div style="padding:0 0 8px">
        ${setupSection}
        ${state.startDate ? statsRow : ''}

        ${state.startDate ? `
        <div class="progress-bar-bg" style="margin: 16px 0 4px">
          <div class="progress-bar-fill" style="width:${pct}%"></div>
        </div>
        <div class="progress-label">${done} / ${totalSessions()} séances complétées</div>
        ` : ''}

        <div class="weeks-grid-title">Vue d'ensemble des 12 semaines</div>
        <div class="weeks-grid">${gridCells}</div>

        <div class="backup-card">
          <div class="backup-card-header">
            <span class="backup-icon">💾</span>
            <div>
              <h3>Sauvegarde & Transfert</h3>
              <p>Exporte tes données pour les sauvegarder ou les récupérer sur un autre appareil.</p>
            </div>
          </div>
          <div class="backup-btn-row">
            <button class="btn-backup-export" onclick="exportData()">
              <span>📤</span> Exporter (.json)
            </button>
            <button class="btn-backup-import" onclick="triggerImport()">
              <span>📥</span> Importer
            </button>
          </div>
          <input type="file" id="importFileInput" accept=".json,application/json"
            style="display:none" onchange="handleImportFile(event)">
        </div>
      </div>
    </div>`;
}

function setStartDate() {
  const input = document.getElementById('startDateInput');
  if (!input) return;
  const d = new Date(input.value + 'T00:00:00');
  if (isNaN(d)) return;
  state.startDate = d;
  save();
  renderApp();
}

function resetStartDate() {
  if (confirm('Réinitialiser la date de début ? Tes séances complétées seront conservées.')) {
    state.startDate = null;
    localStorage.removeItem('ym_startDate');
    renderApp();
  }
}

function goToWeek(wn) {
  const phase = getPhaseForWeek(wn);
  if (!phase) return;
  navigateTo('program');
  setTimeout(() => {
    const card = document.getElementById('phase-' + phase.id);
    if (card) {
      card.classList.add('open');
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}

// ══════════════════════════════════════════════════════════════
//  RULES VIEW
// ══════════════════════════════════════════════════════════════
function renderRules() {
  const rulesHtml = GOLDEN_RULES.map(r => `
    <div class="rule-card">
      <div class="rule-emoji">${r.emoji}</div>
      <div>
        <h3>${r.title}</h3>
        <p>${r.content}</p>
      </div>
    </div>`).join('');

  return `
    <div class="rules-view">
      <div class="page-header">
        <h1>💡 Règles d'or</h1>
        <p>Les 3 principes essentiels</p>
      </div>
      <div style="padding:0 0 8px">
        <div class="rules-header-banner">
          <h2>Tes 3 règles d'or 🌟</h2>
          <p>Garde ces principes en tête pendant toutes les 12 semaines. Ils font toute la différence !</p>
        </div>
        ${rulesHtml}

        <div class="divider"></div>

        <div class="rule-card" style="background:linear-gradient(135deg,#FFF0F5,#EDE7F6)">
          <div class="rule-emoji">⚠️</div>
          <div>
            <h3 style="color:var(--text-dark)">Jours de repos</h3>
            <p><strong>Phase 1 :</strong> Mardi, Jeudi, Week-end (balade optionnelle 15-20 min)<br>
            <strong>Phase 2 :</strong> Mardi, Jeudi, Samedi – Dimanche : 30 min de marche<br>
            <strong>Phase 3 :</strong> Mardi, Jeudi, Samedi – Dimanche : 35-40 min de marche</p>
          </div>
        </div>
      </div>
    </div>`;
}

// ══════════════════════════════════════════════════════════════
//  EXPORT / IMPORT JSON
// ══════════════════════════════════════════════════════════════
function exportData() {
  const payload = {
    version: 1,
    appName: 'Muscu Yasmin',
    exportDate: new Date().toISOString(),
    startDate: state.startDate ? state.startDate.toISOString() : null,
    completedSessions: state.completedSessions,
    videoUrls: state.videoUrls,
    checkedExercises: state.checkedExercises
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
  a.href     = url;
  a.download = `muscu-yasmin-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📤 Données exportées !', 'success');
}

function triggerImport() {
  document.getElementById('importFileInput').click();
}

function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);

      // Validate minimal structure
      if (typeof data !== 'object' || data === null) throw new Error('Format invalide');

      // Show confirmation modal with a preview of what will be imported
      const sessionCount = Object.values(data.completedSessions || {}).filter(Boolean).length;
      const videoCount   = Object.keys(data.videoUrls || {}).length;
      const startLabel   = data.startDate
        ? new Date(data.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'non définie';

      const modal = document.getElementById('confirmImportModal');
      document.getElementById('importPreview').innerHTML = `
        <div class="import-preview-row"><span>📅 Date de départ</span><strong>${startLabel}</strong></div>
        <div class="import-preview-row"><span>✅ Séances complétées</span><strong>${sessionCount}</strong></div>
        <div class="import-preview-row"><span>🎬 Vidéos enregistrées</span><strong>${videoCount}</strong></div>
        <div class="import-preview-row"><span>📁 Fichier</span><strong>${file.name}</strong></div>
      `;

      // Store parsed data for confirmation
      modal._pendingData = data;
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    } catch {
      showToast('❌ Fichier invalide ou corrompu', 'error');
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };
  reader.readAsText(file);
}

function confirmImport() {
  const modal = document.getElementById('confirmImportModal');
  const data  = modal._pendingData;
  if (!data) return;

  if (data.startDate) state.startDate = new Date(data.startDate);
  else state.startDate = null;

  state.completedSessions = data.completedSessions || {};
  state.videoUrls         = data.videoUrls         || {};
  state.checkedExercises  = data.checkedExercises  || {};

  save();
  closeConfirmImportModal();
  renderApp();
  showToast('📥 Données importées avec succès !', 'success');
}

function closeConfirmImportModal() {
  const modal = document.getElementById('confirmImportModal');
  modal.classList.add('hidden');
  modal._pendingData = null;
  document.body.style.overflow = '';
}

// ── Toast notification ───────────────────────────────────────
function showToast(message, type = 'success') {
  const existing = document.getElementById('ym-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id        = 'ym-toast';
  toast.className = `ym-toast ym-toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('ym-toast-visible'));
  });

  setTimeout(() => {
    toast.classList.remove('ym-toast-visible');
    setTimeout(() => toast.remove(), 350);
  }, 2800);
}

// ══════════════════════════════════════════════════════════════
//  BOOT
// ══════════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', init);
