import { motion } from 'framer-motion'
import { format } from 'date-fns'
import type { MoodEntry } from '../../types/mood'
import { getSoilColor, MOOD_COLORS, MOOD_EMOJIS, lightenColor, mixColors } from '../../utils/moodColors'

interface Props {
  entry: MoodEntry
  index: number
  isNew?: boolean
  isSelected: boolean
  onSelect: (id: string | null) => void
}

export function SoilLayer({ entry, index, isNew = false, isSelected, onSelect }: Props) {
  const baseColor = getSoilColor(entry.moods)
  const lightColor = lightenColor(baseColor, 0.18)
  const darkColor = mixColors(baseColor, '#000000', 0.15)
  const dominantMood = [...entry.moods].sort((a, b) => b.intensity - a.intensity)[0]

  return (
    <div className="relative w-full">
      <motion.div
        initial={isNew ? { scaleY: 0, opacity: 0 } : false}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          background: `linear-gradient(180deg, ${lightColor} 0%, ${baseColor} 50%, ${darkColor} 100%)`,
          transformOrigin: 'top',
        }}
        className="w-full h-12 cursor-pointer hover:brightness-110 active:brightness-95 transition-all relative overflow-hidden select-none"
        onClick={() => onSelect(isSelected ? null : entry.id)}
      >
        {/* Organic texture — subtle horizontal grain */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(0,0,0,0.4) 3px,
              rgba(0,0,0,0.4) 4px
            )`,
          }}
        />

        {/* Layer index */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold opacity-25 text-black font-mono">
          {index + 1}
        </span>

        {/* Date */}
        <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-xs font-semibold opacity-30 text-black whitespace-nowrap">
          {format(new Date(entry.timestamp), 'MMM d')}
        </span>

        {/* Dominant mood emoji */}
        {dominantMood && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base leading-none">
            {MOOD_EMOJIS[dominantMood.tag]}
          </span>
        )}
      </motion.div>

      {/* Expanded detail panel */}
      {isSelected && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden bg-stone-900/95 text-white text-sm"
          style={{ borderLeft: `4px solid ${baseColor}` }}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <span className="font-semibold text-stone-200 text-xs leading-snug">
                {format(new Date(entry.timestamp), 'EEEE, MMMM d yyyy')}
                <br />
                <span className="text-stone-400 font-normal">{format(new Date(entry.timestamp), 'h:mm a')}</span>
              </span>
              <button
                onClick={() => onSelect(null)}
                className="text-stone-400 hover:text-white text-xl leading-none ml-2 flex-shrink-0"
              >
                ×
              </button>
            </div>

            {/* Moods */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {entry.moods.map((m) => (
                <span
                  key={m.tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-black"
                  style={{ backgroundColor: MOOD_COLORS[m.tag] }}
                >
                  {MOOD_EMOJIS[m.tag]} {m.tag}
                  <span className="opacity-60 font-normal">·{m.intensity}/5</span>
                </span>
              ))}
            </div>

            {/* Journal text */}
            {entry.journalText ? (
              <p className="text-stone-300 text-sm leading-relaxed italic">"{entry.journalText}"</p>
            ) : (
              <p className="text-stone-500 text-xs italic">No journal note.</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
