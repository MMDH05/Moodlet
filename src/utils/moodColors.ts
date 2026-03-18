import type { MoodTag } from '../types/mood'

// ─── Mood → Color Palette ─────────────────────────────────────────────────────

export const MOOD_COLORS: Record<MoodTag, string> = {
  Joy:           '#FFD700', // golden yellow
  Sadness:       '#6B9AC4', // muted steel blue
  Anger:         '#E05252', // soft red
  Fear:          '#9B59B6', // muted purple
  Disgust:       '#7CB87C', // olive green
  Anxiety:       '#F0A500', // amber
  Ennui:         '#A0A0B0', // slate gray
  Embarrassment: '#F48FB1', // soft pink
  Nostalgia:     '#C4956A', // warm sepia
  Pride:         '#5C85D6', // royal blue
  Contentment:   '#98D8C8', // seafoam mint
  Excitement:    '#FF7043', // vibrant orange-red
  Gratitude:     '#BA68C8', // soft violet
}

export const MOOD_EMOJIS: Record<MoodTag, string> = {
  Joy:           '😊',
  Sadness:       '😢',
  Anger:         '😠',
  Fear:          '😨',
  Disgust:       '🤢',
  Anxiety:       '😰',
  Ennui:         '😑',
  Embarrassment: '😳',
  Nostalgia:     '🥲',
  Pride:         '😌',
  Contentment:   '☺️',
  Excitement:    '🤩',
  Gratitude:     '🙏',
}

// ─── Color blending helpers ───────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
}

/** Blend multiple mood colors weighted by intensity */
export function blendMoodColors(moods: { tag: MoodTag; intensity: number }[]): string {
  if (moods.length === 0) return '#A0A0B0'
  if (moods.length === 1) return MOOD_COLORS[moods[0].tag]

  const totalWeight = moods.reduce((sum, m) => sum + m.intensity, 0)
  let r = 0, g = 0, b = 0

  for (const mood of moods) {
    const weight = mood.intensity / totalWeight
    const [cr, cg, cb] = hexToRgb(MOOD_COLORS[mood.tag])
    r += cr * weight
    g += cg * weight
    b += cb * weight
  }

  return rgbToHex(r, g, b)
}

/** Lighten a hex color by a given amount (0–1) */
export function lightenColor(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(
    Math.min(255, r + (255 - r) * amount),
    Math.min(255, g + (255 - g) * amount),
    Math.min(255, b + (255 - b) * amount),
  )
}

/** Mix two colors: weight = how much of colorB to use (0 = all A, 1 = all B) */
export function mixColors(hexA: string, hexB: string, weight: number): string {
  const [ar, ag, ab] = hexToRgb(hexA)
  const [br, bg, bb] = hexToRgb(hexB)
  const w = Math.max(0, Math.min(1, weight))
  return rgbToHex(
    ar * (1 - w) + br * w,
    ag * (1 - w) + bg * w,
    ab * (1 - w) + bb * w,
  )
}

/** Soil color = rich brown base tinted by mood hue.
 *  Higher intensity = more vivid mood color, lower = more earthy. */
export function getSoilColor(moods: { tag: MoodTag; intensity: number }[]): string {
  const SOIL_BROWN = '#7D5230'
  if (moods.length === 0) return SOIL_BROWN
  const moodColor = blendMoodColors(moods)
  const avgIntensity = moods.reduce((s, m) => s + m.intensity, 0) / moods.length
  // intensity 1 → 25% mood, intensity 5 → 65% mood
  const moodWeight = 0.25 + (avgIntensity / 5) * 0.4
  return mixColors(SOIL_BROWN, moodColor, moodWeight)
}
