import { motion } from 'framer-motion'
import { format } from 'date-fns'
import type { MoodEntry } from '../../types/mood'
import { blendMoodColors, MOOD_COLORS, lightenColor } from '../../utils/moodColors'
import { MOOD_EMOJIS } from '../../utils/moodColors'

interface Props {
  entry: MoodEntry
  index: number
  isNew?: boolean
  isSelected: boolean
  onSelect: (id: string | null) => void
}

export function SoilLayer({ entry, index, isNew = false, isSelected, onSelect }: Props) {
  const baseColor = blendMoodColors(entry.moods)
  const lightColor = lightenColor(baseColor, 0.25)
  const dominantMood = entry.moods.sort((a, b) => b.intensity - a.intensity)[0]

  return (
    <div className="relative">
      {/* Main layer */}
      <motion.div
        initial={isNew ? { scaleY: 0, opacity: 0 } : false}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          background: `linear-gradient(180deg, ${lightColor} 0%, ${baseColor} 60%, ${blendMoodColors(entry.moods.map(m => ({ ...m, intensity: m.intensity * 0.7 })))} 100%)`,
          originY: 0,
        }}
        className="w-full h-10 cursor-pointer hover:brightness-110 transition-all relative overflow-hidden"
        onClick={() => onSelect(isSelected ? null : entry.id)}
        title={`${format(new Date(entry.timestamp), 'MMM d, yyyy')} — ${dominantMood?.tag ?? ''}`}
      >
        {/* Texture lines for depth */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 8px,
              rgba(0,0,0,0.3) 8px,
              rgba(0,0,0,0.3) 9px
            )`,
          }}
        />
        {/* Index marker on far left */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs opacity-40 font-mono text-black">
          {index + 1}
        </div>
        {/* Dominant mood emoji */}
        {dominantMood && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
            {MOOD_EMOJIS[dominantMood.tag]}
          </div>
        )}
        {/* Date faint */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-xs opacity-30 text-black whitespace-nowrap font-medium">
          {format(new Date(entry.timestamp), 'MMM d')}
        </div>
      </motion.div>

      {/* Expanded detail panel */}
      {isSelected && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-stone-900/90 backdrop-blur-sm text-white text-sm p-4 border-l-4"
          style={{ borderColor: baseColor }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-stone-200">
              {format(new Date(entry.timestamp), 'EEEE, MMMM d yyyy — h:mm a')}
            </span>
            <button
              onClick={() => onSelect(null)}
              className="text-stone-400 hover:text-white text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* Moods */}
          <div className="flex flex-wrap gap-2 mb-3">
            {entry.moods.map((m) => (
              <span
                key={m.tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-black"
                style={{ backgroundColor: MOOD_COLORS[m.tag] }}
              >
                {MOOD_EMOJIS[m.tag]} {m.tag}
                <span className="opacity-60">· {m.intensity}/5</span>
              </span>
            ))}
          </div>

          {/* Journal text */}
          {entry.journalText && (
            <p className="text-stone-300 text-sm leading-relaxed italic">
              "{entry.journalText}"
            </p>
          )}
          {!entry.journalText && (
            <p className="text-stone-500 text-xs italic">No journal note.</p>
          )}
        </motion.div>
      )}
    </div>
  )
}
