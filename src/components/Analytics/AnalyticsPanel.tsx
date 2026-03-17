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
  { id: 'wordcloud', label: 'Word Cloud', icon: '☁️' },
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
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl"
            style={{ maxHeight: '85vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-stone-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 pt-2">
              <h2 className="text-lg font-bold text-stone-800">Insights</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-5 mb-4">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="overflow-y-auto px-5 pb-10" style={{ maxHeight: 'calc(85vh - 140px)' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
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
