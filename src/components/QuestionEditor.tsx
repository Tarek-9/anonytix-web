import type { Question, QuestionType } from '@/lib/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
import { cn } from '@/lib/utils'
import { GripVertical, Trash2 } from 'lucide-react'

const TYPE_LABELS: Record<QuestionType, string> = {
  RATING: 'Rating (1–5)',
  TEXT: 'Free text',
  BOOLEAN: 'Yes / No',
  SINGLE_CHOICE: 'Single choice',
  MULTI_CHOICE: 'Multiple choice',
}

interface QuestionEditorProps {
  question: Question
  onChange: (next: Question) => void
  onDelete: () => void
}

export function QuestionEditor({ question, onChange, onDelete }: QuestionEditorProps) {
  const hasOptions =
    question.type === 'SINGLE_CHOICE' || question.type === 'MULTI_CHOICE'

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex flex-col gap-3 rounded-lg border bg-card p-4',
        // On lift the card detaches from the sheet: shadow + slight scale-up.
        isDragging
          ? 'z-10 scale-[1.01] shadow-lg'
          : 'shadow-xs transition-shadow duration-(--motion-fast)',
      )}
    >
      <div className="flex items-start gap-2">
        <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label="Move question"
          className="mt-1.5 cursor-grab touch-none rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <Input
          value={question.text}
          placeholder="Question text"
          onChange={(e) => onChange({ ...question, text: e.target.value })}
        />
        <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete question">
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
          Required question
        </label>
      </div>

      {hasOptions && (
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">Answer options</Label>
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
                aria-label="Delete option"
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
                    label: 'New option',
                    value: `OPT_${question.options.length}`,
                    position: question.options.length + 1,
                  },
                ],
              })
            }
          >
            Add option
          </Button>
        </div>
      )}
    </div>
  )
}
