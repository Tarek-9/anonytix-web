import { Link } from 'react-router-dom'
import { IconSparkles, IconArrowRight } from '@tabler/icons-react'
import type { AiHighlight } from '@/lib/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

const DOT: Record<string, string> = {
  POSITIVE: 'bg-emerald-500',
  NEUTRAL: 'bg-amber-500',
  NEGATIVE: 'bg-red-500',
}

export function AiHighlightsCard({ highlights }: { highlights: AiHighlight[] }) {
  return (
    <Link to="/ai-overview" className="group block h-full">
      <Card className="h-full transition-colors hover:border-primary/50 hover:bg-accent/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconSparkles className="size-4 text-primary" />
            AI Highlights
            <IconArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </CardTitle>
          <CardDescription>Top 5 insights, with the full AI analysis</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {highlights.slice(0, 5).map((h, i) => (
            <div key={h.id} className="flex items-start gap-3 text-sm">
              <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                {i + 1}
              </span>
              <span
                className={cn('mt-1.5 size-2 shrink-0 rounded-full', DOT[h.sentiment])}
              />
              <span className="leading-snug">{h.text}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </Link>
  )
}
