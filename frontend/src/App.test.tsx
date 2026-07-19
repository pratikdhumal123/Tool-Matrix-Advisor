import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const advisorsResponse = [
  {
    id: 'cx-professional-services-tool-matrix',
    name: 'CX Professional Services Tool Matrix',
    description: 'desc',
    description_html: null,
    max_questions: 12,
    questions: [],
    outcomes: [],
    current_question_id: null,
    current_outcome_id: null,
    answered_count: 0,
  },
  {
    id: 'bookings',
    name: 'Bookings',
    description: 'desc',
    description_html: null,
    max_questions: 8,
    questions: [],
    outcomes: [],
    current_question_id: null,
    current_outcome_id: null,
    answered_count: 0,
  },
]

describe('App', () => {
  beforeEach(() => {
    global.fetch = vi.fn(async () => {
      return new Response(JSON.stringify(advisorsResponse), { status: 200 })
    }) as typeof fetch
  })

  it('renders the advisor list view', async () => {
    render(<App />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
      expect(screen.getByRole('button', { name: 'Bookings' })).toBeInTheDocument()
    })

    expect(screen.getByText('17 Advisors')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter a search term and press <Enter>')).toBeInTheDocument()
  })
})