import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { App as CapApp } from '@capacitor/app'
import SplashScreen from './SplashScreen'

/* ── User Profile ───────────────────────────────────────────── */
const USER = {
  name:         'Zin',
  age:          37,
  gender:       'Male',
  heightCm:     162,
  weightKg:     53,
  bmi:          Number((53 / (1.62 ** 2)).toFixed(1)), // 20.2
  bmr:          Math.round(10 * 53 + 6.25 * 162 - 5 * 37 + 5), // 1363
  goalCalories: 1900,
  goalProtein:  80,
  goalCarbs:    220,
  goalFat:      60,
}

/* ── Meal Data ──────────────────────────────────────────────── */
const MEALS = [
  {
    id: 1,
    name: 'Greek Yogurt Parfait',
    mealType: 'Breakfast',
    category: 'Dairy',
    emoji: '🥛',
    photo: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=800&q=80&auto=format&fit=crop',
    calories: 290,
    servingSize: '1 bowl — 200g yogurt + toppings',
    description: 'Creamy strained yogurt layered with antioxidant-rich berries and crunchy granola. One of the fastest ways to hit your morning protein target and kick-start gut health with live cultures.',
    nutrients: { protein: '22g', carbs: '38g', fat: '5g', fiber: '4g' },
    benefits: ['Probiotics', 'Bone health', 'Gut microbiome', 'Immune support'],
    tips: 'Choose plain, unsweetened full-fat Greek yogurt for maximum protein. Layer blueberries and raspberries for the widest antioxidant profile. Add granola just before eating so it stays crisp. A drizzle of raw honey adds sweetness without refined sugar.',
    forYou: 'At 53 kg, a high-protein breakfast protects lean muscle mass and keeps you satiated until lunch — essential for a healthy metabolism at 37. Greek yogurt delivers 22g protein in one bowl, a quarter of your daily goal.',
  },
  {
    id: 2,
    name: 'Overnight Oats & Chia',
    mealType: 'Breakfast',
    category: 'Grains',
    emoji: '🥣',
    photo: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=80&auto=format&fit=crop',
    calories: 340,
    servingSize: '1 jar — 80g oats + 200ml milk',
    description: 'Rolled oats soaked overnight with chia seeds create a thick, pudding-like breakfast rich in beta-glucan fibre and plant-based omega-3 fatty acids. Zero cooking required — prep in two minutes the night before.',
    nutrients: { protein: '14g', carbs: '52g', fat: '9g', fiber: '9g' },
    benefits: ['Slow-release carbs', 'Omega-3 ALA', 'Heart health', 'Easy prep'],
    tips: 'Combine 80g oats, 1 tbsp chia seeds and 200ml oat or almond milk the night before. A light layer of almond butter on top adds protein and flavour. Top with sliced banana and a pinch of cinnamon in the morning for natural sweetness.',
    forYou: 'The high-fibre, slow-release carbs provide steady energy throughout your morning — ideal at 37 when stable blood sugar levels directly influence cognitive performance and mood across the day.',
  },
  {
    id: 3,
    name: 'Avocado & Egg Toast',
    mealType: 'Breakfast',
    category: 'Grains',
    emoji: '🥑',
    photo: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80&auto=format&fit=crop',
    calories: 330,
    servingSize: '1 slice sourdough with full toppings',
    description: 'Whole grain sourdough topped with smashed avocado and a perfectly poached egg. A nutritional trifecta of complex carbs, heart-healthy monounsaturated fats and complete protein — substantial enough to fuel a full morning.',
    nutrients: { protein: '15g', carbs: '28g', fat: '18g', fiber: '7g' },
    benefits: ['Healthy fats', 'Heart health', 'Potassium-rich', 'Sustained energy'],
    tips: 'Use sourdough or whole grain bread for the best glycaemic response. Mash avocado with lemon juice, sea salt and chilli flakes. Poach the egg for 3 minutes in simmering water with a dash of vinegar. Finish with cracked black pepper and extra virgin olive oil.',
    forYou: 'Monounsaturated fats from avocado actively support cardiovascular health — increasingly important from your late 30s. The combination of healthy fats and protein stabilises blood sugar, preventing the mid-morning energy slump.',
  },
  {
    id: 4,
    name: 'Grilled Salmon & Asparagus',
    mealType: 'Dinner',
    category: 'Protein',
    emoji: '🐟',
    photo: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80&auto=format&fit=crop',
    calories: 320,
    servingSize: '150g fillet + 100g asparagus',
    description: 'Wild Atlantic salmon grilled with lemon and herbs alongside crispy asparagus spears. One of the most nutrient-dense dinners available — packed with complete protein and anti-inflammatory omega-3 EPA & DHA that support the heart and brain.',
    nutrients: { protein: '38g', carbs: '8g', fat: '16g', fiber: '3g' },
    benefits: ['Omega-3 EPA/DHA', 'Heart health', 'Brain function', 'Vitamin D & B12'],
    tips: 'Season the fillet generously with garlic, lemon zest and fresh dill. Grill skin-side down for 4 minutes, then flip for 2 minutes for a perfectly medium-rare centre. Asparagus needs only 5 minutes in a hot pan with olive oil and sea salt.',
    forYou: 'At 37, omega-3 fatty acids are essential for cardiovascular health and cognitive function. At 53 kg, 38g protein per serving powerfully supports muscle preservation without excess calories — keeping you well within your 1,900 kcal daily target.',
  },
  {
    id: 5,
    name: 'Chicken & Brown Rice Bowl',
    mealType: 'Lunch',
    category: 'Protein',
    emoji: '🍗',
    photo: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&q=80&auto=format&fit=crop',
    calories: 420,
    servingSize: '150g chicken + 1 cup rice + veg',
    description: 'A meal-prep staple: lean grilled chicken breast over wholesome brown rice with sautéed greens. The most reliable way to consistently hit your protein targets while keeping calories smart and controlled.',
    nutrients: { protein: '45g', carbs: '38g', fat: '8g', fiber: '4g' },
    benefits: ['Muscle building', 'Lean protein', 'Slow-release carbs', 'B vitamins'],
    tips: 'Marinate chicken in soy sauce, garlic and ginger for at least 30 minutes before grilling. Toast brown rice in a dry pan for 2 minutes before cooking in vegetable broth for a rich, nutty flavour. Add steamed broccoli or spinach to significantly boost micronutrients.',
    forYou: 'With 45g of protein per bowl this is your ultimate muscle-maintenance meal. At 53 kg maintaining lean mass is the priority — this meal achieves it without pushing past your 1,900 kcal target, leaving room for a snack.',
  },
  {
    id: 6,
    name: 'Quinoa Power Bowl',
    mealType: 'Lunch',
    category: 'Grains',
    emoji: '🥗',
    photo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop',
    calories: 380,
    servingSize: '1 large bowl (350g total)',
    description: 'Fluffy quinoa loaded with roasted sweet potato, avocado, cherry tomatoes and a tahini-lemon dressing. One of the most complete plant-based lunches available — delivering all nine essential amino acids in one vibrant bowl.',
    nutrients: { protein: '18g', carbs: '52g', fat: '12g', fiber: '8g' },
    benefits: ['Complete protein', 'All 9 amino acids', 'Gluten-free', 'Iron-rich'],
    tips: 'Rinse quinoa thoroughly before cooking to remove saponin bitterness. Cook in vegetable broth instead of plain water for depth of flavour. Roast sweet potato cubes at 200°C for 25 minutes. Whisk tahini with lemon juice, garlic and warm water for the perfect creamy dressing.',
    forYou: 'Quinoa is one of the only plant foods with all 9 essential amino acids — outstanding for muscle recovery at 53 kg. The generous amount of iron also supports energy metabolism, which is particularly important for active men in their late 30s.',
  },
  {
    id: 7,
    name: 'Red Lentil & Spinach Soup',
    mealType: 'Lunch',
    category: 'Legumes',
    emoji: '🍲',
    photo: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80&auto=format&fit=crop',
    calories: 280,
    servingSize: '1 generous bowl (300ml)',
    description: 'A warming, deeply aromatic soup of red lentils, wilted spinach and anti-inflammatory spices. An exceptional plant-based source of both protein and soluble fibre that actively lowers LDL cholesterol and feeds beneficial gut bacteria.',
    nutrients: { protein: '16g', carbs: '42g', fat: '4g', fiber: '12g' },
    benefits: ['Plant iron', 'Cholesterol control', 'Gut health', 'Anti-inflammatory'],
    tips: 'Sauté onions until golden before adding garlic, ginger and cumin seeds. Blooming whole spices in oil unlocks dramatically more flavour. Stir in baby spinach two minutes before serving and finish with a generous squeeze of fresh lemon juice to brighten the entire dish.',
    forYou: 'At only 280 kcal with 12g of fibre this is your best low-calorie, high-satiety lunch option. The plant iron addresses a nutrient that men in their late 30s commonly overlook, supporting consistent energy levels throughout the day.',
  },
  {
    id: 8,
    name: 'Sweet Potato Chickpea Curry',
    mealType: 'Dinner',
    category: 'Legumes',
    emoji: '🍛',
    photo: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80&auto=format&fit=crop',
    calories: 390,
    servingSize: '1 bowl (300g) with rice',
    description: 'A rich, golden curry of sweet potato and chickpeas simmered in coconut milk and turmeric. Colourful, warming and deeply satisfying — a powerhouse of anti-inflammatory curcumin and prebiotic fibre.',
    nutrients: { protein: '14g', carbs: '62g', fat: '9g', fiber: '11g' },
    benefits: ['Curcumin', 'Anti-inflammatory', 'Prebiotic fibre', 'Beta-carotene'],
    tips: 'Toast whole cumin and coriander seeds in a dry pan before grinding for maximum flavour. Use full-fat coconut milk for a creamier finish. Turmeric\'s curcumin becomes far more bioavailable when paired with black pepper — add a generous pinch. Serve over brown rice or with whole grain naan.',
    forYou: 'Turmeric\'s curcumin is one of the most studied anti-inflammatory compounds — especially valuable for joint health and cellular wellness as you approach your 40s. The 11g of prebiotic fibre also feeds your gut microbiome for long-term digestive health.',
  },
  {
    id: 9,
    name: 'Tuna Niçoise Salad',
    mealType: 'Lunch',
    category: 'Protein',
    emoji: '🥗',
    photo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
    calories: 340,
    servingSize: '1 plate (approx. 350g)',
    description: 'A classic French salad elevated with seared or good-quality tinned tuna, soft-boiled eggs, crisp green beans, cherry tomatoes and olives. High in protein and omega-3 fats — sophisticated, colourful and anything but diet food.',
    nutrients: { protein: '32g', carbs: '22g', fat: '12g', fiber: '5g' },
    benefits: ['Omega-3 DHA', 'Vitamin D', 'Selenium', 'Lean protein'],
    tips: 'Soft-boil eggs for exactly 7 minutes for a perfect jammy yolk. Blanch green beans for 2–3 minutes so they stay vibrant and crisp. Dress with extra-virgin olive oil, Dijon mustard and red wine vinegar. Seared fresh tuna is exceptional but quality tinned tuna in olive oil is a brilliant everyday alternative.',
    forYou: 'With 32g of lean protein and essential omega-3 fats, this salad actively supports your body composition at 53 kg. The Vitamin D from tuna contributes to bone density — a key consideration for lean males through their late 30s and beyond.',
  },
  {
    id: 10,
    name: 'Mixed Berry Smoothie Bowl',
    mealType: 'Breakfast',
    category: 'Fruits',
    emoji: '🫐',
    photo: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop',
    calories: 240,
    servingSize: '1 bowl (approx. 350g blended + toppings)',
    description: 'A thick, vibrant blend of frozen berries and banana topped with granola, fresh fruit and a drizzle of honey. Delivers one of the highest antioxidant densities per calorie of any breakfast — and takes under five minutes to make.',
    nutrients: { protein: '8g', carbs: '46g', fat: '4g', fiber: '6g' },
    benefits: ['Anthocyanins', 'Memory support', 'Anti-aging', 'Vitamin C'],
    tips: 'Blend frozen blueberries, raspberries and half a banana with only enough almond milk to get it moving — keep it thick so the bowl holds toppings. Arrange granola, fresh berries, sliced kiwi and a honey drizzle on top. Eat immediately before the toppings soften.',
    forYou: 'Anthocyanins in dark berries are powerfully protective against cognitive decline and oxidative stress — both increasingly relevant in your late 30s. At only 240 kcal this is a light yet energising start to the day, leaving plenty of room in your 1,900 kcal target.',
  },
  {
    id: 11,
    name: 'Garden Salad & Almonds',
    mealType: 'Snack',
    category: 'Vegetables',
    emoji: '🥗',
    photo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80&auto=format&fit=crop',
    calories: 185,
    servingSize: '2 large cups (approx. 250g)',
    description: 'A nutrient-dense, calorie-light salad of mixed greens, cucumber, cherry tomatoes and toasted almonds. Delivers a wide spectrum of vitamins and minerals — including vitamins A, C and K — in their most bioavailable form.',
    nutrients: { protein: '6g', carbs: '12g', fat: '12g', fiber: '5g' },
    benefits: ['Vitamins A, C & K', 'Digestive health', 'Healthy fats', 'Low calorie'],
    tips: 'Use a mix of rocket, spinach and romaine for nutritional variety. Toast sliced almonds in a dry pan until golden — about 3–4 minutes — for significantly deeper flavour. Dress simply with quality extra-virgin olive oil, lemon juice, sea salt and cracked black pepper.',
    forYou: 'At only 185 kcal with 5g fibre this is the ideal afternoon snack that bridges hunger without derailing your 1,900 kcal goal. Vitamin K from dark greens is essential for bone health — especially important for lean males like you as the years progress.',
  },
  {
    id: 12,
    name: 'Almond Butter & Banana Rye',
    mealType: 'Snack',
    category: 'Nuts',
    emoji: '🥜',
    photo: 'https://images.unsplash.com/photo-1598187198094-4be7c8ff8956?w=800&q=80&auto=format&fit=crop',
    calories: 270,
    servingSize: '1–2 slices rye bread + toppings',
    description: 'Natural almond butter and banana slices on dense, fibre-rich rye bread. A brilliantly balanced snack delivering slow-release energy, magnesium and potassium — a pairing that works synergistically for muscle function and recovery.',
    nutrients: { protein: '9g', carbs: '36g', fat: '12g', fiber: '5g' },
    benefits: ['Magnesium', 'Potassium', 'Vitamin E', 'Heart-healthy fats'],
    tips: 'Choose 100% natural almond butter with almonds as the only ingredient — no added sugar or palm oil. Rye bread has a significantly lower GI than white or whole wheat bread, making it superior for stable blood sugar. Add a sprinkle of hemp seeds for an extra protein and omega-3 boost.',
    forYou: 'Magnesium from almonds supports hundreds of metabolic reactions including energy production and muscle function — many men are unknowingly deficient. The potassium from banana pairs perfectly for post-workout recovery or a mid-afternoon energy bridge.',
  },
  {
    id: 13,
    name: 'Almonds & Banana',
    mealType: 'Snack',
    category: 'Nuts',
    emoji: '🍌',
    photo: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80&auto=format&fit=crop',
    calories: 265,
    servingSize: '30g almonds + 1 medium banana',
    description: 'A perfectly balanced two-ingredient snack — crunchy raw almonds paired with a ripe banana. Almonds deliver heart-healthy fats and magnesium while the banana provides fast-acting natural sugars and potassium for energy.',
    nutrients: { protein: '7g', carbs: '29g', fat: '15g', fiber: '6g' },
    benefits: ['Magnesium', 'Potassium', 'Natural energy', 'Heart-healthy fats'],
    tips: 'Choose raw or lightly dry-roasted almonds without added salt or oil. A banana with a few brown spots has more fructose and potassium than an unripe one. For extra protein, swap plain almonds for a tablespoon of almond butter. Perfect pre- or post-light exercise.',
    forYou: 'At 53 kg, this snack is perfectly calibrated — magnesium from almonds supports muscle function and metabolic reactions, while the banana\'s potassium aids cardiovascular health. Both are key micronutrients commonly under-consumed by men in their late 30s.',
  },

  /* ── Myanmar Meals (IDs 14–17) ──────────────────────────── */
  {
    id: 14,
    name: 'Mohinga',
    mealType: 'Breakfast',
    category: 'Protein',
    emoji: '🍜',
    photo: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80&auto=format&fit=crop',
    calories: 350,
    servingSize: '1 bowl — rice noodles + fish broth',
    description: 'Myanmar\'s beloved national dish — delicate rice noodles in a rich, lemongrass-scented fish broth with banana trunk, crispy split-pea fritters and fresh herbs. The nation\'s favourite breakfast, eaten from street corners to homes right across the country.',
    nutrients: { protein: '18g', carbs: '48g', fat: '8g', fiber: '3g' },
    benefits: ['Lean fish protein', 'Anti-inflammatory', 'Sustained energy', 'Gut health'],
    tips: 'Use fresh catfish or snakehead fish for the most authentic depth of flavour. Simmer the broth with lemongrass, galangal and banana trunk for at least 45 minutes. Top with crispy fried split-pea fritters, a soft-boiled egg and a squeeze of lime. Serve immediately for the full street-food experience.',
    forYou: 'A perfect 350 kcal start for you, Zin — lean fish protein supports your 80g daily protein goal and provides the sustained energy your metabolism needs to power through the morning at 37.',
  },
  {
    id: 15,
    name: 'Myanmar Lunch Plate',
    mealType: 'Lunch',
    category: 'Protein',
    emoji: '🍛',
    photo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80&auto=format&fit=crop',
    calories: 440,
    servingSize: '1 cup brown rice + 150g steamed fish + kanzun soup',
    description: 'A complete traditional Myanmar lunch: fragrant brown jasmine rice alongside Nga-baung (banana-leaf steamed fish with turmeric and shallots), paired with a light Kanzun Ywet (water spinach) soup. Simple, nourishing and deeply authentic.',
    nutrients: { protein: '34g', carbs: '54g', fat: '10g', fiber: '6g' },
    benefits: ['High protein', 'Omega-3', 'Iron from water spinach', 'Slow-release carbs'],
    tips: 'Wrap the fish in banana leaves with turmeric, shallots, garlic and lemongrass and steam for 20 minutes — this locks in moisture and all the aromatics. For the Kanzun Ywet soup, briefly sauté water spinach in garlic before adding a light fish or vegetable stock. Keep it simple to retain the fresh, clean flavour.',
    forYou: 'The 34g of protein in this traditional Myanmar lunch actively maintains your lean muscle, Zin. Brown jasmine rice releases carbohydrates more slowly than white rice, helping sustain energy and blood sugar stability through your afternoon.',
  },
  {
    id: 16,
    name: 'Burmese Grilled Chicken',
    mealType: 'Dinner',
    category: 'Protein',
    emoji: '🍗',
    photo: 'https://images.unsplash.com/photo-1598515213692-6114abac6c6c?w=800&q=80&auto=format&fit=crop',
    calories: 330,
    servingSize: '200g chicken thigh + spice marinade',
    description: 'Tender chicken marinated in an aromatic Burmese spice blend — turmeric, lemongrass, garlic, ginger and a hint of shrimp paste — then grilled over charcoal until golden with slightly charred edges. Intensely flavourful and incredibly lean.',
    nutrients: { protein: '38g', carbs: '8g', fat: '14g', fiber: '2g' },
    benefits: ['High protein', 'Turmeric anti-inflammatory', 'Low carb', 'Metabolism support'],
    tips: 'Marinate for at least 4 hours — overnight gives the deepest flavour penetration. The turmeric and lemongrass combination is both delicious and powerfully anti-inflammatory. Serve with sliced cucumbers, fresh tomatoes and a squeeze of lime. Charcoal grilling adds irreplaceable smoky depth.',
    forYou: 'An exceptional high-protein dinner, Zin — 38g of lean protein is ideal for overnight muscle repair at 53 kg. The turmeric marinade delivers curcumin, one of the most potent anti-inflammatory compounds — increasingly important as you approach your 40s.',
  },
  {
    id: 17,
    name: 'Fresh Tropical Fruits',
    mealType: 'Snack',
    category: 'Fruits',
    emoji: '🍑',
    photo: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80&auto=format&fit=crop',
    calories: 185,
    servingSize: '1 plate — mixed seasonal fruits',
    description: 'A colourful plate of Myanmar\'s finest seasonal tropical fruits — ripe mango, sweet papaya, juicy watermelon and vibrant dragon fruit. Packed with natural vitamins, digestive enzymes and antioxidants that nourish without weighing you down.',
    nutrients: { protein: '2g', carbs: '45g', fat: '1g', fiber: '5g' },
    benefits: ['Vitamin C', 'Digestive enzymes', 'Antioxidants', 'Natural hydration'],
    tips: 'Serve slightly chilled for maximum refreshment. Ripe mango with deep orange flesh has the most beta-carotene. A light squeeze of lime juice elevates all the flavours and adds extra Vitamin C. Eat after meals — papaya contains papain, a natural enzyme that actively supports protein digestion.',
    forYou: 'Only 185 kcal yet bursting with Vitamins C and A — this tropical snack fits perfectly into your 1,900 kcal day without disrupting your weight, Zin. Digestive enzymes from papaya and mango support gut health, a key priority for long-term wellness at 37.',
  },
]

/* ── Day Plan Configuration ─────────────────────────────────── */
const DAY_PLAN = [
  {
    slot:        'Breakfast',
    icon:        '🌅',
    time:        '7:00 – 9:00 am',
    accentColor: '#f59e0b',
    bgColor:     'rgba(245,158,11,0.08)',
    choiceIds:   [14],     // Mohinga
  },
  {
    slot:        'Lunch',
    icon:        '☀️',
    time:        '12:00 – 1:30 pm',
    accentColor: '#34d399',
    bgColor:     'rgba(52,211,153,0.08)',
    choiceIds:   [15],     // Myanmar Lunch Plate (Brown Rice + Steamed Fish + Kanzun Ywet Soup)
  },
  {
    slot:        'Dinner',
    icon:        '🌙',
    time:        '6:30 – 8:00 pm',
    accentColor: '#818cf8',
    bgColor:     'rgba(129,140,248,0.08)',
    choiceIds:   [16],     // Burmese Grilled Chicken
  },
  {
    slot:        'Snack',
    icon:        '🍎',
    time:        'Anytime',
    accentColor: '#fb923c',
    bgColor:     'rgba(251,146,60,0.08)',
    choiceIds:   [17],     // Fresh Tropical Fruits
  },
]

const CATEGORIES    = ['All', 'Protein', 'Vegetables', 'Grains', 'Fruits', 'Dairy', 'Legumes', 'Nuts']
const MEAL_TYPES    = ['All Meals', 'Breakfast', 'Lunch', 'Dinner', 'Snack']
const CATEGORY_EMOJI = {
  All: '🍽', Protein: '💪', Vegetables: '🥦', Grains: '🌾',
  Fruits: '🍓', Dairy: '🥛', Legumes: '🫘', Nuts: '🥜',
}

/* ════════════════════════════════════════════════════════════
   PROFILE DASHBOARD  (collapsed by default, tap to expand)
════════════════════════════════════════════════════════════ */
const XLogo = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
)

function ProfileDashboard() {
  const [expanded, setExpanded] = useState(false)

  const macros = [
    { label: 'Protein', emoji: '💪', value: USER.goalProtein, unit: 'g', color: '#34d399', kcal: USER.goalProtein * 4 },
    { label: 'Carbs',   emoji: '🌾', value: USER.goalCarbs,   unit: 'g', color: '#fbbf24', kcal: USER.goalCarbs * 4   },
    { label: 'Fat',     emoji: '🥑', value: USER.goalFat,     unit: 'g', color: '#a78bfa', kcal: USER.goalFat * 9     },
  ]
  const totalMacroKcal = macros.reduce((s, m) => s + m.kcal, 0)

  const toggle = () => setExpanded(v => !v)

  return (
    <div className="profile-dashboard">

      {/* ── Always-visible top bar — tap anywhere to expand/collapse ── */}
      <div
        className="pd-toprow"
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle()}
        aria-expanded={expanded}
        aria-label={expanded ? 'Collapse profile details' : 'Expand profile details'}
      >
        <div className="pd-identity">
          {/* X logo avatar */}
          <div className="pd-avatar-ring">
            <XLogo size={22} />
          </div>
          <div className="pd-identity-text">
            <div className="pd-name">{USER.name}</div>
            <div className="pd-tagline">{USER.age}-year-old Male · Healthy Weight</div>
          </div>
        </div>

        <div className="pd-toprow-right">
          <div className="pd-bmi-badge">
            <div className="pd-bmi-num">{USER.bmi}</div>
            <div className="pd-bmi-lbl">BMI</div>
            <div className="pd-bmi-status">Healthy ✓</div>
          </div>
          {/* Chevron */}
          <div className={`pd-chevron ${expanded ? 'pd-chevron--open' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              width="16" height="16" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Expandable details ── */}
      <div className={`pd-expandable ${expanded ? 'pd-expandable--open' : ''}`}>

        {/* Stats strip */}
        <div className="pd-stats-strip">
          {[
            { icon: '🎂', value: USER.age,      unit: 'yrs',  label: 'Age'    },
            { icon: '📏', value: USER.heightCm, unit: 'cm',   label: 'Height' },
            { icon: '⚖️', value: USER.weightKg, unit: 'kg',   label: 'Weight' },
            { icon: '⚡', value: USER.bmr,       unit: 'kcal', label: 'BMR'    },
          ].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <div className="pd-stat-item">
                <span className="pd-stat-icon">{s.icon}</span>
                <span className="pd-stat-val">{s.value}<em>{s.unit}</em></span>
                <span className="pd-stat-lbl">{s.label}</span>
              </div>
              {i < arr.length - 1 && <div className="pd-stat-divider" />}
            </React.Fragment>
          ))}
        </div>

        {/* Calorie target */}
        <div className="pd-calorie-card">
          <div className="pd-calorie-left">
            <div className="pd-calorie-eyebrow">🔥 Daily Calorie Target</div>
            <div className="pd-calorie-number">{USER.goalCalories.toLocaleString()}</div>
            <div className="pd-calorie-unit">kcal / day</div>
          </div>
          <div className="pd-calorie-right">
            <div className="pd-calorie-formula">
              <div className="pd-formula-row">
                <span className="pd-formula-label">BMR</span>
                <span className="pd-formula-value">{USER.bmr} kcal</span>
              </div>
              <div className="pd-formula-operator">×</div>
              <div className="pd-formula-row">
                <span className="pd-formula-label">Activity</span>
                <span className="pd-formula-value">1.4×</span>
              </div>
              <div className="pd-formula-operator">=</div>
              <div className="pd-formula-row pd-formula-result">
                <span className="pd-formula-label">Target</span>
                <span className="pd-formula-value">{USER.goalCalories} kcal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Macro targets */}
        <div className="pd-macros-section">
          <div className="pd-macros-header">
            <span className="pd-macros-title">DAILY MACRO TARGETS</span>
            <span className="pd-macros-total">{totalMacroKcal} kcal accounted</span>
          </div>
          {macros.map(m => {
            const pct  = Math.round((m.kcal / USER.goalCalories) * 100)
            const barW = Math.round((m.kcal / (USER.goalCarbs * 4)) * 100)
            return (
              <div key={m.label} className="pd-macro-row">
                <span className="pd-macro-emoji">{m.emoji}</span>
                <span className="pd-macro-name">{m.label}</span>
                <div className="pd-macro-bar-track">
                  <div className="pd-macro-bar-fill" style={{ width: `${barW}%`, background: m.color }} />
                </div>
                <span className="pd-macro-val" style={{ color: m.color }}>{m.value}{m.unit}</span>
                <span className="pd-macro-pct">{pct}%</span>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   DAILY MEAL PLAN
════════════════════════════════════════════════════════════ */
function DailyMealPlan({ onMealClick }) {
  // choiceIndex per slot (supports multi-choice breakfast)
  const [choices, setChoices] = useState(
    Object.fromEntries(DAY_PLAN.map(s => [s.slot, 0]))
  )

  const getMeal = (entry) => MEALS.find(m => m.id === entry.choiceIds[choices[entry.slot]])

  const totalCals   = DAY_PLAN.reduce((sum, e) => sum + (getMeal(e)?.calories ?? 0), 0)
  const remaining   = USER.goalCalories - totalCals
  const progressPct = Math.min(Math.round((totalCals / USER.goalCalories) * 100), 100)

  return (
    <div className="day-plan">

      {/* Header */}
      <div className="dmp-header">
        <div className="dmp-header-left">
          <div className="dmp-title">📋 Today's Meal Plan</div>
          <div className="dmp-subtitle">{USER.name}'s personalised Myanmar meal plan · {USER.goalCalories.toLocaleString()} kcal target</div>
        </div>
        <div className="dmp-total-box">
          <div className="dmp-total-num">{totalCals.toLocaleString()}</div>
          <div className="dmp-total-lbl">of {USER.goalCalories.toLocaleString()} kcal</div>
        </div>
      </div>

      {/* Calorie progress bar */}
      <div className="dmp-progress-wrap">
        <div className="dmp-progress-track">
          <div className="dmp-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="dmp-progress-labels">
          <span className="dmp-pct-label">{progressPct}% of daily target planned</span>
          <span className="dmp-remain-label">
            {remaining > 0 ? `${remaining.toLocaleString()} kcal remaining` : '✅ Target reached'}
          </span>
        </div>
      </div>

      {/* Meal slots */}
      <div className="dmp-slots">
        {DAY_PLAN.map((entry, idx) => {
          const meal       = getMeal(entry)
          const hasChoice  = entry.choiceIds.length > 1

          return (
            <div key={entry.slot} className="dmp-slot">
              {/* Vertical timeline connector */}
              {idx < DAY_PLAN.length - 1 && <div className="dmp-connector" />}

              {/* Slot label row */}
              <div className="dmp-slot-label-row">
                <div
                  className="dmp-slot-dot"
                  style={{ background: entry.accentColor, boxShadow: `0 0 12px ${entry.accentColor}55` }}
                >
                  {entry.icon}
                </div>
                <div className="dmp-slot-meta">
                  <span className="dmp-slot-name" style={{ color: entry.accentColor }}>{entry.slot}</span>
                  <span className="dmp-slot-time">{entry.time}</span>
                </div>

                {/* Choice toggle — breakfast only */}
                {hasChoice && (
                  <div className="dmp-choice-row">
                    {entry.choiceIds.map((id, ci) => {
                      const m = MEALS.find(x => x.id === id)
                      return (
                        <button
                          key={id}
                          className={`dmp-choice-pill ${choices[entry.slot] === ci ? 'active' : ''}`}
                          style={choices[entry.slot] === ci
                            ? { background: entry.accentColor, borderColor: entry.accentColor }
                            : {}}
                          onClick={() => setChoices(prev => ({ ...prev, [entry.slot]: ci }))}
                        >
                          {m?.emoji} {ci === 0 ? 'Yogurt' : 'Oats'}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Meal card */}
              {meal && (
                <div
                  className="dmp-meal-card"
                  style={{ borderColor: entry.accentColor + '28', background: entry.bgColor }}
                  onClick={() => onMealClick(meal)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onMealClick(meal)}
                >
                  <div className="dmp-meal-img">
                    <img
                      src={meal.photo}
                      alt={meal.name}
                      loading="lazy"
                      onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.textContent = meal.emoji }}
                    />
                  </div>
                  <div className="dmp-meal-info">
                    <div className="dmp-meal-name">{meal.name}</div>
                    <div className="dmp-meal-cat-row">
                      <span className="dmp-meal-cat">{CATEGORY_EMOJI[meal.category]} {meal.category}</span>
                      <span className="dmp-meal-serving">{meal.servingSize}</span>
                    </div>
                    <div className="dmp-macros-row">
                      <span className="dmp-macro-chip dmp-p">P {meal.nutrients.protein}</span>
                      <span className="dmp-macro-chip dmp-c">C {meal.nutrients.carbs}</span>
                      <span className="dmp-macro-chip dmp-f">F {meal.nutrients.fat}</span>
                      <span className="dmp-macro-chip dmp-fi">Fibre {meal.nutrients.fiber}</span>
                    </div>
                  </div>
                  <div className="dmp-meal-kcal" style={{ color: entry.accentColor }}>
                    <span className="dmp-kcal-num">{meal.calories}</span>
                    <span className="dmp-kcal-unit">kcal</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Day summary footer */}
      <div className="dmp-summary">
        <div className="dmp-sum-row">
          {DAY_PLAN.map((entry) => {
            const meal = getMeal(entry)
            return (
              <div key={entry.slot} className="dmp-sum-item">
                <div className="dmp-sum-dot" style={{ background: entry.accentColor }} />
                <span className="dmp-sum-slot">{entry.slot}</span>
                <span className="dmp-sum-cal" style={{ color: entry.accentColor }}>{meal?.calories ?? '—'}</span>
              </div>
            )
          })}
          <div className="dmp-sum-total">
            <span>Total</span>
            <span className="dmp-sum-total-num">{totalCals}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   MEAL CARD  (Browse grid)
════════════════════════════════════════════════════════════ */
function MealCard({ meal, onClick }) {
  return (
    <div className="meal-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div className="meal-image">
        <img src={meal.photo} alt={meal.name} loading="lazy"
          onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.textContent = meal.emoji }} />
        <div className="meal-image-overlay" />
        <span className="meal-type-badge">{meal.mealType}</span>
        <span className="meal-cal-chip">🔥 {meal.calories}</span>
      </div>
      <div className="meal-content">
        <div className="meal-name">{meal.name}</div>
        <div className="meal-meta-row">
          <span className="meal-category">{CATEGORY_EMOJI[meal.category]} {meal.category}</span>
        </div>
        <p className="meal-description">
          {meal.description.length > 95 ? meal.description.slice(0, 95) + '…' : meal.description}
        </p>
        <div className="meal-macros">
          <span className="macro-pill macro-protein">P {meal.nutrients.protein}</span>
          <span className="macro-pill macro-carbs">C {meal.nutrients.carbs}</span>
          <span className="macro-pill macro-fat">F {meal.nutrients.fat}</span>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   MEAL MODAL
════════════════════════════════════════════════════════════ */
function MealModal({ meal, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-hero">
          <div className="modal-image-wrap">
            <img src={meal.photo} alt={meal.name}
              onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.textContent = meal.emoji }} />
            <div className="modal-hero-overlay" />
            <div className="modal-hero-info">
              <span className="modal-type-badge">{meal.mealType}</span>
              <span className="modal-hero-cal">🔥 {meal.calories} kcal</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <h2 className="modal-name">{meal.name}</h2>
          <div className="modal-meta">
            <span className="modal-category">{CATEGORY_EMOJI[meal.category]} {meal.category}</span>
            <span className="modal-serving">🍽 {meal.servingSize}</span>
          </div>

          <div className="modal-for-you">
            <div className="for-you-label">💚 Personalised for You</div>
            <p>{meal.forYou}</p>
          </div>

          <div className="modal-section-title">📝 About</div>
          <p className="modal-description">{meal.description}</p>

          <div className="modal-section-title">📊 Nutrition per serving</div>
          <div className="nutrient-grid">
            {[
              { label: 'Protein', value: meal.nutrients.protein, color: '#34d399' },
              { label: 'Carbs',   value: meal.nutrients.carbs,   color: '#fbbf24' },
              { label: 'Fat',     value: meal.nutrients.fat,     color: '#a78bfa' },
              { label: 'Fiber',   value: meal.nutrients.fiber,   color: '#38bdf8' },
            ].map(n => (
              <div key={n.label} className="nutrient-card" style={{ borderTopColor: n.color }}>
                <div className="nutrient-value" style={{ color: n.color }}>{n.value}</div>
                <div className="nutrient-label">{n.label}</div>
              </div>
            ))}
          </div>

          <div className="modal-section-title">✅ Health Benefits</div>
          <div className="benefits-list">
            {meal.benefits.map(b => <span key={b} className="benefit-tag">{b}</span>)}
          </div>

          <div className="modal-section-title">💡 Cooking Tips</div>
          <p className="modal-tips">{meal.tips}</p>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   APP ROOT
════════════════════════════════════════════════════════════ */
function App() {
  const [splashDone, setSplashDone]             = useState(false)
  const [searchTerm, setSearchTerm]             = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedMealType, setSelectedMealType] = useState('All Meals')
  const [selectedMeal, setSelectedMeal]         = useState(null)
  const [showExitToast, setShowExitToast]       = useState(false)

  const selectedMealRef   = useRef(null)
  const lastBackPressRef  = useRef(null)
  const exitToastTimerRef = useRef(null)

  useEffect(() => { selectedMealRef.current = selectedMeal }, [selectedMeal])

  useEffect(() => {
    let handle = null
    CapApp.addListener('backButton', () => {
      if (selectedMealRef.current) { setSelectedMeal(null); return }
      const now = Date.now()
      if (lastBackPressRef.current && now - lastBackPressRef.current < 2000) {
        CapApp.exitApp()
      } else {
        lastBackPressRef.current = now
        setShowExitToast(true)
        clearTimeout(exitToastTimerRef.current)
        exitToastTimerRef.current = setTimeout(() => {
          setShowExitToast(false)
          lastBackPressRef.current = null
        }, 2000)
      }
    }).then(h => { handle = h })
    return () => { handle?.remove(); clearTimeout(exitToastTimerRef.current) }
  }, [])

  const filteredMeals = useMemo(() => MEALS.filter(meal => {
    const q = searchTerm.toLowerCase()
    const matchesSearch   = meal.name.toLowerCase().includes(q) || meal.description.toLowerCase().includes(q)
    const matchesCategory = selectedCategory === 'All' || meal.category === selectedCategory
    const matchesMealType = selectedMealType === 'All Meals' || meal.mealType === selectedMealType
    return matchesSearch && matchesCategory && matchesMealType
  }), [searchTerm, selectedCategory, selectedMealType])

  const hasActiveFilters = selectedCategory !== 'All' || selectedMealType !== 'All Meals' || searchTerm
  const clearFilters = useCallback(() => {
    setSelectedCategory('All')
    setSelectedMealType('All Meals')
    setSearchTerm('')
  }, [])

  const handleSplashDone = useCallback(() => setSplashDone(true), [])

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}

      <div>
        {/* ── Header ── */}
        <header>
          <div className="header-inner">
            <div className="header-brand">
              <span className="header-icon">🥗</span>
              <div>
                <h1>Healthy Meal App</h1>
                <p className="header-sub">Personalised for your healthy lifestyle</p>
              </div>
            </div>
            <div className="header-profile-chip">
              <div className="header-x-icon"><XLogo size={12} /></div>
              <span className="profile-chip-label">{USER.name}</span>
            </div>
          </div>
        </header>

        <div className="container">

          {/* ── Profile Dashboard ── */}
          <ProfileDashboard />

          {/* ── Today's Meal Plan ── */}
          <DailyMealPlan onMealClick={setSelectedMeal} />

          {/* ── Browse divider ── */}
          <div className="browse-divider">
            <div className="browse-divider-line" />
            <span className="browse-divider-label">Browse All Meals</span>
            <div className="browse-divider-line" />
          </div>

          {/* ── Search & Filters ── */}
          <div className="search-box">
            <div className="search-input-wrap">
              <span className="search-icon-el">🔍</span>
              <input
                type="text"
                placeholder="Search meals by name or description…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="search-clear" onClick={() => setSearchTerm('')} aria-label="Clear">✕</button>
              )}
            </div>

            <div className="filter-section">
              <div className="filter-label">Category</div>
              <div className="category-filter">
                {CATEGORIES.map(c => (
                  <button key={c}
                    className={`filter-btn ${selectedCategory === c ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(c)}>
                    {CATEGORY_EMOJI[c]} {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-label">Meal Type</div>
              <div className="type-filter">
                {MEAL_TYPES.map(t => (
                  <button key={t}
                    className={`type-btn ${selectedMealType === t ? 'active' : ''}`}
                    onClick={() => setSelectedMealType(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Results bar ── */}
          <div className="results-header">
            <span className="results-count">
              {filteredMeals.length} meal{filteredMeals.length !== 1 ? 's' : ''}
            </span>
            {hasActiveFilters && (
              <button className="clear-filters-btn" onClick={clearFilters}>Clear all filters</button>
            )}
          </div>

          {/* ── Meal Grid ── */}
          <div className="meal-grid">
            {filteredMeals.map(meal => (
              <MealCard key={meal.id} meal={meal} onClick={() => setSelectedMeal(meal)} />
            ))}
          </div>

          {filteredMeals.length === 0 && (
            <div className="empty-state">
              <div className="empty-emoji">🍽</div>
              <p className="empty-title">No meals found</p>
              <p className="empty-sub">Try adjusting your search or filters</p>
              <button className="empty-reset-btn" onClick={clearFilters}>Reset all filters</button>
            </div>
          )}
        </div>

        {/* ── Meal Detail Modal ── */}
        {selectedMeal && <MealModal meal={selectedMeal} onClose={() => setSelectedMeal(null)} />}

        {/* ── Back-exit toast ── */}
        <div className={`exit-toast ${showExitToast ? 'exit-toast--visible' : ''}`}>
          Press back again to exit
        </div>
      </div>
    </>
  )
}

export default App
