import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onClick: () => void
  hasEntries: boolean
}

const PHRASES = [
  'I have insights!',
  'Psst… check this out!',
  'Your mood trends await~',
  'Come see your data! 🌿',
]

export function ChickenInsights({ onClick, hasEntries }: Props) {
  const [showBubble, setShowBubble] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    if (!hasEntries) return

    // Show bubble after 4s on mount, then every 12s
    const show = () => {
      setPhraseIndex((i) => (i + 1) % PHRASES.length)
      setShowBubble(true)
      setTimeout(() => setShowBubble(false), 3200)
    }

    const initial = setTimeout(show, 4000)
    const interval = setInterval(show, 14000)
    return () => {
      clearTimeout(initial)
      clearInterval(interval)
    }
  }, [hasEntries])

  return (
    <div className="relative flex flex-col items-center">
      {/* Speech bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="absolute bottom-full mb-2 left-0 bg-white rounded-2xl rounded-bl-sm px-3 py-2 shadow-lg border-2 border-emerald-200 whitespace-nowrap z-50"
          >
            <span className="text-xs font-black text-emerald-700">
              {PHRASES[phraseIndex]}
            </span>
            {/* Bubble tail */}
            <div className="absolute -bottom-2 left-3 w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '8px solid #d1fae5',
              }}
            />
            <div className="absolute -bottom-1.5 left-3.5 w-0 h-0"
              style={{
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '7px solid white',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chicken button */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        animate={{ y: [0, -3, 0] }}
        transition={{
          y: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' },
          scale: { type: 'spring', stiffness: 380, damping: 14 },
        }}
        className="relative"
        title="View insights"
        aria-label="Open insights panel"
      >
        <svg
          viewBox="0 0 100 106"
          width="58"
          height="62"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ── Comb ── */}
          <circle cx="39" cy="18" r="8" fill="#FF3B3B" />
          <circle cx="50" cy="12" r="9" fill="#FF3B3B" />
          <circle cx="61" cy="18" r="8" fill="#FF3B3B" />
          <circle cx="39" cy="18" r="8" fill="none" stroke="#CC1A1A" strokeWidth="1.2" />
          <circle cx="50" cy="12" r="9" fill="none" stroke="#CC1A1A" strokeWidth="1.2" />
          <circle cx="61" cy="18" r="8" fill="none" stroke="#CC1A1A" strokeWidth="1.2" />

          {/* ── Wings (behind body) ── */}
          <ellipse cx="22" cy="72" rx="11" ry="16" fill="#FFCC2A" transform="rotate(-12 22 72)" />
          <ellipse cx="78" cy="72" rx="11" ry="16" fill="#FFCC2A" transform="rotate(12 78 72)" />
          <ellipse cx="22" cy="72" rx="11" ry="16" fill="none" stroke="#D4A800" strokeWidth="1.2" transform="rotate(-12 22 72)" />
          <ellipse cx="78" cy="72" rx="11" ry="16" fill="none" stroke="#D4A800" strokeWidth="1.2" transform="rotate(12 78 72)" />

          {/* ── Body ── */}
          <ellipse cx="50" cy="74" rx="28" ry="23" fill="#FFD93D" />
          <ellipse cx="50" cy="74" rx="28" ry="23" fill="none" stroke="#D4A800" strokeWidth="1.5" />

          {/* ── Head ── */}
          <circle cx="50" cy="38" r="23" fill="#FFD93D" />
          <circle cx="50" cy="38" r="23" fill="none" stroke="#D4A800" strokeWidth="1.5" />

          {/* ── Eyes ── */}
          <circle cx="39" cy="33" r="9" fill="white" />
          <circle cx="39" cy="33" r="6" fill="#1a1a1a" />
          <circle cx="37" cy="31" r="2.2" fill="white" />
          <circle cx="61" cy="33" r="9" fill="white" />
          <circle cx="61" cy="33" r="6" fill="#1a1a1a" />
          <circle cx="59" cy="31" r="2.2" fill="white" />

          {/* ── Beak ── */}
          <ellipse cx="50" cy="48" rx="8" ry="5" fill="#FF9A00" />
          <ellipse cx="50" cy="53.5" rx="7" ry="4" fill="#E07800" />
          <line x1="42" y1="51" x2="58" y2="51" stroke="#CC6600" strokeWidth="1" />

          {/* ── Wattle ── */}
          <ellipse cx="50" cy="60" rx="5.5" ry="7" fill="#FF3B3B" />
          <ellipse cx="50" cy="60" rx="5.5" ry="7" fill="none" stroke="#CC1A1A" strokeWidth="1" />

          {/* ── Cheek blushes ── */}
          <ellipse cx="32" cy="42" rx="7" ry="4.5" fill="#FFB3BA" opacity="0.75" />
          <ellipse cx="68" cy="42" rx="7" ry="4.5" fill="#FFB3BA" opacity="0.75" />

          {/* ── Belly highlight ── */}
          <ellipse cx="50" cy="70" rx="15" ry="10" fill="white" opacity="0.18" />

          {/* ── Feet ── */}
          <path d="M39 95 L33 103 M39 95 L39 104 M39 95 L45 102" stroke="#FF8C00" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M61 95 L55 102 M61 95 L61 104 M61 95 L67 103" stroke="#FF8C00" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </svg>
      </motion.button>
    </div>
  )
}
