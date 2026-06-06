import type { Kpi } from '@/lib/types'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Reveal } from '@/components/motion/Reveal'
import { CountUp } from '@/components/motion/CountUp'

function suffix(kpi: Kpi): string {
  if (kpi.unit === 'PERCENT') return '%'
  if (kpi.unit === 'OUT_OF_5') return ' / 5'
  return ''
}

export function KpiCards({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {kpis.map((kpi, i) => {
        const decimals = kpi.unit === 'OUT_OF_5' ? 1 : 0
        return (
          <Reveal key={kpi.key} index={i} variant="up">
            <Card className="@container/card h-full transition-shadow duration-(--motion-fast) hover:shadow-sm">
              <CardHeader>
                <CardDescription>{kpi.label}</CardDescription>
                <CardTitle className="font-display text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  <CountUp
                    value={kpi.value}
                    decimals={decimals}
                    format={(n) => `${n.toFixed(decimals)}${suffix(kpi)}`}
                  />
                </CardTitle>
              </CardHeader>
              {kpi.detail && (
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="text-muted-foreground">{kpi.detail}</div>
                </CardFooter>
              )}
            </Card>
          </Reveal>
        )
      })}
    </div>
  )
}
