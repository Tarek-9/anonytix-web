import * as React from 'react'
import { TrendingUp } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import type { SatisfactionYearRow } from '@/lib/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const YEAR_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

const ALL = 'all'

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

  const [selectedYear, setSelectedYear] = React.useState<string>(ALL)

  const visibleYears =
    selectedYear === ALL ? years : years.filter((y) => y === selectedYear)

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Zufriedenheitstrend</CardTitle>
          <CardDescription>
            Durchschnittliche Zufriedenheit pro Monat im Jahresvergleich
          </CardDescription>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[160px] sm:ml-auto" aria-label="Jahr auswählen">
            <SelectValue placeholder="Jahr" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" align="end">
            <SelectItem value={ALL}>Alle Jahre</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <LineChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => (value ?? '').slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {visibleYears.length > 1 && (
              <ChartLegend content={<ChartLegendContent />} />
            )}
            {visibleYears.map((year) => (
              <Line
                key={year}
                dataKey={year}
                type="monotone"
                stroke={`var(--color-${year})`}
                strokeWidth={2}
                dot={false}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Skala 1–5 · höher ist besser <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Durchschnittliche Monatswerte je Jahr
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
