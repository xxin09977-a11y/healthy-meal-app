import React, { useState, useMemo } from 'react'

const MEALS = [
  {
    id: 1,
    name: 'Grilled Salmon',
    category: 'Protein',
    emoji: '🐟',
    calories: 280,
    description: 'Rich in Omega-3 fatty acids, perfect for heart health'
  },
  {
    id: 2,
    name: 'Quinoa Bowl',
    category: 'Grains',
    emoji: '🥣',
    calories: 220,
    description: 'Complete protein with all amino acids'
  },
  {
    id: 3,
    name: 'Green Salad',
    category: 'Vegetables',
    emoji: '🥗',
    calories: 85,
    description: 'Fresh greens loaded with vitamins and minerals'
  },
  {
    id: 4,
    name: 'Chicken Breast',
    category: 'Protein',
    emoji: '🍗',
    calories: 165,
    description: 'Lean protein, low in fat'
  },
  {
    id: 5,
    name: 'Sweet Potato',
    category: 'Vegetables',
    emoji: '🍠',
    calories: 103,
    description: 'Rich in beta-carotene and fiber'
  },
  {
    id: 6,
    name: 'Greek Yogurt',
    category: 'Dairy',
    emoji: '🥛',
    calories: 100,
    description: 'Probiotics for gut health'
  },
  {
    id: 7,
    name: 'Avocado Toast',
    category: 'Grains',
    emoji: '🥑',
    calories: 240,
    description: 'Healthy fats and whole grains'
  },
  {
    id: 8,
    name: 'Berry Mix',
    category: 'Fruits',
    emoji: '🫐',
    calories: 60,
    description: 'Antioxidant powerhouse'
  },
  {
    id: 9,
    name: 'Lentil Soup',
    category: 'Legumes',
    emoji: '🍲',
    calories: 150,
    description: 'Plant-based protein and fiber'
  },
  {
    id: 10,
    name: 'Grilled Vegetables',
    category: 'Vegetables',
    emoji: '🥦',
    calories: 75,
    description: 'Nutrient-dense and low calorie'
  },
  {
    id: 11,
    name: 'Brown Rice',
    category: 'Grains',
    emoji: '🍚',
    calories: 215,
    description: 'Whole grain with fiber'
  },
  {
    id: 12,
    name: 'Almond Butter',
    category: 'Nuts',
    emoji: '🥜',
    calories: 190,
    description: 'Healthy fats and protein'
  }
]

const CATEGORIES = ['All', 'Protein', 'Vegetables', 'Grains', 'Fruits', 'Dairy', 'Legumes', 'Nuts']

function MealModal({ meal, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="modal-emoji">{meal.emoji}</div>
        <div className="modal-body">
          <h2 className="modal-name">{meal.name}</h2>
          <span className="modal-category">{meal.category}</span>
          <p className="modal-description">{meal.description}</p>
          <div className="modal-calories">🔥 {meal.calories} calories per serving</div>
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
    </div>
  )
}

export default App
