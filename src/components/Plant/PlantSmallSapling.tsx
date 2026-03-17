export function PlantSmallSapling() {
  return (
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Main stem */}
      <path d="M60 145 Q58 115 60 80" stroke="#5D8A3C" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Left branch */}
      <path d="M59 110 Q42 102 36 92" stroke="#5D8A3C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Right branch */}
      <path d="M60 118 Q76 108 84 97" stroke="#5D8A3C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Left leaf cluster */}
      <ellipse cx="33" cy="88" rx="16" ry="10" fill="#6AAF40" transform="rotate(-20 33 88)" />
      <ellipse cx="27" cy="84" rx="10" ry="7" fill="#78C048" transform="rotate(-35 27 84)" />
      {/* Right leaf cluster */}
      <ellipse cx="87" cy="92" rx="16" ry="10" fill="#6AAF40" transform="rotate(20 87 92)" />
      <ellipse cx="93" cy="87" rx="10" ry="7" fill="#78C048" transform="rotate(35 93 87)" />
      {/* Top leaves */}
      <ellipse cx="55" cy="78" rx="12" ry="9" fill="#7CC44A" transform="rotate(-15 55 78)" />
      <ellipse cx="65" cy="76" rx="12" ry="9" fill="#8BCF55" transform="rotate(15 65 76)" />
      <ellipse cx="60" cy="70" rx="10" ry="8" fill="#98D855" />
    </svg>
  )
}
