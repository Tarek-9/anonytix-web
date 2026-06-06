import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getDepartmentDashboard } from '@/lib/api'
import type { DepartmentDashboard } from '@/lib/types'
import { CategoryScoresChart } from '@/components/charts/CategoryScoresChart'
import { SatisfactionTrendChart } from '@/components/charts/SatisfactionTrendChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function DepartmentPage() {
  const { id = '' } = useParams()
  const [searchParams] = useSearchParams()
  const [data, setData] = useState<DepartmentDashboard | null>(null)
  const [error, setError] = useState<string | null>(null)
  const campaignId = searchParams.get('campaignId') ?? undefined
  const year = searchParams.get('year') ?? undefined

  useEffect(() => {
    let ignore = false
    getDepartmentDashboard(id, campaignId, year)
      .then((result) => {
        if (!ignore) {
          setData(result)
          setError(null)
        }
      })
      .catch((reason: unknown) => {
        if (!ignore) {
          setError(reason instanceof Error ? reason.message : 'Department could not be loaded.')
        }
      })

    return () => {
      ignore = true
    }
  }, [id, campaignId, year])

  if (error) return <p className="text-destructive">{error}</p>
  if (!data) return <p className="text-muted-foreground">Loading...</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{data.department.name}</h1>
        <Button asChild variant="outline" size="sm">
          <Link to="/dashboard">Back</Link>
        </Button>
      </div>

      {!data.visible ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Not enough data for an anonymous view
            {data.sampleSize ? ` (${data.sampleSize} of ${data.minimumGroupSize}).` : '.'}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex gap-3">
            <Badge variant="secondary">
              Satisfaction {data.overallSatisfaction} / 5
            </Badge>
            <Badge variant="outline">
              Company average {data.companyAverage} / 5
            </Badge>
          </div>
          {data.categoryScores && (
            <CategoryScoresChart
              data={data.categoryScores}
              title="Categories (department vs. company)"
            />
          )}
          {data.trend && <SatisfactionTrendChart data={data.trend} />}
          {data.topTopics && (
            <Card>
              <CardHeader>
                <CardTitle>Top Topics</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {data.topTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <span>{topic.label}</span>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{topic.mentions}×</Badge>
                      <Badge
                        variant={topic.sentiment === 'NEGATIVE' ? 'destructive' : 'outline'}
                      >
                        {topic.sentiment}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
