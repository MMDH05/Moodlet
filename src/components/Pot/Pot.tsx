import { useRef, useState, useEffect } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { MoodEntry } from '../../types/mood'
import { SoilLayer } from './SoilLayer'

interface Props {
  entries: MoodEntry[]
  newestEntryId: string | null
}

export function Pot({ entries, newestEntryId }: Props) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const virtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const entry = entries[index]
      return selectedId === entry?.id ? 240 : 48
    },
    overscan: 6,
  })

  // Notify virtualizer when selection changes (sizes change)
  useEffect(() => {
    virtualizer.measure()
  }, [selectedId, virtualizer])

  const handleSelect = (id: string | null) => {
    setSelectedId(id)
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-stone-500/60 gap-3 py-10">
        <span className="text-4xl">💧</span>
        <p className="font-bold text-sm">Water your plant to begin</p>
        <p className="text-xs font-medium opacity-70">Each entry becomes a soil layer</p>
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      className="h-full overflow-y-auto overflow-x-hidden"
      style={{ contain: 'strict' }}
    >
      {/* Scroll hint row */}
      <div className="flex items-center justify-between px-4 py-1 text-xs font-semibold text-stone-400/70 sticky top-0 z-10 bg-stone-800/40 backdrop-blur-sm">
        <span>{entries.length} layer{entries.length !== 1 ? 's' : ''}</span>
        <span>tap a layer for details ↓</span>
      </div>

      {/* Virtualized list */}
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const entry = entries[virtualItem.index]
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <SoilLayer
                entry={entry}
                index={virtualItem.index}
                isNew={entry.id === newestEntryId}
                isSelected={selectedId === entry.id}
                onSelect={handleSelect}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
