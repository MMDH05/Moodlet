// ─── Mood Tags ────────────────────────────────────────────────────────────────

export const MOOD_TAGS = [
  'Joy',
  'Sadness',
  'Anger',
  'Fear',
  'Disgust',
  'Anxiety',
  'Ennui',
  'Embarrassment',
  'Nostalgia',
  'Pride',
  'Contentment',
  'Excitement',
  'Gratitude',
] as const

export type MoodTag = (typeof MOOD_TAGS)[number]

// ─── Mood Entry ───────────────────────────────────────────────────────────────

export interface MoodRating {
  tag: MoodTag
  intensity: number // 1–5
}

export interface MoodEntry {
  id: string
  timestamp: number // Unix ms
  journalText: string
  moods: MoodRating[] // at least one mood required
}

// ─── Plant Stages ─────────────────────────────────────────────────────────────

export type PlantStage =
  | 'seedling'
  | 'small-sapling'
  | 'normal-sapling'
  | 'plant'
  | 'tree'
  | 'tree-with-fruit'

export interface PlantState {
  stage: PlantStage
  fruitCount: number        // 0–6, only relevant for 'tree-with-fruit'
  fallingFruitIndex: number | null // index of fruit currently animating off
  totalEntries: number
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface DayMoodSummary {
  date: string  // YYYY-MM-DD
  count: number
  dominantMood: MoodTag | null
  averageIntensity: number
}

export interface WeeklySummary {
  weekStart: string // YYYY-MM-DD (Monday)
  weekEnd: string   // YYYY-MM-DD (Sunday)
  totalEntries: number
  moodBreakdown: Record<MoodTag, number>
  topMoods: { tag: MoodTag; count: number }[]
  averageIntensity: number
  mostActiveDay: string | null
  wordFrequency: { word: string; count: number }[]
}
