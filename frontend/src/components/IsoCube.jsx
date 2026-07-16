export default function IsoCube({ size = 32, className = '' }) {
  // Isometric cube with 3 visible faces
  // Using proper isometric projection
  const w = size
  const h = size

  // Center of the SVG
  const cx = w / 2
  const cy = h / 2

  // Cube dimensions in isometric space
  const s = size * 0.38  // half-width of a face

  // Isometric cube vertices (top-down view projected to 2D)
  // Top face vertices (diamond shape)
  const top = [
    [cx, cy - s * 0.95],           // top
    [cx + s, cy - s * 0.45],       // right
    [cx, cy + s * 0.05],           // bottom (center)
    [cx - s, cy - s * 0.45],       // left
  ]

  // Left face vertices
  const left = [
    [cx - s, cy - s * 0.45],       // top-left
    [cx, cy + s * 0.05],           // top-right (center)
    [cx, cy + s * 1.05],           // bottom-right
    [cx - s, cy + s * 0.55],       // bottom-left
  ]

  // Right face vertices
  const right = [
    [cx, cy + s * 0.05],           // top-left (center)
    [cx + s, cy - s * 0.45],       // top-right
    [cx + s, cy + s * 0.55],       // bottom-right
    [cx, cy + s * 1.05],           // bottom-left
  ]

  const toPoints = (pts) => pts.map((p) => p.join(',')).join(' ')

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="3D cube logo"
    >
      {/* Top face - lightest */}
      <polygon points={toPoints(top)} fill="#818cf8" />
      {/* Left face - primary indigo */}
      <polygon points={toPoints(left)} fill="#4f46e5" />
      {/* Right face - darkest */}
      <polygon points={toPoints(right)} fill="#312e81" />
      {/* Cyan accent line on top-left edge */}
      <line
        x1={top[0][0]} y1={top[0][1]}
        x2={top[3][0]} y2={top[3][1]}
        stroke="#22d3ee"
        strokeWidth={size * 0.045}
        strokeLinecap="round"
      />
      {/* Cyan accent dot on top vertex */}
      <circle cx={top[0][0]} cy={top[0][1]} r={size * 0.04} fill="#22d3ee" />
    </svg>
  )
}
