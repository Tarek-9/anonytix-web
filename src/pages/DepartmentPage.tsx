import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDepartmentDashboard } from '@/lib/api'
import type { DepartmentDashboard } from '@/lib/types'
import { CategoryScoresChart } from '@/components/charts/CategoryScoresChart'
import { SatisfactionTrendChart } from '@/components/charts/SatisfactionTrendChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function DepartmentPage() {
  const { id = '' } = useParams()
  const [data, setData] = useState<DepartmentDashboard | null>(null)

  useEffect(() => {
    getDepartmentDashboard(id).then(setData)
  }, [id])

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
                {data.topTopics.map((t, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <span>{t.label}</span>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{t.mentions}×</Badge>
                      <Badge variant={t.sentiment === 'NEGATIVE' ? 'destructive' : 'outline'}>
                        {t.sentiment}
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
