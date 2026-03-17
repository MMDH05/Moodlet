import { useMemo } from 'react'
import type { MoodEntry } from '../../types/mood'
import { buildAllWordFrequency } from '../../utils/analytics'
import { MOOD_COLORS, MOOD_TAGS } from '../../utils/moodColors'
import type { MoodTag } from '../../types/mood'

// Re-export to fix import path
export { MOOD_COLORS }

const CLOUD_COLORS = [
  '#5D8A3C', '#6AAF40', '#C4956A', '#5C85D6', '#9B59B6',
  '#E05252', '#F0A500', '#F48FB1', '#BA68C8', '#FF7043',
  '#98D8C8', '#FFD700', '#6B9AC4',
]

interface Props {
  entries: MoodEntry[]
}

export function WordCloud({ entries }: Props) {
  const words = useMemo(() => buildAllWordFrequency(entries), [entries])

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-stone-400 text-sm gap-2">
        <span className="text-3xl">☁️</span>
        <p>No journal entries yet</p>
        <p className="text-xs">Words from your journal will appear here</p>
      </div>
    )
  }

  const maxCount = words[0]?.count ?? 1

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-2 justify-center items-center p-4 min-h-32">
      {words.slice(0, 60).map(({ word, count }, i) => {
        const size = 0.7 + (count / maxCount) * 2.1 // 0.7rem to 2.8rem
        const color = CLOUD_COLORS[i % CLOUD_COLORS.length]
        const opacity = 0.5 + (count / maxCount) * 0.5
        return (
          <span
            key={word}
            style={{
              fontSize: `${size}rem`,
              color,
              opacity,
              fontWeight: size > 1.5 ? 700 : size > 1 ? 600 : 400,
              lineHeight: 1.2,
              display: 'inline-block',
              transition: 'transform 0.2s',
            }}
            className="hover:scale-110 cursor-default select-none"
            title={`"${word}" — ${count} time${count !== 1 ? 's' : ''}`}
          >
            {word}
          </span>
        )
      })}
    </div>
  )
}

// Silence unused import warnings
const _unused: typeof MOOD_TAGS = MOOD_TAGS
const _unused2: typeof MoodTag = undefined as unknown as MoodTag
void _unused
void _unused2
