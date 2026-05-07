// ── InterfaithDebate — client.js ──

// ═══════════════════════════════════════════════
// FAITH DATA
// ═══════════════════════════════════════════════

window.onerror = function (msg, url, line, col, error) {
  console.error("REAL ERROR:", msg, "at", line, col, error);
};
const FAITHS = [
  { id:'christian_protestant', label:'Christian (Protestant)',        icon:'✝️', broad:'christian', broader:'abrahamic' },
  { id:'christian_catholic',   label:'Christian (Catholic)',          icon:'✝️', broad:'christian', broader:'abrahamic' },
  { id:'christian_orthodox',   label:'Christian (Orthodox)',          icon:'☦️', broad:'christian', broader:'abrahamic' },
  { id:'christian_evangelical',label:'Christian (Evangelical)',       icon:'✝️', broad:'christian', broader:'abrahamic' },
  { id:'christian_mormon',     label:'Christian (Mormon / LDS)',      icon:'✝️', broad:'christian', broader:'abrahamic' },
  { id:'christian_jehovah',    label:"Christian (Jehovah's Witness)", icon:'✝️', broad:'christian', broader:'abrahamic' },
  { id:'christian_other',      label:'Christian (Other)',             icon:'✝️', broad:'christian', broader:'abrahamic' },
  { id:'muslim_sunni',  label:'Muslim (Sunni)',  icon:'☪️', broad:'muslim', broader:'abrahamic' },
  { id:'muslim_shia',   label:'Muslim (Shia)',   icon:'☪️', broad:'muslim', broader:'abrahamic' },
  { id:'muslim_sufi',   label:'Muslim (Sufi)',   icon:'☪️', broad:'muslim', broader:'abrahamic' },
  { id:'muslim_ahmadi', label:'Muslim (Ahmadi)', icon:'☪️', broad:'muslim', broader:'abrahamic' },
  { id:'muslim_other',  label:'Muslim (Other)',  icon:'☪️', broad:'muslim', broader:'abrahamic' },
  { id:'jewish_orthodox',     label:'Jewish (Orthodox)',           icon:'✡️', broad:'jewish', broader:'abrahamic' },
  { id:'jewish_conservative', label:'Jewish (Conservative)',       icon:'✡️', broad:'jewish', broader:'abrahamic' },
  { id:'jewish_reform',       label:'Jewish (Reform)',             icon:'✡️', broad:'jewish', broader:'abrahamic' },
  { id:'jewish_secular',      label:'Jewish (Secular / Cultural)', icon:'✡️', broad:'jewish', broader:'abrahamic' },
  { id:'jewish_other',        label:'Jewish (Other)',              icon:'✡️', broad:'jewish', broader:'abrahamic' },
  { id:'buddhist_zen',       label:'Buddhist (Zen)',                icon:'☸️', broad:'buddhist', broader:'eastern' },
  { id:'buddhist_theravada', label:'Buddhist (Theravada)',          icon:'☸️', broad:'buddhist', broader:'eastern' },
  { id:'buddhist_mahayana',  label:'Buddhist (Mahayana)',           icon:'☸️', broad:'buddhist', broader:'eastern' },
  { id:'buddhist_tibetan',   label:'Buddhist (Tibetan / Vajrayana)',icon:'☸️', broad:'buddhist', broader:'eastern' },
  { id:'buddhist_secular',   label:'Buddhist (Secular)',            icon:'☸️', broad:'buddhist', broader:'eastern' },
  { id:'buddhist_other',     label:'Buddhist (Other)',              icon:'☸️', broad:'buddhist', broader:'eastern' },
  { id:'hindu_vaishnavism', label:'Hindu (Vaishnavism)',          icon:'🕉️', broad:'hindu', broader:'eastern' },
  { id:'hindu_shaivism',    label:'Hindu (Shaivism)',              icon:'🕉️', broad:'hindu', broader:'eastern' },
  { id:'hindu_shaktism',    label:'Hindu (Shaktism)',              icon:'🕉️', broad:'hindu', broader:'eastern' },
  { id:'hindu_advaita',     label:'Hindu (Advaita / Non-dual)',   icon:'🕉️', broad:'hindu', broader:'eastern' },
  { id:'hindu_other',       label:'Hindu (Other)',                 icon:'🕉️', broad:'hindu', broader:'eastern' },
  { id:'sikh',        label:'Sikh',        icon:'🪯', broad:'sikh',       broader:'eastern' },
  { id:'taoist',      label:'Taoist',      icon:'☯️', broad:'taoist',     broader:'eastern' },
  { id:'confucian',   label:'Confucian',   icon:'🏮', broad:'confucian',  broader:'eastern' },
  { id:'shinto',      label:'Shinto',      icon:'⛩️', broad:'shinto',     broader:'eastern' },
  { id:'jain',        label:'Jain',        icon:'🤝', broad:'jain',       broader:'eastern' },
  { id:'zoroastrian', label:'Zoroastrian', icon:'🔥', broad:'zoroastrian',broader:'eastern' },
  { id:'atheist_materialist', label:'Atheist (Materialist)', icon:'⚛️', broad:'atheist', broader:'nonreligious' },
  { id:'atheist_humanist',    label:'Atheist (Humanist)',    icon:'⚛️', broad:'atheist', broader:'nonreligious' },
  { id:'atheist_other',       label:'Atheist (Other)',       icon:'⚛️', broad:'atheist', broader:'nonreligious' },
  { id:'agnostic_strong',     label:'Agnostic (Strong)',     icon:'❓', broad:'agnostic', broader:'nonreligious' },
  { id:'agnostic_weak',       label:'Agnostic (Weak)',       icon:'❓', broad:'agnostic', broader:'nonreligious' },
  { id:'agnostic_other',      label:'Agnostic (Other)',      icon:'❓', broad:'agnostic', broader:'nonreligious' },
  { id:'secular_spiritual',   label:'Spiritual (No label)',  icon:'🌟', broad:'spiritual', broader:'nonreligious' },
  { id:'deist',               label:'Deist',                 icon:'🌌', broad:'deist',    broader:'nonreligious' },
  { id:'pagan_wiccan',  label:'Pagan (Wiccan)',       icon:'🌙', broad:'pagan', broader:'folk' },
  { id:'pagan_norse',   label:'Pagan (Norse)',         icon:'⚡', broad:'pagan', broader:'folk' },
  { id:'pagan_celtic',  label:'Pagan (Celtic)',        icon:'🍀', broad:'pagan', broader:'folk' },
  { id:'pagan_other',   label:'Pagan (Other)',         icon:'🌿', broad:'pagan', broader:'folk' },
  { id:'indigenous',    label:'Indigenous / Animist',  icon:'🪶', broad:'indigenous', broader:'folk' },
  { id:'other',         label:'Other (specify below)', icon:'✏️', broad:'other', broader:'other' },
];

const FAITH_GROUPS = [
  { label:'Christian',     filter: f => f.broad === 'christian' },
  { label:'Muslim',        filter: f => f.broad === 'muslim' },
  { label:'Jewish',        filter: f => f.broad === 'jewish' },
  { label:'Buddhist',      filter: f => f.broad === 'buddhist' },
  { label:'Hindu',         filter: f => f.broad === 'hindu' },
  { label:'Other Eastern', filter: f => f.broader === 'eastern' && !['buddhist','hindu'].includes(f.broad) },
  { label:'Non-religious', filter: f => f.broader === 'nonreligious' },
  { label:'Folk & Other',  filter: f => f.broader === 'folk' || f.id === 'other' },
];

const MATCH_OPTIONS = [
  { section:'General' },
  { id:'any',           label:'Any faith',                icon:'🌐' },
  { id:'any_different', label:'Any (different from mine)',icon:'🔀' },
  { section:'Abrahamic' },
  { id:'any_abrahamic', label:'Any Abrahamic',  icon:'📖' },
  { id:'any_christian', label:'Any Christian',  icon:'✝️' },
  { id:'christian_protestant',  label:'Christian (Protestant)',        icon:'✝️' },
  { id:'christian_catholic',    label:'Christian (Catholic)',          icon:'✝️' },
  { id:'christian_orthodox',    label:'Christian (Orthodox)',          icon:'☦️' },
  { id:'christian_evangelical', label:'Christian (Evangelical)',       icon:'✝️' },
  { id:'christian_mormon',      label:'Christian (Mormon / LDS)',      icon:'✝️' },
  { id:'christian_jehovah',     label:"Christian (Jehovah's Witness)", icon:'✝️' },
  { id:'christian_other',       label:'Christian (Other)',             icon:'✝️' },
  { id:'any_muslim',    label:'Any Muslim',  icon:'☪️' },
  { id:'muslim_sunni',  label:'Muslim (Sunni)', icon:'☪️' },
  { id:'muslim_shia',   label:'Muslim (Shia)',  icon:'☪️' },
  { id:'muslim_sufi',   label:'Muslim (Sufi)',  icon:'☪️' },
  { id:'muslim_ahmadi', label:'Muslim (Ahmadi)',icon:'☪️' },
  { id:'muslim_other',  label:'Muslim (Other)', icon:'☪️' },
  { id:'any_jewish',    label:'Any Jewish',  icon:'✡️' },
  { id:'jewish_orthodox',     label:'Jewish (Orthodox)',           icon:'✡️' },
  { id:'jewish_conservative', label:'Jewish (Conservative)',       icon:'✡️' },
  { id:'jewish_reform',       label:'Jewish (Reform)',             icon:'✡️' },
  { id:'jewish_secular',      label:'Jewish (Secular / Cultural)', icon:'✡️' },
  { id:'jewish_other',        label:'Jewish (Other)',              icon:'✡️' },
  { section:'Eastern' },
  { id:'any_eastern',  label:'Any Eastern',  icon:'🌏' },
  { id:'any_buddhist', label:'Any Buddhist', icon:'☸️' },
  { id:'buddhist_zen',       label:'Buddhist (Zen)',      icon:'☸️' },
  { id:'buddhist_theravada', label:'Buddhist (Theravada)',icon:'☸️' },
  { id:'buddhist_mahayana',  label:'Buddhist (Mahayana)', icon:'☸️' },
  { id:'buddhist_tibetan',   label:'Buddhist (Tibetan)',  icon:'☸️' },
  { id:'buddhist_secular',   label:'Buddhist (Secular)',  icon:'☸️' },
  { id:'buddhist_other',     label:'Buddhist (Other)',    icon:'☸️' },
  { id:'any_hindu',    label:'Any Hindu',   icon:'🕉️' },
  { id:'hindu_vaishnavism', label:'Hindu (Vaishnavism)',        icon:'🕉️' },
  { id:'hindu_shaivism',    label:'Hindu (Shaivism)',            icon:'🕉️' },
  { id:'hindu_shaktism',    label:'Hindu (Shaktism)',            icon:'🕉️' },
  { id:'hindu_advaita',     label:'Hindu (Advaita / Non-dual)', icon:'🕉️' },
  { id:'hindu_other',       label:'Hindu (Other)',               icon:'🕉️' },
  { id:'sikh',        label:'Sikh',        icon:'🪯' },
  { id:'taoist',      label:'Taoist',      icon:'☯️' },
  { id:'confucian',   label:'Confucian',   icon:'🏮' },
  { id:'shinto',      label:'Shinto',      icon:'⛩️' },
  { id:'jain',        label:'Jain',        icon:'🤝' },
  { id:'zoroastrian', label:'Zoroastrian', icon:'🔥' },
  { section:'Non-religious' },
  { id:'any_nonreligious',    label:'Any Non-religious',    icon:'⚛️' },
  { id:'any_atheist',         label:'Any Atheist',          icon:'⚛️' },
  { id:'atheist_materialist', label:'Atheist (Materialist)',icon:'⚛️' },
  { id:'atheist_humanist',    label:'Atheist (Humanist)',   icon:'⚛️' },
  { id:'atheist_other',       label:'Atheist (Other)',      icon:'⚛️' },
  { id:'any_agnostic',     label:'Any Agnostic',      icon:'❓' },
  { id:'agnostic_strong',  label:'Agnostic (Strong)', icon:'❓' },
  { id:'agnostic_weak',    label:'Agnostic (Weak)',   icon:'❓' },
  { id:'agnostic_other',   label:'Agnostic (Other)',  icon:'❓' },
  { id:'secular_spiritual',label:'Spiritual (No label)',icon:'🌟' },
  { id:'deist',            label:'Deist',               icon:'🌌' },
  { section:'Folk & Other' },
  { id:'any_folk',     label:'Any Folk / Pagan',    icon:'🌿' },
  { id:'pagan_wiccan', label:'Pagan (Wiccan)',       icon:'🌙' },
  { id:'pagan_norse',  label:'Pagan (Norse)',         icon:'⚡' },
  { id:'pagan_celtic', label:'Pagan (Celtic)',        icon:'🍀' },
  { id:'pagan_other',  label:'Pagan (Other)',         icon:'🌿' },
  { id:'indigenous',   label:'Indigenous / Animist',  icon:'🪶' },
];

// ═══════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════
const state = {
  name:        '',
  faithId:     '',
  matchPref:   'any',
  style:       'casual',
  customFaith: '',
  roomId:      null,
  matchName:   '',
  matchFaith:  '',
};

// ═══════════════════════════════════════════════
// SOCKET.IO CONNECTION
// ═══════════════════════════════════════════════
const socket = io(); // connects to same host that served the page

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Server confirmed we're in the queue
socket.on('waiting', () => {
  console.log('In waiting pool...');
  // Already on waiting screen — nothing to do
});

// Server found us a match
socket.on('matched', (data) => {
  state.roomId     = data.roomId;
  state.matchName  = data.name;
  state.matchFaith = data.faith;
  onMatched(data);
});

// Incoming message from match
socket.on('message', (data) => {
  onMessageReceived(data.text);
});

// Match left
socket.on('match_disconnected', () => {
  onMatchDisconnected();
});

// Live stats from server
socket.on('stats', (data) => {
  document.getElementById('stat-online').textContent = data.online;
  document.getElementById('stat-chats').textContent  = data.chatsToday;
});

// ═══════════════════════════════════════════════
// SCREEN MANAGEMENT
// ═══════════════════════════════════════════════
const screens = {
  landing:      document.getElementById('screen-landing'),
  waiting:      document.getElementById('screen-waiting'),
  chat:         document.getElementById('screen-chat'),
  disconnected: document.getElementById('screen-disconnected'),
  video:        document.getElementById('screen-video'),
};
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  const target = screens[name];
  if (target) target.classList.add('active');
}

// ═══════════════════════════════════════════════
// FAITH PICKER
// ═══════════════════════════════════════════════
const faithPicker     = document.getElementById('faith-picker');
const faithSelected   = document.getElementById('faith-selected');
const faithDropdown   = document.getElementById('faith-dropdown');
const faithSelIcon    = document.getElementById('faith-selected-icon');
const faithSelLabel   = document.getElementById('faith-selected-label');
const customFaithWrap = document.getElementById('custom-faith-wrap');

function buildFaithDropdown() {
  let html = '';
  FAITH_GROUPS.forEach(group => {
    const items = FAITHS.filter(group.filter);
    html += `<div class="faith-group-label">${group.label}</div>`;
    items.forEach(f => {
      html += `<div class="faith-option" data-id="${f.id}">
        <span class="faith-icon">${f.icon}</span>
        <span>${f.label}</span>
      </div>`;
    });
  });
  faithDropdown.innerHTML = html;
  faithDropdown.querySelectorAll('.faith-option').forEach(el => {
    el.addEventListener('click', () => pickFaith(el.dataset.id));
  });
}

function pickFaith(id) {
  state.faithId = id;
  const faith = FAITHS.find(f => f.id === id);
  faithSelIcon.textContent  = faith.icon;
  faithSelLabel.textContent = faith.label;
  faithDropdown.querySelectorAll('.faith-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.id === id);
  });
  customFaithWrap.classList.toggle('show', id === 'other');
  faithPicker.classList.remove('open');
  checkReady();
}

faithSelected.addEventListener('click', () => faithPicker.classList.toggle('open'));
document.addEventListener('click', e => {
  if (!e.target.closest('#faith-picker')) faithPicker.classList.remove('open');
});

// ═══════════════════════════════════════════════
// MATCH PICKER
// ═══════════════════════════════════════════════
const matchPickerEl = document.getElementById('match-picker');

function buildMatchPicker() {
  matchPickerEl.innerHTML = `
    <div class="mp-picker" id="mp-picker">
      <div class="mp-selected" id="mp-selected">
        <span class="faith-icon" id="mp-sel-icon">🌐</span>
        <span id="mp-sel-label">Any faith</span>
        <span class="fp-arrow">▾</span>
      </div>
      <div class="mp-dropdown" id="mp-dropdown">
        <div class="mp-search-bar">
          <input type="text" id="mp-search" placeholder="Search..." />
        </div>
        <div id="mp-list"></div>
      </div>
    </div>`;

  const mpPicker   = document.getElementById('mp-picker');
  const mpSelIcon  = document.getElementById('mp-sel-icon');
  const mpSelLabel = document.getElementById('mp-sel-label');
  const mpSearch   = document.getElementById('mp-search');
  const mpList     = document.getElementById('mp-list');

  function renderList(filter = '') {
    const q = filter.toLowerCase().trim();
    let html = '';
    let pendingSection = null;
    let hasAny = false;

    MATCH_OPTIONS.forEach(opt => {
      if (opt.section) { pendingSection = opt.section; return; }
      if (q && !opt.label.toLowerCase().includes(q)) return;
      if (pendingSection) {
        html += `<div class="faith-group-label">${pendingSection}</div>`;
        pendingSection = null;
      }
      const sel = state.matchPref === opt.id ? 'selected' : '';
      html += `<div class="mp-option ${sel}" data-id="${opt.id}" data-label="${opt.label}" data-icon="${opt.icon}">
        <span class="faith-icon">${opt.icon}</span>${opt.label}
      </div>`;
      hasAny = true;
    });

    if (!hasAny) html = '<div class="mp-empty">No results</div>';
    mpList.innerHTML = html;

    mpList.querySelectorAll('.mp-option').forEach(el => {
      el.addEventListener('click', () => {
        state.matchPref      = el.dataset.id;
        mpSelIcon.textContent  = el.dataset.icon;
        mpSelLabel.textContent = el.dataset.label;
        mpPicker.classList.remove('open');
        renderList(mpSearch.value);
      });
    });
  }

  document.getElementById('mp-selected').addEventListener('click', () => {
    mpPicker.classList.toggle('open');
    if (mpPicker.classList.contains('open')) setTimeout(() => mpSearch.focus(), 50);
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('#mp-picker')) mpPicker.classList.remove('open');
  });
  mpSearch.addEventListener('input', () => renderList(mpSearch.value));

  renderList();
}

// ═══════════════════════════════════════════════
// STYLE TOGGLES
// ═══════════════════════════════════════════════
document.querySelectorAll('[data-style]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-style]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.style = btn.dataset.style;
  });
});

// ═══════════════════════════════════════════════
// FIND BUTTON
// ═══════════════════════════════════════════════
const inputName = document.getElementById('display-name');
const btnFind   = document.getElementById('btn-find');

function checkReady() {
  btnFind.disabled = !(inputName.value.trim() && state.faithId);
}
inputName.addEventListener('input', checkReady);

btnFind.addEventListener('click', () => {
  state.name        = inputName.value.trim();
  state.customFaith = document.getElementById('custom-faith-input')?.value.trim() || '';
  showScreen('waiting');

  socket.emit('find_match', {
    name:        state.name,
    faithId:     state.faithId,
    matchPref:   state.matchPref,
    style:       state.style,
    customFaith: state.customFaith,
    mode:        state.chatMode || 'text',
  });
});

// ═══════════════════════════════════════════════
// WAITING SCREEN
// ═══════════════════════════════════════════════
document.getElementById('btn-cancel').addEventListener('click', () => {
  socket.emit('cancel_match');
  showScreen('landing');
});

// ═══════════════════════════════════════════════
// CHAT SCREEN
// ═══════════════════════════════════════════════
const chatMessages = document.getElementById('chat-messages');
const chatInput    = document.getElementById('chat-input');
const btnSend      = document.getElementById('btn-send');

function addMessage(text, type = 'theirs', senderName = '') {
  if (type === 'system') {
    const el = document.createElement('div');
    el.className = 'system-msg';
    el.textContent = text;
    chatMessages.appendChild(el);
  } else {
    const wrapper = document.createElement('div');
    wrapper.className = `message ${type}`;
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    const meta = document.createElement('div');
    meta.className = 'message-meta';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    meta.textContent = type === 'mine' ? `You · ${time}` : `${senderName || 'Stranger'} · ${time}`;
    wrapper.appendChild(bubble);
    wrapper.appendChild(meta);
    chatMessages.appendChild(wrapper);
  }
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text || !state.roomId) return;
  chatInput.value = '';
  autoResize();
  addMessage(text, 'mine');
  socket.emit('message', { text, roomId: state.roomId });
}

btnSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
function autoResize() {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
}
chatInput.addEventListener('input', autoResize);

document.getElementById('btn-skip').addEventListener('click', () => {
  if (state.roomId) socket.emit('skip', { roomId: state.roomId });
  state.roomId = null;
  showScreen('waiting');
  socket.emit('find_match', {
    name:        state.name,
    faithId:     state.faithId,
    matchPref:   state.matchPref,
    style:       state.style,
    customFaith: state.customFaith,
    mode:        state.chatMode || 'text',
  });
});

document.getElementById('btn-end').addEventListener('click', () => {
  if (state.roomId) socket.emit('end_chat', { roomId: state.roomId });
  state.roomId = null;
  showScreen('disconnected');
  document.getElementById('disc-reason').textContent = 'You ended the conversation.';
});

// ═══════════════════════════════════════════════
// DISCONNECTED SCREEN
// ═══════════════════════════════════════════════
document.getElementById('btn-again').addEventListener('click', () => {
  showScreen('waiting');
  socket.emit('find_match', {
    name:        state.name,
    faithId:     state.faithId,
    matchPref:   state.matchPref,
    style:       state.style,
    customFaith: state.customFaith,
    mode:        state.chatMode || 'text',
  });
});
document.getElementById('btn-home').addEventListener('click', () => showScreen('landing'));

// ═══════════════════════════════════════════════
// SERVER EVENT HANDLERS
// ═══════════════════════════════════════════════
function onMatched(data) {
  state.matchName  = data.name;
  state.matchFaith = data.faith;

  // Route to the correct screen based on the mode the server echoes back
  if (data.mode === 'video') {
    // video.js owns this path — delegate to its entry point
    if (typeof window.startVideoChat === 'function') {
      window.startVideoChat({ ...data, roomId: state.roomId });
    }
    return;
  }

  // ── Text chat flow ──
  document.getElementById('match-name').textContent  = data.name;
  document.getElementById('match-faith').textContent = data.faith;
  const styleLabels = { casual:'Casual Chat', debate:'Structured Debate', ama:'Ask Me Anything' };
  document.getElementById('style-badge').textContent = styleLabels[state.style] || 'Casual';
  chatMessages.innerHTML = '';
  addMessage(`You're now connected with ${data.name} (${data.faith}). Say hello!`, 'system');
  showScreen('chat');
}

function onMessageReceived(text) {
  // Only handle in text-chat mode; video.js has its own listener
  if (!document.getElementById('screen-chat').classList.contains('active')) return;
  addMessage(text, 'theirs', state.matchName);
}

function onMatchDisconnected() {
  // Only handle in text-chat mode; video.js handles video disconnects
  if (!document.getElementById('screen-chat').classList.contains('active')) return;
  addMessage(`${state.matchName} has left the conversation.`, 'system');
  setTimeout(() => {
    showScreen('disconnected');
    document.getElementById('disc-reason').textContent = `${state.matchName} disconnected.`;
  }, 1500);
  state.roomId = null;
}

// ═══════════════════════════════════════════════
// STATS — animated on first load, then live from server
// ═══════════════════════════════════════════════
function animateStat(el, target) {
  let n = 0;
  const step = Math.ceil(target / 40);
  const iv = setInterval(() => {
    n = Math.min(n + step, target);
    el.textContent = n.toLocaleString();
    if (n >= target) clearInterval(iv);
  }, 30);
}
animateStat(document.getElementById('stat-online'), 1);
animateStat(document.getElementById('stat-chats'), 0);

// ═══════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════
buildFaithDropdown();
buildMatchPicker();