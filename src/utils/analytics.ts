import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns'
import type { MoodEntry, MoodTag, DayMoodSummary, WeeklySummary } from '../types/mood'
import { MOOD_TAGS } from '../types/mood'
import { blendMoodColors, MOOD_COLORS } from './moodColors'

// ─── Stop words ───────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  'i','a','an','the','and','or','but','in','on','at','to','for','of','with',
  'my','me','is','was','it','its','this','that','so','just','about','have',
  'had','has','be','been','not','no','do','did','can','are','were','am','will',
  'would','could','should','like','feel','felt','really','very','pretty','quite',
  'lot','lots','bit','got','get','went','when','then','also','too','up',
  'down','out','from','by','as','if','he','she','they','we','you','your','our',
  'his','her','their','some','all','more','much','even','still','always',
  'never','time','day','today','yesterday','something','anything','everything',
])

// ─── Mood temperature (warm vs cool) for calendar gradient ───────────────────
export const WARM_MOODS = new Set<MoodTag>(['Joy','Anger','Excitement','Anxiety','Embarrassment','Pride'])
export const COOL_MOODS = new Set<MoodTag>(['Sadness','Fear','Ennui','Contentment','Nostalgia','Disgust','Gratitude'])

export function getMoodTemperatureColor(moods: { tag: MoodTag; intensity: number }[]): string {
  if (moods.length === 0) return '#c6d9b8'
  const blended = blendMoodColors(moods)
  // Check if dominant mood is warm or cool
  const dominant = moods.sort((a, b) => b.intensity - a.intensity)[0]
  if (WARM_MOODS.has(dominant.tag)) return blended
  if (COOL_MOODS.has(dominant.tag)) return blended
  return blended
}

// ─── Group by day ─────────────────────────────────────────────────────────────
export function groupByDay(entries: MoodEntry[]): Record<string, MoodEntry[]> {
  const map: Record<string, MoodEntry[]> = {}
  for (const entry of entries) {
    const day = format(new Date(entry.timestamp), 'yyyy-MM-dd')
    if (!map[day]) map[day] = []
    map[day].push(entry)
  }
  return map
}

export function buildDaySummaries(entries: MoodEntry[]): DayMoodSummary[] {
  const byDay = groupByDay(entries)
  return Object.entries(byDay).map(([date, dayEntries]) => {
    const allMoods = dayEntries.flatMap((e) => e.moods)
    const moodCounts: Partial<Record<MoodTag, number>> = {}
    let totalIntensity = 0
    for (const m of allMoods) {
      moodCounts[m.tag] = (moodCounts[m.tag] ?? 0) + 1
      totalIntensity += m.intensity
    }
    const dominantMood = (Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null) as MoodTag | null
    return {
      date,
      count: dayEntries.length,
      dominantMood,
      averageIntensity: allMoods.length > 0 ? totalIntensity / allMoods.length : 0,
    }
  })
}

// ─── Heatmap ─────────────────────────────────────────────────────────────────
export function buildHeatmapData(entries: MoodEntry[]): { date: string; count: number; color: string }[] {
  const byDay = groupByDay(entries)
  return Object.entries(byDay).map(([date, dayEntries]) => {
    const allMoods = dayEntries.flatMap((e) => e.moods)
    const color = blendMoodColors(allMoods)
    return { date, count: dayEntries.length, color }
  })
}

// ─── Word frequency with intensity weighting and mood color ──────────────────
export interface WordData {
  word: string
  count: number
  score: number  // count × avg_intensity — used for sizing
  color: string  // blended color of entries where this word appears
}

export function buildWordFrequency(entries: MoodEntry[]): WordData[] {
  // Map word → { count, totalIntensity, moodColorAccum }
  const wordMap = new Map<string, {
    count: number
    totalIntensity: number
    moodSamples: { tag: MoodTag; intensity: number }[]
  }>()

  for (const entry of entries) {
    const avgEntryIntensity = entry.moods.length > 0
      ? entry.moods.reduce((s, m) => s + m.intensity, 0) / entry.moods.length
      : 3
    const words = entry.journalText
      .toLowerCase()
      .replace(/[^a-z\s'-]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w))

    const seen = new Set<string>()
    for (const word of words) {
      if (seen.has(word)) continue
      seen.add(word)
      const existing = wordMap.get(word) ?? { count: 0, totalIntensity: 0, moodSamples: [] }
      existing.count += 1
      existing.totalIntensity += avgEntryIntensity
      // Keep up to 5 mood samples per word for color blending
      if (existing.moodSamples.length < 5) existing.moodSamples.push(...entry.moods)
      wordMap.set(word, existing)
    }
  }

  return Array.from(wordMap.entries())
    .map(([word, data]) => ({
      word,
      count: data.count,
      score: data.count * (data.totalIntensity / data.count),
      color: data.moodSamples.length > 0 ? blendMoodColors(data.moodSamples) : '#7CB87C',
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 80)
}

export function buildAllWordFrequency(entries: MoodEntry[]): WordData[] {
  return buildWordFrequency(entries)
}

// ─── Recommendations by mood ──────────────────────────────────────────────────
const MOOD_TIPS: Record<MoodTag, string> = {
  Anxiety:       'Try box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s.',
  Sadness:       'Reach out to someone you care about today.',
  Anger:         'A short walk or some physical movement can help release tension.',
  Fear:          'Write down what\'s worrying you — naming fears reduces their power.',
  Joy:           'Celebrate! Share your good mood with someone who could use it.',
  Disgust:       'Give yourself permission to step away from what\'s bothering you.',
  Ennui:         'Try one tiny new thing today — even a different route or playlist.',
  Embarrassment: 'Everyone has awkward moments. Be kind to yourself today.',
  Nostalgia:     'Look at old photos or reconnect with a comforting memory.',
  Pride:         'Acknowledge your accomplishment properly — you earned this.',
  Contentment:   'Savour this moment of peace. Mindful breathing can deepen it.',
  Excitement:    'Channel this energy into something creative or adventurous!',
  Gratitude:     'Write a quick thank-you note to someone who\'s made a difference.',
}

export function getRecommendations(topMoods: { tag: MoodTag; count: number }[]): string[] {
  return topMoods.slice(0, 3).map(({ tag }) => MOOD_TIPS[tag]).filter(Boolean)
}

// ─── Story mode narrative ─────────────────────────────────────────────────────
export function generateWeekStory(summary: WeeklySummary): string {
  if (summary.totalEntries === 0) return ''

  const top = summary.topMoods
  const topWords = summary.wordFrequency.slice(0, 3).map((w) => `"${w.word}"`).join(', ')
  const dayName = summary.mostActiveDay
    ? format(new Date(summary.mostActiveDay + 'T12:00:00'), 'EEEE')
    : null

  let story = ''

  if (top.length === 1) {
    story += `This week was largely defined by a sense of ${top[0].tag.toLowerCase()}. `
  } else if (top.length >= 2) {
    story += `This week, ${top[0].tag.toLowerCase()} was your most felt emotion, with notable moments of ${top[1].tag.toLowerCase()}. `
    if (top[2]) story += `${top[2].tag} also made an appearance. `
  }

  if (summary.totalEntries === 1) {
    story += `You checked in once. `
  } else {
    story += `You journaled ${summary.totalEntries} time${summary.totalEntries > 1 ? 's' : ''}. `
  }

  if (dayName) story += `${dayName} was your most reflective day. `

  if (topWords) story += `Your journals frequently touched on ${topWords}.`

  return story.trim()
}

// ─── Weekly summary ───────────────────────────────────────────────────────────
export function buildWeeklySummary(entries: MoodEntry[], referenceDate: Date = new Date()): WeeklySummary {
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 })

  const weekEntries = entries.filter((e) => {
    const d = new Date(e.timestamp)
    return d >= weekStart && d <= weekEnd
  })

  const moodBreakdown = Object.fromEntries(MOOD_TAGS.map((t) => [t, 0])) as Record<MoodTag, number>
  let totalIntensity = 0
  let totalMoodRatings = 0
  const byDay: Record<string, number> = {}

  for (const entry of weekEntries) {
    const day = format(new Date(entry.timestamp), 'yyyy-MM-dd')
    byDay[day] = (byDay[day] ?? 0) + 1
    for (const mood of entry.moods) {
      moodBreakdown[mood.tag] += 1
      totalIntensity += mood.intensity
      totalMoodRatings++
    }
  }

  const topMoods = (Object.entries(moodBreakdown) as [MoodTag, number][])
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }))

  const mostActiveDay = Object.entries(byDay).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null
  const wordFrequency = buildWordFrequency(weekEntries)

  return {
    weekStart: format(weekStart, 'yyyy-MM-dd'),
    weekEnd: format(weekEnd, 'yyyy-MM-dd'),
    totalEntries: weekEntries.length,
    moodBreakdown,
    topMoods,
    averageIntensity: totalMoodRatings > 0 ? totalIntensity / totalMoodRatings : 0,
    mostActiveDay,
    wordFrequency,
  }
}

// silence unused
const _subWeeks = subWeeks
const _MOOD_COLORS = MOOD_COLORS
void _subWeeks; void _MOOD_COLORS
