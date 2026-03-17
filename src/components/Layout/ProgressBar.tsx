import { motion } from 'framer-motion'
import type { PlantStage } from '../../types/mood'
import { STAGE_LABELS, STAGE_RANGES } from '../../utils/plantLogic'

const STAGE_ORDER: PlantStage[] = [
  'seedling', 'small-sapling', 'normal-sapling', 'plant', 'tree', 'tree-with-fruit',
]

const STAGE_MAX: Record<PlantStage, number> = {
  'seedling':        20,
  'small-sapling':   50,
  'normal-sapling':  90,
  'plant':          200,
  'tree':           300,
  'tree-with-fruit': 300,
}

const STAGE_MIN: Record<PlantStage, number> = {
  'seedling':        0,
  'small-sapling':   21,
  'normal-sapling':  51,
  'plant':           91,
  'tree':           201,
  'tree-with-fruit': 301,
}

interface Props {
  totalEntries: number
  stage: PlantStage
}

export function ProgressBar({ totalEntries, stage }: Props) {
  const min = STAGE_MIN[stage]
  const max = STAGE_MAX[stage]
  const isMaxed = stage === 'tree-with-fruit'

  const pct = isMaxed ? 100 : Math.min(100, ((totalEntries - min) / (max - min)) * 100)

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-xs font-medium text-stone-600">
          {STAGE_LABELS[stage]}
        </span>
        <span className="text-xs text-stone-400">
          {isMaxed ? `${totalEntries} entries` : `${totalEntries} / ${max}`}
        </span>
      </div>
      <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      {!isMaxed && (
        <p className="text-xs text-stone-400 mt-0.5 text-right">
          {max - totalEntries} more to next stage
        </p>
      )}
    </div>
  )
}

// suppress unused
const _: typeof STAGE_RANGES = STAGE_RANGES
const __: typeof STAGE_ORDER = STAGE_ORDER
void _; void __
