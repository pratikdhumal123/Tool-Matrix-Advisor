import type {
  AdvisorAnswerUpdateRequest,
  AdvisorAnswerUpdateResponse,
  AdvisorRecord,
  DashboardResponse,
} from './types'

const apiRoot = import.meta.env.VITE_API_URL ?? '/api/v1'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiRoot}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    const fallback = 'Request failed'

    try {
      const body = (await response.json()) as { detail?: string }
      throw new Error(body.detail ?? fallback)
    } catch {
      throw new Error(fallback)
    }
  }

  return (await response.json()) as T
}

export function fetchDashboard() {
  return request<DashboardResponse>('/dashboard')
}

export function fetchAdvisors() {
  return request<AdvisorRecord[]>('/advisors')
}

export function updateAdvisorAnswer(
  advisorId: string,
  questionId: string,
  answer: AdvisorAnswerUpdateRequest['answer'],
) {
  const payload: AdvisorAnswerUpdateRequest = { answer }

  return request<AdvisorAnswerUpdateResponse>(`/advisors/${advisorId}/questions/${questionId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function resetAdvisorAnswers(advisorId: string) {
  return request<AdvisorAnswerUpdateResponse>(`/advisors/${advisorId}/answers`, {
    method: 'DELETE',
  })
}