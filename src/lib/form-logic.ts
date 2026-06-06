import type { AnswerRequest, Question } from '@/lib/types'

export type FormAnswerValue = number | string | boolean | string[]
export type FormAnswers = Record<string, FormAnswerValue>

/** Keep general questions (empty departmentIds) plus those matching the selection. */
export function filterQuestionsForDepartment(
  questions: Question[],
  departmentId: string | null,
): Question[] {
  return questions.filter(
    (q) =>
      q.departmentIds.length === 0 ||
      (departmentId !== null && q.departmentIds.includes(departmentId)),
  )
}

function isEmpty(value: FormAnswerValue | undefined): boolean {
  if (value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}

/** Build the contract answer payload — only the field matching each type is set. */
export function buildAnswerRequests(
  questions: Question[],
  answers: FormAnswers,
): AnswerRequest[] {
  const result: AnswerRequest[] = []
  for (const q of questions) {
    const value = answers[q.id]
    if (isEmpty(value)) continue
    const base: AnswerRequest = {
      questionId: q.id,
      numericValue: null,
      textValue: null,
      booleanValue: null,
      selectedOptionIds: [],
    }
    switch (q.type) {
      case 'RATING':
        base.numericValue = value as number
        break
      case 'TEXT':
        base.textValue = value as string
        break
      case 'BOOLEAN':
        base.booleanValue = value as boolean
        break
      case 'SINGLE_CHOICE':
      case 'MULTI_CHOICE':
        base.selectedOptionIds = value as string[]
        break
    }
    result.push(base)
  }
  return result
}

/** Returns a map questionId -> error message for unanswered required questions. */
export function validateAnswers(
  questions: Question[],
  answers: FormAnswers,
): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const q of questions) {
    if (q.required && isEmpty(answers[q.id])) {
      errors[q.id] = 'Required field'
    }
  }
  return errors
}
