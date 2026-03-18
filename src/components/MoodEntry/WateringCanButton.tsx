import { motion } from 'framer-motion'

interface Props {
  onClick: () => void
}

export function WateringCanButton({ onClick }: Props) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ rotate: -14, scale: 1.08 }}
      whileTap={{ rotate: -22, scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 380, damping: 14 }}
      className="relative drop-shadow-xl"
      title="Water your plant — log a mood"
      aria-label="Log a mood entry"
    >
      <svg
        viewBox="0 0 110 100"
        width="72"
        height="72"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: 'rotate(180deg)' }}
      >
        {/* ── Handle (right arc) ── */}
        <path
          d="M82 22 Q108 22 108 46 Q108 70 82 70"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* ── Body ── */}
        <rect x="28" y="18" width="58" height="52" rx="12" fill="#43A047" />

        {/* ── Lid rim ── */}
        <rect x="24" y="12" width="66" height="13" rx="6.5" fill="#388E3C" />

        {/* ── Body highlight ── */}
        <rect x="33" y="22" width="12" height="28" rx="6" fill="white" opacity="0.18" />

        {/* ── Spout (from lower-left of body, curving down-left) ── */}
        <path
          d="M36 58 Q18 64 10 80"
          stroke="#43A047"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />

        {/* ── Rose (sprinkler disc) ── */}
        <ellipse cx="9" cy="84" rx="11" ry="8" fill="#2E7D32" />
        {/* Holes */}
        <circle cx="5"  cy="82" r="1.6" fill="#1B5E20" />
        <circle cx="10" cy="81" r="1.6" fill="#1B5E20" />
        <circle cx="14" cy="84" r="1.6" fill="#1B5E20" />
        <circle cx="5"  cy="86" r="1.6" fill="#1B5E20" />
        <circle cx="10" cy="87" r="1.6" fill="#1B5E20" />

        {/* ── Droplets coming from rose ── */}
        <motion.g
          animate={{ opacity: [0, 1, 0], y: [0, -6, -12] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeIn', repeatDelay: 0.6 }}
        >
          <circle cx="4"  cy="93" r="2" fill="#64B5F6" opacity="0.9" />
          <circle cx="9"  cy="95" r="1.5" fill="#64B5F6" opacity="0.7" />
          <circle cx="14" cy="92" r="2" fill="#64B5F6" opacity="0.8" />
        </motion.g>
      </svg>

      {/* Tap label */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black text-emerald-700 opacity-70">
        water me
      </div>
    </motion.button>
  )
}
