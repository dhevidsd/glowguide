/* ================================================================
   GlowGuide - Application Logic
   Clean web app: quiz engine, recommendation engine, page router
   ================================================================ */

const state = {
  page: 'home',
  quizStep: 0,
  answers: {},
  results: [],
  selectedProduct: null
};

const app = () => document.getElementById('app');

/* ================================================================
   RECOMMENDATION ENGINE
   ================================================================ */
function recommend(answers) {
  const { skinType, concern, routine } = answers;
  const caps = { minimal: 3, moderate: 5, full: 7 };
  const maxProducts = caps[routine] || 5;

  // Filter: must match skin type AND concern
  let pool = PRODUCTS.filter(p =>
    p.skinTypes.includes(skinType) && p.concerns.includes(concern)
  );

  // Score each product
  pool = pool.map(p => {
    let score = 0;
    // Primary skin type match (first in array = best fit)
    score += p.skinTypes[0] === skinType ? 4 : 1;
    // Primary concern match
    score += p.concerns[0] === concern ? 4 : 1;
    // Rating bonus
    score += (p.rating - 4) * 3;
    // Review popularity (minor bonus)
    score += Math.min(p.reviews / 10000, 1);
    return { ...p, score };
  });

  // Sort by step order, then score descending
  pool.sort((a, b) => a.step - b.step || b.score - a.score);

  // Pick best per step (ensures variety across routine)
  const chosen = [];
  const usedSteps = new Set();

  for (const p of pool) {
    if (chosen.length >= maxProducts) break;
    if (!usedSteps.has(p.step)) {
      usedSteps.add(p.step);
      chosen.push(p);
    }
  }

  // Fill remaining slots with next-best products
  if (chosen.length < maxProducts) {
    for (const p of pool) {
      if (chosen.length >= maxProducts) break;
      if (!chosen.find(c => c.id === p.id)) {
        chosen.push(p);
      }
    }
  }

  // Sort final selection by step
  chosen.sort((a, b) => a.step - b.step);

  // Personalise reason text
  return chosen.map(p => ({
    ...p,
    reason: p.reason
      .replace(/{skinType}/g, SKIN_TYPE_LABELS[skinType].toLowerCase())
      .replace(/{concern}/g, CONCERN_LABELS[concern].toLowerCase())
  }));
}

/* ================================================================
   NAVIGATION
   ================================================================ */
function navigate(page) {
  state.page = page;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNavHighlight() {
  const homeBtn = document.getElementById('navHome');
  const quizBtn = document.getElementById('navQuiz');
  if (homeBtn) homeBtn.classList.toggle('active', state.page === 'home');
  if (quizBtn) quizBtn.classList.toggle('active', state.page !== 'home');
}

/* ================================================================
   RENDER
   ================================================================ */
function render() {
  const el = app();
  switch (state.page) {
    case 'home':    renderHome(el); break;
    case 'quiz':    renderQuiz(el); break;
    case 'results': renderResults(el); break;
    case 'detail':  renderDetail(el); break;
  }
  updateNavHighlight();
}

/* ================================================================
   HOME PAGE
   ================================================================ */
function renderHome(el) {
  el.innerHTML = `
    <section class="home-hero">
      <h1>Find Your Perfect Skincare Routine</h1>
      <p>Answer 3 simple questions about your skin and get a personalised, science-backed product routine in under 60 seconds.</p>
      <button class="cta-btn" id="heroStart">\u{1F9EA} Start the Skin Quiz</button>
    </section>

    <section class="home-features">
      <div class="feature-box">
        <div class="icon">\u{1F9EC}</div>
        <h3>Skin Type Matching</h3>
        <p>Products filtered to work with your specific skin chemistry - oily, dry, combination, normal or sensitive.</p>
      </div>
      <div class="feature-box">
        <div class="icon">\u{1F3AF}</div>
        <h3>Concern-Targeted</h3>
        <p>Addresses your #1 concern whether that is acne, dark spots, ageing, dehydration or dullness.</p>
      </div>
      <div class="feature-box">
        <div class="icon">\u{1F4CA}</div>
        <h3>35+ Product Database</h3>
        <p>Real products from trusted brands, scored by compatibility. Updated with latest formulations.</p>
      </div>
    </section>

    <section class="home-how">
      <h2>How It Works</h2>
      <div class="how-steps">
        <div class="how-step">
          <div class="num">1</div>
          <h4>Tell Us About Your Skin</h4>
          <p>Your type, your top concern, and how much time you have.</p>
        </div>
        <div class="how-step">
          <div class="num">2</div>
          <h4>Get Matched Products</h4>
          <p>Our algorithm scores 35+ products and picks the best fit.</p>
        </div>
        <div class="how-step">
          <div class="num">3</div>
          <h4>Follow Your Routine</h4>
          <p>Products listed in order with timing, ingredients and tips.</p>
        </div>
      </div>
    </section>
  `;

  document.getElementById('heroStart').addEventListener('click', startQuiz);
}

/* ================================================================
   QUIZ PAGE
   ================================================================ */
function startQuiz() {
  state.quizStep = 0;
  state.answers = {};
  navigate('quiz');
}

function renderQuiz(el) {
  const step = QUIZ_CONFIG.steps[state.quizStep];
  const total = QUIZ_CONFIG.steps.length;
  const pct = Math.round((state.quizStep / total) * 100);
  const selected = state.answers[step.id] || null;

  el.innerHTML = `
    <div class="quiz-page">
      <div class="quiz-breadcrumb">
        <a href="#" id="quizBcHome">Home</a>
        <span>/</span>
        <span>Quiz - Step ${state.quizStep + 1} of ${total}</span>
      </div>

      <div class="quiz-progress">
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="quiz-progress-text">Step ${state.quizStep + 1} of ${total} &middot; ${pct}% complete</div>
      </div>

      <div class="quiz-question">
        <h2>${step.question}</h2>
        <p>${step.subtitle}</p>
      </div>

      <div class="quiz-options">
        ${step.options.map(opt => `
          <div class="quiz-option ${selected === opt.id ? 'selected' : ''}" data-id="${opt.id}">
            <div class="opt-icon">${opt.icon}</div>
            <div class="opt-text">
              <h4>${opt.label}</h4>
              <p>${opt.desc}</p>
            </div>
            <div class="opt-radio"></div>
          </div>
        `).join('')}
      </div>

      <div class="quiz-footer">
        <a href="#" class="quiz-back" id="quizBackBtn">${state.quizStep > 0 ? '\u2190 Previous' : '\u2190 Home'}</a>
        <button class="quiz-next" id="quizNextBtn" ${!selected ? 'disabled' : ''}>
          ${state.quizStep < total - 1 ? 'Next \u2192' : 'Get My Routine \u2728'}
        </button>
      </div>
    </div>
  `;

  // Breadcrumb home
  document.getElementById('quizBcHome').addEventListener('click', e => { e.preventDefault(); navigate('home'); });

  // Back button
  document.getElementById('quizBackBtn').addEventListener('click', e => {
    e.preventDefault();
    if (state.quizStep > 0) { state.quizStep--; render(); }
    else navigate('home');
  });

  // Option selection
  el.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => {
      state.answers[step.id] = opt.dataset.id;
      render();
    });
  });

  // Next button
  document.getElementById('quizNextBtn').addEventListener('click', () => {
    if (!selected) return;
    if (state.quizStep < total - 1) {
      state.quizStep++;
      render();
    } else {
      // Generate results
      state.results = recommend(state.answers);
      navigate('results');
    }
  });
}

/* ================================================================
   RESULTS PAGE
   ================================================================ */
function renderResults(el) {
  const { skinType, concern, routine } = state.answers;
  const products = state.results;
  const showSchedule = routine === 'full';

  el.innerHTML = `
    <div class="results-page">
      <div class="results-header">
        <h1>\u2728 Your Personalised Routine</h1>
        <p>${products.length} products selected from our database of 35+ based on your profile.</p>
        <div class="results-tags">
          <span class="results-tag">${SKIN_TYPE_LABELS[skinType]} Skin</span>
          <span class="results-tag">${CONCERN_LABELS[concern]}</span>
          <span class="results-tag">${ROUTINE_LABELS[routine]}</span>
        </div>
      </div>

      ${showSchedule ? `
      <div class="results-schedule">
        <h2>Your AM / PM Schedule</h2>
        <table class="schedule-grid">
          <thead><tr><th>#</th><th>Step</th><th>Product</th><th>When</th></tr></thead>
          <tbody>
            ${products.map((p, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${p.stepLabel}</td>
                <td>${p.name}</td>
                <td>${p.timing}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      <div class="results-products">
        <h2>Recommended Products</h2>
        <div class="products-list">
          ${products.map(p => `
            <div class="prod-card" data-id="${p.id}">
              <div class="prod-icon ${p.color}">${p.emoji}</div>
              <div class="prod-body">
                <span class="prod-step">${p.stepLabel}</span>
                <h3>${p.name}</h3>
                <div class="meta">${p.brand} \u00B7 ${p.price}</div>
                <div class="timing">${p.timing}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="results-actions">
        <a href="#" class="btn-outline" id="retakeBtn">\u21BB Retake Quiz</a>
        <a href="#" class="btn-outline" id="homeBtn">\u2190 Back to Home</a>
      </div>
    </div>
  `;

  // Product click -> detail
  el.querySelectorAll('.prod-card').forEach(card => {
    card.addEventListener('click', () => {
      state.selectedProduct = card.dataset.id;
      navigate('detail');
    });
  });

  document.getElementById('retakeBtn').addEventListener('click', e => { e.preventDefault(); startQuiz(); });
  document.getElementById('homeBtn').addEventListener('click', e => { e.preventDefault(); navigate('home'); });
}

/* ================================================================
   PRODUCT DETAIL PAGE
   ================================================================ */
function renderDetail(el) {
  const p = state.results.find(x => x.id === state.selectedProduct)
         || PRODUCTS.find(x => x.id === state.selectedProduct);
  if (!p) { navigate('results'); return; }

  const fullStars = Math.floor(p.rating);
  const halfStar = p.rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const starsHtml = '\u2605'.repeat(fullStars) + (halfStar ? '\u00BD' : '') + '\u2606'.repeat(emptyStars);

  el.innerHTML = `
    <div class="detail-page">
      <a href="#" class="detail-back" id="detailBack">\u2190 Back to results</a>

      <div class="detail-top">
        <div class="detail-img ${p.color}">${p.emoji}</div>
        <div class="detail-info">
          <h1>${p.name}</h1>
          <p class="sub">${p.brand} \u00B7 ${p.size} \u00B7 ${p.price}</p>
          <div class="badges">
            ${p.tags.map(t => `<span class="badge badge-green">${t}</span>`).join('')}
            <span class="badge badge-orange">${p.timing}</span>
          </div>
          <div class="rating">
            <span class="stars">${starsHtml}</span>
            <span class="rating-val">${p.rating}</span>
            <span class="rating-cnt">(${p.reviews.toLocaleString()} reviews)</span>
          </div>
        </div>
      </div>

      <div class="detail-sections">
        <div class="detail-section">
          <h3>Why This Product?</h3>
          <p>${p.reason}</p>
        </div>
        <div class="detail-section">
          <h3>Key Ingredients</h3>
          <div class="ing-list">
            ${p.ingredients.map(i => `<span class="ing-chip">${i}</span>`).join('')}
          </div>
        </div>
        <div class="detail-section">
          <h3>How to Use</h3>
          <p>${p.howToUse}</p>
        </div>
      </div>

      <div class="detail-cta">
        <button id="detailBackBtn">\u2190 Back to My Routine</button>
      </div>
    </div>
  `;

  document.getElementById('detailBack').addEventListener('click', e => { e.preventDefault(); navigate('results'); });
  document.getElementById('detailBackBtn').addEventListener('click', () => navigate('results'));
}

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  render();

  // Nav buttons
  document.getElementById('logoLink').addEventListener('click', e => { e.preventDefault(); navigate('home'); });
  document.getElementById('navHome').addEventListener('click', e => { e.preventDefault(); navigate('home'); });
  document.getElementById('navQuiz').addEventListener('click', e => { e.preventDefault(); startQuiz(); });
});
