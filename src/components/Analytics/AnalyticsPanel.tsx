import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MoodEntry } from '../../types/mood'
import { MoodCalendar } from './MoodCalendar'
import { WordCloud } from './WordCloud'
import { WeeklyReport } from './WeeklyReport'

type Tab = 'calendar' | 'wordcloud' | 'weekly'

interface Props {
  entries: MoodEntry[]
  isOpen: boolean
  onClose: () => void
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'calendar',  label: 'Calendar',  icon: '📅' },
  { id: 'wordcloud', label: 'Words',      icon: '☁️' },
  { id: 'weekly',    label: 'Weekly',     icon: '📊' },
]

export function AnalyticsPanel({ entries, isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('calendar')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 bg-gradient-to-b from-white to-emerald-50/50 rounded-t-3xl shadow-2xl max-w-lg mx-auto flex flex-col"
            style={{ height: '88vh', maxHeight: '88vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 pt-2">
              <h2 className="text-xl font-black text-emerald-800">🔍 Insights</h2>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 font-bold text-lg transition-colors"
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 px-5 mb-4">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-sm font-black transition-all ${
                    activeTab === tab.id
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-300/50 scale-105'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                >
                  {activeTab === 'calendar'  && <MoodCalendar entries={entries} />}
                  {activeTab === 'wordcloud' && <WordCloud entries={entries} />}
                  {activeTab === 'weekly'    && <WeeklyReport entries={entries} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
