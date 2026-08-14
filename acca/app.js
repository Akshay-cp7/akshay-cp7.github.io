/* ACCA FR Objective Test Quiz — local, self-contained, no server needed. */

const STORAGE_KEY = 'fr_quiz_progress_v1';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}
let progress = loadProgress(); // { [id]: { correct: bool, attempts: int } }

const ALL_QUESTIONS = (typeof QUESTIONS !== 'undefined') ? QUESTIONS : [];
const TOPICS = [...new Set(ALL_QUESTIONS.map(q => q.topic || 'General'))];

// ---------------- Screen management ----------------
const screens = {
  home: document.getElementById('screen-home'),
  quiz: document.getElementById('screen-quiz'),
  summary: document.getElementById('screen-summary'),
};
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.add('hidden'));
  screens[name].classList.remove('hidden');
  window.scrollTo(0, 0);
}

// ---------------- Home screen ----------------
const topicSelect = document.getElementById('topicSelect');
const countSelect = document.getElementById('countSelect');
const shuffleCheck = document.getElementById('shuffleCheck');
const onlyUnansweredCheck = document.getElementById('onlyUnansweredCheck');

function populateTopics() {
  topicSelect.innerHTML = '';
  const optAll = document.createElement('option');
  optAll.value = '__all__';
  optAll.textContent = `All topics (${ALL_QUESTIONS.length} questions)`;
  topicSelect.appendChild(optAll);
  TOPICS.forEach(t => {
    const count = ALL_QUESTIONS.filter(q => (q.topic || 'General') === t).length;
    const o = document.createElement('option');
    o.value = t;
    o.textContent = `${t} (${count})`;
    topicSelect.appendChild(o);
  });
}

function renderHomeStats() {
  const total = ALL_QUESTIONS.length;
  const answeredIds = Object.keys(progress);
  const answered = answeredIds.length;
  const correct = answeredIds.filter(id => progress[id].correct).length;
  const accuracy = answered ? Math.round((correct / answered) * 100) : 0;

  document.getElementById('homeStats').innerHTML = `
    <div class="stat"><span class="num">${total}</span><span class="lbl">Questions</span></div>
    <div class="stat"><span class="num">${answered}</span><span class="lbl">Attempted</span></div>
    <div class="stat"><span class="num">${correct}</span><span class="lbl">Correct</span></div>
    <div class="stat"><span class="num">${accuracy}%</span><span class="lbl">Accuracy</span></div>
  `;

  const bars = document.getElementById('topicBars');
  bars.innerHTML = '';
  TOPICS.forEach(t => {
    const qs = ALL_QUESTIONS.filter(q => (q.topic || 'General') === t);
    const done = qs.filter(q => progress[q.id]).length;
    const correctCount = qs.filter(q => progress[q.id] && progress[q.id].correct).length;
    const pct = qs.length ? Math.round((correctCount / qs.length) * 100) : 0;
    const row = document.createElement('div');
    row.className = 'topic-bar-row';
    row.innerHTML = `
      <div class="tbr-top"><span>${t}</span><span>${correctCount}/${qs.length} correct (${done} attempted)</span></div>
      <div class="topic-bar-track"><div class="topic-bar-fill" style="width:${pct}%"></div></div>
    `;
    bars.appendChild(row);
  });
}

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------------- Quiz state ----------------
let session = { queue: [], index: 0, correctCount: 0, answeredCount: 0 };

function buildQueue({ topic, count, shuffle, onlyUnanswered, missedOnly }) {
  let pool = ALL_QUESTIONS.slice();
  if (missedOnly) {
    pool = pool.filter(q => progress[q.id] && progress[q.id].correct === false);
  } else {
    if (topic && topic !== '__all__') pool = pool.filter(q => (q.topic || 'General') === topic);
    if (onlyUnanswered) pool = pool.filter(q => !(progress[q.id] && progress[q.id].correct));
  }
  if (shuffle) pool = shuffleArray(pool);
  if (count && count < pool.length) pool = pool.slice(0, count);
  return pool;
}

function startSession(queue) {
  if (!queue.length) {
    alert('No questions match those filters.');
    return;
  }
  session = { queue, index: 0, correctCount: 0, answeredCount: 0 };
  showScreen('quiz');
  renderQuestion();
}

document.getElementById('startBtn').addEventListener('click', () => {
  const topic = topicSelect.value;
  const count = parseInt(countSelect.value, 10);
  const shuffle = shuffleCheck.checked;
  const onlyUnanswered = onlyUnansweredCheck.checked;
  startSession(buildQueue({ topic, count, shuffle, onlyUnanswered }));
});

document.getElementById('reviewMissedBtn').addEventListener('click', () => {
  startSession(buildQueue({ shuffle: true, missedOnly: true, count: 9999 }));
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Reset all quiz progress? This cannot be undone.')) {
    progress = {};
    saveProgress(progress);
    renderHomeStats();
  }
});

document.getElementById('quitBtn').addEventListener('click', () => {
  showScreen('home');
  renderHomeStats();
});

document.getElementById('backHomeBtn').addEventListener('click', () => {
  showScreen('home');
  renderHomeStats();
});

// ---------------- Rendering a question ----------------
const qTopic = document.getElementById('qTopic');
const qType = document.getElementById('qType');
const qMarks = document.getElementById('qMarks');
const qScenario = document.getElementById('qScenario');
const qText = document.getElementById('qText');
const qOptions = document.getElementById('qOptions');
const qFeedback = document.getElementById('qFeedback');
const checkBtn = document.getElementById('checkBtn');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');
const quizScore = document.getElementById('quizScore');

const TYPE_LABELS = { single: 'Single choice', multi: 'Multiple choice', numeric: 'Numeric entry', match: 'Match / classify' };

function renderQuestion() {
  const q = session.queue[session.index];
  qFeedback.classList.add('hidden');
  qFeedback.className = 'q-feedback hidden';
  checkBtn.classList.remove('hidden');
  checkBtn.disabled = false;
  nextBtn.classList.add('hidden');

  qTopic.textContent = q.topic || 'General';
  qType.textContent = TYPE_LABELS[q.type] || q.type;
  qMarks.textContent = q.marks ? `${q.marks} mark${q.marks > 1 ? 's' : ''}` : '';
  qMarks.style.visibility = q.marks ? 'visible' : 'hidden';

  if (q.scenario) {
    qScenario.classList.remove('hidden');
    qScenario.innerHTML = `<span class="scenario-label">Scenario</span>${escapeHtml(q.scenario)}`;
  } else {
    qScenario.classList.add('hidden');
  }

  let questionText = q.question || '';
  if (q.type === 'multi' && Array.isArray(q.answerIndexes)) {
    questionText += ` (select ${q.answerIndexes.length})`;
  }
  qText.textContent = questionText;

  qOptions.innerHTML = '';

  if (q.type === 'single') {
    (q.options || []).forEach((opt, i) => {
      const row = document.createElement('label');
      row.className = 'opt';
      row.innerHTML = `<input type="radio" name="opt" value="${i}"><span class="opt-text">${escapeHtml(opt)}</span>`;
      qOptions.appendChild(row);
    });
  } else if (q.type === 'multi') {
    (q.options || []).forEach((opt, i) => {
      const row = document.createElement('label');
      row.className = 'opt';
      row.innerHTML = `<input type="checkbox" name="opt" value="${i}"><span class="opt-text">${escapeHtml(opt)}</span>`;
      qOptions.appendChild(row);
    });
  } else if (q.type === 'numeric') {
    const wrap = document.createElement('div');
    wrap.className = 'q-numeric';
    wrap.innerHTML = `<input type="text" id="numericInput" placeholder="Type your answer (e.g. $3,250 or 43 days)">`;
    qOptions.appendChild(wrap);
  } else if (q.type === 'match') {
    const wrap = document.createElement('div');
    wrap.className = 'q-pairs';
    (q.pairs || []).forEach((pair, i) => {
      const row = document.createElement('div');
      row.className = 'pair-row';
      row.dataset.index = i;
      const opts = (pair.options || []).map((o, j) => `<option value="${j}">${escapeHtml(o)}</option>`).join('');
      row.innerHTML = `<div class="pair-label">${escapeHtml(pair.label)}</div>
        <select><option value="" disabled selected>Choose...</option>${opts}</select>`;
      wrap.appendChild(row);
    });
    qOptions.appendChild(wrap);
  }

  updateProgressBar();
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s == null ? '' : String(s);
  return d.innerHTML;
}

function updateProgressBar() {
  const total = session.queue.length;
  const pos = session.index + 1;
  progressFill.style.width = `${(session.index / total) * 100}%`;
  progressLabel.textContent = `Question ${pos} of ${total}`;
  quizScore.textContent = session.answeredCount
    ? `${session.correctCount}/${session.answeredCount} correct`
    : '';
}

function normalize(s) {
  return (s == null ? '' : String(s)).trim().toLowerCase().replace(/[$,£€\s]/g, '');
}

function isCorrectNumeric(input, answerText) {
  const a = normalize(input);
  const b = normalize(answerText);
  if (!a) return false;
  if (a === b) return true;
  const na = parseFloat(a.replace(/[^0-9.\-]/g, ''));
  const nb = parseFloat(b.replace(/[^0-9.\-]/g, ''));
  if (!isNaN(na) && !isNaN(nb)) {
    return Math.abs(na - nb) <= Math.max(0.01, Math.abs(nb) * 0.005);
  }
  return false;
}

function evaluateAnswer(q) {
  if (q.type === 'single') {
    const sel = qOptions.querySelector('input[name="opt"]:checked');
    if (!sel) return null;
    return { correct: parseInt(sel.value, 10) === q.answerIndex, chosen: parseInt(sel.value, 10) };
  }
  if (q.type === 'multi') {
    const sels = [...qOptions.querySelectorAll('input[name="opt"]:checked')].map(i => parseInt(i.value, 10));
    if (!sels.length) return null;
    const want = (q.answerIndexes || []).slice().sort();
    const got = sels.slice().sort();
    const correct = want.length === got.length && want.every((v, i) => v === got[i]);
    return { correct, chosen: got };
  }
  if (q.type === 'numeric') {
    const input = document.getElementById('numericInput');
    if (!input || !input.value.trim()) return null;
    return { correct: isCorrectNumeric(input.value, q.answerText), chosen: input.value };
  }
  if (q.type === 'match') {
    const rows = [...qOptions.querySelectorAll('.pair-row')];
    if (rows.some(r => r.querySelector('select').value === '')) return null;
    let allCorrect = true;
    const chosen = rows.map(r => {
      const idx = parseInt(r.querySelector('select').value, 10);
      const pair = q.pairs[parseInt(r.dataset.index, 10)];
      const ok = idx === pair.answerIndex;
      if (!ok) allCorrect = false;
      return { idx, ok };
    });
    return { correct: allCorrect, chosen };
  }
  return null;
}

function showAnswerStyling(q, result) {
  if (q.type === 'single') {
    [...qOptions.querySelectorAll('.opt')].forEach((row, i) => {
      const input = row.querySelector('input');
      input.disabled = true;
      row.classList.add('disabled');
      if (i === q.answerIndex) row.classList.add('correct');
      else if (i === result.chosen) row.classList.add('incorrect');
    });
  } else if (q.type === 'multi') {
    const want = new Set(q.answerIndexes || []);
    [...qOptions.querySelectorAll('.opt')].forEach((row, i) => {
      const input = row.querySelector('input');
      input.disabled = true;
      row.classList.add('disabled');
      if (want.has(i)) row.classList.add('correct');
      else if (input.checked) row.classList.add('incorrect');
    });
  } else if (q.type === 'numeric') {
    const input = document.getElementById('numericInput');
    input.disabled = true;
    input.classList.add(result.correct ? 'correct' : 'incorrect');
  } else if (q.type === 'match') {
    [...qOptions.querySelectorAll('.pair-row')].forEach((row, i) => {
      row.querySelector('select').disabled = true;
      row.classList.add(result.chosen[i].ok ? 'correct' : 'incorrect');
    });
  }
}

checkBtn.addEventListener('click', () => {
  const q = session.queue[session.index];
  const result = evaluateAnswer(q);
  if (!result) {
    alert('Please select/enter an answer first.');
    return;
  }

  showAnswerStyling(q, result);

  session.answeredCount++;
  if (result.correct) session.correctCount++;

  progress[q.id] = { correct: result.correct, attempts: (progress[q.id]?.attempts || 0) + 1 };
  saveProgress(progress);

  qFeedback.classList.remove('hidden');
  qFeedback.classList.add(result.correct ? 'ok' : 'bad');
  let correctAnswerText = '';
  if (q.type === 'numeric') correctAnswerText = q.answerText;
  else if (q.type === 'single') correctAnswerText = q.options[q.answerIndex];
  else if (q.type === 'multi') correctAnswerText = (q.answerIndexes || []).map(i => q.options[i]).join('; ');

  qFeedback.innerHTML = `
    <span class="fb-title">${result.correct ? '✓ Correct' : '✗ Not quite'}${correctAnswerText && !result.correct ? ` — correct answer: ${escapeHtml(correctAnswerText)}` : ''}</span>
    <span class="fb-explain">${escapeHtml(q.explanation || '')}</span>
  `;

  checkBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');
  updateProgressBar();
});

nextBtn.addEventListener('click', () => {
  session.index++;
  if (session.index >= session.queue.length) {
    finishSession();
  } else {
    renderQuestion();
  }
});

function finishSession() {
  showScreen('summary');
  const pct = session.answeredCount ? Math.round((session.correctCount / session.answeredCount) * 100) : 0;
  document.getElementById('summaryScore').textContent = `${session.correctCount} / ${session.answeredCount} (${pct}%)`;

  const byTopic = {};
  session.queue.forEach(q => {
    const t = q.topic || 'General';
    byTopic[t] = byTopic[t] || { correct: 0, total: 0 };
    byTopic[t].total++;
    if (progress[q.id] && progress[q.id].correct) byTopic[t].correct++;
  });
  const bd = document.getElementById('summaryBreakdown');
  bd.innerHTML = Object.entries(byTopic).map(([t, v]) =>
    `<div><span>${t}</span><span>${v.correct}/${v.total}</span></div>`
  ).join('');
}

// ---------------- Init ----------------
populateTopics();
renderHomeStats();
showScreen('home');
