"use client"

const weeks = 20
const days = 7

// Simple deterministic pseudo-random generator so SSR and client produce the same grid.
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = seed
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function generateData() {
  const rand = mulberry32(2024)
  const data: number[][] = []
  for (let w = 0; w < weeks; w++) {
    const row: number[] = []
    for (let d = 0; d < days; d++) {
      const r = rand()
      if (r < 0.15) row.push(0)
      else if (r < 0.35) row.push(1)
      else if (r < 0.6) row.push(2)
      else if (r < 0.85) row.push(3)
      else row.push(4)
    }
    data.push(row)
  }
  return data
}

const colors = [
  "var(--surface-low)",
  "#dcc9ff",
  "#a19ff9",
  "#702ae1",
  "#5352a5",
]

const data = generateData()

export function StreakCalendar() {
  return (
    <div className="mt-5">
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {data.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((value, di) => (
              <div
                key={di}
                className="h-3.5 w-3.5 rounded-sm transition-transform hover:scale-125"
                style={{ background: colors[value] }}
                title={`Level ${value}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>20 tuần qua</span>
        <div className="flex items-center gap-1.5">
          <span>Ít</span>
          {colors.map((c, i) => (
            <span
              key={i}
              className="h-3 w-3 rounded-sm"
              style={{ background: c }}
            />
          ))}
          <span>Nhiều</span>
        </div>
      </div>
    </div>
  )
}
