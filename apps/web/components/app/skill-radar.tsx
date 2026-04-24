"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts"

interface SkillDatum {
  skill:    string
  value:    number
  fullMark: number
}

const MOCK: SkillDatum[] = [
  { skill: "Listen", value: 78, fullMark: 100 },
  { skill: "Read", value: 85, fullMark: 100 },
  { skill: "Speak", value: 62, fullMark: 100 },
  { skill: "Write", value: 70, fullMark: 100 },
  { skill: "Vocab", value: 88, fullMark: 100 },
  { skill: "Grammar", value: 75, fullMark: 100 },
]

export function SkillRadar({ data }: { data?: SkillDatum[] }) {
  const chartData = data && data.length > 0 ? data : MOCK
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} outerRadius="75%">
          <PolarGrid
            stroke="rgba(158, 174, 199, 0.3)"
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <PolarRadiusAxis
            axisLine={false}
            tick={false}
            domain={[0, 100]}
          />
          <Radar
            dataKey="value"
            stroke="#5352a5"
            strokeWidth={2}
            fill="url(#radarFill)"
            fillOpacity={0.5}
          />
          <defs>
            <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a19ff9" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#702ae1" stopOpacity={0.3} />
            </linearGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
