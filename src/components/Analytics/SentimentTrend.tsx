import { useMemo } from 'react'
import { format } from 'date-fns'
import type { MoodEntry } from '../../types/mood'
import { analyzeSentiment } from '../../utils/sentimentAnalysis'

interface Props {
  entries: MoodEntry[]
}

export function SentimentTrend({ entries }: Props) {
  // Only analyze entries that have journal text; take the most recent 40
  const analyzed = useMemo(() => {
    return [...entries]
      .filter((e) => e.journalText.trim().length > 0)
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-40)
      .map((e) => ({
        entry: e,
        result: analyzeSentiment(e.journalText),
        date: format(new Date(e.timestamp), 'MMM d'),
      }))
  }, [entries])

  const avgScore = useMemo(() => {
    if (analyzed.length === 0) return 0
    return analyzed.reduce((s, a) => s + a.result.score, 0) / analyzed.length
  }, [analyzed])

  const positiveCount = analyzed.filter((a) => a.result.label === 'positive').length
  const negativeCount = analyzed.filter((a) => a.result.label === 'negative').length
  const neutralCount  = analyzed.filter((a) => a.result.label === 'neutral').length

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-stone-400 gap-2">
        <span className="text-4xl">🧠</span>
        <p className="font-bold text-sm">No entries yet</p>
        <p className="text-xs">Sentiment analysis will appear here</p>
      </div>
    )
  }

  if (analyzed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-stone-400 gap-2">
        <span className="text-4xl">✍️</span>
        <p className="font-bold text-sm">No journal text yet</p>
        <p className="text-xs">Write in your journal to see sentiment analysis</p>
      </div>
    )
  }

  const avgLabel = avgScore > 0.05 ? 'positive' : avgScore < -0.05 ? 'negative' : 'neutral'
  const avgColor = avgLabel === 'positive' ? '#10b981' : avgLabel === 'negative' ? '#ef4444' : '#9ca3af'
  const avgEmoji = avgLabel === 'positive' ? '😊' : avgLabel === 'negative' ? '😔' : '😐'

  return (
    <div className="space-y-5">
      {/* Overview cards */}
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-1 bg-white rounded-2xl p-3 text-center shadow-sm border border-stone-100">
          <div className="text-2xl mb-0.5">{avgEmoji}</div>
          <div className="text-xs font-black capitalize" style={{ color: avgColor }}>{avgLabel}</div>
          <div className="text-xs font-semibold text-stone-400 mt-0.5">Overall</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-3 text-center shadow-sm border border-green-100">
          <div className="text-base font-black text-green-700">{positiveCount}</div>
          <div className="text-xs font-semibold text-green-500 mt-0.5">Positive</div>
        </div>
        <div className="bg-stone-50 rounded-2xl p-3 text-center shadow-sm border border-stone-100">
          <div className="text-base font-black text-stone-500">{neutralCount}</div>
          <div className="text-xs font-semibold text-stone-400 mt-0.5">Neutral</div>
        </div>
        <div className="bg-red-50 rounded-2xl p-3 text-center shadow-sm border border-red-100">
          <div className="text-base font-black text-red-500">{negativeCount}</div>
          <div className="text-xs font-semibold text-red-400 mt-0.5">Negative</div>
        </div>
      </div>

      {/* Bar chart */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">📈</span>
          <h4 className="text-xs font-black text-stone-600 uppercase tracking-wider">
            Sentiment over time {analyzed.length < entries.length ? `(last ${analyzed.length} journal entries)` : ''}
          </h4>
        </div>
        {/* Zero line chart */}
        <div className="relative bg-stone-50 rounded-2xl p-3 border border-stone-100" style={{ height: 120 }}>
          {/* Zero line */}
          <div className="absolute left-3 right-3 border-t border-dashed border-stone-300" style={{ top: '50%' }} />
          {/* Bars */}
          <div className="absolute inset-3 flex items-center gap-0.5">
            {analyzed.map(({ result, date }, i) => {
              const pct = Math.abs(result.score) * 50  // max 50% of half-height
              const isPos = result.score >= 0
              const barColor = result.label === 'positive' ? '#10b981'
                : result.label === 'negative' ? '#ef4444' : '#d1d5db'
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-center h-full"
                  title={`${date}: ${result.label} (${result.score.toFixed(2)})`}
                >
                  {/* Positive bar (top half) */}
                  <div className="flex-1 flex flex-col justify-end">
                    {isPos && (
                      <div
                        className="w-full rounded-t-sm transition-all duration-500"
                        style={{ height: `${pct}%`, backgroundColor: barColor, minHeight: pct > 0 ? 2 : 0 }}
                      />
                    )}
                  </div>
                  {/* Negative bar (bottom half) */}
                  <div className="flex-1 flex flex-col justify-start">
                    {!isPos && (
                      <div
                        className="w-full rounded-b-sm transition-all duration-500"
                        style={{ height: `${pct}%`, backgroundColor: barColor, minHeight: pct > 0 ? 2 : 0 }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex justify-between text-xs text-stone-400 font-medium mt-1 px-1">
          <span>Older</span>
          <span>positive ↑ / negative ↓</span>
          <span>Newer</span>
        </div>
      </div>
    </div>
  )
}
