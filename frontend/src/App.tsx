import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { fetchAdvisors, resetAdvisorAnswers, updateAdvisorAnswer } from './api'
import './App.css'
import type { AdvisorAnswer, AdvisorRecord } from './types'

function App() {
  const [advisors, setAdvisors] = useState<AdvisorRecord[]>([])
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string | null>(null)
  const [expandedAdvisorIds, setExpandedAdvisorIds] = useState<string[]>([
    'bookings',
    'conflict-board-membership',
    'conflict-family-member-employment',
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatingKey, setUpdatingKey] = useState('')

  const deferredSearch = useDeferredValue(searchTerm)

  useEffect(() => {
    const loadAdvisors = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetchAdvisors()
        startTransition(() => {
          setAdvisors(response)
        })
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : 'Unable to load advisors.',
        )
      } finally {
        setLoading(false)
      }
    }

    void loadAdvisors()
  }, [])

  const filteredAdvisors = useMemo(() => {
    if (!deferredSearch.trim()) {
      return advisors
    }

    const normalized = deferredSearch.trim().toLowerCase()
    return advisors.filter(
      (advisor) =>
        advisor.name.toLowerCase().includes(normalized) ||
        advisor.description.toLowerCase().includes(normalized),
    )
  }, [advisors, deferredSearch])

  const selectedAdvisor =
    advisors.find((advisor) => advisor.id === selectedAdvisorId) ?? advisors[0] ?? null

  const currentQuestion = (selectedAdvisor?.questions ?? []).find(
    (question) => question.id === selectedAdvisor.current_question_id,
  ) ?? null

  const questionPath = useMemo(() => {
    if (!selectedAdvisor || selectedAdvisor.questions.length === 0) {
      return []
    }

    const lookup = new Map(
      selectedAdvisor.questions.map((question) => [question.id, question]),
    )
    const path = [] as typeof selectedAdvisor.questions
    const visited = new Set<string>()
    let cursor: string | null = selectedAdvisor.questions[0]?.id ?? null

    while (cursor && !visited.has(cursor)) {
      const question = lookup.get(cursor)
      if (!question) {
        break
      }

      path.push(question)
      visited.add(cursor)

      if (question.answer !== 'YES' && question.answer !== 'NO') {
        break
      }

      const nextQuestionId =
        question.answer === 'YES'
          ? question.yes_next_question_id
          : question.no_next_question_id
      const nextOutcomeId =
        question.answer === 'YES' ? question.yes_outcome_id : question.no_outcome_id

      if (nextOutcomeId) {
        break
      }

      cursor = nextQuestionId
    }

    return path
  }, [selectedAdvisor])

  const currentOutcome = (selectedAdvisor?.outcomes ?? []).find(
    (outcome) => outcome.id === selectedAdvisor.current_outcome_id,
  ) ?? null

  const toggleAdvisor = (advisorId: string) => {
    setExpandedAdvisorIds((current) =>
      current.includes(advisorId)
        ? current.filter((id) => id !== advisorId)
        : [...current, advisorId],
    )
  }

  const expandAll = () => {
    setExpandedAdvisorIds(filteredAdvisors.map((advisor) => advisor.id))
  }

  const collapseAll = () => {
    setExpandedAdvisorIds([])
  }

  const setAnswer = async (
    advisorId: string,
    questionId: string,
    answer: Exclude<AdvisorAnswer, null>,
  ) => {
    setUpdatingKey(`${advisorId}:${questionId}`)
    setError('')

    try {
      const response = await updateAdvisorAnswer(advisorId, questionId, answer)
      setAdvisors((current) =>
        current.map((advisor) =>
          advisor.id === advisorId ? response.advisor : advisor,
        ),
      )
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Unable to update the selected answer.',
      )
    } finally {
      setUpdatingKey('')
    }
  }

  const restartAdvisor = async (advisorId: string) => {
    setUpdatingKey(`reset:${advisorId}`)
    setError('')

    try {
      const response = await resetAdvisorAnswers(advisorId)
      setAdvisors((current) =>
        current.map((advisor) =>
          advisor.id === advisorId ? response.advisor : advisor,
        ),
      )
    } catch (resetError) {
      setError(
        resetError instanceof Error ? resetError.message : 'Unable to restart the advisor.',
      )
    } finally {
      setUpdatingKey('')
    }
  }

  const showListView = selectedAdvisorId === null

  return (
    <div className="matrix-app-shell">
      <div className="matrix-frame">
        <header className="site-header">
          <div className="utility-bar">
            <span className="confidential-label">CISCO CONFIDENTIAL</span>
            <div className="utility-links">
              <a href="/">Filter By Organization [Change]</a>
              <span>|</span>
              <a href="/">Terms of Use</a>
              <span>|</span>
              <a href="/">Feedback</a>
              <span>|</span>
              <a href="/">Help</a>
            </div>
          </div>

          <div className="brand-bar">
            <div className="brand-block">
              <div className="cisco-mark" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div>
                <p className="brand-name">CISCO</p>
              </div>
            </div>

            <div className="title-nav-wrap">
              <h1 className="site-title">Data Advisor</h1>
              <nav className="primary-nav" aria-label="Primary">
                <a href="/">Home</a>
                <a href="/">Data Classification Wizard</a>
                <a href="/">Tool Advisor</a>
                <a href="/">Data Categories</a>
                <a href="/" className="active">
                  <span className="new-pill">NEW</span>
                  More Advisors
                </a>
                <a href="/">Find A Tool</a>
              </nav>
            </div>

            <button type="button" className="feedback-button">
              Feedback
            </button>
          </div>
        </header>

        {showListView ? (
          <section className="matrix-page advisor-list-page">
            <header className="advisor-list-header">
              <div>
                <h2 className="section-title">17 Advisors</h2>
              </div>

              <label className="search-field" htmlFor="advisor-search">
                <span>Quick Search</span>
                <input
                  id="advisor-search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Enter a search term and press <Enter>"
                />
              </label>
            </header>

            {error ? <p className="page-error">{error}</p> : null}
            {loading ? <p className="page-muted">Loading advisors...</p> : null}

            <div className="list-actions">
              <button type="button" className="link-button" onClick={expandAll}>
                Expand All
              </button>
              <span className="divider">|</span>
              <button type="button" className="link-button" onClick={collapseAll}>
                Collapse All
              </button>
            </div>

            <div className="advisor-list">
              {filteredAdvisors.map((advisor) => {
                const expanded = expandedAdvisorIds.includes(advisor.id)

                return (
                  <article key={advisor.id} className="advisor-card">
                    <div className="advisor-card-top">
                      <button
                        type="button"
                        className="expand-chip"
                        aria-label={expanded ? `Collapse ${advisor.name}` : `Expand ${advisor.name}`}
                        onClick={() => toggleAdvisor(advisor.id)}
                      >
                        <span className={expanded ? 'chevron up' : 'chevron'} />
                      </button>

                      <div className="advisor-card-copy">
                        <button
                          type="button"
                          className="advisor-title"
                          onClick={() => setSelectedAdvisorId(advisor.id)}
                        >
                          {advisor.name}
                        </button>
                        {expanded ? <p>{advisor.description}</p> : null}
                      </div>

                      <div className="advisor-card-meta">
                        <span>Max Questions: {advisor.max_questions}</span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ) : (
          <section className="matrix-page question-page">
            <button
              type="button"
              className="close-page"
              aria-label="Close advisor"
              onClick={() => setSelectedAdvisorId(null)}
            >
              ×
            </button>

            <div className="question-page-headline">
              <div>
                <h2 className="section-title">{selectedAdvisor.name}</h2>
                {selectedAdvisor.description_html ? (
                  <div
                    className="rich-text-block"
                    dangerouslySetInnerHTML={{ __html: selectedAdvisor.description_html }}
                  />
                ) : (
                  <p>{selectedAdvisor.description}</p>
                )}
              </div>

              <div className="question-page-meta">
                <span>Max. Questions: {selectedAdvisor.max_questions}</span>
                {selectedAdvisor.questions.length > 0 ? (
                  <strong>
                    {selectedAdvisor.answered_count}/{selectedAdvisor.max_questions} Questions Answered
                  </strong>
                ) : null}
              </div>
            </div>

            {error ? <p className="page-error">{error}</p> : null}

            <div className="list-actions detail-actions">
              <button
                type="button"
                className="link-button"
                disabled={updatingKey === `reset:${selectedAdvisor.id}`}
                onClick={() => void restartAdvisor(selectedAdvisor.id)}
              >
                Start Over
              </button>
              <span className="divider">|</span>
              <button type="button" className="link-button" onClick={() => setSelectedAdvisorId(null)}>
                Back To Advisors
              </button>
            </div>

            {currentOutcome ? (
              <section className="outcome-panel">
                <h2>{currentOutcome.title}</h2>
                <div
                  className="rich-text-block outcome-html"
                  dangerouslySetInnerHTML={{ __html: currentOutcome.details_html }}
                />
              </section>
            ) : questionPath.length > 0 ? (
              <div className="question-list">
                {questionPath.map((question) => {
                  const isCurrent = question.id === currentQuestion?.id

                  return (
                    <article
                      key={question.id}
                      className={isCurrent ? 'question-row active-question-row' : 'question-row'}
                    >
                      <div className="question-topline">
                        <button type="button" className="expand-chip static" aria-hidden="true">
                          <span className="chevron up" />
                        </button>

                        <div className="question-copy">
                          <div className="question-line">
                            <p>{question.prompt}</p>
                            <div className="answer-options" role="radiogroup" aria-label={question.prompt}>
                              <label>
                                <input
                                  type="radio"
                                  name={question.id}
                                  checked={question.answer === 'YES'}
                                  disabled={updatingKey === `${selectedAdvisor.id}:${question.id}`}
                                  onChange={() =>
                                    void setAnswer(selectedAdvisor.id, question.id, 'YES')
                                  }
                                />
                                <span>YES</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name={question.id}
                                  checked={question.answer === 'NO'}
                                  disabled={updatingKey === `${selectedAdvisor.id}:${question.id}`}
                                  onChange={() =>
                                    void setAnswer(selectedAdvisor.id, question.id, 'NO')
                                  }
                                />
                                <span>NO</span>
                              </label>
                            </div>
                          </div>

                          {question.guidance ? (
                            <p className="guidance-text">{question.guidance}</p>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <p className="page-muted">No workflow steps are configured for this advisor yet.</p>
            )}
          </section>
        )}

        <footer className="page-footer">
          <p>Cisco Systems, Inc. Cisco Confidential.</p>
          <div>
            <a href="/">About</a>
            <span>|</span>
            <a href="/">Help</a>
            <span>|</span>
            <a href="/">Support and Feedback</a>
            <span>|</span>
            <span>Version: 2.9.1</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
