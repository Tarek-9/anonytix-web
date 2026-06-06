import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { listSurveys } from '@/lib/api'
import type { Survey } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Reveal } from '@/components/motion/Reveal'
import { IconCircleCheck, IconCheck, IconCopy } from '@tabler/icons-react'

interface PublishState {
  publishedUrl?: string
}

export default function SurveysListPage() {
  const [surveys, setSurveys] = useState<Survey[] | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const publishedUrl = (location.state as PublishState | null)?.publishedUrl ?? null
  const [link, setLink] = useState<string | null>(publishedUrl)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    listSurveys().then(setSurveys)
  }, [])

  // Clear router state so the overlay doesn't reopen on refresh/back.
  useEffect(() => {
    if (publishedUrl) {
      window.history.replaceState({}, '')
    }
  }, [publishedUrl])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Surveys</h1>
        <Button onClick={() => navigate('/surveys/new')}>
          Create survey
        </Button>
      </div>

      {!surveys ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {surveys.map((s, i) => (
            <Reveal key={s.id} index={i} step={50}>
              <Card className="h-full transition-shadow duration-(--motion-fast) hover:shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">{s.title}</CardTitle>
                  <Badge variant={s.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                    {s.status}
                  </Badge>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/surveys/${s.id}`}>Edit</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/dashboard">Results</Link>
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      )}

      <Dialog
        open={link !== null}
        onOpenChange={(open) => {
          if (!open) {
            setLink(null)
            setCopied(false)
          }
        }}
      >
        <DialogContent>
          <DialogHeader className="items-center text-center sm:text-center">
            <div className="success-pop mb-1 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <IconCircleCheck className="size-7" />
            </div>
            <DialogTitle className="font-display text-xl">
              Survey published
            </DialogTitle>
          </DialogHeader>
          <Reveal variant="fade" delay={120} className="flex flex-col gap-3">
            <p className="text-center text-sm text-muted-foreground">
              Share this single general link with employees:
            </p>
            <div className="flex gap-2">
              <Input readOnly value={link ?? ''} className="font-mono text-xs" />
              <Button
                onClick={() => {
                  if (link) navigator.clipboard.writeText(link)
                  setCopied(true)
                }}
              >
                {copied ? (
                  <>
                    <IconCheck className="size-4" /> Copied
                  </>
                ) : (
                  <>
                    <IconCopy className="size-4" /> Copy
                  </>
                )}
              </Button>
            </div>
          </Reveal>
        </DialogContent>
      </Dialog>
    </div>
  )
}
