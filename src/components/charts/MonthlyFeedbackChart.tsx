import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import type { MonthlyFeedback } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const config = {
  positive: { label: 'Positive', color: '#2563eb' },
  negative: { label: 'Negative', color: '#dc2626' },
} satisfies ChartConfig

export function MonthlyFeedbackChart({ data }: { data: MonthlyFeedback[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback by Month</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="max-h-72 w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => (value ?? '').slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="positive" fill="var(--color-positive)" radius={4} />
            <Bar dataKey="negative" fill="var(--color-negative)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
