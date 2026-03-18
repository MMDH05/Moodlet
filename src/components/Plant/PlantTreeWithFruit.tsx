import { motion, AnimatePresence } from 'framer-motion'

// Fruit positions at OUTER EDGES of canopy — clearly visible, not buried
const FRUIT_POSITIONS = [
  { cx: 34,  cy: 136 }, // outer left low
  { cx: 162, cy: 128 }, // outer right low
  { cx: 24,  cy: 92  }, // outer left mid
  { cx: 170, cy: 82  }, // outer right mid
  { cx: 56,  cy: 46  }, // upper left
  { cx: 142, cy: 42  }, // upper right
]

interface Props {
  fruitCount: number
  fallingFruitIndex: number | null
}

export function PlantTreeWithFruit({ fruitCount, fallingFruitIndex }: Props) {
  const visibleFruits = FRUIT_POSITIONS.slice(0, Math.min(fruitCount, 6))

  return (
    <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
      {/* Trunk */}
      <path d="M100 215 Q94 180 95 145 Q96 110 97 75" stroke="#7D5228" strokeWidth="13" fill="none" strokeLinecap="round" />
      <path d="M97 198 Q80 193 70 208" stroke="#7D5228" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M100 196 Q118 191 128 208" stroke="#7D5228" strokeWidth="7" fill="none" strokeLinecap="round" />

      {/* — LAYER 1: deep shadow base — */}
      <ellipse cx="90" cy="148" rx="55" ry="36" fill="#3A7020" />
      <ellipse cx="118" cy="140" rx="52" ry="34" fill="#3A7020" />
      <ellipse cx="70" cy="118" rx="52" ry="36" fill="#3A7020" />
      <ellipse cx="125" cy="112" rx="55" ry="36" fill="#3A7020" />
      <ellipse cx="92" cy="90" rx="57" ry="37" fill="#3A7020" />
      <ellipse cx="100" cy="65" rx="50" ry="34" fill="#3A7020" />
      <ellipse cx="100" cy="42" rx="42" ry="30" fill="#3A7020" />

      {/* — LAYER 2: mid green — */}
      <ellipse cx="78" cy="142" rx="52" ry="32" fill="#4A9A2A" />
      <ellipse cx="122" cy="134" rx="50" ry="31" fill="#4A9A2A" />
      <ellipse cx="60" cy="112" rx="48" ry="33" fill="#4A9A2A" />
      <ellipse cx="132" cy="105" rx="52" ry="33" fill="#4A9A2A" />
      <ellipse cx="87" cy="84" rx="54" ry="34" fill="#4A9A2A" />
      <ellipse cx="112" cy="78" rx="50" ry="33" fill="#4A9A2A" />
      <ellipse cx="98" cy="58" rx="46" ry="31" fill="#4A9A2A" />
      <ellipse cx="98" cy="36" rx="38" ry="26" fill="#4A9A2A" />

      {/* — LAYER 3: bright mid — */}
      <ellipse cx="66" cy="134" rx="44" ry="28" fill="#5CB535" />
      <ellipse cx="128" cy="124" rx="44" ry="28" fill="#5CB535" />
      <ellipse cx="50" cy="104" rx="42" ry="28" fill="#5CB535" />
      <ellipse cx="145" cy="95" rx="44" ry="29" fill="#5CB535" />
      <ellipse cx="82" cy="76" rx="48" ry="29" fill="#5CB535" />
      <ellipse cx="116" cy="70" rx="46" ry="28" fill="#5CB535" />
      <ellipse cx="95" cy="50" rx="42" ry="27" fill="#5CB535" />
      <ellipse cx="98" cy="28" rx="34" ry="22" fill="#5CB535" />

      {/* — LAYER 4: light top highlights — */}
      <ellipse cx="56" cy="122" rx="34" ry="22" fill="#74D448" />
      <ellipse cx="140" cy="110" rx="36" ry="22" fill="#74D448" />
      <ellipse cx="42" cy="92" rx="30" ry="20" fill="#74D448" />
      <ellipse cx="154" cy="82" rx="32" ry="20" fill="#74D448" />
      <ellipse cx="76" cy="64" rx="40" ry="24" fill="#74D448" />
      <ellipse cx="122" cy="58" rx="38" ry="22" fill="#74D448" />
      <ellipse cx="94" cy="38" rx="34" ry="20" fill="#74D448" />
      <ellipse cx="98" cy="18" rx="26" ry="16" fill="#74D448" />

      {/* — TOP CROWN — */}
      <ellipse cx="90" cy="24" rx="28" ry="17" fill="#8EE860" />
      <ellipse cx="108" cy="20" rx="24" ry="15" fill="#8EE860" />
      <ellipse cx="98" cy="12" rx="20" ry="13" fill="#A0F070" />

      {/* ── Fruits — rendered on top at outer canopy edges ─────────── */}
      {visibleFruits.map((pos, i) => {
        const isFalling = fallingFruitIndex === i
        return (
          <AnimatePresence key={i}>
            {!isFalling ? (
              <g key={`fruit-${i}`}>
                {/* Leaf stem */}
                <line
                  x1={pos.cx + 1}
                  y1={pos.cy - 9}
                  x2={pos.cx + 5}
                  y2={pos.cy - 15}
                  stroke="#4A9A2A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <motion.circle
                  cx={pos.cx}
                  cy={pos.cy}
                  r="10"
                  fill="#E84040"
                  stroke="#B02020"
                  strokeWidth="1.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                />
                {/* Highlight */}
                <motion.ellipse
                  cx={pos.cx - 3}
                  cy={pos.cy - 3}
                  rx="3"
                  ry="4"
                  fill="white"
                  opacity={0.35}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.12 + 0.1 }}
                />
              </g>
            ) : (
              <motion.circle
                key={`fruit-falling-${i}`}
                cx={pos.cx}
                cy={pos.cy}
                r="10"
                fill="#E84040"
                stroke="#B02020"
                strokeWidth="1.5"
                initial={{ opacity: 1, y: 0, rotate: 0 }}
                animate={{ opacity: 0, y: 90, rotate: 60 }}
                transition={{ duration: 0.85, ease: 'easeIn' }}
              />
            )}
          </AnimatePresence>
        )
      })}
    </svg>
  )
}
