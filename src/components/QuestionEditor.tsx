import type { Question, QuestionType } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2 } from 'lucide-react'

const TYPE_LABELS: Record<QuestionType, string> = {
  RATING: 'Bewertung (1–5)',
  TEXT: 'Freitext',
  BOOLEAN: 'Ja / Nein',
  SINGLE_CHOICE: 'Einzelauswahl',
  MULTI_CHOICE: 'Mehrfachauswahl',
}

interface QuestionEditorProps {
  question: Question
  onChange: (next: Question) => void
  onDelete: () => void
}

export function QuestionEditor({ question, onChange, onDelete }: QuestionEditorProps) {
  const hasOptions =
    question.type === 'SINGLE_CHOICE' || question.type === 'MULTI_CHOICE'

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-start gap-2">
        <Input
          value={question.text}
          placeholder="Fragetext"
          onChange={(e) => onChange({ ...question, text: e.target.value })}
        />
        <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Frage löschen">
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Select
          value={question.type}
          onValueChange={(v) =>
            onChange({ ...question, type: v as QuestionType, options: [] })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(TYPE_LABELS) as QuestionType[]).map((t) => (
              <SelectItem key={t} value={t}>
                {TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={question.required}
            onCheckedChange={(c) => onChange({ ...question, required: c === true })}
          />
          Pflichtfrage
        </label>
      </div>

      {hasOptions && (
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">Antwortoptionen</Label>
          {question.options.map((opt, i) => (
            <div key={opt.id} className="flex gap-2">
              <Input
                value={opt.label}
                onChange={(e) =>
                  onChange({
                    ...question,
                    options: question.options.map((o, j) =>
                      j === i ? { ...o, label: e.target.value } : o,
                    ),
                  })
                }
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Option löschen"
                onClick={() =>
                  onChange({
                    ...question,
                    options: question.options.filter((_, j) => j !== i),
                  })
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() =>
              onChange({
                ...question,
                options: [
                  ...question.options,
                  {
                    id: `opt-${question.id}-${question.options.length}`,
                    label: 'Neue Option',
                    value: `OPT_${question.options.length}`,
                    position: question.options.length + 1,
                  },
                ],
              })
            }
          >
            Option hinzufügen
          </Button>
        </div>
      )}
    </div>
  )
}
