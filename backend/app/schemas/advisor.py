from typing import Literal

from pydantic import BaseModel


AnswerValue = Literal['YES', 'NO']


class AdvisorQuestionRead(BaseModel):
    id: str
    prompt: str
    guidance: str
    answer: AnswerValue | None
    yes_next_question_id: str | None = None
    no_next_question_id: str | None = None
    yes_outcome_id: str | None = None
    no_outcome_id: str | None = None


class AdvisorOutcomeRead(BaseModel):
    id: str
    title: str
    details_html: str


class AdvisorRead(BaseModel):
    id: str
    name: str
    description: str
    max_questions: int
    description_html: str | None = None
    questions: list[AdvisorQuestionRead]
    outcomes: list[AdvisorOutcomeRead] = []
    current_question_id: str | None = None
    current_outcome_id: str | None = None
    answered_count: int = 0


class AdvisorAnswerUpdate(BaseModel):
    answer: AnswerValue


class AdvisorAnswerUpdateResponse(BaseModel):
    advisor: AdvisorRead