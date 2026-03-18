import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { MoodEntry } from '../../types/mood'
import { buildAllWordFrequency } from '../../utils/analytics'

interface Props {
  entries: MoodEntry[]
}

export function WordCloud({ entries }: Props) {
  const words = useMemo(() => buildAllWordFrequency(entries), [entries])

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-stone-400 gap-2">
        <span className="text-4xl">☁️</span>
        <p className="font-bold text-sm">No journal entries yet</p>
        <p className="text-xs">Words from your journals will grow here</p>
      </div>
    )
  }

  const maxScore = words[0]?.score ?? 1

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-2.5 justify-center items-center p-4 min-h-36">
      {words.slice(0, 60).map(({ word, score, color }, i) => {
        // Size based on intensity × frequency score
        const size = 0.65 + (score / maxScore) * 2.3
        const opacity = 0.55 + (score / maxScore) * 0.45
        return (
          <motion.span
            key={word}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.015 }}
            style={{
              fontSize: `${size}rem`,
              color,
              fontWeight: size > 1.8 ? 900 : size > 1.2 ? 700 : 500,
              lineHeight: 1.2,
              display: 'inline-block',
            }}
            className="hover:scale-110 transition-transform cursor-default select-none"
            title={`"${word}" — score ${score.toFixed(1)}`}
          >
            {word}
          </motion.span>
        )
      })}
    </div>
  )
}
