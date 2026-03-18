import type { PlantStage, PlantState } from '../types/mood'

// ─── Stage thresholds (from PRD) ─────────────────────────────────────────────

export function getPlantStage(totalEntries: number): PlantStage {
  if (totalEntries <= 1)  return 'seedling'
  if (totalEntries <= 2)  return 'small-sapling'
  if (totalEntries <= 3)  return 'normal-sapling'
  if (totalEntries <= 4) return 'plant'
  if (totalEntries <= 5) return 'tree'
  return 'tree-with-fruit'
}

/**
 * Fruit count: starts appearing at 301 entries.
 * One fruit added every 5 new entries. Max 6 on the tree at once.
 */
export function getFruitCount(totalEntries: number): number {
  if (totalEntries <= 5) return 0
  return Math.min(6, Math.floor((totalEntries - 10) / 5) + 1)
}

export function buildPlantState(totalEntries: number): PlantState {
  return {
    stage: getPlantStage(totalEntries),
    fruitCount: getFruitCount(totalEntries),
    fallingFruitIndex: null,
    totalEntries,
  }
}

// ─── Stage display labels ─────────────────────────────────────────────────────

export const STAGE_LABELS: Record<PlantStage, string> = {
  'seedling':       'Seedling',
  'small-sapling':  'Small Sapling',
  'normal-sapling': 'Sapling',
  'plant':          'Plant',
  'tree':           'Tree',
  'tree-with-fruit':'Tree in Bloom',
}

export const STAGE_RANGES: Record<PlantStage, string> = {
  'seedling':       '0–20 entries',
  'small-sapling':  '21–50 entries',
  'normal-sapling': '51–90 entries',
  'plant':          '91–200 entries',
  'tree':           '201–300 entries',
  'tree-with-fruit':'300+ entries',
}
