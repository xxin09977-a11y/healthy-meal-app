import React, { useState, useMemo, useEffect, useRef } from 'react'
import { App as CapApp } from '@capacitor/app'

const MEALS = [
  {
    id: 1,
    name: 'Grilled Salmon',
    category: 'Protein',
    emoji: '🐟',
    calories: 280,
    servingSize: '150g fillet',
    description: 'Rich in Omega-3 fatty acids, perfect for heart health and brain function. Salmon is one of the most nutrient-dense foods available, packed with high-quality protein and essential fatty acids.',
    nutrients: { protein: '34g', carbs: '0g', fat: '14g', fiber: '0g' },
    benefits: ['Heart health', 'Brain function', 'Anti-inflammatory', 'Vitamin D'],
    tips: 'Grill 4–5 min per side over medium-high heat with lemon, garlic and fresh herbs. Aim for medium-rare to retain moisture. Pairs beautifully with steamed broccoli or a light salad.'
  },
  {
    id: 2,
    name: 'Quinoa Bowl',
    category: 'Grains',
    emoji: '🥣',
    calories: 220,
    servingSize: '1 cup cooked (185g)',
    description: 'One of the few plant foods that delivers all nine essential amino acids, making it a complete protein. Naturally gluten-free and packed with minerals like iron and magnesium.',
    nutrients: { protein: '8g', carbs: '39g', fat: '4g', fiber: '5g' },
    benefits: ['Complete protein', 'Gluten-free', 'High fiber', 'Iron-rich'],
    tips: 'Rinse quinoa before cooking to remove bitterness. Cook in vegetable broth instead of water for extra flavour. Top with roasted veggies, avocado and a drizzle of tahini for a filling meal.'
  },
  {
    id: 3,
    name: 'Green Salad',
    category: 'Vegetables',
    emoji: '🥗',
    calories: 85,
    servingSize: '2 cups (100g)',
    description: 'A vibrant mix of leafy greens bursting with vitamins, minerals and phytonutrients. Low in calories yet high in water content, making it ideal for weight management and hydration.',
    nutrients: { protein: '3g', carbs: '10g', fat: '4g', fiber: '4g' },
    benefits: ['Vitamins A & C', 'Iron & Calcium', 'Hydrating', 'Low calorie'],
    tips: 'Combine spinach, rocket and mixed lettuce for maximum nutritional variety. Dress with extra-virgin olive oil and apple cider vinegar. Add pumpkin seeds or walnuts for satisfying crunch.'
  },
  {
    id: 4,
    name: 'Chicken Breast',
    category: 'Protein',
    emoji: '🍗',
    calories: 165,
    servingSize: '150g breast',
    description: 'The gold standard of lean protein. Chicken breast is extremely low in fat while delivering an impressive protein punch — ideal for muscle building, recovery and keeping you full for longer.',
    nutrients: { protein: '31g', carbs: '0g', fat: '4g', fiber: '0g' },
    benefits: ['Muscle building', 'Low fat', 'High protein', 'B vitamins'],
    tips: 'Pound to an even thickness before cooking for juicier results. Marinate for at least 30 minutes. Always rest for 5 minutes after cooking so juices redistribute throughout the meat.'
  },
  {
    id: 5,
    name: 'Sweet Potato',
    category: 'Vegetables',
    emoji: '🍠',
    calories: 103,
    servingSize: '1 medium (130g)',
    description: 'A nutritional powerhouse that provides a slow, sustained release of energy. Exceptionally high in beta-carotene (which converts to Vitamin A) and rich in dietary fibre that supports digestive health.',
    nutrients: { protein: '2g', carbs: '24g', fat: '0g', fiber: '4g' },
    benefits: ['Beta-carotene', 'Vitamin C', 'Digestive health', 'Blood sugar control'],
    tips: 'Bake whole at 200°C for 45 minutes for maximum natural sweetness. The skin is entirely edible and fibre-rich. Pairs wonderfully with black beans, Greek yogurt or guacamole.'
  },
  {
    id: 6,
    name: 'Greek Yogurt',
    category: 'Dairy',
    emoji: '🥛',
    calories: 100,
    servingSize: '170g (¾ cup)',
    description: 'Strained to remove excess whey, giving it a thick, creamy texture and a protein content nearly double that of regular yogurt. Loaded with live cultures that actively support your gut microbiome.',
    nutrients: { protein: '17g', carbs: '6g', fat: '0g', fiber: '0g' },
    benefits: ['Probiotics', 'Bone health', 'Gut microbiome', 'Immune support'],
    tips: 'Choose plain, unsweetened varieties for maximum probiotic benefit. Top with fresh berries and a light drizzle of honey. Use as a healthy substitute for sour cream in dips and dressings.'
  },
  {
    id: 7,
    name: 'Avocado Toast',
    category: 'Grains',
    emoji: '🥑',
    calories: 240,
    servingSize: '1 slice with topping',
    description: 'A satisfying combination of slow-release whole grain carbohydrates and heart-healthy monounsaturated fats from avocado. Provides long-lasting energy without the mid-morning energy crash.',
    nutrients: { protein: '6g', carbs: '24g', fat: '14g', fiber: '7g' },
    benefits: ['Healthy fats', 'Heart health', 'Potassium-rich', 'Sustained energy'],
    tips: 'Use whole grain or sourdough bread for the best nutritional base. Season mashed avocado with lemon juice, sea salt and chilli flakes. Add a poached egg on top to boost protein by an extra 6g.'
  },
  {
    id: 8,
    name: 'Berry Mix',
    category: 'Fruits',
    emoji: '🫐',
    calories: 60,
    servingSize: '1 cup (150g)',
    description: 'A colourful medley of blueberries, strawberries and raspberries delivering one of the highest antioxidant densities of any food. These compounds combat oxidative stress and support brain health and memory.',
    nutrients: { protein: '1g', carbs: '14g', fat: '1g', fiber: '4g' },
    benefits: ['Antioxidants', 'Memory boost', 'Anti-aging', 'Vitamin C'],
    tips: 'Mix blueberries, strawberries and raspberries for the broadest antioxidant profile. Frozen berries retain most of their nutrients and are more cost-effective. Add to smoothies, overnight oats or Greek yogurt.'
  },
  {
    id: 9,
    name: 'Lentil Soup',
    category: 'Legumes',
    emoji: '🍲',
    calories: 150,
    servingSize: '1 bowl (250ml)',
    description: 'A warming, deeply satisfying soup that is one of the best plant-based sources of both protein and iron. The high fibre content actively lowers LDL cholesterol and feeds beneficial gut bacteria.',
    nutrients: { protein: '9g', carbs: '20g', fat: '1g', fiber: '8g' },
    benefits: ['Plant protein', 'Iron-rich', 'Heart health', 'Cholesterol lowering'],
    tips: 'Add cumin, turmeric and smoked paprika for depth of flavour. Wilt in a handful of spinach two minutes before serving. A squeeze of fresh lemon over the bowl brightens every flavour in the dish.'
  },
  {
    id: 10,
    name: 'Grilled Vegetables',
    category: 'Vegetables',
    emoji: '🥦',
    calories: 75,
    servingSize: '1 cup mixed (150g)',
    description: 'A nutrient-dense, low-calorie dish that celebrates seasonal produce. Grilling preserves far more nutrients than boiling while adding a smoky char that enhances the natural sweetness of each vegetable.',
    nutrients: { protein: '3g', carbs: '12g', fat: '3g', fiber: '4g' },
    benefits: ['Vitamins A, C & K', 'Low calorie', 'Antioxidants', 'Digestive support'],
    tips: 'Toss courgette, peppers, aubergine and asparagus in olive oil, garlic and Italian herbs before grilling. Char marks add fantastic smoky flavour. Serve immediately or use cold in wraps and salads.'
  },
  {
    id: 11,
    name: 'Brown Rice',
    category: 'Grains',
    emoji: '🍚',
    calories: 215,
    servingSize: '1 cup cooked (195g)',
    description: 'Unlike white rice, brown rice retains its bran and germ layers, making it far richer in fibre, vitamins and minerals. It releases glucose slowly into the bloodstream, providing steady, long-lasting energy.',
    nutrients: { protein: '5g', carbs: '45g', fat: '2g', fiber: '4g' },
    benefits: ['Whole grain', 'Manganese-rich', 'Slow-release energy', 'Cholesterol control'],
    tips: 'Use a 2:1 water-to-rice ratio and simmer on very low heat for 45 minutes. Toast the dry rice in a dry pan for 2 minutes before adding water — it builds a delicious nutty flavour throughout.'
  },
  {
    id: 12,
    name: 'Almond Butter',
    category: 'Nuts',
    emoji: '🥜',
    calories: 190,
    servingSize: '2 tbsp (32g)',
    description: 'A rich, creamy spread made from whole almonds — one of the most nutritious nuts available. A concentrated source of Vitamin E, magnesium and heart-healthy monounsaturated fats that promote lasting satiety.',
    nutrients: { protein: '7g', carbs: '6g', fat: '18g', fiber: '2g' },
    benefits: ['Vitamin E', 'Magnesium', 'Healthy fats', 'Lasting satiety'],
    tips: 'Choose natural almond butter with almonds as the only ingredient — no added sugar or palm oil. Stir well before each use. Spread on apple slices, blend into smoothies or thin with water for a sauce.'
  }
]

const CATEGORIES = ['All', 'Protein', 'Vegetables', 'Grains', 'Fruits', 'Dairy', 'Legumes', 'Nuts']

function MealModal({ meal, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Fixed hero — always visible, never scrolls */}
        <div className="modal-hero">
          <div className="modal-emoji">{meal.emoji}</div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Scrollable body */}
        <div className="modal-body">
          <h2 className="modal-name">{meal.name}</h2>
          <div className="modal-meta">
            <span className="modal-category">{meal.category}</span>
            <span className="modal-serving">🍽 {meal.servingSize}</span>
          </div>

          <div className="modal-section-title">📝 About</div>
          <p className="modal-description">{meal.description}</p>

          <div className="modal-calories">🔥 {meal.calories} calories per serving</div>

          <div className="modal-section-title">📊 Nutrition per serving</div>
          <div className="nutrient-grid">
            {[
              { label: 'Protein', value: meal.nutrients.protein, color: '#059669' },
              { label: 'Carbs',   value: meal.nutrients.carbs,   color: '#d97706' },
              { label: 'Fat',     value: meal.nutrients.fat,     color: '#7c3aed' },
              { label: 'Fiber',   value: meal.nutrients.fiber,   color: '#0891b2' },
            ].map(n => (
              <div key={n.label} className="nutrient-card" style={{ borderTopColor: n.color }}>
                <div className="nutrient-value" style={{ color: n.color }}>{n.value}</div>
                <div className="nutrient-label">{n.label}</div>
              </div>
            ))}
          </div>

          <div className="modal-section-title">✅ Health Benefits</div>
          <div className="benefits-list">
            {meal.benefits.map(b => (
              <span key={b} className="benefit-tag">{b}</span>
            ))}
          </div>

          <div className="modal-section-title">💡 Tips</div>
          <p className="modal-tips">{meal.tips}</p>
        </div>
      </div>
    </div>
  )
}

function MealCard({ meal, onClick }) {
  return (
    <div className="meal-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div className="meal-image">{meal.emoji}</div>
      <div className="meal-content">
        <div className="meal-name">{meal.name}</div>
        <span className="meal-category">{meal.category}</span>
        <p className="meal-description">{meal.description}</p>
        <div className="meal-calories">🔥 {meal.calories} cal</div>
      </div>
    </div>
  )
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [showExitToast, setShowExitToast] = useState(false)

  // Refs so the back-button listener never captures stale state
  const selectedMealRef = useRef(null)
  const lastBackPressRef = useRef(null)
  const exitToastTimerRef = useRef(null)

  useEffect(() => { selectedMealRef.current = selectedMeal }, [selectedMeal])

  // Register Capacitor back-button listener once on mount
  useEffect(() => {
    let handle = null

    CapApp.addListener('backButton', () => {
      // If a modal is open, close it instead of triggering exit logic
      if (selectedMealRef.current) {
        setSelectedMeal(null)
        return
      }

      const now = Date.now()
      if (lastBackPressRef.current && now - lastBackPressRef.current < 2000) {
        // Second press within 2 s → exit the app
        CapApp.exitApp()
      } else {
        // First press → show toast and record timestamp
        lastBackPressRef.current = now
        setShowExitToast(true)
        clearTimeout(exitToastTimerRef.current)
        exitToastTimerRef.current = setTimeout(() => {
          setShowExitToast(false)
          lastBackPressRef.current = null
        }, 2000)
      }
    }).then(h => { handle = h })

    return () => {
      handle?.remove()
      clearTimeout(exitToastTimerRef.current)
    }
  }, [])

  const filteredMeals = useMemo(() => {
    return MEALS.filter(meal => {
      const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          meal.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || meal.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  return (
    <div>
      <header>
        <h1>🥗 Healthy Meal App</h1>
        <p>Discover nutritious meals for a healthier lifestyle</p>
      </header>

      <div className="container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="category-filter">
            {CATEGORIES.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="meal-grid">
          {filteredMeals.map(meal => (
            <MealCard key={meal.id} meal={meal} onClick={() => setSelectedMeal(meal)} />
          ))}
        </div>

        {filteredMeals.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#6b7280' }}>
            <p style={{ fontSize: '18px' }}>No meals found. Try a different search!</p>
          </div>
        )}
      </div>

      {selectedMeal && (
        <MealModal meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      )}

      {/* Double-tap-to-exit toast */}
      <div className={`exit-toast ${showExitToast ? 'exit-toast--visible' : ''}`}>
        Press back again to exit
      </div>
    </div>
  )
}

export default App
