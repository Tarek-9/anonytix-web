import { useState } from 'react'
import { IconShieldCheck, IconCheck, IconCode, IconChevronDown } from '@tabler/icons-react'
import type { SubmitFeedbackRequest } from '@/lib/types'
import { cn } from '@/lib/utils'

const GUARANTEES = [
  'Wir fragen weder Name noch E-Mail — du musst dich nicht anmelden.',
  'Ein gemeinsamer Link für alle Mitarbeitenden — keine Zuordnung zu einer Person möglich.',
  'Freitext wird vor der Auswertung durch KI anonymisiert.',
  'Ergebnisse sind erst ab mehreren Antworten je Abteilung sichtbar.',
  'Keine IP-Adresse, kein Gerät und keine genaue Uhrzeit werden gespeichert.',
  'HR sieht ausschließlich aggregierte Auswertungen — niemals einzelne Antworten.',
]

export function AnonymityPanel({ payload }: { payload: SubmitFeedbackRequest | null }) {
  const [showPayload, setShowPayload] = useState(false)

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center gap-2 font-medium text-primary">
        <IconShieldCheck className="size-5" />
        Vollständig anonym — und so stellen wir das sicher
      </div>

      <ul className="mt-3 flex flex-col gap-2 text-sm">
        {GUARANTEES.map((g) => (
          <li key={g} className="flex items-start gap-2">
            <IconCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{g}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setShowPayload((v) => !v)}
        className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <IconCode className="size-4" />
        Was wird übermittelt?
        <IconChevronDown
          className={cn('size-4 transition-transform', showPayload && 'rotate-180')}
        />
      </button>

      {showPayload && (
        <div className="mt-2">
          <p className="mb-2 text-xs text-muted-foreground">
            Genau diese Daten verlassen deinen Browser — keine Kennung, die auf dich
            verweist:
          </p>
          <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
            {JSON.stringify(
              payload ?? { departmentId: '…', answers: [] },
              null,
              2,
            )}
          </pre>
        </div>
      )}
    </div>
  )
}
