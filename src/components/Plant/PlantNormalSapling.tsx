export function PlantNormalSapling() {
  return (
    <svg viewBox="0 0 140 170" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Main trunk */}
      <path d="M70 158 Q67 130 68 90 Q69 70 70 50" stroke="#6B4F2A" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Left branch low */}
      <path d="M69 120 Q50 110 38 100" stroke="#6B4F2A" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Right branch low */}
      <path d="M69 128 Q88 116 100 104" stroke="#6B4F2A" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Left branch high */}
      <path d="M69 90 Q52 80 44 68" stroke="#5D8A3C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Right branch high */}
      <path d="M70 88 Q88 76 96 64" stroke="#5D8A3C" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Low left foliage */}
      <ellipse cx="34" cy="96" rx="18" ry="12" fill="#5A9E35" transform="rotate(-20 34 96)" />
      <ellipse cx="26" cy="92" rx="12" ry="8" fill="#6AAF40" transform="rotate(-40 26 92)" />
      {/* Low right foliage */}
      <ellipse cx="104" cy="100" rx="18" ry="12" fill="#5A9E35" transform="rotate(20 104 100)" />
      <ellipse cx="112" cy="96" rx="12" ry="8" fill="#6AAF40" transform="rotate(40 112 96)" />
      {/* High left foliage */}
      <ellipse cx="40" cy="64" rx="18" ry="11" fill="#68B83C" transform="rotate(-25 40 64)" />
      <ellipse cx="32" cy="60" rx="11" ry="8" fill="#78C448" transform="rotate(-45 32 60)" />
      {/* High right foliage */}
      <ellipse cx="100" cy="60" rx="18" ry="11" fill="#68B83C" transform="rotate(25 100 60)" />
      <ellipse cx="108" cy="56" rx="11" ry="8" fill="#78C448" transform="rotate(45 108 56)" />
      {/* Crown */}
      <ellipse cx="64" cy="48" rx="20" ry="14" fill="#7CC44A" />
      <ellipse cx="76" cy="45" rx="18" ry="12" fill="#8BCF55" />
      <ellipse cx="70" cy="38" rx="14" ry="10" fill="#98D855" />
    </svg>
  )
}
