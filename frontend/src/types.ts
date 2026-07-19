export interface DashboardSummary {
  total_orders: number
  ready_orders: number
  pending_orders: number
  collected_orders: number
  collection_rate: number
  revenue_in_queue: number
}

export interface DashboardResponse {
  summary: DashboardSummary
}

export type AdvisorAnswer = 'YES' | 'NO' | null

export interface AdvisorQuestion {
  id: string
  prompt: string
  guidance: string
  answer: AdvisorAnswer
  yes_next_question_id: string | null
  no_next_question_id: string | null
  yes_outcome_id: string | null
  no_outcome_id: string | null
}

export interface AdvisorOutcome {
  id: string
  title: string
  details_html: string
}

export interface AdvisorRecord {
  id: string
  name: string
  description: string
  description_html: string | null
  max_questions: number
  questions: AdvisorQuestion[]
  outcomes: AdvisorOutcome[]
  current_question_id: string | null
  current_outcome_id: string | null
  answered_count: number
}

export interface AdvisorAnswerUpdateRequest {
  answer: Exclude<AdvisorAnswer, null>
}

export interface AdvisorAnswerUpdateResponse {
  advisor: AdvisorRecord
}