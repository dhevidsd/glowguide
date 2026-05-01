/* ══════════════════════════════════════════════════════════════
   GlowGuide — Application Logic
   Quiz engine · Recommendation engine · Screen router
   ══════════════════════════════════════════════════════════════ */

/* ── State ─────────────────────────────────────────────────── */
const state = {
  currentScreen: 'home',      // home | quiz | results | product
  quizStep: 0,                // 0 → skinType, 1 → concern, 2 → routine
  answers: {},                // { skinType: 'oily', concern: 'acne', routine: 'moderate' }
  recommendedProducts: [],    // computed after quiz
  selectedProduct: null,      // product id for detail view
  history: []                 // navigation history for back button
};

const $ = (sel) => document.querySelector(sel);
const screen = () => $('#screen');

/* ── Clock ────────────────────────────────────────────────── */
function updateClock() {
  const el = $('#clock');
  if (el) {
    const now = new Date();
    el.textContent = now.getHours().toString().padStart(2, '0') + ':' +
                     now.getMinutes().toString().padStart(2, '0');
  }
}
setInterval(updateClock, 30000);

/* ══════════════════════════════════════════════════════════════
   RECOMMENDATION ENGINE  (FR-04)
   ══════════════════════════════════════════════════════════════ */
function recommend(answers) {
  const { skinType, concern, routine } = answers;

  // 1. Filter products that match skin type AND concern
  let pool = PRODUCTS.filter(p =>
    p.skinTypes.includes(skinType) && p.concerns.includes(concern)
  );

  // 2. Determine how many steps to include
  const stepCounts = { minimal: 3, moderate: 5, full: 7 };
  const maxProducts = stepCounts[routine] || 5;

  // 3. Score each product for relevance
  pool = pool.map(p => {
    let score = 0;
    // primary skin type match
    if (p.skinTypes[0] === skinType) score += 3;
    else score += 1;
    // primary concern match
    if (p.concerns[0] === concern) score += 3;
    else score += 1;
    // favour higher ratings
    score += (p.rating - 4) * 2;
    return { ...p, score };
  });

  // 4. Sort by step order, then score
  pool.sort((a, b) => a.step - b.step || b.score - a.score);

  // 5. Pick the best product per step, up to maxProducts
  const chosen = [];
  const usedSteps = new Set();
  for (const p of pool) {
    if (chosen.length >= maxProducts) break;
    if (!usedSteps.has(p.step)) {
      usedSteps.add(p.step);
      chosen.push(p);
    }
  }

  // 6. If we still need products, add more from remaining pool
  if (chosen.length < maxProducts) {
    for (const p of pool) {
      if (chosen.length >= maxProducts) break;
      if (!chosen.find(c => c.id === p.id)) {
        chosen.push(p);
      }
    }
  }

  // 7. Final sort by step order
  chosen.sort((a, b) => a.step - b.step);

  // 8. Personalise the reason text
  return chosen.map(p => ({
    ...p,
    reason: p.reason
      .replace(/{skinType}/g, SKIN_TYPE_LABELS[skinType].toLowerCase())
      .replace(/{concern}/g, CONCERN_LABELS[concern].toLowerCase())
  }));
}

/* ══════════════════════════════════════════════════════════════
   SCREEN ROUTER
   ══════════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════════
   RENDER DISPATCHER
   ══════════════════════════════════════════════════════════════ */
function render(isBack = false) {
  const el = screen();
  el.classList.add('fade-out');
  setTimeout(() => {
    el.scrollTop = 0;
    switch (state.currentScreen) {
      case 'home':    renderHome(el);    break;
      case 'quiz':    renderQuiz(el);    break;
      case 'results': renderResults(el); break;
      case 'product': renderProduct(el); break;
    }
    el.classList.remove('fade-out');
    el.classList.add('fade-in');
    updateClock();
  }, 180);
}

/* ══════════════════════════════════════════════════════════════
   HOME SCREEN
   ══════════════════════════════════════════════════════════════ */
function renderHome(el) {
  el.innerHTML = `
    <div class="hero">
      <div class="hero-icon">✨</div>
      <h1>GlowGuide</h1>
      <p>Your personalised skincare routine — built in 60 seconds</p>
    </div>

    <div class="section-hd">
      <h2>How It Works</h2>
      <p>Three quick questions → a tailored routine just for you.</p>
    </div>

    <div class="stats-row">
      <div class="stat-box"><div class="num">3</div><div class="lbl">Questions</div></div>
      <div class="stat-box"><div class="num">60s</div><div class="lbl">To complete</div></div>
      <div class="stat-box"><div class="num">15+</div><div class="lbl">Products</div></div>
    </div>

    <div class="section-hd" style="padding-top:16px">
      <h2>Personalised For You</h2>
      <p>Evidence-based product picks matched to your unique profile.</p>
    </div>

    <div class="chip-row">
      <span class="chip">🧬 Skin Type</span>
      <span class="chip">🎯 Concerns</span>
      <span class="chip">⚡ Lifestyle</span>
    </div>

    <div class="btn-cta-wrap" style="margin-top:20px">
      <button class="btn btn-primary" id="startQuiz">Start My Skin Quiz →</button>
    </div>

    <div class="card" style="margin-top:20px; text-align:center;">
      <p style="font-size:12px; color:var(--muted); line-height:1.5;">
        🌿 <strong>Cruelty-free & dermatologist-reviewed picks</strong><br>
        Products chosen by skin compatibility, not sponsorship.
      </p>
    </div>
  `;

  $('#startQuiz').addEventListener('click', () => {
    state.quizStep = 0;
    state.answers = {};
    navigate('quiz');
  });
}

/* ══════════════════════════════════════════════════════════════
   QUIZ SCREEN  (FR-01, FR-02, FR-03, FR-08, FR-09)
   ══════════════════════════════════════════════════════════════ */
function renderQuiz(el) {
  const step = QUIZ_CONFIG.steps[state.quizStep];
  const total = QUIZ_CONFIG.steps.length;
  const pct = ((state.quizStep) / total * 100).toFixed(0);
  const selected = state.answers[step.id] || null;

  el.innerHTML = `
    <div class="top-nav">
      <button class="back-btn" id="quizBack">←</button>
      <span class="nav-title">Step ${state.quizStep + 1} of ${total}</span>
    </div>

    <div class="progress-wrap">
      <div class="progress-label">
        <span>Progress</span>
        <span>${pct}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>
    </div>

    <div class="section-hd">
      <h2>${step.question}</h2>
      <p>${step.subtitle}</p>
    </div>

    <div class="option-list" id="optionList">
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
    <div class="btn-cta-wrap" style="margin-top:16px">
      <button class="btn btn-primary" id="quizNext">
        ${state.quizStep < total - 1 ? 'Next →' : 'See My Routine ✨'}
      </button>
    </div>` : ''}
  `;

  // Back button
  $('#quizBack').addEventListener('click', () => {
    if (state.quizStep > 0) {
      state.quizStep--;
      // Pop our own history entry so back works correctly
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
      renderQuiz(el); // re-render to show selection & next button
    });
  });

  // Next / Finish
  const nextBtn = $('#quizNext');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (state.quizStep < total - 1) {
        state.quizStep++;
        navigate('quiz');
      } else {
        // Quiz complete — generate recommendations
        state.recommendedProducts = recommend(state.answers);
        navigate('results');
      }
    });
  }
}

/* ══════════════════════════════════════════════════════════════
   RESULTS SCREEN  (FR-04, FR-06, FR-10)
   ══════════════════════════════════════════════════════════════ */
function renderResults(el) {
  const { skinType, concern, routine } = state.answers;
  const products = state.recommendedProducts;
  const isFullRoutine = routine === 'full';

  // Group products by step
  let currentStep = -1;

  el.innerHTML = `
    <div class="result-banner">
      <h2>Your Routine ✨</h2>
      <p>${products.length} products selected for your skin profile</p>
      <div class="result-profile">
        <span class="profile-chip">${SKIN_TYPE_LABELS[skinType]} Skin</span>
        <span class="profile-chip">${CONCERN_LABELS[concern]}</span>
        <span class="profile-chip">${ROUTINE_LABELS[routine]}</span>
      </div>
    </div>

    ${isFullRoutine ? `
    <div class="section-hd">
      <h2>AM / PM Schedule</h2>
      <p>Your complete morning and evening sequence.</p>
    </div>
    <div class="schedule-table">
      <table>
        <tr><th>Step</th><th>Product</th><th>When</th></tr>
        ${products.map(p => `
          <tr>
            <td><strong>${p.stepLabel}</strong></td>
            <td>${p.name}</td>
            <td>${p.timing}</td>
          </tr>
        `).join('')}
      </table>
    </div>
    ` : ''}

    <div class="section-hd" ${isFullRoutine ? 'style="padding-top:8px"' : ''}>
      <h2>Recommended Products</h2>
      <p>Tap any product for full details and usage tips.</p>
    </div>

    <div id="productCards">
      ${products.map(p => {
        let stepHeader = '';
        if (p.step !== currentStep) {
          currentStep = p.step;
          stepHeader = `<div class="step-label">Step ${p.step} — ${p.stepLabel}</div>`;
        }
        return `
          ${stepHeader}
          <div class="product-card" data-product="${p.id}">
            <div class="product-img ${p.color}">${p.emoji}</div>
            <div class="product-info">
              <span class="product-tag">${p.stepLabel}</span>
              <h3>${p.name}</h3>
              <div class="brand">${p.brand} · ${p.price}</div>
              <div class="desc">${p.timing}</div>
            </div>
            <div class="product-arrow">›</div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="btn-cta-wrap" style="margin-top:8px">
      <button class="btn btn-outline" id="retakeQuiz">↻ Retake Quiz</button>
    </div>
    <div class="btn-cta-wrap" style="margin-top:8px; margin-bottom:16px">
      <button class="btn btn-outline" id="goHomeBtn">← Back to Home</button>
    </div>
  `;

  // Product card clicks → detail view
  el.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      state.selectedProduct = card.dataset.product;
      navigate('product');
    });
  });

  // Retake quiz (FR-06)
  $('#retakeQuiz').addEventListener('click', () => {
    state.quizStep = 0;
    state.answers = {};
    state.history = [];
    navigate('quiz');
  });

  // Back home
  $('#goHomeBtn').addEventListener('click', () => {
    state.history = [];
    navigate('home');
  });
}

/* ══════════════════════════════════════════════════════════════
   PRODUCT DETAIL SCREEN  (FR-05, FR-07)
   ══════════════════════════════════════════════════════════════ */
function renderProduct(el) {
  const p = state.recommendedProducts.find(x => x.id === state.selectedProduct)
         || PRODUCTS.find(x => x.id === state.selectedProduct);
  if (!p) { navigate('results', { isBack: true }); return; }

  const starsHtml = '★'.repeat(Math.floor(p.rating)) +
                    (p.rating % 1 >= 0.5 ? '½' : '') +
                    '☆'.repeat(5 - Math.ceil(p.rating));

  el.innerHTML = `
    <div class="top-nav">
      <button class="back-btn" id="prodBack">←</button>
      <span class="nav-title">${p.stepLabel}</span>
    </div>

    <div class="product-hero ${p.color}">${p.emoji}</div>

    <div class="section-hd">
      <h2>${p.name}</h2>
      <p>${p.brand} · ${p.size} · ${p.price}</p>
    </div>

    <div class="badge-row">
      ${p.tags.map(t => `<span class="badge badge-green">${t}</span>`).join('')}
      <span class="badge badge-orange">${p.timing}</span>
    </div>

    <div class="divider"></div>

    <div class="rating">
      <span class="stars">${starsHtml}</span>
      <span class="rating-num">${p.rating}</span>
      <span class="rating-count">(${p.reviews.toLocaleString()} reviews)</span>
    </div>

    <div class="divider"></div>

    <div class="label">Why This Product?</div>
    <div class="body-text">${p.reason}</div>

    <div class="divider"></div>

    <div class="label">Key Ingredients</div>
    <div class="ingredient-tags">
      ${p.ingredients.map(i => `<span class="ing-tag">${i}</span>`).join('')}
    </div>

    <div class="divider"></div>

    <div class="label">How to Use</div>
    <div class="body-text">${p.howToUse}</div>

    <div class="btn-cta-wrap" style="margin-top:20px; margin-bottom:16px">
      <button class="btn btn-primary" id="backToRoutine">← Back to My Routine</button>
    </div>
  `;

  $('#prodBack').addEventListener('click', goBack);
  $('#backToRoutine').addEventListener('click', goBack);
}

/* ── Boot ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  render();
});
