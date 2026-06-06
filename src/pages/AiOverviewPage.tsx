import { useEffect, useState } from 'react'
import { IconSparkles } from '@tabler/icons-react'
import { getDashboardOverview } from '@/lib/api'
import type { DashboardOverview } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const DOT: Record<string, string> = {
  POSITIVE: 'bg-emerald-500',
  NEUTRAL: 'bg-amber-500',
  NEGATIVE: 'bg-red-500',
}

export default function AiOverviewPage() {
  const [data, setData] = useState<DashboardOverview | null>(null)

  useEffect(() => {
    getDashboardOverview().then(setData)
  }, [])

  if (!data) return <p className="text-muted-foreground">Loading...</p>

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <IconSparkles className="size-6 text-primary" />
          AI Analysis
        </h1>
        <p className="text-muted-foreground">
          {data.company.name} · {data.campaign.name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p>{data.aiSummary.summary}</p>
          <p className="text-xs text-muted-foreground">{data.aiSummary.disclaimer}</p>
        </CardContent>
      </Card>

      {data.aiHighlights && (
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {data.aiHighlights.map((h, i) => (
              <div key={h.id} className="flex items-start gap-3 text-sm">
                <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                  {i + 1}
                </span>
                <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', DOT[h.sentiment])} />
                <span className="leading-snug">{h.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Detected Topics</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {data.topTopics.map((t, i) => (
            <div key={t.id ?? i} className="flex items-center justify-between gap-4 border-b pb-3 last:border-0">
              <span>{t.label}</span>
              <div className="flex shrink-0 gap-2">
                <Badge variant="secondary">{t.mentions}×</Badge>
                <Badge variant={t.sentiment === 'NEGATIVE' ? 'destructive' : 'outline'}>
                  {t.sentiment}
                </Badge>
                <Badge variant={t.priority === 'HIGH' ? 'destructive' : 'outline'}>
                  {t.priority}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {data.recommendedActions.map((a) => (
            <div key={a.id} className="flex items-start justify-between gap-4 border-b pb-3 last:border-0">
              <div>
                <p className="font-medium">{a.title}</p>
                <p className="text-sm text-muted-foreground">{a.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Badge variant={a.priority === 'HIGH' ? 'destructive' : 'secondary'}>
                  {a.priority}
                </Badge>
                <Badge variant="outline">{a.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
