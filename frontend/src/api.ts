import type {
  AdvisorAnswerUpdateRequest,
  AdvisorAnswerUpdateResponse,
  AdvisorRecord,
  CollectOrderRequest,
  CollectOrderResponse,
  DashboardResponse,
  GenerateCollectionResponse,
  Order,
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

export function fetchOrders() {
  return request<Order[]>('/orders')
}

export function generateCollectionQr(orderId: number) {
  return request<GenerateCollectionResponse>(`/orders/${orderId}/generate-collection`, {
    method: 'POST',
  })
}

export function collectOrderByPin(pin: string) {
  const payload: CollectOrderRequest = { pin }

  return request<CollectOrderResponse>('/orders/collect/by-pin', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
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