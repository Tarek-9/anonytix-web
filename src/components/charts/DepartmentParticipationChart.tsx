import { Pie, PieChart } from 'recharts'
import type { HeatmapRow } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export function DepartmentParticipationChart({ rows }: { rows: HeatmapRow[] }) {
  const chartData = rows.map((r, i) => ({
    department: r.departmentName,
    participants: r.sampleSize,
    fill: COLORS[i % COLORS.length],
  }))

  const config: ChartConfig = { participants: { label: 'Teilnehmer' } }
  rows.forEach((r, i) => {
    config[r.departmentName] = {
      label: r.departmentName,
      color: COLORS[i % COLORS.length],
    }
  })

  const total = chartData.reduce((sum, d) => sum + d.participants, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teilnahme nach Abteilung</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto aspect-square max-h-64">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="department" />} />
            <Pie data={chartData} dataKey="participants" nameKey="department" />
            <ChartLegend
              content={<ChartLegendContent nameKey="department" />}
              className="flex-wrap gap-2"
            />
          </PieChart>
        </ChartContainer>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {total} Teilnehmer insgesamt
        </p>
      </CardContent>
    </Card>
  )
}
