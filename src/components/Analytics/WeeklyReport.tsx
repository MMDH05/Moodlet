import { useMemo, useState } from 'react'
import { format, parseISO, subWeeks } from 'date-fns'
import type { MoodEntry } from '../../types/mood'
import { buildWeeklySummary } from '../../utils/analytics'
import { MOOD_COLORS, MOOD_EMOJIS } from '../../utils/moodColors'

interface Props {
  entries: MoodEntry[]
}

export function WeeklyReport({ entries }: Props) {
  const [weekOffset, setWeekOffset] = useState(0) // 0 = this week, 1 = last week, etc.

  const referenceDate = useMemo(() => subWeeks(new Date(), weekOffset), [weekOffset])
  const summary = useMemo(() => buildWeeklySummary(entries, referenceDate), [entries, referenceDate])

  const isCurrentWeek = weekOffset === 0

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-stone-400 text-sm gap-2">
        <span className="text-3xl">📊</span>
        <p>No entries yet</p>
        <p className="text-xs">Weekly reports will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekOffset((p) => p + 1)}
          className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors text-sm"
        >
          ← Prev
        </button>
        <div className="text-center">
          <div className="text-sm font-semibold text-stone-700">
            {isCurrentWeek ? 'This Week' : `Week of ${format(parseISO(summary.weekStart), 'MMM d')}`}
          </div>
          <div className="text-xs text-stone-400">
            {format(parseISO(summary.weekStart), 'MMM d')} – {format(parseISO(summary.weekEnd), 'MMM d, yyyy')}
          </div>
        </div>
        <button
          onClick={() => setWeekOffset((p) => Math.max(0, p - 1))}
          disabled={isCurrentWeek}
          className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {summary.totalEntries === 0 ? (
        <p className="text-center text-stone-400 text-sm py-6">No entries this week.</p>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Entries" value={summary.totalEntries.toString()} />
            <StatCard
              label="Avg Intensity"
              value={summary.averageIntensity.toFixed(1) + '/5'}
            />
            <StatCard
              label="Most Active"
              value={summary.mostActiveDay ? format(parseISO(summary.mostActiveDay), 'EEE') : '—'}
            />
          </div>

          {/* Top moods */}
          {summary.topMoods.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Top Moods</h4>
              <div className="space-y-2">
                {summary.topMoods.map(({ tag, count }) => {
                  const pct = Math.round((count / (summary.totalEntries || 1)) * 100)
                  return (
                    <div key={tag} className="flex items-center gap-3">
                      <span className="text-sm w-28 flex items-center gap-1.5 flex-shrink-0">
                        <span>{MOOD_EMOJIS[tag]}</span>
                        <span className="text-stone-700">{tag}</span>
                      </span>
                      <div className="flex-1 bg-stone-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: MOOD_COLORS[tag] }}
                        />
                      </div>
                      <span className="text-xs text-stone-500 w-8 text-right">{count}×</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Top words */}
          {summary.wordFrequency.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                Words this week
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {summary.wordFrequency.slice(0, 20).map(({ word, count }) => (
                  <span
                    key={word}
                    className="px-2 py-0.5 bg-stone-100 rounded-full text-xs text-stone-600"
                  >
                    {word}
                    {count > 1 && <span className="text-stone-400 ml-1">×{count}</span>}
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-stone-50 rounded-xl p-3 text-center">
      <div className="text-lg font-bold text-stone-800">{value}</div>
      <div className="text-xs text-stone-500 mt-0.5">{label}</div>
    </div>
  )
}
