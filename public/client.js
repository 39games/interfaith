// ── InterfaithDebate — client.js ──

// ═══════════════════════════════════════════════
// FAITH DATA
// ═══════════════════════════════════════════════

window.onerror = function (msg, url, line, col, error) {
  console.error("REAL ERROR:", msg, "at", line, col, error);
};

// ═══════════════════════════════════════════════
// SVG ICON LIBRARY
// Each key maps to an inline SVG string (24×24 viewBox)
// ═══════════════════════════════════════════════
const ICONS = {
  // ── Christian cross
  cross: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10.5" y="2" width="3" height="20" rx="1.2" fill="currentColor"/><rect x="3" y="7" width="18" height="3" rx="1.2" fill="currentColor"/></svg>`,
  // ── Orthodox cross (three bars)
  orthodox: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10.5" y="2" width="3" height="20" rx="1" fill="currentColor"/><rect x="4" y="7" width="16" height="2.5" rx="1" fill="currentColor"/><rect x="6" y="12.5" width="12" height="2.5" rx="1" fill="currentColor"/><rect x="8.5" y="17.5" width="7" height="2" rx="1" transform="rotate(-12 8.5 17.5)" fill="currentColor"/></svg>`,
  // ── Crescent & star (Islam)
  crescent: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 4C8.36 4 5 7.36 5 11.5S8.36 19 12.5 19c1.74 0 3.34-.6 4.6-1.6A7.5 7.5 0 0 1 9 11.5 7.5 7.5 0 0 1 17.1 4.6 7.44 7.44 0 0 0 12.5 4z" fill="currentColor"/><polygon points="18,3 18.7,5.2 21,5.2 19.15,6.6 19.85,8.8 18,7.4 16.15,8.8 16.85,6.6 15,5.2 17.3,5.2" fill="currentColor"/></svg>`,
  // ── Star of David (Judaism)
  star_david: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 22l-3.09-6.26L2 14.73l5-4.87L5.82 3 12 6.23 18.18 3 17 9.87l5 4.86-6.91 1.01z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
  // ── Dharma wheel (Buddhism)
  dharma: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="2.2" fill="currentColor"/><line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="5.6" y1="5.6" x2="18.4" y2="18.4" stroke="currentColor" stroke-width="1.5"/><line x1="18.4" y1="5.6" x2="5.6" y2="18.4" stroke="currentColor" stroke-width="1.5"/></svg>`,
  // ── Om symbol (Hinduism)
  om: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><text x="3" y="19" font-size="17" font-family="serif" fill="currentColor">ॐ</text></svg>`,
  // ── Khanda (Sikhism)
  khanda: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="2"/><path d="M5 8 Q12 14 19 8" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M5 16 Q12 10 19 16" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>`,
  // ── Yin-yang (Taoism)
  yinyang: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 3 A9 9 0 0 1 12 21 A4.5 4.5 0 0 1 12 12 A4.5 4.5 0 0 0 12 3z" fill="currentColor"/><circle cx="12" cy="7.5" r="1.5" fill="currentColor"/><circle cx="12" cy="16.5" r="1.5" fill="white"/></svg>`,
  // ── Lantern (Confucianism)
  lantern: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 4h6v1.5C17 7 18 9 18 12s-1 5-3 6.5V20H9v-1.5C7 17 6 15 6 12s1-5 3-6.5V4z" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" stroke-width="1.5"/></svg>`,
  // ── Torii gate (Shinto)
  torii: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="7" x2="22" y2="7" stroke="currentColor" stroke-width="2"/><line x1="3.5" y1="10" x2="20.5" y2="10" stroke="currentColor" stroke-width="1.5"/><line x1="7" y1="7" x2="7" y2="22" stroke="currentColor" stroke-width="2"/><line x1="17" y1="7" x2="17" y2="22" stroke="currentColor" stroke-width="2"/><path d="M2 7 Q12 3 22 7" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
  // ── Jain hand (Ahimsa)
  jain: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 19V9.5a1.5 1.5 0 0 1 3 0V14a1.5 1.5 0 0 1 3 0v-2a1.5 1.5 0 0 1 3 0v5c0 2.76-2.24 5-5 5H9.5A3.5 3.5 0 0 1 6 18.5v-5a1.5 1.5 0 0 1 3 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>`,
  // ── Flame (Zoroastrian)
  flame: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C10 6 7 8 7 12a5 5 0 0 0 10 0c0-2-1-3.5-2-5-0.5 1.5-1 2.5-2 3 1-3-1-6-1-8z" fill="currentColor"/></svg>`,
  // ── Atom (Atheism/Science)
  atom: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="2" fill="currentColor"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" stroke-width="1.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" stroke-width="1.5" transform="rotate(120 12 12)"/></svg>`,
  // ── Question mark (Agnostic)
  question: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17.5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/></svg>`,
  // ── Sparkle / star (Spiritual)
  sparkle: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`,
  // ── Galaxy / nebula (Deism)
  galaxy: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="2" fill="currentColor"/><ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"/><circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="1.4" stroke-dasharray="3 3"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.2"/></svg>`,
  // ── Crescent moon (Wiccan/Pagan)
  moon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/></svg>`,
  // ── Thor's hammer / lightning (Norse)
  lightning: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L4 14h7l-2 8 11-12h-7l2-8z" fill="currentColor"/></svg>`,
  // ── Shamrock / leaf (Celtic)
  leaf: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22V12M12 12c0-3-2-5-4.5-5S3 9 3 11.5 5 14 8 14c-3 0-5 2-5 4.5S5 22 7.5 22 10 20 10 17c0 3 2 5 4.5 5S19 20 19 17.5 17 15 14 15c3 0 5-2 5-4.5S17 7 14.5 7 12 9 12 12z" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>`,
  // ── Herb/sprout (pagan other)
  sprout: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 12C12 8 9 5 5 5c0 4 3 7 7 7z" fill="currentColor"/><path d="M12 12C12 8 15 5 19 5c0 4-3 7-7 7z" fill="currentColor"/></svg>`,
  // ── Feather (Indigenous)
  feather: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.24 4.76a6 6 0 0 0-8.49 0L4 12.51V20h7.49l7.75-7.75a6 6 0 0 0 0-7.49z" stroke="currentColor" stroke-width="1.6" fill="none"/><line x1="4" y1="20" x2="12" y2="12" stroke="currentColor" stroke-width="1.5"/></svg>`,
  // ── Pencil (Other/custom)
  pencil: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>`,
  // ── Globe (Any faith)
  globe: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 3C10 7 10 17 12 21M12 3C14 7 14 17 12 21M3 12h18" stroke="currentColor" stroke-width="1.4"/><path d="M4.2 8h15.6M4.2 16h15.6" stroke="currentColor" stroke-width="1.2"/></svg>`,
  // ── Shuffle (Any different)
  shuffle: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="16 3 21 3 21 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><line x1="4" y1="20" x2="21" y2="3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><polyline points="21 16 21 21 16 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 15l6 6M4 4l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  // ── Book (Abrahamic)
  book: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="1.6"/></svg>`,
  // ── World / compass (Eastern)
  compass: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><polygon points="12,7 14,12 12,17 10,12" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="white"/></svg>`,
};

// Map faith/match icon keys to ICONS entries
const ICON_MAP = {
  // Christian variants
  '✝️':  'cross',
  '☦️':  'orthodox',
  // Islam
  '☪️':  'crescent',
  // Judaism
  '✡️':  'star_david',
  // Buddhism
  '☸️':  'dharma',
  // Hinduism
  '🕉️': 'om',
  // Sikh
  '🪯':  'khanda',
  // Taoism
  '☯️':  'yinyang',
  // Confucian
  '🏮':  'lantern',
  // Shinto
  '⛩️':  'torii',
  // Jain
  '🤝':  'jain',
  // Zoroastrian
  '🔥':  'flame',
  // Atheist
  '⚛️':  'atom',
  // Agnostic
  '❓':  'question',
  // Spiritual
  '🌟':  'sparkle',
  // Deist
  '🌌':  'galaxy',
  // Wiccan
  '🌙':  'moon',
  // Norse
  '⚡':  'lightning',
  // Celtic
  '🍀':  'leaf',
  // Pagan other
  '🌿':  'sprout',
  // Indigenous
  '🪶':  'feather',
  // Other
  '✏️':  'pencil',
  // Match options
  '🌐':  'globe',
  '🔀':  'shuffle',
  '📖':  'book',
  '🌏':  'compass',
};

function getIcon(emojiOrKey) {
  const key = ICON_MAP[emojiOrKey] || ICON_MAP[emojiOrKey.trim()];
  if (key && ICONS[key]) return ICONS[key];
  // fallback: render as text
  return `<span style="font-size:13px;line-height:1">${emojiOrKey}</span>`;
}

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
        <span class="faith-icon svg-icon">${getIcon(f.icon)}</span>
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
  faithSelIcon.innerHTML  = getIcon(faith.icon);
  faithSelIcon.classList.add('svg-icon');
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
        <span class="faith-icon svg-icon" id="mp-sel-icon">${ICONS.globe}</span>
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
        <span class="faith-icon svg-icon">${getIcon(opt.icon)}</span>${opt.label}
      </div>`;
      hasAny = true;
    });

    if (!hasAny) html = '<div class="mp-empty">No results</div>';
    mpList.innerHTML = html;

    mpList.querySelectorAll('.mp-option').forEach(el => {
      el.addEventListener('click', () => {
        state.matchPref        = el.dataset.id;
        mpSelIcon.innerHTML    = getIcon(el.dataset.icon);
        mpSelIcon.classList.add('svg-icon');
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