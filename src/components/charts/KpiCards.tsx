import type { Kpi } from '@/lib/types'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function formatValue(kpi: Kpi): string {
  if (kpi.unit === 'PERCENT') return `${kpi.value}%`
  if (kpi.unit === 'OUT_OF_5') return `${kpi.value} / 5`
  return String(kpi.value)
}

export function KpiCards({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {kpis.map((kpi) => (
        <Card key={kpi.key} className="@container/card">
          <CardHeader>
            <CardDescription>{kpi.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {formatValue(kpi)}
            </CardTitle>
          </CardHeader>
          {kpi.detail && (
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="text-muted-foreground">{kpi.detail}</div>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}
