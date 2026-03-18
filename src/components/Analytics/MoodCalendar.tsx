import { useMemo } from 'react'
import { format, subYears, startOfWeek, endOfWeek, differenceInWeeks } from 'date-fns'
import type { MoodEntry } from '../../types/mood'
import { buildHeatmapData } from '../../utils/analytics'

interface Props {
  entries: MoodEntry[]
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_LABELS = ['Mon','','Wed','','Fri','','']
const CELL_SIZE = 12
const CELL_GAP = 2

export function MoodCalendar({ entries }: Props) {
  const today = new Date()
  const yearAgo = subYears(today, 1)

  const heatmapMap = useMemo(() => {
    const data = buildHeatmapData(entries)
    return new Map(data.map((d) => [d.date, d]))
  }, [entries])

  const gridStart = startOfWeek(yearAgo, { weekStartsOn: 1 })
  const totalWeeks = differenceInWeeks(today, gridStart) + 2

  const weeks: Date[][] = []
  for (let w = 0; w < totalWeeks; w++) {
    const week: Date[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(gridStart)
      date.setDate(gridStart.getDate() + w * 7 + d)
      week.push(date)
    }
    weeks.push(week)
  }

  const monthLabels: { label: string; col: number }[] = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const month = week[0].getMonth()
    if (month !== lastMonth) {
      monthLabels.push({ label: MONTHS[month], col: wi })
      lastMonth = month
    }
  })

  const totalWidth = totalWeeks * (CELL_SIZE + CELL_GAP)

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-stone-400 text-sm gap-2">
        <span className="text-3xl">📅</span>
        <p>No entries yet</p>
        <p className="text-xs">Your mood history will appear here as a heatmap</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div style={{ minWidth: totalWidth + 30 }}>
        {/* Month labels */}
        <div className="relative h-5 pl-8 mb-1">
          {monthLabels.map(({ label, col }) => (
            <span
              key={`${label}-${col}`}
              className="absolute text-xs text-stone-400"
              style={{ left: 32 + col * (CELL_SIZE + CELL_GAP) }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex" style={{ gap: CELL_GAP }}>
          {/* Day labels */}
          <div className="flex flex-col mr-1" style={{ gap: CELL_GAP }}>
            {DAY_LABELS.map((d, i) => (
              <div
                key={i}
                className="text-xs text-stone-400 text-right"
                style={{ height: CELL_SIZE, lineHeight: `${CELL_SIZE}px`, width: 24 }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grid columns */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col" style={{ gap: CELL_GAP }}>
              {week.map((date) => {
                const dateStr = format(date, 'yyyy-MM-dd')
                const todayStr = format(today, 'yyyy-MM-dd')
                const data = heatmapMap.get(dateStr)
                const isToday = dateStr === todayStr
                const isFuture = date > today
                const isOutOfRange = date < yearAgo

                let bg = '#e7e5e4'
                if (isOutOfRange || isFuture) bg = 'transparent'
                else if (data) bg = data.color

                return (
                  <div
                    key={dateStr}
                    title={data ? `${format(date, 'MMM d, yyyy')}: ${data.count} entry(s)` : format(date, 'MMM d, yyyy')}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      backgroundColor: bg,
                      borderRadius: 2,
                      border: isToday ? '1.5px solid #5D8A3C' : 'none',
                      flexShrink: 0,
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-3 pl-8">
          <span className="text-xs text-stone-400">Less</span>
          {['#e7e5e4', '#c6d9b8', '#8bcf55', '#5a9e35', '#3d7a22'].map((c) => (
            <div
              key={c}
              style={{ width: CELL_SIZE, height: CELL_SIZE, backgroundColor: c, borderRadius: 2 }}
            />
          ))}
          <span className="text-xs text-stone-400">More</span>
        </div>
      </div>
    </div>
  )
}
