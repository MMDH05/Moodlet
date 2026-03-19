import Sentiment from 'sentiment'
import { SentimentIntensityAnalyzer } from 'vader-sentiment'
import winkSentiment from 'wink-sentiment'
import type { MoodTag } from '../types/mood'

// ─── Keyword hints per mood ───────────────────────────────────────────────────
const MOOD_KEYWORDS: Record<MoodTag, string[]> = {
  Joy:           ['happy', 'joy', 'wonderful', 'great', 'amazing', 'love', 'smile', 'laugh', 'delightful', 'cheerful', 'elated', 'bliss', 'fantastic'],
  Sadness:       ['sad', 'cry', 'tears', 'miss', 'lonely', 'heartbreak', 'depressed', 'grief', 'sorrow', 'unhappy', 'miserable', 'hopeless', 'down'],
  Anger:         ['angry', 'frustrated', 'furious', 'rage', 'annoyed', 'irritated', 'mad', 'hate', 'livid', 'outraged', 'bitter', 'resentful'],
  Fear:          ['scared', 'afraid', 'terrified', 'worried', 'nervous', 'dread', 'panic', 'fear', 'horror', 'frightened', 'uneasy', 'paranoid'],
  Disgust:       ['disgusting', 'gross', 'repulsed', 'nauseating', 'horrible', 'awful', 'revolting', 'sick', 'yuck', 'appalled'],
  Anxiety:       ['anxious', 'stressed', 'overwhelmed', 'tense', 'restless', 'worry', 'apprehensive', 'unsettled', 'jittery', 'on edge'],
  Ennui:         ['bored', 'boredom', 'dull', 'tedious', 'monotonous', 'empty', 'meaningless', 'pointless', 'flat', 'listless', 'apathetic'],
  Embarrassment: ['embarrassed', 'ashamed', 'humiliated', 'awkward', 'cringe', 'mortified', 'foolish', 'stupid mistake'],
  Nostalgia:     ['remember', 'memories', 'childhood', 'miss', 'used to', 'back then', 'past', 'old days', 'when i was', 'long ago'],
  Pride:         ['proud', 'accomplished', 'achievement', 'succeeded', 'earned', 'confident', 'nailed', 'crushed it', 'finally did'],
  Contentment:   ['content', 'satisfied', 'peaceful', 'calm', 'serene', 'comfortable', 'relaxed', 'settled', 'at ease', 'cozy'],
  Excitement:    ['excited', 'thrilled', 'pumped', 'eager', 'energized', 'enthusiastic', 'electric', 'stoked', 'fired up', 'can\'t wait'],
  Gratitude:     ['grateful', 'thankful', 'appreciate', 'blessed', 'thanks', 'lucky', 'fortunate', 'recognition'],
}

// Singleton instance (avoid re-creating on every call)
const afinnAnalyzer = new Sentiment()

export interface SentimentResult {
  /** Normalized composite score: -1 (very negative) to 1 (very positive) */
  score: number
  label: 'positive' | 'negative' | 'neutral'
  /** Up to 3 mood tags inferred from keywords + overall sentiment */
  suggestedMoods: MoodTag[]
  positiveWords: string[]
  negativeWords: string[]
  /** Individual library scores, each normalized to -1..1 */
  breakdown: { afinn: number; vader: number; wink: number }
}

export function analyzeSentiment(text: string): SentimentResult {
  const empty: SentimentResult = {
    score: 0, label: 'neutral', suggestedMoods: [],
    positiveWords: [], negativeWords: [],
    breakdown: { afinn: 0, vader: 0, wink: 0 },
  }
  if (!text.trim()) return empty

  // ── Run all three analyzers ───────────────────────────────────────────────
  const afinn = afinnAnalyzer.analyze(text)
  const vader = SentimentIntensityAnalyzer.polarity_scores(text)
  const wink  = winkSentiment(text)

  // Normalize to -1..1
  const afinnNorm = Math.max(-1, Math.min(1, afinn.comparative / 5))
  const vaderNorm = vader.compound                                       // already -1..1
  const winkNorm  = Math.max(-1, Math.min(1, wink.normalizedScore / 5))

  const score = (afinnNorm + vaderNorm + winkNorm) / 3
  const label = score > 0.05 ? 'positive' : score < -0.05 ? 'negative' : 'neutral'

  // ── Keyword-based mood matching ───────────────────────────────────────────
  const textLower = text.toLowerCase()
  const hits: { tag: MoodTag; count: number }[] = []

  for (const [tag, keywords] of Object.entries(MOOD_KEYWORDS) as [MoodTag, string[]][]) {
    const count = keywords.filter((kw) => textLower.includes(kw)).length
    if (count > 0) hits.push({ tag, count })
  }

  hits.sort((a, b) => b.count - a.count)

  // If no keywords matched, fall back to overall sentiment
  if (hits.length === 0) {
    if      (score >  0.4) hits.push({ tag: 'Joy',         count: 1 })
    else if (score >  0.15) hits.push({ tag: 'Contentment', count: 1 })
    else if (score < -0.4) hits.push({ tag: 'Sadness',     count: 1 })
    else if (score < -0.15) hits.push({ tag: 'Anxiety',    count: 1 })
    else                    hits.push({ tag: 'Ennui',       count: 1 })
  }

  return {
    score,
    label,
    suggestedMoods: hits.slice(0, 3).map((h) => h.tag),
    positiveWords: afinn.positive ?? [],
    negativeWords: afinn.negative ?? [],
    breakdown: { afinn: afinnNorm, vader: vaderNorm, wink: winkNorm },
  }
}
