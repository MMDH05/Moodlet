export function PlantFull() {
  return (
    <svg viewBox="0 0 160 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Trunk */}
      <path d="M80 168 Q76 140 77 100 Q78 70 80 40" stroke="#7B5C30" strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* Branches */}
      <path d="M78 130 Q55 118 38 104" stroke="#7B5C30" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M79 138 Q104 124 120 108" stroke="#7B5C30" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M78 100 Q58 86 44 72" stroke="#6B4F2A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M80 96 Q102 82 116 68" stroke="#6B4F2A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M79 70 Q62 56 52 44" stroke="#5D8A3C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M80 68 Q98 54 108 42" stroke="#5D8A3C" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Low foliage */}
      <ellipse cx="34" cy="100" rx="22" ry="14" fill="#4A8E2A" transform="rotate(-20 34 100)" />
      <ellipse cx="24" cy="96" rx="14" ry="10" fill="#5A9E35" transform="rotate(-45 24 96)" />
      <ellipse cx="124" cy="104" rx="22" ry="14" fill="#4A8E2A" transform="rotate(20 124 104)" />
      <ellipse cx="134" cy="100" rx="14" ry="10" fill="#5A9E35" transform="rotate(45 134 100)" />

      {/* Mid foliage */}
      <ellipse cx="40" cy="68" rx="20" ry="13" fill="#5A9E35" transform="rotate(-25 40 68)" />
      <ellipse cx="30" cy="63" rx="13" ry="9" fill="#6AAF40" transform="rotate(-50 30 63)" />
      <ellipse cx="120" cy="64" rx="20" ry="13" fill="#5A9E35" transform="rotate(25 120 64)" />
      <ellipse cx="130" cy="59" rx="13" ry="9" fill="#6AAF40" transform="rotate(50 130 59)" />

      {/* High foliage */}
      <ellipse cx="48" cy="40" rx="18" ry="12" fill="#68B83C" transform="rotate(-30 48 40)" />
      <ellipse cx="112" cy="38" rx="18" ry="12" fill="#68B83C" transform="rotate(30 112 38)" />

      {/* Crown */}
      <ellipse cx="72" cy="36" rx="26" ry="18" fill="#6AAF40" />
      <ellipse cx="88" cy="32" rx="24" ry="16" fill="#78C048" />
      <ellipse cx="80" cy="24" rx="20" ry="14" fill="#8BCF55" />
      <ellipse cx="80" cy="18" rx="14" ry="10" fill="#98D855" />

      {/* Small flowers */}
      <circle cx="48" cy="56" r="4" fill="#FFD700" opacity="0.9" />
      <circle cx="112" cy="52" r="4" fill="#FFB347" opacity="0.9" />
      <circle cx="68" cy="30" r="3.5" fill="#FF9EAA" opacity="0.9" />
    </svg>
  )
}
