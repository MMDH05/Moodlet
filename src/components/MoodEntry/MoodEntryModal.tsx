import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MOOD_TAGS, type MoodTag, type MoodRating } from '../../types/mood'
import { MOOD_COLORS, MOOD_EMOJIS } from '../../utils/moodColors'
import type { AddEntryPayload } from '../../hooks/useMoodEntries'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: AddEntryPayload) => void
}

const INTENSITY_LABELS: Record<number, string> = {
  1: 'Barely',
  2: 'Slightly',
  3: 'Moderately',
  4: 'Strongly',
  5: 'Intensely',
}

export function MoodEntryModal({ isOpen, onClose, onSubmit }: Props) {
  const [journalText, setJournalText] = useState('')
  const [selectedMoods, setSelectedMoods] = useState<Map<MoodTag, number>>(new Map())
  const [error, setError] = useState<string | null>(null)

  function toggleMood(tag: MoodTag) {
    setSelectedMoods((prev) => {
      const next = new Map(prev)
      if (next.has(tag)) {
        next.delete(tag)
      } else {
        next.set(tag, 3) // default intensity 3
      }
      return next
    })
  }

  function setIntensity(tag: MoodTag, value: number) {
    setSelectedMoods((prev) => {
      const next = new Map(prev)
      next.set(tag, value)
      return next
    })
  }

  function handleSubmit() {
    if (selectedMoods.size === 0) {
      setError('Please select at least one mood.')
      return
    }
    setError(null)
    const moods: MoodRating[] = Array.from(selectedMoods.entries()).map(([tag, intensity]) => ({
      tag,
      intensity,
    }))
    onSubmit({ journalText, moods })
    // Reset
    setJournalText('')
    setSelectedMoods(new Map())
    onClose()
  }

  function handleClose() {
    setJournalText('')
    setSelectedMoods(new Map())
    setError(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-w-lg mx-auto overflow-hidden"
            style={{ maxHeight: '90vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-stone-300 rounded-full" />
            </div>

            <div className="overflow-y-auto px-5 pb-8" style={{ maxHeight: 'calc(90vh - 24px)' }}>
              {/* Header */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-800">How are you feeling?</h2>
                  <p className="text-sm text-stone-500 mt-0.5">Water your plant with today's mood</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Journal text */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Journal (optional)
                </label>
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="What's on your mind today?"
                  rows={3}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-stone-400"
                />
              </div>

              {/* Mood tags */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Mood tags <span className="text-stone-400 font-normal">(select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOOD_TAGS.map((tag) => {
                    const isSelected = selectedMoods.has(tag)
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleMood(tag)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          isSelected
                            ? 'text-white shadow-md scale-105'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                        style={isSelected ? { backgroundColor: MOOD_COLORS[tag] } : {}}
                      >
                        <span>{MOOD_EMOJIS[tag]}</span>
                        <span>{tag}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Intensity sliders for selected moods */}
              <AnimatePresence>
                {selectedMoods.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-5 overflow-hidden"
                  >
                    <label className="block text-sm font-medium text-stone-700 mb-3">
                      Intensity
                    </label>
                    <div className="space-y-4">
                      {Array.from(selectedMoods.entries()).map(([tag, intensity]) => (
                        <div key={tag}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-stone-700 flex items-center gap-1.5">
                              <span>{MOOD_EMOJIS[tag]}</span> {tag}
                            </span>
                            <span
                              className="text-xs font-medium px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: MOOD_COLORS[tag] + '30', color: MOOD_COLORS[tag] }}
                            >
                              {INTENSITY_LABELS[intensity]}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-400">1</span>
                            <input
                              type="range"
                              min={1}
                              max={5}
                              step={1}
                              value={intensity}
                              onChange={(e) => setIntensity(tag, Number(e.target.value))}
                              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                              style={{
                                accentColor: MOOD_COLORS[tag],
                                background: `linear-gradient(to right, ${MOOD_COLORS[tag]} ${(intensity - 1) * 25}%, #e7e5e4 ${(intensity - 1) * 25}%)`,
                              }}
                            />
                            <span className="text-xs text-stone-400">5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500 mb-3">{error}</p>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-700 active:scale-95 text-white font-semibold text-base transition-all shadow-lg shadow-green-600/30"
              >
                💧 Water the Plant
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
