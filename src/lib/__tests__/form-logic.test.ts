import { describe, it, expect } from 'vitest'
import {
  filterQuestionsForDepartment,
  buildAnswerRequests,
  validateAnswers,
  type FormAnswers,
} from '@/lib/form-logic'
import type { Question } from '@/lib/types'

function q(partial: Partial<Question> & Pick<Question, 'id' | 'type'>): Question {
  return {
    text: 't',
    helpText: null,
    category: 'C',
    required: false,
    position: 1,
    minimumValue: null,
    maximumValue: null,
    maximumLength: null,
    analyzeWithAi: false,
    departmentIds: [],
    options: [],
    ...partial,
  }
}

describe('filterQuestionsForDepartment', () => {
  const general = q({ id: 'g', type: 'TEXT', departmentIds: [] })
  const devOnly = q({ id: 'd', type: 'TEXT', departmentIds: ['dev'] })

  it('returns only general questions when no department selected', () => {
    const result = filterQuestionsForDepartment([general, devOnly], null)
    expect(result.map((x) => x.id)).toEqual(['g'])
  })

  it('includes department-specific questions when selected', () => {
    const result = filterQuestionsForDepartment([general, devOnly], 'dev')
    expect(result.map((x) => x.id)).toEqual(['g', 'd'])
  })

  it('excludes other departments questions', () => {
    const result = filterQuestionsForDepartment([general, devOnly], 'sales')
    expect(result.map((x) => x.id)).toEqual(['g'])
  })
})

describe('buildAnswerRequests', () => {
  it('maps each type to only its value field', () => {
    const questions: Question[] = [
      q({ id: 'r', type: 'RATING' }),
      q({ id: 't', type: 'TEXT' }),
      q({ id: 'b', type: 'BOOLEAN' }),
      q({ id: 's', type: 'SINGLE_CHOICE' }),
      q({ id: 'm', type: 'MULTI_CHOICE' }),
    ]
    const answers: FormAnswers = {
      r: 4,
      t: 'hallo',
      b: true,
      s: ['opt1'],
      m: ['opt1', 'opt2'],
    }
    expect(buildAnswerRequests(questions, answers)).toEqual([
      { questionId: 'r', numericValue: 4, textValue: null, booleanValue: null, selectedOptionIds: [] },
      { questionId: 't', numericValue: null, textValue: 'hallo', booleanValue: null, selectedOptionIds: [] },
      { questionId: 'b', numericValue: null, textValue: null, booleanValue: true, selectedOptionIds: [] },
      { questionId: 's', numericValue: null, textValue: null, booleanValue: null, selectedOptionIds: ['opt1'] },
      { questionId: 'm', numericValue: null, textValue: null, booleanValue: null, selectedOptionIds: ['opt1', 'opt2'] },
    ])
  })

  it('omits questions with no answer', () => {
    const questions: Question[] = [q({ id: 't', type: 'TEXT' })]
    expect(buildAnswerRequests(questions, {})).toEqual([])
  })
})

describe('validateAnswers', () => {
  it('flags missing required answers', () => {
    const questions: Question[] = [q({ id: 't', type: 'TEXT', required: true })]
    const errors = validateAnswers(questions, {})
    expect(errors).toEqual({ t: 'Required field' })
  })

  it('passes when required answers are present', () => {
    const questions: Question[] = [q({ id: 't', type: 'TEXT', required: true })]
    expect(validateAnswers(questions, { t: 'x' })).toEqual({})
  })

  it('treats empty string and empty array as missing', () => {
    const questions: Question[] = [
      q({ id: 't', type: 'TEXT', required: true }),
      q({ id: 'm', type: 'MULTI_CHOICE', required: true }),
    ]
    expect(validateAnswers(questions, { t: '', m: [] })).toEqual({
      t: 'Required field',
      m: 'Required field',
    })
  })
})
