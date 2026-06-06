import * as React from 'react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
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

const YEAR_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export function SatisfactionByYearChart({ data }: { data: SatisfactionYearRow[] }) {
  const years = React.useMemo(
    () => (data[0] ? Object.keys(data[0]).filter((k) => k !== 'month') : []),
    [data],
  )

  const config = React.useMemo(() => {
    const c: ChartConfig = {}
    years.forEach((y, i) => {
      c[y] = { label: y, color: YEAR_COLORS[i % YEAR_COLORS.length] }
    })
    return c
  }, [years])

  const averages = React.useMemo(() => {
    const out: Record<string, number> = {}
    for (const y of years) {
      const vals = data
        .map((r) => r[y])
        .filter((v): v is number => typeof v === 'number')
      out[y] = vals.length
        ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1))
        : 0
    }
    return out
  }, [years, data])

  const [activeYear, setActiveYear] = React.useState<string>(
    years[years.length - 1] ?? '',
  )

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Zufriedenheitstrend</CardTitle>
          <CardDescription>
            Durchschnittliche Zufriedenheit pro Monat im Jahresvergleich
          </CardDescription>
        </div>
        <div className="flex">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              data-active={activeYear === year}
              className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveYear(year)}
            >
              <span className="text-xs text-muted-foreground">{year}</span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {averages[year]} / 5
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={16}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[160px]"
                  nameKey={activeYear}
                  labelFormatter={(value) => `${value} ${activeYear}`}
                />
              }
            />
            <Line
              dataKey={activeYear}
              type="monotone"
              stroke={`var(--color-${activeYear})`}
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
