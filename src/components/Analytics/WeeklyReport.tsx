import { useMemo, useState } from 'react'
import { format, parseISO, subWeeks } from 'date-fns'
import type { MoodEntry } from '../../types/mood'
import { buildWeeklySummary, getRecommendations, generateWeekStory } from '../../utils/analytics'
import { MOOD_COLORS, MOOD_EMOJIS } from '../../utils/moodColors'

interface Props {
  entries: MoodEntry[]
}

export function WeeklyReport({ entries }: Props) {
  const [weekOffset, setWeekOffset] = useState(0)

  const referenceDate = useMemo(() => subWeeks(new Date(), weekOffset), [weekOffset])
  const summary = useMemo(() => buildWeeklySummary(entries, referenceDate), [entries, referenceDate])
  const story = useMemo(() => generateWeekStory(summary), [summary])
  const recommendations = useMemo(() => getRecommendations(summary.topMoods), [summary])

  const isCurrentWeek = weekOffset === 0

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-stone-400 gap-2">
        <span className="text-4xl">📊</span>
        <p className="font-bold text-sm">No entries yet</p>
        <p className="text-xs">Weekly reports will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekOffset((p) => p + 1)}
          className="px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-500 font-bold transition-colors text-sm"
        >
          ← Prev
        </button>
        <div className="text-center">
          <div className="text-sm font-black text-stone-800">
            {isCurrentWeek ? 'This Week' : `Week of ${format(parseISO(summary.weekStart), 'MMM d')}`}
          </div>
          <div className="text-xs text-stone-400 font-medium">
            {format(parseISO(summary.weekStart), 'MMM d')} – {format(parseISO(summary.weekEnd), 'MMM d, yyyy')}
          </div>
        </div>
        <button
          onClick={() => setWeekOffset((p) => Math.max(0, p - 1))}
          disabled={isCurrentWeek}
          className="px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-500 font-bold transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {summary.totalEntries === 0 ? (
        <p className="text-center text-stone-400 text-sm py-6 font-medium">No entries this week.</p>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            <StatCard label="Entries" value={String(summary.totalEntries)} emoji="📝" />
            <StatCard label="Avg Intensity" value={`${summary.averageIntensity.toFixed(1)}/5`} emoji="⚡" />
            <StatCard
              label="Most Active"
              value={summary.mostActiveDay ? format(parseISO(summary.mostActiveDay), 'EEE') : '—'}
              emoji="📅"
            />
          </div>

          {/* Story mode */}
          {story && (
            <div className="bg-emerald-50 rounded-2xl p-4 border-2 border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">🌿</span>
                <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">This week's story</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed font-medium">{story}</p>
            </div>
          )}

          {/* Emotion balance meter */}
          {summary.topMoods.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">⚖️</span>
                <h4 className="text-xs font-black text-stone-600 uppercase tracking-wider">Emotion Balance</h4>
              </div>
              {/* Stacked bar */}
              <div className="w-full h-5 rounded-full overflow-hidden flex mb-3 shadow-inner bg-stone-100">
                {summary.topMoods.map(({ tag, count }) => {
                  const totalMoodCount = summary.topMoods.reduce((s, m) => s + m.count, 0)
                  const pct = (count / totalMoodCount) * 100
                  return (
                    <div
                      key={tag}
                      style={{ width: `${pct}%`, backgroundColor: MOOD_COLORS[tag] }}
                      title={`${tag}: ${count}`}
                      className="transition-all duration-500"
                    />
                  )
                })}
              </div>
              {/* Legend */}
              <div className="space-y-2">
                {summary.topMoods.map(({ tag, count }) => {
                  const pct = Math.round((count / (summary.totalEntries || 1)) * 100)
                  return (
                    <div key={tag} className="flex items-center gap-3">
                      <span className="text-sm w-32 flex items-center gap-1.5 flex-shrink-0 font-semibold text-stone-700">
                        <span>{MOOD_EMOJIS[tag]}</span> {tag}
                      </span>
                      <div className="flex-1 bg-stone-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: MOOD_COLORS[tag] }}
                        />
                      </div>
                      <span className="text-xs font-bold text-stone-400 w-8 text-right">{count}×</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">💡</span>
                <h4 className="text-xs font-black text-stone-600 uppercase tracking-wider">This week, try…</h4>
              </div>
              <div className="space-y-2">
                {recommendations.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white rounded-2xl p-3 shadow-sm border border-stone-100">
                    <span className="text-lg flex-shrink-0">{['🌬️','🤝','🚶'][i] ?? '✨'}</span>
                    <p className="text-sm font-medium text-stone-700 leading-snug">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top words */}
          {summary.wordFrequency.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">💬</span>
                <h4 className="text-xs font-black text-stone-600 uppercase tracking-wider">Words this week</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {summary.wordFrequency.slice(0, 20).map(({ word, count }) => (
                  <span
                    key={word}
                    className="px-2.5 py-1 bg-stone-100 rounded-full text-xs font-bold text-stone-600"
                  >
                    {word}
                    {count > 1 && <span className="text-stone-400 font-normal ml-1">×{count}</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-stone-100">
      <div className="text-lg mb-0.5">{emoji}</div>
      <div className="text-base font-black text-stone-800">{value}</div>
      <div className="text-xs font-semibold text-stone-400 mt-0.5">{label}</div>
    </div>
  )
}
