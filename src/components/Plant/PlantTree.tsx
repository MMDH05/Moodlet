export function PlantTree() {
  return (
    <svg viewBox="0 0 180 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Trunk */}
      <path d="M90 188 Q84 160 85 115 Q86 80 88 45" stroke="#8B6340" strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* Root flares */}
      <path d="M88 180 Q72 178 65 188" stroke="#8B6340" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M90 180 Q106 178 113 188" stroke="#8B6340" strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* Primary branches */}
      <path d="M86 145 Q60 132 40 118" stroke="#8B6340" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M88 152 Q114 137 134 122" stroke="#8B6340" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M87 110 Q62 94 46 76" stroke="#7B5C30" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M89 106 Q114 90 130 72" stroke="#7B5C30" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Secondary branches */}
      <path d="M87 80 Q68 66 56 52" stroke="#6B4F2A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M88 76 Q108 62 120 48" stroke="#6B4F2A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M40 118 Q28 108 22 96" stroke="#7B5C30" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M134 122 Q148 110 154 96" stroke="#7B5C30" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Low foliage clusters */}
      <ellipse cx="36" cy="114" rx="24" ry="16" fill="#3D7A22" transform="rotate(-20 36 114)" />
      <ellipse cx="22" cy="108" rx="16" ry="11" fill="#4A8E2A" transform="rotate(-45 22 108)" />
      <ellipse cx="18" cy="92" rx="18" ry="12" fill="#4A8E2A" transform="rotate(-15 18 92)" />
      <ellipse cx="138" cy="118" rx="24" ry="16" fill="#3D7A22" transform="rotate(20 138 118)" />
      <ellipse cx="154" cy="112" rx="16" ry="11" fill="#4A8E2A" transform="rotate(45 154 112)" />
      <ellipse cx="158" cy="92" rx="18" ry="12" fill="#4A8E2A" transform="rotate(15 158 92)" />

      {/* Mid foliage */}
      <ellipse cx="42" cy="72" rx="22" ry="14" fill="#4A8E2A" transform="rotate(-25 42 72)" />
      <ellipse cx="30" cy="64" rx="14" ry="10" fill="#5A9E35" transform="rotate(-50 30 64)" />
      <ellipse cx="134" cy="68" rx="22" ry="14" fill="#4A8E2A" transform="rotate(25 134 68)" />
      <ellipse cx="148" cy="60" rx="14" ry="10" fill="#5A9E35" transform="rotate(50 148 60)" />

      {/* High foliage */}
      <ellipse cx="52" cy="48" rx="20" ry="13" fill="#5A9E35" transform="rotate(-30 52 48)" />
      <ellipse cx="124" cy="44" rx="20" ry="13" fill="#5A9E35" transform="rotate(30 124 44)" />

      {/* Crown mass */}
      <ellipse cx="80" cy="42" rx="30" ry="20" fill="#5A9E35" />
      <ellipse cx="100" cy="36" rx="28" ry="18" fill="#68B83C" />
      <ellipse cx="90" cy="26" rx="24" ry="16" fill="#78C448" />
      <ellipse cx="88" cy="16" rx="18" ry="13" fill="#8BCF55" />
      <ellipse cx="90" cy="10" rx="12" ry="9" fill="#98D855" />
    </svg>
  )
}
