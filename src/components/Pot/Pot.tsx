import { useRef, useState } from 'react'
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

  // Each layer is 40px base + 180px expanded if selected
  const virtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const entry = entries[index]
      return selectedId === entry?.id ? 220 : 40
    },
    overscan: 5,
  })

  const handleSelect = (id: string | null) => {
    setSelectedId(id)
    // Notify virtualizer that sizes have changed
    virtualizer.measure()
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-stone-500 text-sm gap-2 py-8">
        <span className="text-3xl">💧</span>
        <p>Water your plant to start</p>
        <p className="text-xs text-stone-400">Each entry becomes a soil layer</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scroll hint */}
      <div className="flex items-center justify-between px-3 py-1.5 text-xs text-stone-500 border-b border-stone-200 bg-stone-50 flex-shrink-0">
        <span>{entries.length} {entries.length === 1 ? 'layer' : 'layers'} — scroll to explore</span>
        <span className="text-stone-400">tap a layer for details</span>
      </div>

      {/* Virtualized soil layers */}
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ contain: 'strict' }}
      >
        <div
          style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}
        >
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
    </div>
  )
}
