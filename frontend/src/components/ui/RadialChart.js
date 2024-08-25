"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import colors from 'tailwindcss/colors'
import { displayScore } from '@/lib/utils'

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
}

export function RadialChart({ score }) {
  const chartData = [{ score, neg: 10 - score }]
  let color = colors.green[500];
  let emoji = '🌳';

  if (score < 2.5) {
    color = colors.red[500];
    emoji = '🔥';
  } else if (score < 5) {
    color = colors.yellow[500];
    emoji = '🌱';
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="-mb-20 mx-auto aspect-square w-full max-w-[250px]"
    >
      <RadialBarChart
        data={chartData}
        endAngle={180}
        innerRadius={80}
        outerRadius={130}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {emoji} {displayScore(score)}
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="neg"
          stackId="a"
          cornerRadius={5}
          fill="white"
          className="stroke-gray-100 stroke-2"
        />
        <RadialBar
          dataKey="score"
          fill={color}
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  )
}
