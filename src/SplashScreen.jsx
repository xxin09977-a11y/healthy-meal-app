import React, { useEffect, useState } from 'react'

const FOOD_ITEMS = [
  { emoji: '🥗', delay: 0,    x: 12,  y: 18  },
  { emoji: '🐟', delay: 120,  x: 78,  y: 12  },
  { emoji: '🥑', delay: 240,  x: 88,  y: 72  },
  { emoji: '🫐', delay: 60,   x: 8,   y: 78  },
  { emoji: '🍋', delay: 300,  x: 50,  y: 6   },
  { emoji: '🥦', delay: 180,  x: 22,  y: 88  },
  { emoji: '🍠', delay: 360,  x: 72,  y: 88  },
  { emoji: '🥛', delay: 420,  x: 92,  y: 38  },
]

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('in')

  useEffect(() => {
    const outTimer  = setTimeout(() => setPhase('out'), 2200)
    const doneTimer = setTimeout(() => onDone(),        2750)
    return () => { clearTimeout(outTimer); clearTimeout(doneTimer) }
  }, [onDone])

  return (
    <div className={`splash ${phase === 'out' ? 'splash--out' : ''}`}>
      {/* Background particle food emojis */}
      {FOOD_ITEMS.map((item, i) => (
        <span
          key={i}
          className="splash-particle"
          style={{
            left: `${item.x}%`,
            top:  `${item.y}%`,
            animationDelay: `${item.delay}ms`,
          }}
        >
          {item.emoji}
        </span>
      ))}

      {/* Central content */}
      <div className="splash-center">
        <div className="splash-logo-ring">
          <span className="splash-logo-emoji">🥗</span>
        </div>

        <h1 className="splash-title">Healthy Meal</h1>
        <p className="splash-subtitle">Discover nutritious meals</p>

        <div className="splash-dots">
          <span className="splash-dot" style={{ animationDelay: '0ms'   }} />
          <span className="splash-dot" style={{ animationDelay: '180ms' }} />
          <span className="splash-dot" style={{ animationDelay: '360ms' }} />
        </div>
      </div>
    </div>
  )
}
