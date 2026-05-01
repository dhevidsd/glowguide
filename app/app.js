/* ================================================================
   GlowGuide — Application Logic
   Quiz engine, Recommendation engine, Screen router
   (Web app layout — no phone frame)
   ================================================================ */

/* -- State ---------------------------------------------------- */
const state = {
  currentScreen: 'home',
  quizStep: 0,
  answers: {},
  recommendedProducts: [],
  selectedProduct: null,
  history: []
};

const screen = () => document.getElementById('screen');

/* ================================================================
   RECOMMENDATION ENGINE (FR-04)
   ================================================================ */
function recommend(answers) {
  const { skinType, concern, routine } = answers;

  // 1. Filter products matching skin type AND concern
  let pool = PRODUCTS.filter(p =>
    p.skinTypes.includes(skinType) && p.concerns.includes(concern)
  );

  // 2. Cap based on routine preference
  const stepCounts = { minimal: 3, moderate: 5, full: 7 };
  const maxProducts = stepCounts[routine] || 5;

  // 3. Score each product
  pool = pool.map(p => {
    let score = 0;
    if (p.skinTypes[0] === skinType) score += 3; else score += 1;
    if (p.concerns[0] === concern) score += 3; else score += 1;
    score += (p.rating - 4) * 2;
    return { ...p, score };
  });

  // 4. Sort by step then score
  pool.sort((a, b) => a.step - b.step || b.score - a.score);

  // 5. Pick best per step
  const chosen = [];
  const usedSteps = new Set();
  for (const p of pool) {
    if (chosen.length >= maxProducts) break;
    if (!usedSteps.has(p.step)) {
      usedSteps.add(p.step);
      chosen.push(p);
    }
  }

  // 6. Fill remaining slots if needed
  if (chosen.length < maxProducts) {
    for (const p of pool) {
      if (chosen.length >= maxProducts) break;
      if (!chosen.find(c => c.id === p.id)) chosen.push(p);
    }
  }

  // 7. Final sort by step
  chosen.sort((a, b) => a.step - b.step);

  // 8. Personalise reason text
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
function navigate(target, opts = {}) {
  if (!opts.isBack) {
    state.history.push({
      screen: state.currentScreen,
      quizStep: state.quizStep,
      product: state.selectedProduct
    });
  }
  state.currentScreen = target;
  render();
}

function goBack() {
  if (state.history.length === 0) { navigate('home', { isBack: true }); return; }
  const prev = state.history.pop();
  state.currentScreen = prev.screen;
  state.quizStep = prev.quizStep ?? state.quizStep;
  state.selectedProduct = prev.product ?? state.selectedProduct;
  render(true);
}

/* ── Nav link highlighting ── */
function updateNav() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active',
      link.dataset.screen === state.currentScreen ||
      (link.dataset.screen === 'quiz' && ['quiz', 'results', 'product'].includes(state.currentScreen))
    );
  });
}

/* ================================================================
   RENDER DISPATCHER
   ================================================================ */
function render(isBack = false) {
  const el = screen();
  el.classList.add('fade-out');
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    switch (state.currentScreen) {
      case 'home':    renderHome(el);    break;
      case 'quiz':    renderQuiz(el);    break;
      case 'results': renderResults(el); break;
      case 'product': renderProduct(el); break;
    }
    el.classList.remove('fade-out');
    el.classList.add('fade-in');
    updateNav();
  }, 150);
}

/* ================================================================
   HOME SCREEN
   ================================================================ */
function renderHome(el) {
  el.innerHTML = `
    <div class="hero-banner">
      <div class="hero-icon">\u2728</div>
      <h1>Your Personalised Skincare Routine</h1>
      <p>Answer 3 quick questions and get a science-backed routine tailored to your skin type, concerns, and lifestyle.</p>
    </div>

    <div class="stats-strip">
      <div class="stat-pill"><div class="num">3</div><div class="lbl">Questions</div></div>
      <div class="stat-pill"><div class="num">60s</div><div class="lbl">To Complete</div></div>
      <div class="stat-pill"><div class="num">15+</div><div class="lbl">Products in DB</div></div>
      <div class="stat-pill"><div class="num">5</div><div class="lbl">Skin Types</div></div>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="icon">\u{1F9EC}</div>
        <h3>Skin Type Analysis</h3>
        <p>Tell us about your skin and we match products that work with your natural chemistry.</p>
      </div>
      <div class="feature-card">
        <div class="icon">\u{1F3AF}</div>
        <h3>Concern Targeting</h3>
        <p>Whether it is acne, dark spots or ageing, we prioritise products that address your #1 concern.</p>
      </div>
      <div class="feature-card">
        <div class="icon">\u26A1</div>
        <h3>Flexible Routines</h3>
        <p>Choose minimal (3 steps), moderate (5 steps) or a full AM/PM ritual (7 steps) to fit your lifestyle.</p>
      </div>
    </div>

    <div class="cta-section">
      <button class="btn btn-primary btn-lg" id="startQuiz">\u{1F9EA} Start My Skin Quiz</button>
    </div>
  `;

  document.getElementById('startQuiz').addEventListener('click', () => {
    state.quizStep = 0;
    state.answers = {};
    navigate('quiz');
  });
}

/* ================================================================
   QUIZ SCREEN (FR-01, FR-02, FR-03, FR-08, FR-09)
   ================================================================ */
function renderQuiz(el) {
  const step = QUIZ_CONFIG.steps[state.quizStep];
  const total = QUIZ_CONFIG.steps.length;
  const pct = Math.round((state.quizStep / total) * 100);
  const selected = state.answers[step.id] || null;

  el.innerHTML = `
    <a href="#" class="back-link" id="quizBack">\u2190 ${state.quizStep > 0 ? 'Previous question' : 'Back to Home'}</a>

    <div class="progress-wrap">
      <div class="progress-meta">
        <span>Step ${state.quizStep + 1} of ${total}</span>
        <span>${pct}% complete</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>
    </div>

    <div class="quiz-header">
      <h2>${step.question}</h2>
      <p>${step.subtitle}</p>
    </div>

    <div class="option-grid" id="optionGrid">
      ${step.options.map(opt => `
        <div class="option ${selected === opt.id ? 'selected' : ''}" data-id="${opt.id}">
          <div class="option-icon">${opt.icon}</div>
          <div class="option-text">
            <h3>${opt.label}</h3>
            <p>${opt.desc}</p>
          </div>
          <div class="option-check"></div>
        </div>
      `).join('')}
    </div>

    ${selected ? `
    <div class="quiz-actions">
      <button class="btn btn-primary" id="quizNext">
        ${state.quizStep < total - 1 ? 'Next \u2192' : 'See My Routine \u2728'}
      </button>
    </div>` : ''}
  `;

  // Back
  document.getElementById('quizBack').addEventListener('click', (e) => {
    e.preventDefault();
    if (state.quizStep > 0) {
      state.quizStep--;
      if (state.history.length) state.history.pop();
      render();
    } else {
      goBack();
    }
  });

  // Option selection
  el.querySelectorAll('.option').forEach(opt => {
    opt.addEventListener('click', () => {
      state.answers[step.id] = opt.dataset.id;
      renderQuiz(el);
    });
  });

  // Next
  const nextBtn = document.getElementById('quizNext');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (state.quizStep < total - 1) {
        state.quizStep++;
        navigate('quiz');
      } else {
        state.recommendedProducts = recommend(state.answers);
        navigate('results');
      }
    });
  }
}

/* ================================================================
   RESULTS SCREEN (FR-04, FR-06, FR-10)
   ================================================================ */
function renderResults(el) {
  const { skinType, concern, routine } = state.answers;
  const products = state.recommendedProducts;
  const isFullRoutine = routine === 'full';

  el.innerHTML = `
    <div class="results-banner">
      <h2>\u2728 Your Personalised Routine</h2>
      <p>${products.length} products selected for your skin profile</p>
      <div class="profile-chips">
        <span class="profile-chip">${SKIN_TYPE_LABELS[skinType]} Skin</span>
        <span class="profile-chip">${CONCERN_LABELS[concern]}</span>
        <span class="profile-chip">${ROUTINE_LABELS[routine]}</span>
      </div>
    </div>

    ${isFullRoutine ? `
    <div class="schedule-section">
      <h3>AM / PM Schedule</h3>
      <table class="schedule-table">
        <thead><tr><th>Step</th><th>Product</th><th>When</th></tr></thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td><strong>${p.stepLabel}</strong></td>
              <td>${p.name}</td>
              <td>${p.timing}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    <div class="products-section">
      <h3>Recommended Products \u2014 Tap for details</h3>
      <div class="product-grid">
        ${products.map(p => `
          <div class="product-card" data-product="${p.id}">
            <div class="product-img ${p.color}">${p.emoji}</div>
            <div class="product-info">
              <span class="product-tag">${p.stepLabel}</span>
              <h4>${p.name}</h4>
              <div class="brand">${p.brand} \u00B7 ${p.price}</div>
              <div class="timing">${p.timing}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="results-actions">
      <button class="btn btn-outline" id="retakeQuiz">\u21BB Retake Quiz</button>
      <button class="btn btn-outline" id="goHomeBtn">\u2190 Back to Home</button>
    </div>
  `;

  // Product detail
  el.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      state.selectedProduct = card.dataset.product;
      navigate('product');
    });
  });

  // Retake (FR-06)
  document.getElementById('retakeQuiz').addEventListener('click', () => {
    state.quizStep = 0;
    state.answers = {};
    state.history = [];
    navigate('quiz');
  });

  document.getElementById('goHomeBtn').addEventListener('click', () => {
    state.history = [];
    navigate('home');
  });
}

/* ================================================================
   PRODUCT DETAIL SCREEN (FR-05, FR-07)
   ================================================================ */
function renderProduct(el) {
  const p = state.recommendedProducts.find(x => x.id === state.selectedProduct)
         || PRODUCTS.find(x => x.id === state.selectedProduct);
  if (!p) { navigate('results', { isBack: true }); return; }

  const starsHtml = '\u2605'.repeat(Math.floor(p.rating)) +
                    (p.rating % 1 >= 0.5 ? '\u00BD' : '') +
                    '\u2606'.repeat(5 - Math.ceil(p.rating));

  el.innerHTML = `
    <a href="#" class="back-link" id="prodBack">\u2190 Back to My Routine</a>

    <div class="detail-grid">
      <div class="detail-hero ${p.color}">${p.emoji}</div>

      <div class="detail-content">
        <h2>${p.name}</h2>
        <p class="subtitle">${p.brand} \u00B7 ${p.size} \u00B7 ${p.price}</p>

        <div class="badge-row">
          ${p.tags.map(t => `<span class="badge badge-green">${t}</span>`).join('')}
          <span class="badge badge-orange">${p.timing}</span>
        </div>

        <div class="rating-row">
          <span class="stars">${starsHtml}</span>
          <span class="rating-num">${p.rating}</span>
          <span class="rating-count">(${p.reviews.toLocaleString()} reviews)</span>
        </div>

        <div class="detail-section">
          <div class="label">Why This Product?</div>
          <div class="body-text">${p.reason}</div>
        </div>

        <div class="detail-section">
          <div class="label">Key Ingredients</div>
          <div class="ingredient-tags">
            ${p.ingredients.map(i => `<span class="ing-tag">${i}</span>`).join('')}
          </div>
        </div>

        <div class="detail-section">
          <div class="label">How to Use</div>
          <div class="body-text">${p.howToUse}</div>
        </div>

        <button class="btn btn-primary" id="backToRoutine" style="margin-top:16px">\u2190 Back to My Routine</button>
      </div>
    </div>
  `;

  document.getElementById('prodBack').addEventListener('click', (e) => { e.preventDefault(); goBack(); });
  document.getElementById('backToRoutine').addEventListener('click', goBack);
}

/* ================================================================
   BOOT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  render();

  // Nav link clicks
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.screen;
      if (target === 'quiz') {
        state.quizStep = 0;
        state.answers = {};
        state.history = [];
      } else {
        state.history = [];
      }
      navigate(target);
    });
  });

  // Logo click -> home
  document.getElementById('logoLink').addEventListener('click', (e) => {
    e.preventDefault();
    state.history = [];
    navigate('home');
  });
});
