/* ================================================================
   GlowGuide - Product Database & Quiz Configuration
   ================================================================ */

const QUIZ_CONFIG = {
  steps: [
    {
      id: 'skinType',
      question: 'What best describes your skin type?',
      subtitle: 'Pick the option that matches how your skin usually feels by midday.',
      options: [
        { id: 'dry',         icon: '\u{1F4A7}', label: 'Dry',         desc: 'Feels tight, flaky or rough, especially after washing.' },
        { id: 'oily',        icon: '\u2728',     label: 'Oily',        desc: 'Shiny by mid-morning, enlarged pores, prone to breakouts.' },
        { id: 'combination', icon: '\u{1F500}',  label: 'Combination', desc: 'Oily T-zone with dry or normal cheeks.' },
        { id: 'normal',      icon: '\u{1F33F}',  label: 'Normal',      desc: 'Balanced, not too oily or dry, minimal sensitivity.' },
        { id: 'sensitive',   icon: '\u{1F534}',  label: 'Sensitive',   desc: 'Reacts easily with redness, stinging or itching.' }
      ]
    },
    {
      id: 'concern',
      question: 'What is your main skin concern?',
      subtitle: 'Choose the concern you would most like to target with your routine.',
      options: [
        { id: 'acne',            icon: '\u{1FAE7}', label: 'Acne & Breakouts',          desc: 'Frequent pimples, blackheads or clogged pores.' },
        { id: 'darkspots',       icon: '\u{1F311}', label: 'Dark Spots & Uneven Tone',  desc: 'Post-acne marks, sun spots or hyperpigmentation.' },
        { id: 'ageing',          icon: '\u231B',     label: 'Fine Lines & Ageing',       desc: 'Wrinkles, loss of firmness or dullness over time.' },
        { id: 'dehydration',     icon: '\u{1F4A6}', label: 'Dehydration & Dryness',     desc: 'Skin that lacks moisture, feels tight or looks dull.' },
        { id: 'dullness',        icon: '\u{1F31F}', label: 'Dullness & Glow',           desc: 'Skin that looks tired, flat or lacks radiance.' }
      ]
    },
    {
      id: 'routine',
      question: 'How involved do you want your routine to be?',
      subtitle: 'We will keep your product list realistic for your lifestyle.',
      options: [
        { id: 'minimal',  icon: '\u26A1',     label: 'Minimal (2-3 steps)',      desc: 'Cleanser, moisturiser and SPF, quick and easy.' },
        { id: 'moderate', icon: '\u2696\uFE0F', label: 'Moderate (4-5 steps)',    desc: 'Add a targeted serum and eye cream to the basics.' },
        { id: 'full',     icon: '\u{1F319}',  label: 'Full Routine (6+ steps)',   desc: 'Toner, essence, multiple serums, a thorough AM/PM ritual.' }
      ]
    }
  ]
};

/* -- Product Database ----------------------------------------- */
const PRODUCTS = [
  // --- CLEANSERS ---
  {
    id: 'cleanser-oily',
    name: 'Gentle Foaming Cleanser',
    brand: 'CeraVe',
    size: '236 ml',
    price: '~\u00A312',
    step: 1,
    stepLabel: 'Cleanser',
    timing: 'AM + PM',
    skinTypes: ['oily', 'combination', 'normal'],
    concerns: ['acne', 'darkspots', 'dullness'],
    tags: ['fragrance-free', 'cruelty-free', 'non-comedogenic', 'dermatologist-tested'],
    ingredients: ['Niacinamide 4%', 'Ceramides NP, AP, EOP', 'Hyaluronic Acid'],
    rating: 4.7,
    reviews: 2340,
    color: 'pink',
    emoji: '\u{1F9F4}',
    reason: 'Removes excess oil and impurities without stripping moisture. Niacinamide calms redness while ceramides maintain the skin barrier \u2014 critical for {skinType} skin dealing with {concern}.',
    howToUse: 'Apply a small amount to damp skin twice daily. Massage gently for 30-60 seconds, then rinse with lukewarm water. Pat dry.'
  },
  {
    id: 'cleanser-dry',
    name: 'Hydrating Cream Cleanser',
    brand: 'La Roche-Posay',
    size: '200 ml',
    price: '~\u00A314',
    step: 1,
    stepLabel: 'Cleanser',
    timing: 'AM + PM',
    skinTypes: ['dry', 'sensitive'],
    concerns: ['dehydration', 'ageing', 'darkspots', 'dullness'],
    tags: ['fragrance-free', 'non-comedogenic', 'dermatologist-tested'],
    ingredients: ['Glycerin', 'Niacinamide', 'Ceramide-3', 'Thermal Spring Water'],
    rating: 4.6,
    reviews: 1870,
    color: 'blue',
    emoji: '\u{1F9F4}',
    reason: 'A cream-based formula that cleanses without drying. Glycerin and ceramides replenish moisture \u2014 essential for {skinType} skin fighting {concern}.',
    howToUse: 'Apply to damp face morning and evening. Massage in circular motions for 30 seconds and rinse gently.'
  },

  // --- TONERS ---
  {
    id: 'toner-bha',
    name: 'BHA Clarifying Toner 2%',
    brand: "Paula's Choice",
    size: '118 ml',
    price: '~\u00A332',
    step: 2,
    stepLabel: 'Exfoliating Toner',
    timing: 'PM (3-4x per week)',
    skinTypes: ['oily', 'combination', 'normal'],
    concerns: ['acne', 'darkspots', 'dullness'],
    tags: ['fragrance-free', 'cruelty-free'],
    ingredients: ['Salicylic Acid 2%', 'Green Tea Extract', 'Methylpropanediol'],
    rating: 4.8,
    reviews: 3120,
    color: 'green',
    emoji: '\u{1F49A}',
    reason: 'Salicylic acid (BHA) exfoliates inside the pore, dissolving the buildup that causes blackheads and breakouts. Highly effective for {skinType} skin targeting {concern}.',
    howToUse: 'After cleansing, apply to a cotton pad and sweep across face. Avoid the eye area. Use 3-4 times per week in PM. Always follow with SPF in the morning.'
  },
  {
    id: 'toner-hydrating',
    name: 'Hyaluronic Acid Hydrating Toner',
    brand: 'Klairs',
    size: '180 ml',
    price: '~\u00A318',
    step: 2,
    stepLabel: 'Hydrating Toner',
    timing: 'AM + PM',
    skinTypes: ['dry', 'sensitive', 'normal'],
    concerns: ['dehydration', 'ageing', 'dullness'],
    tags: ['fragrance-free', 'vegan', 'cruelty-free'],
    ingredients: ['Hyaluronic Acid', 'Beta-Glucan', 'Centella Asiatica'],
    rating: 4.5,
    reviews: 1540,
    color: 'blue',
    emoji: '\u{1F4A7}',
    reason: 'Draws moisture into the skin with multiple weights of hyaluronic acid. Perfect for {skinType} skin that needs hydration to address {concern}.',
    howToUse: 'Pat into slightly damp skin after cleansing. Can be layered 2-3 times for extra hydration.'
  },

  // --- SERUMS ---
  {
    id: 'serum-niacinamide',
    name: '10% Niacinamide + 1% Zinc Serum',
    brand: 'The Ordinary',
    size: '30 ml',
    price: '~\u00A36',
    step: 3,
    stepLabel: 'Treatment Serum',
    timing: 'AM + PM',
    skinTypes: ['oily', 'combination', 'normal', 'sensitive'],
    concerns: ['acne', 'darkspots', 'dullness'],
    tags: ['fragrance-free', 'vegan', 'cruelty-free'],
    ingredients: ['Niacinamide 10%', 'Zinc PCA 1%'],
    rating: 4.5,
    reviews: 5200,
    color: 'blue',
    emoji: '\u{1F535}',
    reason: 'Reduces sebum production, minimises pore appearance and fades post-acne marks over 4-8 weeks. The zinc helps regulate oil \u2014 ideal for {skinType} skin with {concern}.',
    howToUse: 'Apply 2-3 drops to clean skin. Can be used AM and PM. Layer under moisturiser.'
  },
  {
    id: 'serum-vitc',
    name: 'Vitamin C 15% + Ferulic Acid',
    brand: 'The Inkey List',
    size: '30 ml',
    price: '~\u00A312',
    step: 3,
    stepLabel: 'Antioxidant Serum',
    timing: 'AM only',
    skinTypes: ['dry', 'normal', 'combination', 'oily'],
    concerns: ['darkspots', 'dullness', 'ageing'],
    tags: ['vegan', 'cruelty-free'],
    ingredients: ['Ascorbic Acid 15%', 'Ferulic Acid', 'Vitamin E'],
    rating: 4.4,
    reviews: 1890,
    color: 'yellow',
    emoji: '\u{1F34A}',
    reason: 'Brightens skin tone, fades existing dark spots and boosts SPF protection. Antioxidant defence is key for {skinType} skin dealing with {concern}.',
    howToUse: 'Apply 3-4 drops to clean, dry skin in the morning before moisturiser. Allow to absorb for 1 minute.'
  },
  {
    id: 'serum-retinol',
    name: '0.2% Retinol Serum',
    brand: 'RoC Retinol Correxion',
    size: '30 ml',
    price: '~\u00A320',
    step: 3,
    stepLabel: 'Retinoid (2x/wk)',
    timing: 'PM only (2x per week)',
    skinTypes: ['dry', 'normal', 'combination'],
    concerns: ['ageing', 'darkspots'],
    tags: ['dermatologist-tested'],
    ingredients: ['Retinol 0.2%', 'Hyaluronic Acid', 'Vitamin E'],
    rating: 4.3,
    reviews: 1440,
    color: 'pink',
    emoji: '\u{1F319}',
    reason: 'Accelerates cell turnover to reduce fine lines and smooth texture. Start at 0.2% to build tolerance \u2014 effective for {skinType} skin addressing {concern}.',
    howToUse: 'Apply a pea-sized amount to clean skin PM only, 2x per week. Build up over 4-6 weeks. Do NOT use with BHA on the same night.'
  },
  {
    id: 'serum-hyaluronic',
    name: 'Hyaluronic Acid 2% + B5',
    brand: 'The Ordinary',
    size: '30 ml',
    price: '~\u00A37',
    step: 3,
    stepLabel: 'Hydrating Serum',
    timing: 'AM + PM',
    skinTypes: ['dry', 'sensitive', 'normal'],
    concerns: ['dehydration', 'ageing', 'dullness'],
    tags: ['fragrance-free', 'vegan', 'cruelty-free'],
    ingredients: ['Hyaluronic Acid (multi-weight)', 'Panthenol (Vitamin B5)'],
    rating: 4.6,
    reviews: 4100,
    color: 'blue',
    emoji: '\u{1F4A6}',
    reason: 'Multiple molecular weights of HA deliver hydration at different skin depths. Panthenol soothes and repairs \u2014 critical for {skinType} skin with {concern}.',
    howToUse: 'Apply 2-3 drops to damp skin. Follow with moisturiser to seal in hydration.'
  },

  // --- MOISTURISERS ---
  {
    id: 'moisturiser-oily',
    name: 'Oil-Free Hydrating Lotion',
    brand: 'Neutrogena Hydro Boost',
    size: '50 ml',
    price: '~\u00A310',
    step: 4,
    stepLabel: 'Moisturiser',
    timing: 'AM + PM',
    skinTypes: ['oily', 'combination'],
    concerns: ['acne', 'darkspots', 'dullness', 'dehydration'],
    tags: ['oil-free', 'non-comedogenic', 'fragrance-free'],
    ingredients: ['Hyaluronic Acid', 'Glycerin', 'Dimethicone'],
    rating: 4.5,
    reviews: 2780,
    color: 'green',
    emoji: '\u{1F49A}',
    reason: 'Oil-free gel-cream that hydrates without congesting pores. Hyaluronic acid delivers lightweight moisture \u2014 ideal for {skinType} skin managing {concern}.',
    howToUse: 'Apply a small amount after serum. AM and PM. Gently press into skin rather than rubbing.'
  },
  {
    id: 'moisturiser-dry',
    name: 'Toleriane Double Repair Moisturiser',
    brand: 'La Roche-Posay',
    size: '75 ml',
    price: '~\u00A316',
    step: 4,
    stepLabel: 'Moisturiser',
    timing: 'AM + PM',
    skinTypes: ['dry', 'sensitive', 'normal'],
    concerns: ['dehydration', 'ageing', 'darkspots', 'dullness'],
    tags: ['fragrance-free', 'non-comedogenic', 'dermatologist-tested'],
    ingredients: ['Ceramide-3', 'Niacinamide', 'Glycerin', 'Prebiotic Thermal Water'],
    rating: 4.7,
    reviews: 2100,
    color: 'green',
    emoji: '\u{1F49C}',
    reason: 'Ceramides and niacinamide repair the skin barrier while locking in moisture. Clinically tested for sensitive skin \u2014 perfect for {skinType} skin battling {concern}.',
    howToUse: 'Apply a generous amount after serum. Can be used AM and PM. At night, use a thicker layer for overnight barrier repair.'
  },

  // --- EYE CREAM ---
  {
    id: 'eyecream',
    name: 'Caffeine Eye Serum 5%',
    brand: 'The Ordinary',
    size: '30 ml',
    price: '~\u00A38',
    step: 5,
    stepLabel: 'Eye Cream',
    timing: 'AM + PM',
    skinTypes: ['oily', 'combination', 'dry', 'normal', 'sensitive'],
    concerns: ['ageing', 'dullness', 'dehydration'],
    tags: ['fragrance-free', 'vegan', 'cruelty-free'],
    ingredients: ['Caffeine 5%', 'EGCG (Green Tea)', 'Hyaluronic Acid'],
    rating: 4.3,
    reviews: 3400,
    color: 'pink',
    emoji: '\u{1F441}\uFE0F',
    reason: 'Caffeine reduces puffiness and dark circles. EGCG provides antioxidant protection. Lightweight enough for {skinType} skin, effective for {concern}-related under-eye concerns.',
    howToUse: 'Dab a small amount around the orbital bone using your ring finger. AM and PM. Do not pull or drag skin.'
  },

  // --- SPF ---
  {
    id: 'spf-light',
    name: 'Ultra-Light SPF 50 PA++++',
    brand: 'ISDIN Fotoprotector',
    size: '50 ml',
    price: '~\u00A320',
    step: 6,
    stepLabel: 'SPF (AM only)',
    timing: 'AM only',
    skinTypes: ['oily', 'combination', 'normal'],
    concerns: ['acne', 'darkspots', 'ageing', 'dullness'],
    tags: ['non-comedogenic', 'oil-free', 'water-resistant'],
    ingredients: ['Ethylhexyl Triazone', 'Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine', 'DNA Repairsomes'],
    rating: 4.6,
    reviews: 1950,
    color: 'yellow',
    emoji: '\u2600\uFE0F',
    reason: 'Broad-spectrum protection with an invisible, non-greasy finish. Non-comedogenic formula will not trigger breakouts \u2014 essential for {skinType} skin, especially when treating {concern}.',
    howToUse: 'Apply as the last step of your AM routine. Use at least a two-finger length amount. Reapply every 2 hours if outdoors.'
  },
  {
    id: 'spf-hydrating',
    name: 'UV Aqua Rich Watery Essence SPF 50+',
    brand: 'Biore',
    size: '50 g',
    price: '~\u00A312',
    step: 6,
    stepLabel: 'SPF (AM only)',
    timing: 'AM only',
    skinTypes: ['dry', 'sensitive', 'normal'],
    concerns: ['dehydration', 'ageing', 'darkspots', 'dullness'],
    tags: ['fragrance-free', 'lightweight'],
    ingredients: ['Hyaluronic Acid', 'Royal Jelly Extract', 'Micro Defence UV Block'],
    rating: 4.7,
    reviews: 4200,
    color: 'yellow',
    emoji: '\u2600\uFE0F',
    reason: 'Watery texture absorbs instantly and doubles as a hydrating layer. Perfect for {skinType} skin that needs moisture alongside UV protection against {concern}.',
    howToUse: 'Shake before use. Apply liberally as the last AM step. Feels like a lightweight serum.'
  },

  // --- ESSENCE (Full routine only) ---
  {
    id: 'essence',
    name: 'First Treatment Essence',
    brand: 'COSRX',
    size: '150 ml',
    price: '~\u00A322',
    step: 2,
    stepLabel: 'Essence',
    timing: 'AM + PM',
    skinTypes: ['dry', 'normal', 'combination', 'sensitive'],
    concerns: ['dullness', 'dehydration', 'ageing'],
    tags: ['fragrance-free', 'vegan', 'cruelty-free'],
    ingredients: ['Galactomyces Ferment Filtrate 73.7%', 'Niacinamide', 'Adenosine'],
    rating: 4.5,
    reviews: 2800,
    color: 'blue',
    emoji: '\u{1FAE7}',
    reason: 'Fermented galactomyces brightens and hydrates in a lightweight, watery layer. Provides the multi-step hydration that {skinType} skin needs to combat {concern}.',
    howToUse: 'Pour into palms and press into skin after toner. Can be layered for extra glow.'
  }
];

/* -- Concern labels for display -------------------------------- */
const CONCERN_LABELS = {
  acne: 'Acne & Breakouts',
  darkspots: 'Dark Spots & Uneven Tone',
  ageing: 'Fine Lines & Ageing',
  dehydration: 'Dehydration & Dryness',
  dullness: 'Dullness & Glow'
};

const SKIN_TYPE_LABELS = {
  dry: 'Dry',
  oily: 'Oily',
  combination: 'Combination',
  normal: 'Normal',
  sensitive: 'Sensitive'
};

const ROUTINE_LABELS = {
  minimal: 'Minimal Routine',
  moderate: 'Moderate Routine',
  full: 'Full AM/PM Ritual'
};
