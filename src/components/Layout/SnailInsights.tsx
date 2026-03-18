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

export function SnailInsights({ onClick, hasEntries }: Props) {
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

      {/* Snail button */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        animate={{ y: [0, -2, 0] }}
        transition={{
          y: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' },
          scale: { type: 'spring', stiffness: 380, damping: 14 },
        }}
        className="relative"
        title="View insights"
        aria-label="Open insights panel"
      >
        <svg
          viewBox="0 0 100 72"
          width="64"
          height="46"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ── Body (slug shape) ── */}
          <ellipse cx="62" cy="52" rx="32" ry="14" fill="#F9E234" />

          {/* ── Head ── */}
          <ellipse cx="88" cy="46" rx="14" ry="12" fill="#F9E234" />

          {/* ── Shell ── */}
          <circle cx="44" cy="36" r="24" fill="#C87D3A" />
          <circle cx="44" cy="36" r="17" fill="#B86A28" />
          <circle cx="44" cy="36" r="11" fill="#C87D3A" />
          <circle cx="44" cy="36" r="6"  fill="#B86A28" />
          <circle cx="44" cy="36" r="2.5" fill="#8B4A18" />
          {/* Shell shine */}
          <ellipse cx="36" cy="26" rx="5" ry="7" fill="white" opacity="0.2" transform="rotate(-30 36 26)" />

          {/* ── Shell outline ── */}
          <circle cx="44" cy="36" r="24" fill="none" stroke="#9B5A1A" strokeWidth="1.5" />

          {/* ── Left eyestalk ── */}
          <path d="M80 40 Q76 28 74 22" stroke="#D4B820" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="73" cy="19" r="5" fill="#222" />
          <circle cx="72" cy="17.5" r="2" fill="white" />

          {/* ── Right eyestalk ── */}
          <path d="M86 38 Q84 26 83 20" stroke="#D4B820" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="82" cy="17" r="5" fill="#222" />
          <circle cx="81" cy="15.5" r="2" fill="white" />

          {/* ── Smile ── */}
          <path d="M84 50 Q88 55 93 50" fill="none" stroke="#B8A010" strokeWidth="2.5" strokeLinecap="round" />

          {/* ── Cheek blushes ── */}
          <ellipse cx="93" cy="50" rx="4" ry="2.5" fill="#FFB3BA" opacity="0.6" />

          {/* ── Belly highlight ── */}
          <ellipse cx="62" cy="48" rx="16" ry="5" fill="white" opacity="0.15" />

          {/* ── Foot / underside ── */}
          <ellipse cx="62" cy="62" rx="30" ry="5" fill="#D4C020" opacity="0.5" />
        </svg>
      </motion.button>
    </div>
  )
}
