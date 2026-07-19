from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_session
from app.schemas.advisor import AdvisorAnswerUpdate, AdvisorAnswerUpdateResponse, AdvisorRead
from app.services.advisor_service import get_advisor, list_advisors, reset_answers, update_answer


router = APIRouter()


@router.get('/health')
def healthcheck() -> dict[str, str]:
    return {'status': 'ok'}


@router.get('/advisors', response_model=list[AdvisorRead])
def get_advisors(session: Session = Depends(get_session)) -> list[AdvisorRead]:
    return list_advisors(session)


@router.get('/advisors/{advisor_id}', response_model=AdvisorRead)
def get_advisor_by_id(advisor_id: str, session: Session = Depends(get_session)) -> AdvisorRead:
    return get_advisor(session, advisor_id)


@router.put('/advisors/{advisor_id}/questions/{question_id}', response_model=AdvisorAnswerUpdateResponse)
def put_advisor_answer(
    advisor_id: str,
    question_id: str,
    payload: AdvisorAnswerUpdate,
    session: Session = Depends(get_session),
) -> AdvisorAnswerUpdateResponse:
    return AdvisorAnswerUpdateResponse(
        advisor=update_answer(session, advisor_id, question_id, payload.answer)
    )


@router.delete('/advisors/{advisor_id}/answers', response_model=AdvisorAnswerUpdateResponse)
def delete_advisor_answers(
    advisor_id: str,
    session: Session = Depends(get_session),
) -> AdvisorAnswerUpdateResponse:
    return AdvisorAnswerUpdateResponse(advisor=reset_answers(session, advisor_id))
