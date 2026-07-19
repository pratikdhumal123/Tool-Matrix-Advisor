from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.db.database import get_session
from app.schemas.advisor import AdvisorAnswerUpdate, AdvisorAnswerUpdateResponse, AdvisorRead
from app.schemas.order import (
    CollectOrderRequest,
    CollectOrderResponse,
    DashboardResponse,
    GenerateCollectionResponse,
    ImportResponse,
    OrderCreate,
    OrderRead,
)
from app.services.order_service import (
    build_dashboard,
    collect_by_pin,
    create_order,
    generate_collection,
    import_orders,
    list_orders,
)
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


@router.get('/dashboard', response_model=DashboardResponse)
def get_dashboard(session: Session = Depends(get_session)) -> DashboardResponse:
    return build_dashboard(session)


@router.get('/orders', response_model=list[OrderRead])
def get_orders(session: Session = Depends(get_session)) -> list[OrderRead]:
    return list_orders(session)


@router.post('/orders', response_model=OrderRead, status_code=201)
def post_order(payload: OrderCreate, session: Session = Depends(get_session)) -> OrderRead:
    return create_order(session, payload)


@router.post('/orders/import', response_model=ImportResponse)
async def upload_orders(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
) -> ImportResponse:
    content = await file.read()
    imported, updated, errors = import_orders(session, file.filename or 'upload.xlsx', content)
    return ImportResponse(imported=imported, updated=updated, errors=errors)


@router.post('/orders/collect/by-pin', response_model=CollectOrderResponse)
def post_collect_by_pin(
    payload: CollectOrderRequest,
    session: Session = Depends(get_session),
) -> CollectOrderResponse:
    return CollectOrderResponse(order=collect_by_pin(session, payload.pin))


@router.post('/orders/{order_id}/generate-collection', response_model=GenerateCollectionResponse)
def post_generate_collection(order_id: int, session: Session = Depends(get_session)) -> GenerateCollectionResponse:
    return GenerateCollectionResponse(order=generate_collection(session, order_id))