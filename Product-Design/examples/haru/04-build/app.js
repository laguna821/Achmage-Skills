/* 하루 (Haru) front end. State in localStorage, hash routing, screens S01 to S09.
   Each screen root carries data-screen="S##"; elements that implement a settled decision carry data-decision="D##". */
(() => {
'use strict';
const HK = window.HK;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ic = (n, w = 2, cls = 'hk-icon') => `<svg class="${cls}" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${HH_ICONS[n]}</svg>`;

/* ---------- dates ---------- */
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const today = () => ymd(new Date());
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return ymd(d); };
const diffDays = (a, b) => Math.round((parse(a) - parse(b)) / 864e5);
const WD = '일월화수목금토';
const md = s => { const d = parse(s); return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WD[d.getDay()]})`; };
const fmtDate = s => {
  if (!s) return '마감일 없음';
  const t = today();
  if (s === t) return '오늘';
  if (s === addDays(t, 1)) return '내일';
  return (parse(s).getFullYear() !== new Date().getFullYear() ? parse(s).getFullYear() + '년 ' : '') + md(s);
};
const nextMonday = () => { const d = parse(today()).getDay(); return addDays(today(), ((8 - d) % 7) || 7); };
const longToday = () => { const d = new Date(); return `${d.getMonth() + 1}월 ${d.getDate()}일 ${WD[d.getDay()]}요일`; };
const dayOf = ts => ts ? ymd(new Date(ts)) : null;
const overdueText = t => `${md(t.due)} · ${diffDays(today(), t.due)}일 지났어요`;
const whenDeleted = ts => { const d = dayOf(ts), t = today(); return d === t ? '오늘 삭제' : d === addDays(t, -1) ? '어제 삭제' : `${parse(d).getMonth() + 1}월 ${parse(d).getDate()}일 삭제`; };

/* ---------- store ---------- */
const KEY = 'haru.v1', SEEN = 'haru.seen';
let S, storageIssue = null;
const uid = p => p + Math.random().toString(36).slice(2, 9);
const blankUi = () => ({ route: '', doneOpen: {}, filter: {}, recents: [], sidebarHidden: false });
function emptyState() {
  return { version: 1, members: [{ id: 'me', name: '나' }], projects: [], tasks: [], ui: blankUi(), draft: { title: '' } };
}
function seed() {
  const t = today(), now = Date.now(), day = 864e5;
  const s = emptyState();
  s.members.push({ id: 'm-minji', name: '민지' }, { id: 'm-junho', name: '준호' });
  s.projects = [
    { id: 'p-web', name: '웹사이트 개편', memberIds: ['me', 'm-minji', 'm-junho'], lastUsed: now - 1000 },
    { id: 'p-move', name: '이사 준비', memberIds: ['me', 'm-minji'], lastUsed: now - 2000 },
    { id: 'p-book', name: '독서 모임', memberIds: ['me'], lastUsed: now - 3000 },
  ];
  const T = (title, o) => Object.assign({ id: uid('t'), title, note: '', due: null, projectId: null, assigneeId: 'me', done: false, doneAt: null, created: now - 5 * day + Math.random() * 1000, updated: now }, o);
  s.tasks = [
    T('디자인 시안 검토하기', { projectId: 'p-web', due: t, note: '메인 화면과 상세 화면 두 가지를 봐요.' }),
    T('주간 회의 자료 정리', { projectId: 'p-web', due: t, assigneeId: 'm-minji' }),
    T('이사 업체 견적 비교', { projectId: 'p-move', due: t, note: '세 곳에서 받은 견적을 표로 비교해요.' }),
    T('도서관 책 반납하기', { projectId: 'p-book', due: t }),
    T('치과 예약 전화하기', { due: t }),
    T('관리비 납부', { projectId: 'p-move', due: addDays(t, -2) }),
    T('로고 파일 전달받기', { projectId: 'p-web', due: addDays(t, -1), assigneeId: 'm-junho' }),
    T('아침 운동 기록', { due: t, done: true, doneAt: now - 3600e3 }),
    T('회의록 공유', { projectId: 'p-web', due: t, assigneeId: 'm-minji', done: true, doneAt: now - 7200e3 }),
    T('다음 모임 책 고르기', { projectId: 'p-book', due: addDays(t, 2) }),
    T('개발 일정 확정하기', { projectId: 'p-web', due: addDays(t, 3), assigneeId: 'm-junho' }),
    T('이삿짐 박스 구하기', { projectId: 'p-move', due: addDays(t, 5), assigneeId: 'm-minji' }),
    T('새 폰트 라이선스 확인', { projectId: 'p-web' }),
    T('독서 모임 장소 예약', { projectId: 'p-book', due: addDays(t, -3), done: true, doneAt: now - 3 * day }),
    T('오래된 메모 정리', { deletedAt: now - day }),
  ];
  return s;
}
const sampleWanted = () => /[?&]sample=1(&|$)/.test(location.search);
function load() {
  let probe = true;
  try { localStorage.setItem('haru.probe', '1'); localStorage.removeItem('haru.probe'); } catch (e) { probe = false; }
  if (!probe) { storageIssue = 'blocked'; return sampleWanted() ? seed() : emptyState(); }
  let raw = null, seen = false;
  try { raw = localStorage.getItem(KEY); seen = !!localStorage.getItem(SEEN); } catch (e) {}
  if (raw) {
    try { const o = JSON.parse(raw); if (o && o.members) { o.ui = Object.assign(blankUi(), o.ui); o.draft = o.draft || { title: '' }; return o; } } catch (e) {}
  }
  try { localStorage.setItem(SEEN, '1'); } catch (e) {}
  if (sampleWanted()) return seed();            // ?sample=1 with empty storage: demos and tests
  if (seen) { storageIssue = 'missing'; return emptyState(); }
  return emptyState();                          // first launch starts empty (S01 first-open state)
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
    if (storageIssue === 'full' || storageIssue === 'blocked') { storageIssue = null; HK.announce('다시 저장할 수 있어요'); renderBanners(); }
  } catch (e) {
    storageIssue = e && e.name === 'QuotaExceededError' ? 'full' : 'blocked';
    renderBanners();
  }
}

/* selectors */
const liveMembers = () => S.members.filter(m => !m.removedAt);
const member = id => liveMembers().find(m => m.id === id);
const liveProjects = () => S.projects.filter(p => !p.deletedAt);
const proj = id => liveProjects().find(p => p.id === id);
const liveTasks = () => S.tasks.filter(t => !t.deletedAt);
const task = id => S.tasks.find(t => t.id === id && !t.deletedAt);
const tasksOf = pid => liveTasks().filter(t => t.projectId === pid);
const stats = pid => { const a = tasksOf(pid); return { total: a.length, done: a.filter(t => t.done).length }; };
const byDue = (a, b) => (a.due || '9999').localeCompare(b.due || '9999') || a.created - b.created;
const norm = s => String(s).toLowerCase().replace(/\s+/g, '');
const membersFor = pid => { const p = proj(pid); return p ? liveMembers().filter(m => p.memberIds.includes(m.id)) : liveMembers(); };
const nameList = p => { const ms = liveMembers().filter(m => p.memberIds.includes(m.id)); return ms.length <= 3 ? ms.map(m => m.name).join(', ') : `${ms.length}명`; };

/* ---------- routing ---------- */
let route = { sec: 'today', pid: null, tid: null };
function parseRoute() {
  const seg = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const r = { sec: 'today', pid: null, tid: null }, a = seg[0] || 'today';
  if (a === 'projects') { r.sec = 'projects'; if (seg[1] && seg[1] !== 't') { r.pid = seg[1]; if (seg[2] === 't') r.tid = seg[3]; } }
  else if (a === 'search') { r.sec = 'search'; if (seg[1] === 't') r.tid = seg[2]; }
  else if (a === 'settings') r.sec = 'settings';
  else if (a === 'trash') r.sec = 'trash';
  else if (seg[1] === 't') r.tid = seg[2];
  return r;
}
const base = (r = route) => r.sec === 'projects' ? '#/projects' + (r.pid ? '/' + r.pid : '') : '#/' + r.sec;
const withTask = id => (route.sec === 'projects' && !route.pid) ? '#/projects' : base() + '/t/' + id;
const go = h => { if (location.hash === h) render(); else location.hash = h; };
const tabOf = sec => sec === 'trash' ? 'settings' : sec;
const NAMES = { today: '오늘', projects: '프로젝트', search: '검색', settings: '설정', trash: '휴지통' };

/* ---------- session (not persisted) ---------- */
const settling = new Set();   // tasks toggled in this visit: they stay in their old group until the person leaves (D09)
let query = '';
let overlayOpen = false;
const undoStack = [];
let qaFk = null, pjFk = null, sheetOf = null;
let qa = null, pj = null, detailPicking = false, titleError = false, memberMsg = '', backupMsg = null, renaming = null;

/* ---------- component helpers ---------- */
function menu({ label, value, icon, items, id, ctx = '', cls = '' }) {
  const its = items.map(i => i.sep ? '<hr class="hk-menu__sep" role="separator">' :
    `<button type="button" role="${i.radio === false ? 'menuitem' : 'menuitemradio'}" ${i.radio === false ? '' : `aria-checked="${!!i.checked}"`} class="hk-menu__item" data-act="${i.act}" data-val="${esc(i.val ?? '')}" data-ctx="${ctx}">${esc(i.label)}</button>`).join('');
  return `<div class="hk-menu ${cls}" data-hk="menu"${id ? ` id="${id}"` : ''}><button type="button" class="hk-menu__trigger" aria-haspopup="menu" aria-label="${esc(label)}: ${esc(value)}"${id ? ` data-fk="${id}-btn"` : ''}>${icon ? ic(icon, 2) : ''}<span>${esc(value)}</span>${ic('chevron-down', 2)}</button><div role="menu" aria-label="${esc(label)}">${its}</div></div>`;
}
function rowMenu(kind, id, name, extra = '') {
  const items = kind === 'trash'
    ? `<button type="button" role="menuitem" class="hk-menu__item" data-act="restore" data-id="${id}" data-kind="${extra}">복원${ic('rotate-ccw', 2)}</button><button type="button" role="menuitem" class="hk-menu__item hk-menu__item--destructive" data-act="forever" data-id="${id}" data-kind="${extra}">영구 삭제${ic('trash-2', 2)}</button>`
    : (kind === 'project'
      ? `<button type="button" role="menuitem" class="hk-menu__item" data-act="open-project" data-id="${id}">열기</button><button type="button" role="menuitem" class="hk-menu__item" data-act="edit-project" data-id="${id}">편집${ic('pencil', 2)}</button><button type="button" role="menuitem" class="hk-menu__item hk-menu__item--destructive" data-act="delete-project" data-id="${id}">삭제${ic('trash-2', 2)}</button>`
      : `<button type="button" role="menuitem" class="hk-menu__item" data-act="open-task" data-id="${id}">열기</button><button type="button" role="menuitem" class="hk-menu__item hk-menu__item--destructive" data-act="delete-task" data-id="${id}">삭제${ic('trash-2', 2)}</button>`);
  return `<div class="hk-menu hh-more" data-hk="menu"><button type="button" class="hk-bar-btn" aria-haspopup="menu" aria-label="‘${esc(name)}’ 더 보기" data-fk="more:${id}">${ic('ellipsis', 2)}</button><div role="menu" aria-label="‘${esc(name)}’ 더 보기">${items}</div></div>`;
}
const checkBtn = (t, fk) => `<button type="button" class="hk-complete" data-hk="complete" role="checkbox" aria-checked="${t.done}" aria-label="‘${esc(t.title)}’ 완료" data-act="toggle" data-id="${t.id}" data-fk="${fk}" data-decision="D09"></button>`;
function banner() {
  if (!storageIssue) return '';
  const T = {
    full: ['변경 내용을 저장하지 못했어요', '브라우저 저장 공간이 가득 찼어요. 지금 작업은 이 화면에서 계속할 수 있어요.', '내보내기', 'export'],
    blocked: ['이 브라우저가 저장을 막고 있어요', '시크릿 모드이거나 사이트 데이터가 차단됐을 수 있어요. 창을 닫으면 작업이 사라져요.', '내보내기', 'export'],
    missing: ['저장된 데이터를 찾을 수 없어요', '브라우저가 사이트 데이터를 지웠을 수 있어요. 내보낸 파일이 있다면 설정에서 가져올 수 있어요.', '설정 열기', 'settings'],
  }[storageIssue];
  return `<section class="hk-banner hk-banner--warning" data-hk="banner" role="region" data-decision="D15">${ic('triangle-alert', 2, 'hk-icon hk-banner__icon')}<div class="hk-banner__body"><h3 class="hk-banner__title">${T[0]}</h3><p class="hk-banner__text">${T[1]}</p></div><div class="hk-banner__actions"><button type="button" class="hk-banner__action" data-act="banner-${T[3]}">${T[2]}</button></div></section>`;
}
function renderBanners() { $$('.hh-bannerslot').forEach(s => { s.innerHTML = banner(); }); }
const slot = () => `<div class="hh-bannerslot">${banner()}</div>`;
const addBtn = (extra = '') => `<button type="button" class="hk-btn hk-btn--filled hh-add" data-act="add" aria-label="새 할 일" ${extra} data-fk="add">${ic('plus', 2.5)}<span class="hh-add__text">새 할 일</span></button>`;
const sbToggle = () => `<button type="button" class="hk-bar-btn hk-regular-only" data-act="sidebar" aria-label="사이드바 보기" aria-expanded="false">${ic('panel-left', 2)}</button>`;
const back = (href, label) => `<a class="hk-bar-btn hk-compact-only" href="${href}" aria-label="뒤로, ${esc(label)}" data-fk="back">${ic('chevron-left', 2)}<span>${esc(label)}</span></a>`;
function navbar({ title, lead = '', trail = '', large = null, toggle = true }) {
  return `<header class="hk-navbar" data-hk="navbar"${large ? ` data-large="#${large}"` : ''}><div class="hk-navbar__row"><div class="hk-navbar__lead">${lead}${toggle ? sbToggle() : ''}</div><span class="hk-navbar__title" aria-hidden="true">${esc(title)}</span><div class="hk-navbar__trail">${trail}</div></div></header>`;
}
const progressText = st => st.total === 0 ? '할 일이 아직 없어요' : st.done === st.total ? '모두 끝냈어요' : `${st.total}개 중 ${st.done}개 완료`;
let gseq = 0;
function gauge(p, st) {
  const id = 'g' + (++gseq);
  return `<div class="hk-gauge hk-gauge--slim" data-hk="gauge" data-decision="D05" data-value-text="{max}개 중 {value}개 완료" data-empty-text="할 일이 아직 없어요" data-full-text="모두 끝냈어요"><div class="hk-gauge__head"><span class="hk-gauge__label hk-visually-hidden" id="${id}">‘${esc(p.name)}’ 프로젝트 진행도</span><span class="hk-gauge__value hh-num"></span></div><div class="hk-gauge__track" role="meter" aria-labelledby="${id}" aria-valuemin="0" aria-valuemax="${st.total}" aria-valuenow="${st.done}"><span class="hk-gauge__fill"></span></div></div>`;
}

/* ---------- task rows ---------- */
function taskMeta(t, ctx) {
  const parts = [];
  const p = proj(t.projectId), a = member(t.assigneeId);
  const od = t.due && t.due < today() && !t.done;
  if (ctx !== 'project') parts.push(p ? esc(p.name) : '프로젝트 없음');
  if (liveMembers().length >= 2 && a && ctx !== 'search') parts.push(esc(a.name));
  if (ctx === 'project' && !a && liveMembers().length >= 2) parts.push('담당자 없음');
  if (od) parts.push(overdueText(t)); else if (ctx === 'project' || ctx === 'search') { if (t.due) parts.push(`<span class="hh-num">${fmtDate(t.due)}</span>`); }
  if (ctx === 'search' && a && liveMembers().length >= 2) parts.splice(1, 0, esc(a.name));
  return parts.join(' · ');
}
function taskRow(t, ctx, hl) {
  const sel = route.tid === t.id;
  const title = hl ? hl(t.title) : esc(t.title);
  return `<li class="hh-row" data-tid="${t.id}"${sel ? ' aria-current="true"' : ''}>${checkBtn(t, 'chk:' + t.id)}<a class="hh-row__main" href="${withTask(t.id)}" data-fk="row:${t.id}"><span class="hh-row__title" data-done="${t.done}">${title}</span><span class="hh-row__meta">${taskMeta(t, ctx)}</span></a>${rowMenu('task', t.id, t.title)}</li>`;
}
const effDone = t => t.done !== settling.has(t.id);
function doneDisclosure(key, label, rows, open) {
  if (!rows.length) return '';
  return `<details class="hk-disclosure hh-done" data-key="${key}" ${open ? 'open' : ''} data-decision="D16"><summary>${label}</summary><div class="hk-disclosure__body"><ul class="hh-list">${rows}</ul></div></details>`;
}

/* ---------- S01 오늘 ---------- */
function viewToday() {
  const t = today(), all = liveTasks();
  const firstOpen = all.length === 0 && liveProjects().length === 0;
  const open = all.filter(x => !effDone(x) && x.due === t).sort((a, b) => a.created - b.created);
  const over = all.filter(x => !effDone(x) && x.due && x.due < t).sort(byDue);
  const doneRows = all.filter(x => effDone(x) && x.due && x.due <= t && dayOf(x.doneAt || x.updated) === t).sort((a, b) => b.doneAt - a.doneAt);
  const doneCount = all.filter(x => x.done && x.due && x.due <= t && dayOf(x.doneAt) === t).length;
  let body = '';
  if (firstOpen) {
    body = `<div class="hh-first" data-decision="D16"><p>오늘 할 일이 여기에 모여요</p><form id="first-form" novalidate><div class="hk-field" data-hk="field" data-clear="false"><label class="hk-visually-hidden" for="first-title">새 할 일 제목</label><div class="hk-field__control"><input class="hk-field__input" id="first-title" type="text" placeholder="무엇을 할까요?" autocomplete="off" enterkeyhint="done"></div></div><button type="submit" class="hk-btn hk-btn--filled">추가</button></form><div class="hh-first__sample"><button type="button" class="hk-btn hk-btn--plain" data-act="load-sample" data-fk="sample">예시로 둘러보기</button></div></div>`;
  } else {
    if (open.length) body += `<section class="hh-section hh-section--first" aria-label="오늘 할 일"><ul class="hh-list">${open.map(x => taskRow(x, 'today')).join('')}</ul></section>`;
    else if (doneCount && !over.length) body += `<p class="hh-note">오늘 할 일을 모두 끝냈어요</p>`;
    else if (doneCount) body += `<p class="hh-note">오늘 할 일을 모두 끝냈어요</p>`;
    else body += `<div class="hh-note">오늘 할 일이 없어요<br><button type="button" class="hk-btn hk-btn--tinted" data-act="add">새 할 일</button></div>`;
    if (over.length) body += `<section class="hh-section" aria-labelledby="h-over"><h2 class="hh-section__head" id="h-over">지난 할 일 <span class="hh-section__count hh-num">${over.length}개</span></h2><ul class="hh-list">${over.map(x => taskRow(x, 'today')).join('')}</ul></section>`;
    body += doneDisclosure('today', `오늘 끝낸 일 <span class="hh-num">${doneCount}개</span>`, doneRows.map(x => taskRow(x, 'today')).join(''), S.ui.doneOpen.today);
  }
  return `<div data-screen="S01" data-decision="D16">${navbar({ title: '오늘', large: 'ttl-l', trail: firstOpen ? '' : addBtn() })}<h1 class="hk-navbar__large hh-title" id="ttl-l" data-show="always" tabindex="-1">오늘</h1><p class="hh-sub">${longToday()}</p>${slot()}${body}</div>`;
}

/* ---------- S02 / S03 ---------- */
function viewProjects() {
  const ps = liveProjects().sort((a, b) => b.lastUsed - a.lastUsed);
  let body;
  if (!ps.length) body = `<div class="hk-empty"><div class="hk-empty__icon" aria-hidden="true">${ic('folder', 1.5)}</div><p class="hk-empty__text">프로젝트는 할 일을 한곳에 모아 둬요</p><button type="button" class="hk-empty__action" data-act="new-project" data-fk="newproj">새 프로젝트</button></div>`;
  else body = `<ul class="hh-list hh-col" data-decision="D10">${ps.map(p => { const st = stats(p.id); return `<li class="hh-row" data-pid="${p.id}"><a class="hh-row__main" href="#/projects/${p.id}" data-fk="prow:${p.id}"><span class="hh-row__title">${esc(p.name)}</span>${gauge(p, st)}<span class="hh-row__meta">${esc(nameList(p))}</span></a><span class="hh-chev hk-compact-only" aria-hidden="true"></span>${rowMenu('project', p.id, p.name)}</li>`; }).join('')}</ul>`;
  const trail = (ps.length ? `<button type="button" class="hk-bar-btn" data-act="new-project" data-fk="newproj"><span class="hh-trail-text">새 프로젝트</span></button>` : '') + addBtn();
  return `<div data-screen="S02" data-decision="D05">${navbar({ title: '프로젝트', large: 'ttl-l', trail })}<h1 class="hk-navbar__large hh-title" id="ttl-l" data-show="always" tabindex="-1">프로젝트</h1>${slot()}${body}</div>`;
}
function viewProject() {
  const p = proj(route.pid);
  if (!p) return `<div data-screen="S03">${navbar({ title: '프로젝트', lead: back('#/projects', '프로젝트') })}<div class="hk-empty"><p class="hk-empty__title">이 프로젝트를 찾을 수 없어요</p><a class="hk-empty__action" href="#/projects" style="text-decoration:none;display:inline-flex;align-items:center">프로젝트 목록</a></div></div>`;
  const st = stats(p.id);
  const fid = S.ui.filter[p.id] || 'all';
  const filt = fid === 'all' ? null : fid;
  const fm = filt ? member(filt) : null;
  const effF = filt && fm ? filt : null;
  const rowsAll = tasksOf(p.id).filter(x => !effF || x.assigneeId === effF);
  const open = rowsAll.filter(x => !effDone(x)).sort(byDue);
  const done = rowsAll.filter(x => effDone(x)).sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0));
  const fitems = [{ label: '모두', val: 'all', act: 'set-filter', checked: !effF }].concat(membersFor(p.id).map(m => ({ label: m.name, val: m.id, act: 'set-filter', checked: effF === m.id })));
  const fval = '담당자: ' + (effF ? fm.name : '모두');
  let body;
  if (!stats(p.id).total) body = `<div class="hh-note">이 프로젝트에 할 일이 아직 없어요<br><button type="button" class="hk-btn hk-btn--tinted" data-act="add">새 할 일</button></div>`;
  else if (!rowsAll.length) body = `<div class="hh-note">이 담당자의 할 일이 없어요<br><button type="button" class="hk-btn hk-btn--tinted" data-act="set-filter" data-val="all">필터 해제</button></div>`;
  else {
    body = open.length ? `<section class="hh-section" aria-label="할 일" data-decision="D11"><ul class="hh-list">${open.map(x => taskRow(x, 'project')).join('')}</ul></section>` : '';
    body += doneDisclosure('p:' + p.id, `끝낸 일 <span class="hh-num">${rowsAll.filter(x => x.done).length}개</span>`, done.map(x => taskRow(x, 'project')).join(''), S.ui.doneOpen['p:' + p.id]);
  }
  const trail = `<button type="button" class="hk-bar-btn" data-act="edit-project" data-id="${p.id}" data-fk="editproj"><span class="hh-trail-text">편집</span></button>${addBtn()}`;
  return `<div data-screen="S03" data-decision="D14">${navbar({ title: p.name, lead: back('#/projects', '프로젝트'), trail, large: 'ttl-l' })}<h1 class="hk-navbar__large hh-title" id="ttl-l" data-show="always" tabindex="-1">${esc(p.name)}</h1>
  <div class="hh-head" data-decision="D05">${gauge(p, st)}<p class="hh-meta">구성원: ${esc(liveMembers().filter(m => p.memberIds.includes(m.id)).map(m => m.name).join(', ') || '없음')}</p></div>
  <div class="hh-filter" data-decision="D04">${menu({ label: '담당자', value: fval, icon: null, items: fitems, id: 'filter-menu' })}</div>${slot()}${body}</div>`;
}

/* ---------- S07 검색 ---------- */
function hlFn(q) {
  const chars = [...q.replace(/\s+/g, '')].map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!chars.length) return esc;
  const re = new RegExp(chars.join('\\s*'), 'i');
  return s => { const m = re.exec(s); if (!m) return esc(s); return esc(s.slice(0, m.index)) + '<strong>' + esc(m[0]) + '</strong>' + esc(s.slice(m.index + m[0].length)); };
}
function searchResults() {
  const q = query.trim();
  if (!q) {
    if (!S.ui.recents.length) return `<p class="hh-note">할 일이나 프로젝트 이름을 적어 보세요</p>`;
    return `<section class="hh-section" aria-labelledby="h-rec"><div class="hh-recents__head"><h2 class="hh-section__head" id="h-rec" style="padding-inline-start:0">최근 검색</h2><button type="button" class="hk-btn hk-btn--plain" data-act="clear-recents" aria-label="최근 검색 지우기">지우기</button></div>${S.ui.recents.map(r => `<button type="button" class="hh-recent" data-act="recent" data-val="${esc(r)}">${ic('search', 2)}<span>${esc(r)}</span></button>`).join('')}</section>`;
  }
  const nq = norm(q), hl = hlFn(q);
  const ts = liveTasks().filter(t => norm(t.title).includes(nq) || norm(t.note || '').includes(nq) || norm(proj(t.projectId)?.name || '').includes(nq)).sort(byDue);
  const ps = liveProjects().filter(p => norm(p.name).includes(nq));
  if (!ts.length && !ps.length) return `<div class="hk-empty" role="status"><div class="hk-empty__icon" aria-hidden="true">${ic('search', 1.5)}</div><p class="hk-empty__title">‘${esc(q)}’ 검색 결과가 없어요</p><p class="hk-empty__text">철자를 확인하거나 새 할 일로 추가해 보세요. 휴지통은 검색에 포함되지 않아요.</p><button type="button" class="hk-empty__action" data-act="add" data-title="${esc(q)}">‘${esc(q)}’ 새 할 일로 추가</button></div>`;
  let h = '';
  if (ts.length) h += `<section class="hh-section" aria-labelledby="h-st"><h2 class="hh-section__head" id="h-st">할 일 <span class="hh-section__count hh-num">${ts.length}개</span></h2><ul class="hh-list">${ts.map(t => taskRow(t, 'search', hl)).join('')}</ul></section>`;
  if (ps.length) h += `<section class="hh-section" aria-labelledby="h-sp"><h2 class="hh-section__head" id="h-sp">프로젝트 <span class="hh-section__count hh-num">${ps.length}개</span></h2><ul class="hh-list">${ps.map(p => { const st = stats(p.id); return `<li class="hh-row" data-pid="${p.id}"><a class="hh-row__main" href="#/projects/${p.id}" data-act="remember-search"><span class="hh-row__title">${hl(p.name)}</span><span class="hh-row__meta hh-num">${progressText(st)}</span></a></li>`; }).join('')}</ul></section>`;
  return h;
}
function viewSearch() {
  return `<div data-screen="S07" data-decision="D13">${navbar({ title: '검색', large: 'ttl-l', trail: addBtn() })}<h1 class="hk-navbar__large hh-title" id="ttl-l" data-show="always" tabindex="-1">검색</h1>${slot()}
  <div class="hh-searchwrap"><form class="hk-search" data-hk="search" role="search"><div class="hk-search__bar"><div class="hk-search__field">${ic('search', 2)}<input class="hk-search__input" id="q" type="search" aria-label="검색" placeholder="할 일과 프로젝트 검색" enterkeyhint="search" autocomplete="off" value="${esc(query)}"></div><button type="button" class="hk-btn hk-btn--plain hk-search__cancel">취소</button></div></form></div>
  <div id="search-results" aria-live="polite">${searchResults()}</div></div>`;
}

/* ---------- S08 휴지통 ---------- */
function trashItems() {
  const dp = S.projects.filter(p => p.deletedAt);
  const items = dp.map(p => ({ kind: 'project', id: p.id, title: p.name, at: p.deletedAt, n: S.tasks.filter(t => t.deletedAt && t.projectId === p.id).length }));
  S.tasks.filter(t => t.deletedAt && !(t.projectId && dp.some(p => p.id === t.projectId))).forEach(t => items.push({ kind: 'task', id: t.id, title: t.title, at: t.deletedAt }));
  return items.sort((a, b) => b.at - a.at);
}
function viewTrash() {
  const items = trashItems();
  const body = items.length ? `<ul class="hh-list hh-col" data-decision="D01">${items.map(i => `<li class="hh-row hh-trashrow" data-kind="${i.kind}" data-id="${i.id}"><div class="hh-row__main"><span class="hh-row__title">${esc(i.title)}</span><span class="hh-row__meta"><span class="hh-type">${i.kind === 'task' ? '할 일' : '프로젝트'}</span> · ${i.kind === 'project' ? `할 일 ${i.n}개 포함 · ` : ''}${whenDeleted(i.at)}</span></div><div class="hh-actions"><button type="button" class="hk-btn hk-btn--plain" data-act="restore" data-id="${i.id}" data-kind="${i.kind}" aria-label="‘${esc(i.title)}’ 복원" data-fk="rest:${i.id}">복원</button>${rowMenu('trash', i.id, i.title, i.kind)}</div></li>`).join('')}</ul>`
    : `<div class="hk-empty"><div class="hk-empty__icon" aria-hidden="true">${ic('trash-2', 1.5)}</div><p class="hk-empty__title">휴지통이 비어 있어요</p><p class="hk-empty__text">삭제한 할 일과 프로젝트가 여기에 와요</p></div>`;
  const trail = `<button type="button" class="hk-bar-btn" data-act="empty-trash" ${items.length ? '' : 'disabled'} data-fk="empty"><span class="hh-trail-text">휴지통 비우기</span></button>`;
  return `<div data-screen="S08">${navbar({ title: '휴지통', lead: back('#/settings', '설정'), trail, large: 'ttl-l' })}<h1 class="hk-navbar__large hh-title" id="ttl-l" data-show="always" tabindex="-1">휴지통</h1><p class="hh-sub">항목 ${items.length}개</p>${slot()}${body}</div>`;
}

/* ---------- S09 설정 ---------- */
function memberRows() {
  return liveMembers().map(m => {
    const edit = renaming === m.id;
    return `<li class="hh-member" data-mid="${m.id}">${edit
      ? `<input class="hh-member__input" id="ren-input" type="text" value="${esc(m.name)}" aria-label="구성원 이름" data-mid="${m.id}">`
      : `<button type="button" class="hh-member__name" data-act="rename" data-id="${m.id}" data-fk="mname:${m.id}">${esc(m.name)}</button>`}
      <button type="button" class="hk-bar-btn" data-act="rename" data-id="${m.id}" aria-label="‘${esc(m.name)}’ 이름 바꾸기">${ic('pencil', 2)}</button>
      ${m.id === 'me' ? '' : `<button type="button" class="hk-bar-btn" data-act="remove-member" data-id="${m.id}" aria-label="‘${esc(m.name)}’ 구성원 삭제">${ic('trash-2', 2)}</button>`}</li>`;
  }).join('');
}
function viewSettings() {
  const n = trashItems().length;
  const bm = backupMsg ? `<p class="hh-msg ${backupMsg.err ? 'hh-msg--err' : 'hh-msg--ok'}" role="status">${ic(backupMsg.err ? 'circle-alert' : 'circle-check', 2)}<span>${esc(backupMsg.text)}</span></p>` : '';
  return `<div data-screen="S09" data-decision="D12">${navbar({ title: '설정', large: 'ttl-l' })}<h1 class="hk-navbar__large hh-title" id="ttl-l" data-show="always" tabindex="-1">설정</h1>${slot()}<div class="hh-col">
  <section class="hh-block" style="margin-top:var(--s-2)" aria-labelledby="h-mem"><h2 class="hh-section__head" id="h-mem">구성원</h2>
    <ul class="hh-cells" id="member-list" data-decision="D08">${memberRows()}<li class="hh-member hh-member--add"><input class="hh-member__input" id="new-member" type="text" placeholder="이름" aria-label="구성원 이름" autocomplete="off" enterkeyhint="done"><button type="button" class="hk-btn hk-btn--tinted" data-act="add-member" aria-label="구성원 추가" disabled>${ic('plus', 2.25)}추가</button></li></ul>
    <p class="hh-hint" id="member-msg" role="status">${esc(memberMsg)}</p></section>
  <section class="hh-block" aria-labelledby="h-bak"><h2 class="hh-section__head" id="h-bak">백업</h2>
    <div class="hh-cells"><div class="hh-backup__note">${ic('info', 2)}<div><p>데이터는 이 브라우저에만 저장돼요.</p><p>내보낸 파일로 다른 곳에 보관할 수 있어요.</p></div></div><div class="hh-backup"><button type="button" class="hk-btn hk-btn--tinted" data-act="export" data-fk="export">${ic('share', 2)}내보내기</button><button type="button" class="hk-btn hk-btn--tinted" data-act="import" data-fk="import">${ic('download', 2)}가져오기</button></div></div>
    <div class="hh-msgwrap" id="backup-msg">${bm}</div></section>
  <section class="hh-block hk-compact-only" aria-label="휴지통"><div class="hh-cells"><a class="hh-linkrow" href="#/trash" data-fk="trashlink"><span>휴지통${n ? ` <span class="hh-type hh-num">${n}</span>` : ''}</span><span class="hh-chev" style="margin:0" aria-hidden="true"></span></a></div></section>
  <section class="hh-block" style="margin-top:calc(var(--block-gap) + var(--s-2))" aria-label="모든 데이터"><div class="hh-cells hh-danger" data-decision="D01"><button type="button" class="hk-btn hk-btn--plain hk-btn--destructive" data-act="delete-all" data-fk="delall">모든 데이터 삭제</button></div></section></div></div>`;
}

/* ---------- S04 할 일 상세 ---------- */
function dueItems(t) {
  const d = t.due, tt = today(), nm = nextMonday();
  return [
    { label: '오늘', val: 'today', act: 'set-due', checked: d === tt },
    { label: '내일', val: 'tomorrow', act: 'set-due', checked: d === addDays(tt, 1) },
    { label: `다음 주 (${parse(nm).getMonth() + 1}월 ${parse(nm).getDate()}일)`, val: 'nextweek', act: 'set-due', checked: d === nm },
    { label: '마감일 없음', val: 'none', act: 'set-due', checked: !d },
    { sep: true },
    { label: '날짜 고르기…', val: 'pick', act: 'set-due', radio: false },
  ];
}
const projectItems = cur => [{ label: '프로젝트 없음', val: '', act: 'set-project', checked: !cur }].concat(liveProjects().map(p => ({ label: p.name, val: p.id, act: 'set-project', checked: cur === p.id })));
const assigneeItems = (pid, cur) => [{ label: '담당자 없음', val: '', act: 'set-assignee', checked: !cur }].concat(membersFor(pid).map(m => ({ label: m.name, val: m.id, act: 'set-assignee', checked: cur === m.id })));
const dueValue = t => t.due && t.due < today() && !t.done ? overdueText(t) : fmtDate(t.due);
function fieldCells(t, ctx, picking) {
  const a = member(t.assigneeId), p = proj(t.projectId);
  return `<div class="hh-cell"><span class="hh-cell__label">마감일</span>${menu({ label: '마감일', value: dueValue(t), icon: 'calendar', items: dueItems(t), ctx, id: ctx + '-due' })}${picking ? '' : `<input type="date" class="hh-datepick" id="${ctx}-date" data-ctx="${ctx}" value="${t.due || today()}" tabindex="-1" aria-label="날짜">`}</div>
  ${picking ? `<div class="hh-cell hh-cell--date"><div class="hk-field" data-hk="field"><label class="hk-field__label" for="${ctx}-date">날짜</label><div class="hk-field__control"><input class="hk-field__input" id="${ctx}-date" type="date" data-ctx="${ctx}" value="${t.due || today()}">${ic('calendar', 2, 'hk-icon hk-field__icon')}</div></div></div>` : ''}
  <div class="hh-cell"><span class="hh-cell__label">프로젝트</span>${menu({ label: '프로젝트', value: p ? p.name : '프로젝트 없음', icon: 'folder', items: projectItems(t.projectId), ctx, id: ctx + '-proj' })}</div>
  <div class="hh-cell"><span class="hh-cell__label">담당자</span>${menu({ label: '담당자', value: a ? a.name : '담당자 없음', icon: 'user', items: assigneeItems(t.projectId, t.assigneeId), ctx, id: ctx + '-asg' })}</div>`;
}
function parentLabel() { return route.sec === 'projects' && route.pid ? (proj(route.pid)?.name || '프로젝트') : NAMES[route.sec]; }
function viewDetail() {
  const t = task(route.tid);
  if (!t) return `<div data-screen="S04" data-decision="D07">${navbar({ title: '할 일', toggle: false, lead: back(base(), parentLabel()), trail: `<button type="button" class="hk-bar-btn hk-regular-only" data-act="close-detail" aria-label="상세 닫기">${ic('x', 2)}</button>` })}<div class="hk-empty"><p class="hk-empty__title">이 할 일을 찾을 수 없어요</p><a class="hk-empty__action" href="${base()}" style="text-decoration:none;display:inline-flex;align-items:center">목록으로</a></div></div>`;
  const trail = `<div class="hk-menu" data-hk="menu"><button type="button" class="hk-bar-btn" aria-haspopup="menu" aria-label="더 보기" data-fk="d-more">${ic('ellipsis', 2)}</button><div role="menu" aria-label="더 보기"><button type="button" role="menuitem" class="hk-menu__item hk-menu__item--destructive" data-act="delete-task" data-id="${t.id}">삭제${ic('trash-2', 2)}</button></div></div><button type="button" class="hk-bar-btn hk-regular-only" data-act="close-detail" aria-label="상세 닫기" data-fk="d-close">${ic('x', 2)}</button>`;
  return `<div data-screen="S04" data-decision="D07">${navbar({ title: '할 일', toggle: false, lead: back(base(), parentLabel()), trail })}${slot()}
  <div class="hh-form"><div class="hh-titleblock"><label class="hh-label" for="d-title">제목</label><div class="hh-titlerow">${checkBtn(t, 'd-chk')}<div class="hh-titlefield"><textarea class="hh-title-input" id="d-title" rows="1" data-done="${t.done}" ${titleError ? 'aria-invalid="true" aria-describedby="d-title-err"' : ''} enterkeyhint="next" data-fk="d-title">${esc(t.title)}</textarea>${titleError ? `<p class="hh-msg hh-msg--err" id="d-title-err">${ic('circle-alert', 2)}<span>제목을 적어 주세요</span></p>` : ''}</div></div></div>
  <div class="hh-cells" id="d-cells" data-decision="D03">${fieldCells(t, 'd', detailPicking)}</div>
  <div class="hk-field hh-notefield" data-hk="field textview" data-max-rows="8"><label class="hk-field__label" for="d-note">메모</label><div class="hk-field__control"><textarea class="hk-field__input" id="d-note" placeholder="메모를 남겨 보세요" data-fk="d-note">${esc(t.note || '')}</textarea></div></div></div></div>`;
}
function emptyDetail() { return `<div data-screen="S04" data-decision="D07" class="hh-emptydetail"><div class="hk-empty"><div class="hk-empty__icon" aria-hidden="true">${ic('square-check-big', 1.5)}</div><p class="hk-empty__text">할 일을 고르면 여기에 보여요</p></div></div>`; }

/* ---------- render ---------- */
const showsDetail = () => ['today', 'search'].includes(route.sec) || (route.sec === 'projects' && route.pid);
let lastKey = '';
function sidebarMode() {
  if (!matchMedia('(min-width: 744px)').matches) return 'none';
  const wide = matchMedia('(min-width: 960px)').matches, fine = matchMedia('(pointer: fine)').matches;
  if (wide && fine) return S.ui.sidebarHidden ? 'hidden' : 'shown';
  return overlayOpen ? 'overlay' : 'hidden';
}
function renderNav() {
  const mode = sidebarMode();
  $('#shell').dataset.sidebar = mode === 'none' ? 'hidden' : mode;
  const open = mode === 'shown' || mode === 'overlay';
  $$('[data-act="sidebar"]').forEach(b => { b.setAttribute('aria-expanded', String(open)); b.setAttribute('aria-label', open ? '사이드바 숨기기' : '사이드바 보기'); });
  const cur = (cond) => cond ? ' aria-current="page"' : '';
  const secs = route.sec;
  const cnt = liveTasks().filter(t => !t.done && t.due && t.due <= today()).length;
  $('#sidebar').innerHTML = `<div class="hk-sidebar__section"><ul>
    <li><a class="hk-sidebar__item" href="#/today"${cur(secs === 'today')}>${ic('calendar', 2)}<span class="hk-sidebar__label">오늘</span>${cnt ? `<span class="hk-sidebar__count">${cnt}</span>` : ''}</a></li>
    <li><a class="hk-sidebar__item" href="#/search"${cur(secs === 'search')}>${ic('search', 2)}<span class="hk-sidebar__label">검색</span></a></li>
    <li><a class="hk-sidebar__item" href="#/projects"${cur(secs === 'projects' && !route.pid)}>${ic('folder', 2)}<span class="hk-sidebar__label">프로젝트</span></a><ul>${liveProjects().sort((a, b) => b.lastUsed - a.lastUsed).map(p => `<li><a class="hk-sidebar__item" href="#/projects/${p.id}"${cur(secs === 'projects' && route.pid === p.id)}><span class="hk-sidebar__label">${esc(p.name)}</span></a></li>`).join('')}</ul></li>
    <li><a class="hk-sidebar__item" href="#/trash"${cur(secs === 'trash')}>${ic('trash-2', 2)}<span class="hk-sidebar__label">휴지통</span></a></li>
    <li><a class="hk-sidebar__item" href="#/settings"${cur(secs === 'settings')}>${ic('settings', 2)}<span class="hk-sidebar__label">설정</span></a></li></ul></div>`;
  const tabs = [['today', '오늘', 'calendar'], ['projects', '프로젝트', 'folder'], ['search', '검색', 'search'], ['settings', '설정', 'settings']];
  $('#tabbar ul').innerHTML = tabs.map(([k, l, i]) => `<li><a class="hk-tab" href="#/${k}"${cur(tabOf(secs) === k)}>${ic(i, 2)}<span class="hk-tab__label">${l}</span></a></li>`).join('');
}
function withFocus(fn) {
  const a = document.activeElement, fk = a && a.closest && a.closest('[data-fk]')?.dataset.fk;
  fn();
  if (fk) { const el = $(`[data-fk="${CSS.escape(fk)}"]`); if (el && el !== document.activeElement) el.focus({ preventScroll: true }); }
}
function renderList() {
  const el = $('#pane-list');
  const v = { today: viewToday, projects: route.pid ? viewProject : viewProjects, search: viewSearch, trash: viewTrash, settings: viewSettings }[route.sec];
  const top = el.scrollTop;
  el.innerHTML = v();
  const key = route.sec + ':' + route.pid;
  el.scrollTop = key === lastKey ? top : 0;
  lastKey = key;
  fitTitles(el);
}
function renderDetail() {
  const el = $('#pane-detail');
  el.innerHTML = !showsDetail() ? '' : route.tid ? viewDetail() : emptyDetail();
  fitTitles(el);
}
function fitTitles(root) { $$('.hh-title-input', root).forEach(t => { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }); }
function markSelected() { $$('#pane-list .hh-row[data-tid]').forEach(r => { if (route.tid === r.dataset.tid) r.setAttribute('aria-current', 'true'); else r.removeAttribute('aria-current'); }); }
let prevSec = null;
function render() {
  const prev = route;
  route = parseRoute();
  const main = $('#main');
  const rkey = route.sec + ':' + route.pid;
  if (route.sec !== prevSec) { settling.clear(); detailPicking = false; $$('.hk-toast').forEach(t => t.hkDismiss ? t.hkDismiss(false) : t.remove()); if (prevSec) { if (route.sec !== 'search') {} } }
  else if (prev.pid !== route.pid || (HK.compact() && prev.tid !== route.tid)) { settling.clear(); detailPicking = false; }
  else if (prev.tid !== route.tid) detailPicking = false;
  titleError = false;
  prevSec = route.sec;
  main.dataset.panes = showsDetail() ? '2' : '1';
  main.dataset.view = route.tid && showsDetail() ? 'detail' : 'list';
  $('#pane-list').toggleAttribute('inert', main.dataset.view === 'detail' && HK.compact());
  S.ui.route = location.hash || '#/today'; save();
  if (route.pid) { const p = proj(route.pid); if (p && prev.pid !== route.pid) p.lastUsed = Date.now(); }
  renderNav();
  renderList();
  renderDetail();
  if (route.sec === 'search' && !route.tid && prev.sec !== 'search') setTimeout(() => $('#q')?.focus(), 50);
  if (route.tid && showsDetail() && prev.tid !== route.tid && kbOpen) focusSoon('#d-title');
  else if (prev.tid && !route.tid && prev.sec === route.sec && task(prev.tid)) focusSoon(fk('row:' + prev.tid), HEAD);
  kbOpen = false;
  document.title = '하루 · ' + (route.tid && showsDetail() && HK.compact() ? '할 일' : (route.pid ? (proj(route.pid)?.name || '프로젝트') : NAMES[route.sec]));
  if (route.sec !== (prev.sec) && lastAnnounce !== route.sec) { HK.announce(NAMES[route.sec]); }
  lastAnnounce = route.sec;
}
let lastAnnounce = null;
function refresh() { withFocus(() => { renderNav(); renderList(); if (route.tid && showsDetail()) renderDetail(); }); }
function refreshAll() { withFocus(() => { renderNav(); renderList(); renderDetail(); }); }

/* ---------- focus: keyboard people continue where they were, never on body ---------- */
let lastFk = null, kbOpen = false, toastN = 0;
const fk = k => `[data-fk="${CSS.escape(k)}"]`;
const HEAD = '#pane-list .hh-title';
function focusSoon(...sels) {
  setTimeout(() => {
    for (const s of sels) { const e = s && $(s); if (e && !e.disabled && !e.closest('[inert]')) { e.focus(); return; } }
  }, 30);
}
function neighborFk(id) {
  const li = $(`#pane-list .hh-row[data-tid="${id}"], #pane-list .hh-row[data-pid="${id}"], #pane-list .hh-trashrow[data-id="${id}"], #pane-list .hh-member[data-mid="${id}"]`);
  if (!li) return null;
  for (const sib of [li.nextElementSibling, li.previousElementSibling]) {
    const e = sib && $('[data-fk^="row:"], [data-fk^="prow:"], [data-fk^="rest:"], [data-fk^="mname:"]', sib);
    if (e) return e.dataset.fk;
  }
  return null;
}
const settle = k => focusSoon(k && fk(k), fk('add'), HEAD);

/* ---------- mutations ---------- */
function touch(t) { t.updated = Date.now(); }
function addTask(o) {
  const t = Object.assign({ id: uid('t'), title: '', note: '', due: null, projectId: null, assigneeId: 'me', done: false, doneAt: null, created: Date.now(), updated: Date.now() }, o);
  S.tasks.push(t);
  if (t.projectId) { const p = proj(t.projectId); if (p) p.lastUsed = Date.now(); }
  save(); HK.announce(`‘${t.title}’ 할 일을 추가했어요`);
  return t;
}
function toggleTask(id) {
  const t = task(id); if (!t) return;
  t.done = !t.done; t.doneAt = t.done ? Date.now() : null; touch(t);
  if (settling.has(id)) settling.delete(id); else settling.add(id);
  save(); HK.announce(t.done ? '완료로 표시했어요' : '완료를 취소했어요');
  if (route.tid === id) renderDetail();
  refresh();
  if (route.tid === id && showsDetail()) { /* keep list in sync */ }
}
function loadSample() {
  const prev = S, sample = seed();
  sample.ui = prev.ui; sample.draft = prev.draft;
  S = sample; save(); refreshAll(); renderNav();
  showUndo(`예시 할 일 ${liveTasks().length}개를 불러왔어요`, pushUndo({ undo: () => { S = prev; } }));
  HK.announce('예시 데이터를 불러왔어요');
  focusSoon(fk('add'), HEAD);
}
function pushUndo(entry) { undoStack.push(entry); return entry; }
function showUndo(message, entry) {
  HK.toast({ message, undoLabel: '실행 취소', undoneMessage: '되돌렸어요', duration: 0, shortcut: true, container: $('#toasthost'), onUndo: () => runUndo(entry) });
  $('#main').dataset.toast = '1';
}
function runUndo(entry) {
  const i = undoStack.indexOf(entry); if (i < 0) return;
  undoStack.splice(i, 1); entry.undo(); save(); refreshAll();
  focusSoon(entry.fk && fk(entry.fk), fk('add'), HEAD);
}
function deleteTask(id) {
  const t = task(id); if (!t) return;
  const nb = neighborFk(id);
  t.deletedAt = Date.now(); touch(t); save();
  if (route.tid === id) { go(base()); } else refreshAll();
  focusSoon(nb && fk(nb), fk('add'), HEAD);
  showUndo(`‘${t.title}’ 할 일을 삭제했어요`, pushUndo({ fk: 'row:' + id, undo: () => { delete t.deletedAt; } }));
  HK.announce(`‘${t.title}’ 할 일을 삭제했어요`);
}
function deleteProject(id) {
  const p = proj(id); if (!p) return;
  const now = Date.now(), ts = tasksOf(id), nb = neighborFk(id);
  p.deletedAt = now; ts.forEach(t => { t.deletedAt = now; t.viaProject = id; }); save();
  if (route.pid === id) go('#/projects'); else refreshAll();
  focusSoon(nb && fk(nb), fk('add'), HEAD);
  const msg = ts.length ? `‘${p.name}’ 프로젝트와 할 일 ${ts.length}개를 삭제했어요` : `‘${p.name}’ 프로젝트를 삭제했어요`;
  showUndo(msg, pushUndo({ fk: 'prow:' + id, undo: () => { delete p.deletedAt; ts.forEach(t => { delete t.deletedAt; delete t.viaProject; }); } }));
  HK.announce(msg);
}
function removeMember(id) {
  const m = member(id); if (!m || id === 'me') return;
  const nb = neighborFk(id);
  m.removedAt = Date.now(); save(); refreshAll();
  focusSoon(nb && fk(nb), '#new-member', HEAD);
  showUndo(`‘${m.name}’ 구성원을 삭제했어요`, pushUndo({ fk: 'mname:' + id, undo: () => { delete m.removedAt; } }));
}
function toastMsg(message) { HK.toast({ message, duration: 0, container: $('#toasthost') }); $('#main').dataset.toast = '1'; }
function restoreItem(kind, id) {
  const nb = neighborFk(id);
  focusSoon(nb && fk(nb), fk('empty'), HEAD);
  if (kind === 'project') {
    const p = S.projects.find(x => x.id === id); if (!p) return;
    const ts = S.tasks.filter(t => t.deletedAt && t.projectId === id);
    delete p.deletedAt; ts.forEach(t => { delete t.deletedAt; delete t.viaProject; }); p.lastUsed = Date.now();
    save(); refreshAll();
    toastMsg(ts.length ? `‘${p.name}’ 프로젝트와 할 일 ${ts.length}개를 되돌렸어요` : `‘${p.name}’ 프로젝트를 되돌렸어요`);
  } else {
    const t = S.tasks.find(x => x.id === id); if (!t) return;
    delete t.deletedAt; if (t.projectId && !proj(t.projectId)) t.projectId = null; touch(t);
    save(); refreshAll(); toastMsg(`‘${t.title}’ 할 일을 되돌렸어요`);
  }
}

/* ---------- confirmations (D01) ---------- */
function confirmDlg({ title, message, actions }) {
  // actions in compact order: choices first (destructive on top), cancel last. kind: destructive | default | normal | cancel
  return new Promise(res => {
    const compact = HK.compact();
    const dlg = compact ? $('#as-confirm') : $('#alert-confirm');
    const form = $('form', dlg);
    if (compact) {
      const ch = actions.filter(a => a.kind !== 'cancel'), cn = actions.find(a => a.kind === 'cancel');
      form.innerHTML = `<div class="hk-actionsheet__group"><div class="hk-actionsheet__head"><h2 class="hk-actionsheet__title" id="as-confirm-t">${esc(title)}</h2>${message ? `<p class="hk-actionsheet__message">${esc(message)}</p>` : ''}</div>${ch.map(a => `<button value="${a.value}" class="hk-actionsheet__btn${a.kind === 'destructive' ? ' hk-actionsheet__btn--destructive' : ''}">${esc(a.label)}</button>`).join('')}</div><div class="hk-actionsheet__cancel"><button value="cancel" class="hk-actionsheet__btn hk-actionsheet__btn--cancel">${esc(cn.label)}</button></div>`;
    } else {
      let list = actions.slice();
      if (list.length === 2) list = [list.find(a => a.kind === 'cancel'), list.find(a => a.kind !== 'cancel')];
      const dflt = list.some(a => a.kind === 'default');
      dlg.toggleAttribute('data-destructive', !dflt);
      form.innerHTML = `<div class="hk-alert__content"><h2 class="hk-alert__title" id="alert-confirm-t">${esc(title)}</h2>${message ? `<p class="hk-alert__message" id="alert-confirm-m">${esc(message)}</p>` : ''}</div><div class="hk-alert__actions">${list.map(a => `<button value="${a.value}" class="hk-alert__btn${a.kind === 'destructive' ? ' hk-alert__btn--destructive' : ''}${a.kind === 'default' ? ' hk-alert__btn--default' : ''}"${a.kind === 'default' ? ' autofocus' : ''}>${esc(a.label)}</button>`).join('')}</div>`;
    }
    dlg.returnValue = '';
    dlg.__opener = document.activeElement;
    const op = lastFk;
    const done = () => {
      dlg.removeEventListener('close', done);
      const rv = dlg.returnValue || 'cancel';
      if (rv === 'cancel') focusSoon(op && fk(op), HEAD);
      res(rv);
    };
    dlg.addEventListener('close', done);
    dlg.showModal();
  });
}
async function emptyTrash() {
  const n = trashItems().length; if (!n) return;
  const v = await confirmDlg({ title: `휴지통의 항목 ${n}개를 영구 삭제할까요?`, message: '삭제한 항목은 되돌릴 수 없어요.', actions: [{ label: '휴지통 비우기', value: 'ok', kind: HK.compact() ? 'destructive' : 'default' }, { label: '취소', value: 'cancel', kind: 'cancel' }] });
  if (v !== 'ok') return;
  S.tasks = S.tasks.filter(t => !t.deletedAt); S.projects = S.projects.filter(p => !p.deletedAt);
  undoStack.length = 0; save(); refreshAll(); HK.announce('영구 삭제했어요');
  focusSoon(HEAD);
}
async function foreverItem(kind, id) {
  const it = trashItems().find(i => i.id === id && i.kind === kind); if (!it) return;
  const nb = neighborFk(id);
  const title = kind === 'project' ? `‘${it.title}’ 프로젝트와 할 일 ${it.n}개를 영구 삭제할까요?` : `‘${it.title}’ 할 일을 영구 삭제할까요?`;
  const v = await confirmDlg({ title, message: '되돌릴 수 없어요.', actions: [{ label: '영구 삭제', value: 'ok', kind: HK.compact() ? 'destructive' : 'default' }, { label: '취소', value: 'cancel', kind: 'cancel' }] });
  if (v !== 'ok') return;
  if (kind === 'project') { S.tasks = S.tasks.filter(t => !(t.deletedAt && t.projectId === id)); S.projects = S.projects.filter(p => p.id !== id); }
  else S.tasks = S.tasks.filter(t => t.id !== id);
  save(); refreshAll(); HK.announce('영구 삭제했어요');
  focusSoon(nb && fk(nb), HEAD);
}
async function deleteAll() {
  const v = await confirmDlg({ title: '이 브라우저의 모든 데이터를 삭제할까요?', message: `할 일 ${liveTasks().length}개, 프로젝트 ${liveProjects().length}개, 구성원 ${liveMembers().length}명이 모두 사라지고 되돌릴 수 없어요. 먼저 내보내기로 파일을 저장해 두세요.`, actions: [{ label: '모든 데이터 삭제', value: 'ok', kind: 'destructive' }, { label: '취소', value: 'cancel', kind: 'cancel' }] });
  if (v !== 'ok') return;
  S = emptyState(); undoStack.length = 0; storageIssue = storageIssue === 'missing' ? null : storageIssue; backupMsg = null; query = '';
  save(); location.hash = '#/today'; render(); HK.announce('모든 데이터를 삭제했어요'); focusSoon(HEAD);
}

/* ---------- backup (S09) ---------- */
function doExport() {
  const data = { app: 'haru', version: 1, exportedAt: new Date().toISOString(), data: { members: S.members, projects: S.projects, tasks: S.tasks } };
  const name = `haru-${today()}.json`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  backupMsg = { text: `내보냈어요 · ${name}` }; showBackupMsg(); HK.announce('내보냈어요');
}
function showBackupMsg() { const w = $('#backup-msg'); if (!w) return; w.innerHTML = backupMsg ? `<p class="hh-msg ${backupMsg.err ? 'hh-msg--err' : 'hh-msg--ok'}" role="status">${ic(backupMsg.err ? 'circle-alert' : 'circle-check', 2)}<span>${esc(backupMsg.text)}</span></p>` : ''; }
function importError(text) { backupMsg = { err: true, text }; showBackupMsg(); }
async function onImportFile(file) {
  if (!file) return;
  let o;
  try { o = JSON.parse(await file.text()); } catch (e) { return importError('파일을 읽을 수 없어요. 파일이 손상됐을 수 있어요. 다시 내보낸 파일을 골라 주세요. 지금 데이터는 그대로예요.'); }
  if (!o || o.app !== 'haru' || !o.data) return importError('이 파일은 하루에서 내보낸 파일이 아니에요. 하루에서 내보낸 .json 파일을 골라 주세요. 지금 데이터는 그대로예요.');
  if (o.version > 1) return importError('더 새로운 버전의 하루에서 만든 파일이에요. 하루를 새로 고친 뒤 다시 시도해 주세요. 지금 데이터는 그대로예요.');
  const d = o.data;
  if (!Array.isArray(d.members) || !Array.isArray(d.projects) || !Array.isArray(d.tasks)) return importError('파일을 읽을 수 없어요. 파일이 손상됐을 수 없어요. 다시 내보낸 파일을 골라 주세요. 지금 데이터는 그대로예요.'.replace('없을 수 없어요', '있어요'));
  const nt = d.tasks.filter(t => !t.deletedAt).length, np = d.projects.filter(p => !p.deletedAt).length;
  const v = await confirmDlg({ title: '가져온 파일로 어떻게 할까요?', message: `파일에는 할 일 ${nt}개, 프로젝트 ${np}개가 있어요. 바꾸면 지금 데이터가 사라져요.`, actions: [{ label: '바꾸기', value: 'replace', kind: 'destructive' }, { label: '합치기', value: 'merge', kind: 'normal' }, { label: '취소', value: 'cancel', kind: 'cancel' }] });
  if (v === 'cancel' || !v) return;
  if (v === 'replace') { S.members = d.members; S.projects = d.projects; S.tasks = d.tasks; }
  else {
    const merge = (cur, inc, stamp) => { const m = new Map(cur.map(x => [x.id, x])); inc.forEach(x => { const c = m.get(x.id); if (!c || stamp(x) > stamp(c)) m.set(x.id, x); }); return [...m.values()]; };
    S.members = merge(S.members, d.members, x => x.removedAt || 0);
    S.projects = merge(S.projects, d.projects, x => x.lastUsed || 0);
    S.tasks = merge(S.tasks, d.tasks, x => x.updated || x.created || 0);
  }
  if (!S.members.some(m => m.id === 'me' && !m.removedAt)) { const me = S.members.find(m => m.id === 'me'); if (me) delete me.removedAt; else S.members.unshift({ id: 'me', name: '나' }); }
  if (storageIssue === 'missing') storageIssue = null;
  undoStack.length = 0; save();
  backupMsg = { text: `가져왔어요. 할 일 ${liveTasks().length}개, 프로젝트 ${liveProjects().length}개` };
  render(); HK.announce(backupMsg.text);
}

/* ---------- S05 빠른 추가 ---------- */
function qaRowsHtml() { return fieldCells({ due: qa.due, projectId: qa.projectId, assigneeId: qa.assigneeId, done: false }, 'qa', qa.picking); }
function qaBodyHtml() {
  return `<div class="hh-qa"><div class="hk-field" data-hk="field"><label class="hk-field__label" for="qa-title">제목</label><div class="hk-field__control"><input class="hk-field__input" id="qa-title" type="text" autocomplete="off" enterkeyhint="done" placeholder="할 일을 적어 주세요" value="${esc(qa.title)}"></div><div class="hk-field__foot"><p class="hk-field__hint" id="qa-hint"></p></div></div><div class="hh-cells" id="qa-rows">${qaRowsHtml()}</div></div>`;
}
function qaSync() {
  const ok = qa.title.trim().length > 0;
  ['#qa-add-c', '#qa-add-r'].forEach(s => { const b = $(s); if (b) b.disabled = !ok; });
  const h = $('#qa-hint'); if (h) h.textContent = ok || !qa.touched ? '' : '제목을 적어 주세요';
}
function qaRerenderRows() { const r = $('#qa-rows'); if (r) withFocus(() => { r.innerHTML = qaRowsHtml(); }); }
function openQA(opener, preset = {}) {
  if ($('dialog[open]') || $(':popover-open')) return;
  const draft = S.draft?.title || '';
  qa = { title: preset.title ?? draft, touched: false, due: route.sec === 'today' ? today() : null, projectId: route.pid && proj(route.pid) ? route.pid : null, assigneeId: 'me', picking: false };
  if (qa.projectId) qa.assigneeId = membersFor(qa.projectId).some(m => m.id === 'me') ? 'me' : null;
  const compact = HK.compact(), el = compact ? $('#qa-sheet') : $('#qa-pop');
  $('.qa-body', el).innerHTML = qaBodyHtml();
  qaSync();
  el.__opener = opener; qaFk = (opener.closest('[data-fk]') || { dataset: {} }).dataset.fk || lastFk; sheetOf = 'qa';
  if (compact) el.showModal(); else el.showPopover();
  setTimeout(() => { const i = $('#qa-title'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 60);
}
function qaSave(keepOpen) {
  if (!qa || !qa.title.trim()) return;
  const t = addTask({ title: qa.title.trim(), due: qa.due, projectId: qa.projectId, assigneeId: qa.assigneeId });
  S.draft = { title: '' }; save();
  if (keepOpen) { qa.title = ''; const i = $('#qa-title'); i.value = ''; qaSync(); i.focus(); }
  else { const c = $('#qa-sheet'), r = $('#qa-pop'); if (c.open) c.close('add'); if (r.matches(':popover-open')) r.hidePopover(); }
  refreshAll();
  const row = $(`#pane-list [data-tid="${t.id}"]`); if (row) row.scrollIntoView({ block: 'nearest', behavior: HK.reduceMotion() ? 'auto' : 'smooth' });
}

/* ---------- S06 프로젝트 ---------- */
function pjBodyHtml() {
  const ms = liveMembers();
  return `<div class="hk-field" data-hk="field"><label class="hk-field__label" for="pj-name">이름</label><div class="hk-field__control"><input class="hk-field__input" id="pj-name" type="text" autocomplete="off" placeholder="프로젝트 이름" enterkeyhint="done" value="${esc(pj.name)}"></div><div class="hk-field__foot"><p class="hk-field__hint" id="pj-hint"></p></div></div>
  <div class="hk-list" style="margin:var(--s-4) 0 0" data-decision="D08"><h3 class="hk-list__header" id="pj-mh" style="padding-inline:0">구성원</h3><ul class="hk-list__group hh-members" role="group" aria-labelledby="pj-mh">${ms.map(m => `<li class="hk-row"><button type="button" role="checkbox" aria-checked="${pj.members.has(m.id)}" class="hk-row__main" data-act="pj-member" data-id="${m.id}"><span class="hk-row__title">${esc(m.name)}</span><span class="hk-row__check" aria-hidden="true"></span></button></li>`).join('')}</ul></div>
  <a class="hk-btn hk-btn--plain hh-sheetlink" href="#/settings" data-act="manage-members">구성원 관리</a>
  ${pj.id ? `<div class="hh-cells hh-pjdelete hh-danger"><button type="button" class="hk-btn hk-btn--plain hk-btn--destructive" data-act="pj-delete">프로젝트 삭제</button></div>` : ''}`;
}
function pjSync() {
  const ok = pj.name.trim().length > 0;
  $('#pj-save').disabled = !ok;
  const same = ok && liveProjects().some(p => p.id !== pj.id && p.name === pj.name.trim());
  $('#pj-hint').textContent = !ok ? (pj.touched ? '이름을 적어 주세요' : '') : same ? '같은 이름의 프로젝트가 이미 있어요' : '';
}
function openPJ(opener, id) {
  if ($('dialog[open]')) return;
  const p = id ? proj(id) : null;
  pj = { id: p ? p.id : null, touched: false, name: p ? p.name : '', members: new Set(p ? p.memberIds : ['me']) };
  pjFk = (opener.closest('[data-fk]') || { dataset: {} }).dataset.fk || lastFk; sheetOf = 'pj';
  $('#pj-sheet-t').textContent = p ? '프로젝트 편집' : '새 프로젝트';
  $('#pj-save').textContent = p ? '저장' : '만들기';
  $('#pj-body').innerHTML = pjBodyHtml(); pjSync();
  const dlg = $('#pj-sheet'); dlg.__opener = opener;
  $('#as-discard-t').textContent = '변경한 내용이 있어요';
  $('#as-discard-yes').textContent = '변경 취소'; $('#as-discard-no').textContent = '계속 편집';
  dlg.showModal();
  setTimeout(() => { const i = $('#pj-name'); if (i) i.focus(); }, 60);
}
function pjSave() {
  if (!pj.name.trim()) return;
  const mem = [...pj.members];
  let id = pj.id;
  if (id) { const p = proj(id); p.name = pj.name.trim(); p.memberIds = mem; p.lastUsed = Date.now(); }
  else { id = uid('p'); S.projects.push({ id, name: pj.name.trim(), memberIds: mem, lastUsed: Date.now() }); }
  save(); $('#pj-sheet').close('save');
  if (!pj.id) go('#/projects/' + id); else refreshAll();
  HK.announce(`‘${pj.name.trim()}’ 프로젝트를 저장했어요`);
}

/* ---------- actions ---------- */
function setFocusTo(sel) { setTimeout(() => { const e = $(sel); if (e) e.focus(); }, 0); }
function applyField(ctx, act, val) {
  const target = ctx === 'qa' ? qa : task(route.tid);
  if (!target) return;
  const ds = ctx === 'qa' ? { due: v => target.due = v } : null;
  if (act === 'set-due') {
    if (val === 'pick') {
      const i = $(`#${ctx}-date`);
      try { i.showPicker(); } catch (e) { if (ctx === 'qa') { qa.picking = true; qaRerenderRows(); } else { detailPicking = true; renderDetail(); } const j = $(`#${ctx}-date`); if (j) j.focus(); }
      return;
    }
    target.due = { today: today(), tomorrow: addDays(today(), 1), nextweek: nextMonday(), none: null }[val];
    if (ctx === 'qa') qa.picking = false; else detailPicking = false;
  } else if (act === 'set-project') {
    target.projectId = val || null;
    if (target.assigneeId && !membersFor(target.projectId).some(m => m.id === target.assigneeId)) target.assigneeId = null;
  } else if (act === 'set-assignee') target.assigneeId = val || null;
  if (ctx === 'qa') { qaRerenderRows(); return; }
  touch(target); save(); detailPicking = ctx === 'd' ? false : detailPicking;
  refreshAll();
}
function onClick(e) {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act, id = el.dataset.id, val = el.dataset.val;
  const trig = el.closest('.hk-menu') && $(':scope > [aria-haspopup]', el.closest('.hk-menu'));
  lastFk = ((trig || el).closest('[data-fk]') || { dataset: {} }).dataset.fk || null;
  switch (act) {
    case 'toggle': toggleTask(id); break;
    case 'load-sample': loadSample(); break;
    case 'add': openQA(el, el.dataset.title ? { title: el.dataset.title } : {}); break;
    case 'qa-cancel': $('#qa-pop').hidePopover(); break;
    case 'open-task': kbOpen = e.detail === 0; go(withTask(id)); break;
    case 'open-project': go('#/projects/' + id); break;
    case 'delete-task': deleteTask(id); break;
    case 'delete-project': deleteProject(id); break;
    case 'edit-project': openPJ(el, id); break;
    case 'new-project': openPJ(el, null); break;
    case 'pj-member': { const on = el.getAttribute('aria-checked') !== 'true'; el.setAttribute('aria-checked', String(on)); on ? pj.members.add(id) : pj.members.delete(id); break; }
    case 'pj-delete': { const pid = pj.id; $('#pj-sheet').close('cancel'); deleteProject(pid); break; }
    case 'manage-members': $('#pj-sheet').close('cancel'); break;
    case 'set-due': case 'set-project': case 'set-assignee': applyField(el.dataset.ctx, act, val); break;
    case 'set-filter': { const p = route.pid; if (val === 'all') delete S.ui.filter[p]; else S.ui.filter[p] = val; save(); refresh(); setFocusTo('[data-fk="filter-menu-btn"]'); break; }
    case 'restore': restoreItem(el.dataset.kind, id); break;
    case 'forever': foreverItem(el.dataset.kind, id); break;
    case 'empty-trash': emptyTrash(); break;
    case 'close-detail': go(base()); break;
    case 'sidebar': if (matchMedia('(min-width: 960px)').matches && matchMedia('(pointer: fine)').matches) S.ui.sidebarHidden = !S.ui.sidebarHidden; else overlayOpen = !overlayOpen; save(); renderNav(); if (overlayOpen) setTimeout(() => $('#sidebar [aria-current="page"]')?.focus(), 0); break;
    case 'sidebar-close': overlayOpen = false; renderNav(); break;
    case 'rename': startRename(id); break;
    case 'remove-member': removeMember(id); break;
    case 'add-member': addMember(); break;
    case 'export': doExport(); break;
    case 'import': backupMsg = null; showBackupMsg(); $('#import-file').value = ''; $('#import-file').click(); break;
    case 'delete-all': deleteAll(); break;
    case 'banner-export': doExport(); break;
    case 'banner-settings': go('#/settings'); break;
    case 'recent': query = val; go('#/search'); break;
    case 'clear-recents': S.ui.recents = []; save(); $('#search-results').innerHTML = searchResults(); break;
    case 'remember-search': rememberSearch(); break;
  }
}
function rememberSearch() { const q = query.trim(); if (!q) return; S.ui.recents = [q, ...S.ui.recents.filter(r => r !== q)].slice(0, 8); save(); }
function validName(v, selfId) {
  const n = v.trim();
  if (!n) return '이름을 적어 주세요';
  if (liveMembers().some(m => m.id !== selfId && m.name === n)) return '같은 이름이 이미 있어요';
  return '';
}
function setMemberMsg(t) { memberMsg = t; const m = $('#member-msg'); if (m) m.textContent = t; }
function addMember() {
  const i = $('#new-member'); if (!i) return;
  const err = validName(i.value); if (err) { setMemberMsg(err); i.setAttribute('aria-invalid', 'true'); return; }
  S.members.push({ id: uid('m'), name: i.value.trim() }); save(); memberMsg = ''; HK.announce(`‘${i.value.trim()}’ 구성원을 추가했어요`);
  renderNav(); renderList(); setFocusTo('#new-member');
}
function startRename(id) {
  renaming = id; withFocus(() => renderList());
  setTimeout(() => { const i = $('#ren-input'); if (i) { i.focus(); i.select(); } }, 0);
}
function finishRename(input, commit) {
  const id = input.dataset.mid, m = member(id);
  if (commit) { const err = validName(input.value, id); if (err) { input.setAttribute('aria-invalid', 'true'); setMemberMsg(err); return false; } m.name = input.value.trim(); save(); }
  renaming = null; memberMsg = ''; renderList(); setFocusTo(`[data-fk="mname:${id}"]`); return true;
}

/* ---------- boot ---------- */
S = load();
HK_boot();
function HK_boot() {
  // density follows input, not width alone (visual-system-note: Type)
  const mq = matchMedia('(min-width: 744px) and (pointer: fine)');
  const dens = () => document.documentElement.classList.toggle('hk-mac', mq.matches);
  dens(); mq.addEventListener('change', () => { dens(); renderNav(); });
  ['(min-width: 744px)', '(min-width: 960px)', '(max-width: 743px)'].forEach(q => matchMedia(q).addEventListener('change', () => { overlayOpen = false; render(); }));
  document.addEventListener('click', onClick);
  $('#import-file').addEventListener('change', e => onImportFile(e.target.files[0]));
  window.addEventListener('hashchange', render);
  window.addEventListener('beforeunload', () => { flushFields(); });

  // fields saved as the person goes (S04), no Save button
  const flushFields = () => {
    const t = route.tid && task(route.tid);
    const ti = $('#d-title'), no = $('#d-note');
    if (t && ti && ti.value.trim() && ti.value !== t.title) { t.title = ti.value.trim(); touch(t); }
    if (t && no && no.value !== t.note) { t.note = no.value; touch(t); }
    if (t) save();
  };
  document.addEventListener('change', e => {
    const t = route.tid && task(route.tid), el = e.target;
    if (el.id === 'd-title' && t) {
      const v = el.value.trim();
      if (!v) { el.value = t.title; titleError = true; renderDetail(); const x = $('#d-title'); return; }
      titleError = false; if (v !== t.title) { t.title = v; touch(t); save(); refresh(); }
    } else if (el.id === 'd-note' && t) { t.note = el.value; touch(t); save(); }
    else if (el.type === 'date' && el.dataset.ctx) {
      if (!el.value) return;
      if (el.dataset.ctx === 'qa') { qa.due = el.value; qa.picking = false; qaRerenderRows(); }
      else if (t) { t.due = el.value; touch(t); save(); detailPicking = false; refreshAll(); }
      focusSoon(fk(el.dataset.ctx + '-due-btn'));
    }
  });
  document.addEventListener('input', e => {
    const el = e.target;
    if (el.id === 'd-title') { fitTitles(el.parentNode); if (titleError) { titleError = false; el.removeAttribute('aria-invalid'); $('#d-title-err')?.remove(); } }
    else if (el.id === 'qa-title') { qa.touched = true; qa.title = el.value; S.draft = { title: el.value }; save(); qaSync(); }
    else if (el.id === 'pj-name') { pj.touched = true; pj.name = el.value; pjSync(); }
    else if (el.id === 'q') { query = el.value; $('#search-results').innerHTML = searchResults(); }
    else if (el.id === 'new-member') { const err = el.value ? validName(el.value) : ''; el.toggleAttribute('aria-invalid', !!err); if (!err) el.removeAttribute('aria-invalid'); setMemberMsg(err); $('[data-act="add-member"]').disabled = !el.value.trim() || !!err; }
    else if (el.id === 'ren-input') { el.removeAttribute('aria-invalid'); setMemberMsg(''); }
  });
  document.addEventListener('keydown', e => {
    const el = e.target;
    if (el.id === 'd-title' && e.key === 'Enter') { e.preventDefault(); $('#d-due-btn')?.focus(); $('#d-due button')?.focus(); el.dispatchEvent(new Event('change', { bubbles: true })); }
    else if (el.id === 'new-member' && e.key === 'Enter') { e.preventDefault(); addMember(); }
    else if (el.id === 'ren-input') { if (e.key === 'Enter') { e.preventDefault(); finishRename(el, true); } else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finishRename(el, false); } }
    else if (el.id === 'qa-title' && e.key === 'Enter' && e.shiftKey && !HK.compact()) { e.preventDefault(); qaSave(true); }
    else if (el.id === 'q' && e.key === 'Enter') rememberSearch();
    else if (e.key === 'Escape' && overlayOpen) { overlayOpen = false; renderNav(); $('[data-act="sidebar"]:not([hidden])')?.focus(); }
    else if (e.key === 'Delete' && !HK.compact() && el.closest && el.closest('.hh-row[data-tid]') && !/INPUT|TEXTAREA/.test(el.tagName)) deleteTask(el.closest('.hh-row').dataset.tid);
    else if ((e.key === 'n' || e.key === 'N') && !e.metaKey && !e.ctrlKey && !e.altKey && !HK.compact() && !/INPUT|TEXTAREA|SELECT/.test(el.tagName) && ['today', 'projects', 'search'].includes(route.sec) && !(route.sec === 'projects' && !route.pid && false)) { const b = $('[data-act="add"]'); if (b) { e.preventDefault(); openQA(b); } }
  });
  // Ctrl or Cmd+Z while the undo toast shows is the kit's (HK.toast shortcut: true)
  document.addEventListener('hk-toast-dismiss', () => { delete $('#main').dataset.toast; });
  document.addEventListener('click', e => { const a = e.target.closest('a.hh-row__main'); if (a && e.detail === 0) kbOpen = true; }, true);
  document.addEventListener('contextmenu', e => { const r = e.target.closest('.hh-row'); if (r && !HK.compact()) { const b = $('.hh-more .hk-bar-btn', r); if (b) { e.preventDefault(); b.click(); } } });
  document.addEventListener('toggle', e => { const d = e.target; if (d.matches && d.matches('details.hh-done')) { const k = d.dataset.key; S.ui.doneOpen[k] = d.open; save(); } }, true);
  document.addEventListener('submit', e => {
    const f = e.target;
    if (f.id === 'qa-form-c' || f.id === 'qa-form-r') { e.preventDefault(); qaSave(false); }
    else if (f.id === 'pj-form') { e.preventDefault(); pjSave(); }
    else if (f.id === 'first-form') { e.preventDefault(); const i = $('#first-title'); if (i.value.trim()) { const t = addTask({ title: i.value.trim(), due: today() }); refreshAll(); focusSoon(fk('row:' + t.id), fk('add'), HEAD); } }
  });
  // S05 and S06: Cancel and Escape close and keep the draft; only a swipe-down with content asks (D06): data-discard-ask="swipe" on both sheets
  $('#as-discard').addEventListener('close', e => { if (e.target.returnValue === 'discard' && sheetOf === 'qa') { S.draft = { title: '' }; save(); } });
  $('#qa-sheet').addEventListener('close', () => settle(qaFk));
  $('#pj-sheet').addEventListener('close', () => settle(pjFk));
  $('#qa-pop').addEventListener('toggle', e => { if (e.newState === 'closed') settle(qaFk); });
  if (!location.hash) location.hash = (S.ui.route && S.ui.route.startsWith('#/')) ? S.ui.route : '#/today';
  render();
  window.__haru = { simulate: k => { storageIssue = k || null; renderBanners(); }, state: () => S, reset: () => { localStorage.clear(); location.hash = ''; location.reload(); } };
}
})();




