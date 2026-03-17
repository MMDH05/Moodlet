import { motion } from 'framer-motion'

interface Props {
  onClick: () => void
}

export function WateringCanButton({ onClick }: Props) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08, rotate: -8 }}
      whileTap={{ scale: 0.92, rotate: -15 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold shadow-lg shadow-green-600/40 transition-colors"
      title="Log a mood entry"
    >
      <span className="text-xl" role="img" aria-label="Watering can">🪣</span>
      <span className="text-sm">Water</span>
    </motion.button>
  )
}
