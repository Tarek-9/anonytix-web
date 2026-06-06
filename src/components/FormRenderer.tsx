import type { PublicForm, Question } from '@/lib/types'
import type { FormAnswers, FormAnswerValue } from '@/lib/form-logic'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface FormRendererProps {
  form: PublicForm
  answers: FormAnswers
  errors: Record<string, string>
  onDepartmentChange: (departmentId: string) => void
  onAnswerChange: (questionId: string, value: FormAnswerValue) => void
}

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: Question
  value: FormAnswerValue | undefined
  onChange: (value: FormAnswerValue) => void
}) {
  switch (question.type) {
    case 'RATING': {
      const min = question.minimumValue ?? 1
      const max = question.maximumValue ?? 5
      const scale = Array.from({ length: max - min + 1 }, (_, i) => min + i)
      return (
        <div className="flex gap-2">
          {scale.map((n) => (
            <Button
              key={n}
              type="button"
              variant={value === n ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChange(n)}
            >
              {n}
            </Button>
          ))}
        </div>
      )
    }
    case 'TEXT':
      return (
        <Textarea
          maxLength={question.maximumLength ?? undefined}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )
    case 'BOOLEAN':
      return (
        <div className="flex gap-2">
          <Button
            type="button"
            variant={value === true ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(true)}
          >
            Ja
          </Button>
          <Button
            type="button"
            variant={value === false ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(false)}
          >
            Nein
          </Button>
        </div>
      )
    case 'SINGLE_CHOICE':
      return (
        <RadioGroup
          value={(value as string[])?.[0] ?? ''}
          onValueChange={(v) => onChange([v])}
        >
          {question.options.map((opt) => (
            <div key={opt.id} className="flex items-center gap-2">
              <RadioGroupItem value={opt.id} id={opt.id} />
              <Label htmlFor={opt.id}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      )
    case 'MULTI_CHOICE': {
      const selected = (value as string[]) ?? []
      return (
        <div className="flex flex-col gap-2">
          {question.options.map((opt) => (
            <div key={opt.id} className="flex items-center gap-2">
              <Checkbox
                id={opt.id}
                checked={selected.includes(opt.id)}
                onCheckedChange={(checked) =>
                  onChange(
                    checked
                      ? [...selected, opt.id]
                      : selected.filter((id) => id !== opt.id),
                  )
                }
              />
              <Label htmlFor={opt.id}>{opt.label}</Label>
            </div>
          ))}
        </div>
      )
    }
  }
}

export function FormRenderer({
  form,
  answers,
  errors,
  onDepartmentChange,
  onAnswerChange,
}: FormRendererProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label>
          Abteilung <span className="text-destructive">*</span>
        </Label>
        <Select
          value={form.selectedDepartmentId ?? ''}
          onValueChange={onDepartmentChange}
        >
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Abteilung auswählen" />
          </SelectTrigger>
          <SelectContent>
            {form.departments.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {form.selectedDepartmentId &&
        form.questions.map((q) => (
          <div key={q.id} className="flex flex-col gap-2">
            <Label className={cn(errors[q.id] && 'text-destructive')}>
              {q.text}
              {q.required && <span className="text-destructive"> *</span>}
            </Label>
            {q.helpText && (
              <p className="text-sm text-muted-foreground">{q.helpText}</p>
            )}
            <QuestionField
              question={q}
              value={answers[q.id]}
              onChange={(v) => onAnswerChange(q.id, v)}
            />
            {errors[q.id] && (
              <p className="text-sm text-destructive">{errors[q.id]}</p>
            )}
          </div>
        ))}
    </div>
  )
}
