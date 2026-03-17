import { motion } from 'framer-motion'

interface Props {
  color: string
  onComplete: () => void
}

export function Droplet({ color, onComplete }: Props) {
  return (
    <motion.div
      className="fixed top-0 left-1/2 z-50 pointer-events-none"
      initial={{ y: 0, x: '-50%', opacity: 1, scale: 1 }}
      animate={{ y: '60vh', opacity: [1, 1, 0], scale: [1, 0.8, 0.4] }}
      transition={{ duration: 0.9, ease: 'easeIn' }}
      onAnimationComplete={onComplete}
    >
      <svg width="24" height="32" viewBox="0 0 24 32">
        <path
          d="M12 2 C12 2 2 14 2 20 A10 10 0 0 0 22 20 C22 14 12 2 12 2Z"
          fill={color}
          stroke="white"
          strokeWidth="1"
          opacity="0.9"
        />
        {/* Highlight */}
        <ellipse cx="8" cy="18" rx="2.5" ry="4" fill="white" opacity="0.3" transform="rotate(-20 8 18)" />
      </svg>
    </motion.div>
  )
}
