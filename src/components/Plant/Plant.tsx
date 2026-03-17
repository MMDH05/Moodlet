import { motion, AnimatePresence } from 'framer-motion'
import type { PlantState } from '../../types/mood'
import { STAGE_LABELS } from '../../utils/plantLogic'
import { PlantSeedling } from './PlantSeedling'
import { PlantSmallSapling } from './PlantSmallSapling'
import { PlantNormalSapling } from './PlantNormalSapling'
import { PlantFull } from './PlantFull'
import { PlantTree } from './PlantTree'
import { PlantTreeWithFruit } from './PlantTreeWithFruit'

interface Props {
  plantState: PlantState
}

const STAGE_HEIGHTS: Record<string, string> = {
  'seedling':       'h-20',
  'small-sapling':  'h-28',
  'normal-sapling': 'h-36',
  'plant':          'h-44',
  'tree':           'h-52',
  'tree-with-fruit':'h-52',
}

export function Plant({ plantState }: Props) {
  const { stage, fruitCount, fallingFruitIndex } = plantState

  function renderPlant() {
    switch (stage) {
      case 'seedling':       return <PlantSeedling />
      case 'small-sapling':  return <PlantSmallSapling />
      case 'normal-sapling': return <PlantNormalSapling />
      case 'plant':          return <PlantFull />
      case 'tree':           return <PlantTree />
      case 'tree-with-fruit':return <PlantTreeWithFruit fruitCount={fruitCount} fallingFruitIndex={fallingFruitIndex} />
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Stage label */}
      <motion.div
        key={stage}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full mb-2"
      >
        {STAGE_LABELS[stage]}
      </motion.div>

      {/* Plant SVG — animates height on stage change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          className={`${STAGE_HEIGHTS[stage]} w-full flex items-end justify-center`}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {renderPlant()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
