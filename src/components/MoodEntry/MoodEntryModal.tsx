import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MOOD_TAGS, type MoodTag, type MoodRating } from '../../types/mood'
import { MOOD_COLORS, MOOD_EMOJIS } from '../../utils/moodColors'
import type { AddEntryPayload } from '../../hooks/useMoodEntries'
import { analyzeSentiment, type SentimentResult } from '../../utils/sentimentAnalysis'

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
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!journalText.trim()) { setSentiment(null); return }
    debounceRef.current = setTimeout(() => {
      setSentiment(analyzeSentiment(journalText))
    }, 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [journalText])

  function toggleMood(tag: MoodTag) {
    setSelectedMoods((prev) => {
      const next = new Map(prev)
      if (next.has(tag)) next.delete(tag)
      else next.set(tag, 3)
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
      setError('Pick at least one mood 🌱')
      return
    }
    setError(null)
    const moods: MoodRating[] = Array.from(selectedMoods.entries()).map(([tag, intensity]) => ({ tag, intensity }))
    onSubmit({ journalText, moods })
    setJournalText('')
    setSelectedMoods(new Map())
    onClose()
  }

  function handleClose() {
    setJournalText('')
    setSelectedMoods(new Map())
    setError(null)
    setSentiment(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 bg-gradient-to-b from-white to-emerald-50/60 rounded-t-3xl shadow-2xl max-w-lg mx-auto overflow-hidden"
            style={{ maxHeight: '92vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
            </div>

            <div className="overflow-y-auto px-5 pb-10" style={{ maxHeight: 'calc(92vh - 28px)' }}>
              {/* Header */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <h2 className="text-2xl font-black text-emerald-800">How are you feeling?</h2>
                  <p className="text-sm font-semibold text-emerald-600 mt-0.5">Water your plant with today's mood 💧</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 font-bold text-lg transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Journal */}
              <div className="mb-5">
                <label className="block text-sm font-bold text-emerald-800 mb-2">
                  Journal <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="What's on your mind today? ✍️"
                  rows={3}
                  className="w-full rounded-2xl border-2 border-emerald-100 bg-white px-4 py-3 text-sm text-stone-800 resize-none focus:outline-none focus:border-emerald-400 placeholder:text-stone-300 font-medium"
                />
              </div>

              {/* Sentiment suggestions */}
              <AnimatePresence>
                {sentiment && sentiment.suggestedMoods.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">
                          {sentiment.label === 'positive' ? '😊' : sentiment.label === 'negative' ? '😔' : '😐'}
                        </span>
                        <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                          Detected from your journal
                        </span>
                        <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: sentiment.label === 'positive' ? '#d1fae5' : sentiment.label === 'negative' ? '#fee2e2' : '#f3f4f6',
                            color: sentiment.label === 'positive' ? '#065f46' : sentiment.label === 'negative' ? '#991b1b' : '#6b7280',
                          }}
                        >
                          {sentiment.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {sentiment.suggestedMoods.map((tag) => {
                          const isSelected = selectedMoods.has(tag)
                          return (
                            <button
                              key={tag}
                              onClick={() => toggleMood(tag)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                                isSelected ? 'text-white opacity-60' : 'text-white'
                              }`}
                              style={{ backgroundColor: MOOD_COLORS[tag] }}
                            >
                              <span>{MOOD_EMOJIS[tag]}</span>
                              <span>{tag}</span>
                              {!isSelected && <span className="ml-0.5 opacity-70">+ add</span>}
                            </button>
                          )
                        })}
                      </div>
                      {(sentiment.positiveWords.length > 0 || sentiment.negativeWords.length > 0) && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {sentiment.positiveWords.slice(0, 4).map((w) => (
                            <span key={w} className="text-xs px-1.5 py-0.5 rounded-lg bg-green-100 text-green-700 font-semibold">{w}</span>
                          ))}
                          {sentiment.negativeWords.slice(0, 4).map((w) => (
                            <span key={w} className="text-xs px-1.5 py-0.5 rounded-lg bg-red-100 text-red-700 font-semibold">{w}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mood tags */}
              <div className="mb-5">
                <label className="block text-sm font-bold text-emerald-800 mb-2">
                  Moods <span className="text-stone-400 font-normal">(select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOOD_TAGS.map((tag) => {
                    const isSelected = selectedMoods.has(tag)
                    return (
                      <motion.button
                        key={tag}
                        onClick={() => toggleMood(tag)}
                        whileTap={{ scale: 0.9 }}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-bold transition-all ${
                          isSelected
                            ? 'text-white shadow-lg scale-105'
                            : 'bg-white text-stone-600 shadow-sm hover:scale-105'
                        }`}
                        style={isSelected ? { backgroundColor: MOOD_COLORS[tag], boxShadow: `0 4px 12px ${MOOD_COLORS[tag]}60` } : {}}
                      >
                        <span>{MOOD_EMOJIS[tag]}</span>
                        <span>{tag}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Intensity sliders */}
              <AnimatePresence>
                {selectedMoods.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-5 overflow-hidden"
                  >
                    <label className="block text-sm font-bold text-emerald-800 mb-3">Intensity</label>
                    <div className="space-y-4">
                      {Array.from(selectedMoods.entries()).map(([tag, intensity]) => (
                        <div key={tag} className="bg-white rounded-2xl p-3 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-stone-700 flex items-center gap-1.5">
                              <span>{MOOD_EMOJIS[tag]}</span> {tag}
                            </span>
                            <span
                              className="text-xs font-bold px-2.5 py-1 rounded-full"
                              style={{ backgroundColor: MOOD_COLORS[tag] + '25', color: MOOD_COLORS[tag] }}
                            >
                              {INTENSITY_LABELS[intensity]}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-400 font-bold">1</span>
                            <input
                              type="range"
                              min={1}
                              max={5}
                              step={1}
                              value={intensity}
                              onChange={(e) => setIntensity(tag, Number(e.target.value))}
                              className="flex-1 h-2.5 rounded-full appearance-none cursor-pointer"
                              style={{
                                accentColor: MOOD_COLORS[tag],
                                background: `linear-gradient(to right, ${MOOD_COLORS[tag]} ${(intensity - 1) * 25}%, #f0ede8 ${(intensity - 1) * 25}%)`,
                              }}
                            />
                            <span className="text-xs text-stone-400 font-bold">5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              {error && (
                <p className="text-sm font-bold text-red-500 mb-3 text-center">{error}</p>
              )}

              {/* Submit */}
              <motion.button
                onClick={handleSubmit}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base transition-colors shadow-xl shadow-emerald-400/40"
              >
                💧 Water the Plant
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
