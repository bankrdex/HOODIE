'use client'

type HoodieCanvasProps = {
  color?: string
  image?: string | null
  text?: string
}

export default function HoodieCanvas({
  color = '#1a1a1a',
  image,
  text,
}: HoodieCanvasProps) {
  return (
    <div className="flex items-center justify-center w-full aspect-square bg-zinc-950 rounded-2xl p-6">
      <div className="relative w-full max-w-[280px] aspect-[3/4]">
        <svg
          viewBox="0 0 320 420"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-2xl"
        >
          <defs>
            <linearGradient id="bodyShade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.22)" />
              <stop offset="25%" stopColor="rgba(0,0,0,0.06)" />
              <stop offset="75%" stopColor="rgba(0,0,0,0.06)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
            </linearGradient>
            <linearGradient id="sleeveShadeL" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.05)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
            </linearGradient>
            <linearGradient id="sleeveShadeR" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.05)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
            </linearGradient>
            <clipPath id="chestClip">
              <rect x="108" y="148" width="104" height="100" rx="4" />
            </clipPath>
          </defs>

          {/* ── LEFT SLEEVE ── */}
          <path
            d="M 78 142 L 22 265 Q 18 274 26 277 L 62 280 Q 70 281 74 272 L 108 158"
            fill={color}
          />
          <path
            d="M 78 142 L 22 265 Q 18 274 26 277 L 62 280 Q 70 281 74 272 L 108 158"
            fill="url(#sleeveShadeL)"
          />
          {/* left cuff */}
          <path
            d="M 22 265 Q 18 274 26 277 L 62 280 Q 70 281 74 272 L 70 267 Q 67 274 60 273 L 26 270 Q 20 267 23 260 Z"
            fill="rgba(0,0,0,0.25)"
          />

          {/* ── RIGHT SLEEVE ── */}
          <path
            d="M 242 142 L 298 265 Q 302 274 294 277 L 258 280 Q 250 281 246 272 L 212 158"
            fill={color}
          />
          <path
            d="M 242 142 L 298 265 Q 302 274 294 277 L 258 280 Q 250 281 246 272 L 212 158"
            fill="url(#sleeveShadeR)"
          />
          {/* right cuff */}
          <path
            d="M 298 265 Q 302 274 294 277 L 258 280 Q 250 281 246 272 L 250 267 Q 253 274 260 273 L 294 270 Q 300 267 297 260 Z"
            fill="rgba(0,0,0,0.25)"
          />

          {/* ── BODY ── */}
          <path
            d="M 90 145 L 230 145 L 238 398 Q 238 408 228 408 L 92 408 Q 82 408 82 398 Z"
            fill={color}
          />
          <path
            d="M 90 145 L 230 145 L 238 398 Q 238 408 228 408 L 92 408 Q 82 408 82 398 Z"
            fill="url(#bodyShade)"
          />

          {/* ── HOOD LEFT ── */}
          <path
            d="M 90 145 L 66 82 Q 54 48 82 32 L 124 18 Q 140 12 148 30 L 152 145"
            fill={color}
          />
          <path
            d="M 90 145 L 66 82 Q 54 48 82 32 L 105 28 L 118 145"
            fill="rgba(0,0,0,0.14)"
          />

          {/* ── HOOD RIGHT ── */}
          <path
            d="M 230 145 L 254 82 Q 266 48 238 32 L 196 18 Q 180 12 172 30 L 168 145"
            fill={color}
          />
          <path
            d="M 230 145 L 254 82 Q 266 48 238 32 L 215 28 L 202 145"
            fill="rgba(255,255,255,0.04)"
          />

          {/* ── HOOD OPENING ── */}
          <ellipse cx="160" cy="82" rx="44" ry="58" fill="rgba(0,0,0,0.55)" />
          <ellipse cx="160" cy="84" rx="36" ry="50" fill="rgba(0,0,0,0.65)" />

          {/* ── DRAWSTRINGS ── */}
          <line
            x1="150" y1="145" x2="142" y2="210"
            stroke="rgba(0,0,0,0.4)" strokeWidth="2.5" strokeLinecap="round"
          />
          <line
            x1="170" y1="145" x2="178" y2="210"
            stroke="rgba(0,0,0,0.4)" strokeWidth="2.5" strokeLinecap="round"
          />
          <ellipse cx="142" cy="213" rx="4" ry="3" fill="rgba(0,0,0,0.45)" />
          <ellipse cx="178" cy="213" rx="4" ry="3" fill="rgba(0,0,0,0.45)" />

          {/* ── KANGAROO POCKET ── */}
          <path
            d="M 110 290 Q 110 284 117 284 L 203 284 Q 210 284 210 290 L 213 348 Q 213 355 206 355 L 114 355 Q 107 355 107 348 Z"
            fill="rgba(0,0,0,0.14)"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="1"
          />
          <line
            x1="160" y1="284" x2="160" y2="355"
            stroke="rgba(0,0,0,0.12)" strokeWidth="1"
          />

          {/* ── BOTTOM RIB ── */}
          <path
            d="M 82 398 Q 82 408 92 408 L 228 408 Q 238 408 238 398 L 236 390 Q 235 396 228 396 L 92 396 Q 85 396 84 390 Z"
            fill="rgba(0,0,0,0.2)"
          />

          {/* ── CENTER SEAM ── */}
          <line
            x1="160" y1="145" x2="160" y2="408"
            stroke="rgba(0,0,0,0.1)" strokeWidth="1"
            strokeDasharray="4,4"
          />

          {/* ── DESIGN OVERLAY (chest area) ── */}
          {image && (
            <g clipPath="url(#chestClip)">
              <image
                href={image}
                x="108"
                y="148"
                width="104"
                height="100"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          )}

          {/* ── TEXT OVERLAY ── */}
          {text && (
            <text
              x="160"
              y="200"
              textAnchor="middle"
              fill="white"
              fontSize="14"
              fontWeight="bold"
              fontFamily="system-ui, sans-serif"
            >
              {text}
            </text>
          )}

          {/* ── EMPTY STATE ── */}
          {!image && !text && (
            <text
              x="160"
              y="215"
              textAnchor="middle"
              fill="rgba(255,255,255,0.12)"
              fontSize="11"
              fontFamily="system-ui, sans-serif"
            >
              Upload your design
            </text>
          )}
        </svg>
      </div>
    </div>
  )
}
