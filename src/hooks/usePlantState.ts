import { useState, useEffect, useRef } from 'react'
import { buildPlantState, getFruitCount } from '../utils/plantLogic'
import type { PlantState } from '../types/mood'

/**
 * Tracks plant state and handles the "falling fruit" animation
 * when the fruit count would exceed 6 on a new entry.
 */
export function usePlantState(totalEntries: number): PlantState {
  const [plantState, setPlantState] = useState<PlantState>(() => buildPlantState(totalEntries))
  const prevCountRef = useRef(totalEntries)

  useEffect(() => {
    const prev = prevCountRef.current
    prevCountRef.current = totalEntries

    if (totalEntries === prev) return

    const prevFruits = getFruitCount(prev)
    const nextFruits = getFruitCount(totalEntries)

    // If we would exceed 6 fruits, animate the oldest one falling off first
    if (prevFruits === 6 && nextFruits === 6 && totalEntries > prev) {
      // Trigger fall animation for index 0 (oldest fruit, left side)
      setPlantState((s) => ({ ...s, fallingFruitIndex: 0 }))
      const timer = setTimeout(() => {
        setPlantState(buildPlantState(totalEntries))
      }, 900)
      return () => clearTimeout(timer)
    }

    setPlantState(buildPlantState(totalEntries))
  }, [totalEntries])

  return plantState
}
