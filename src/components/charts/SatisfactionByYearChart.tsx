import * as React from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import type { SatisfactionYearRow } from '@/lib/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

export function SatisfactionByYearChart({
  data,
  year,
}: {
  data: SatisfactionYearRow[]
  year: string
}) {
  const config = React.useMemo(
    () => ({ [year]: { label: year, color: 'var(--chart-1)' } }) as ChartConfig,
    [year],
  )

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="border-b p-4 sm:p-6">
        <CardTitle>Zufriedenheitstrend</CardTitle>
        <CardDescription>
          Durchschnittliche Zufriedenheit pro Monat — {year}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
          <LineChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={16}
            />
            <YAxis domain={[0, 5]} width={32} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent className="w-[160px]" />} />
            <Line
              dataKey={year}
              type="monotone"
              stroke={`var(--color-${year})`}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
