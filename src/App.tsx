import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useMoodEntries } from './hooks/useMoodEntries'
import { usePlantState } from './hooks/usePlantState'
import { Plant } from './components/Plant/Plant'
import { Pot } from './components/Pot/Pot'
import { Droplet } from './components/Pot/Droplet'
import { WateringCanButton } from './components/MoodEntry/WateringCanButton'
import { MoodEntryModal } from './components/MoodEntry/MoodEntryModal'
import { AnalyticsPanel } from './components/Analytics/AnalyticsPanel'
import { ProgressBar } from './components/Layout/ProgressBar'
import { ChickenInsights } from './components/Layout/SnailInsights'
import { blendMoodColors } from './utils/moodColors'
import type { AddEntryPayload } from './hooks/useMoodEntries'
import type { MoodRating } from './types/mood'

interface DropletState {
  color: string
  key: number
}

export default function App() {
  const { entries, addEntry, totalCount } = useMoodEntries()
  const plantState = usePlantState(totalCount)

  const [isEntryModalOpen, setEntryModalOpen] = useState(false)
  const [isAnalyticsOpen, setAnalyticsOpen] = useState(false)
  const [newestEntryId, setNewestEntryId] = useState<string | null>(null)
  const [droplet, setDroplet] = useState<DropletState | null>(null)
  const [dropletKey, setDropletKey] = useState(0)

  const handleSubmitEntry = useCallback((payload: AddEntryPayload) => {
    const color = blendMoodColors(payload.moods as MoodRating[])
    const newEntry = addEntry(payload)
    setNewestEntryId(newEntry.id)
    setDropletKey((k) => k + 1)
    setDroplet({ color, key: dropletKey + 1 })
  }, [addEntry, dropletKey])

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #cde8ff 0%, #e4f5e0 50%, #c5e3c0 60%)' }}
    >
      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center px-5 pt-4 pb-1 z-20">
        <div>
          <h1 className="text-2xl font-black text-emerald-800 tracking-tight leading-none">
            🌱 Moodlet
          </h1>
          <p className="text-xs font-semibold text-emerald-600 mt-0.5">your emotional garden</p>
        </div>
      </header>

      {/* ── Progress bar ─────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-5 pb-2">
        <ProgressBar totalEntries={totalCount} stage={plantState.stage} />
      </div>

      {/* ── Sky / Plant area + Grass line ────────────────────────── */}
      {/* This wrapper is relative so we can absolutely position the watering can */}
      <div className="flex-shrink-0 relative" style={{ height: '30vh' }}>

        {/* Plant — centered, sitting above ground */}
        <div className="absolute inset-0 flex items-end justify-center pb-5">
          <div className="w-36 sm:w-44">
            <Plant plantState={plantState} />
          </div>
        </div>

        {/* Chicken insights — bottom-left, sitting ON the grass line */}
        <div className="absolute bottom-0 left-5 translate-y-1/2 z-20">
          <ChickenInsights
            onClick={() => setAnalyticsOpen(true)}
            hasEntries={totalCount > 0}
          />
        </div>

        {/* Watering can — bottom-right, sitting ON the grass line */}
        <div className="absolute bottom-0 right-5 translate-y-1/2 z-20 pb-1">
          <WateringCanButton onClick={() => setEntryModalOpen(true)} />
        </div>

        {/* Wavy grass line — at the very bottom of sky area */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 400 22"
            className="w-full"
            style={{ height: 22, display: 'block' }}
            preserveAspectRatio="none"
          >
            <path
              d="M0,10 C20,2 40,18 60,10 C80,2 100,18 120,10 C140,2 160,18 180,10 C200,2 220,18 240,10 C260,2 280,18 300,10 C320,2 340,18 360,10 C380,2 400,18 400,10 L400,22 L0,22 Z"
              fill="#4a7a2a"
            />
            <path
              d="M0,14 C20,7 40,21 60,14 C80,7 100,21 120,14 C140,7 160,21 180,14 C200,7 220,21 240,14 C260,7 280,21 300,14 C320,7 340,21 360,14 C380,7 400,21 400,14 L400,22 L0,22 Z"
              fill="#3d6522"
              opacity="0.55"
            />
          </svg>
        </div>
      </div>

      {/* ── Soil — full-width ground, fills remaining space ──────── */}
      <div
        className="flex-1 overflow-hidden relative"
        style={{ background: 'linear-gradient(180deg, #6b4226 0%, #502e18 100%)' }}
      >
        {totalCount > 0 && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-stone-500/40 pointer-events-none z-10 whitespace-nowrap tracking-wide uppercase">
            {totalCount} {totalCount === 1 ? 'memory' : 'memories'} in the soil
          </div>
        )}
        <Pot entries={entries} newestEntryId={newestEntryId} />
      </div>

      {/* ── Droplet animation ─────────────────────────────────────── */}
      <AnimatePresence>
        {droplet && (
          <Droplet
            key={droplet.key}
            color={droplet.color}
            onComplete={() => setDroplet(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Modals ────────────────────────────────────────────────── */}
      <MoodEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setEntryModalOpen(false)}
        onSubmit={handleSubmitEntry}
      />

      <AnalyticsPanel
        entries={entries}
        isOpen={isAnalyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
      />
    </div>
  )
}
