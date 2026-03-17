export function PlantSeedling() {
  return (
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Stem */}
      <line x1="60" y1="130" x2="60" y2="90" stroke="#5D8A3C" strokeWidth="3" strokeLinecap="round" />
      {/* Left leaf */}
      <ellipse cx="46" cy="95" rx="14" ry="8" fill="#6AAF40" transform="rotate(-30 46 95)" />
      {/* Right leaf */}
      <ellipse cx="74" cy="95" rx="14" ry="8" fill="#78C048" transform="rotate(30 74 95)" />
      {/* Tiny tip */}
      <ellipse cx="60" cy="86" rx="5" ry="7" fill="#8BCF55" transform="rotate(-5 60 86)" />
    </svg>
  )
}
