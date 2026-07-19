from pathlib import Path
import os
import sys

from fastapi.testclient import TestClient


ROOT = Path(__file__).resolve().parents[1]
os.environ['DATABASE_URL'] = f"sqlite:///{(ROOT / 'test_advisor_sales.db').as_posix()}"
sys.path.append(str(ROOT))

from app.db.database import Base, SessionLocal, engine  # noqa: E402
from app.main import app  # noqa: E402
from app.services.advisor_service import ADVISOR_CATALOG  # noqa: E402
from app.services.order_service import seed_orders  # noqa: E402


def _reset_database() -> None:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
      seed_orders(session)


def test_healthcheck() -> None:
    _reset_database()
    with TestClient(app) as client:
        response = client.get('/api/v1/health')

    assert response.status_code == 200
    assert response.json() == {'status': 'ok'}


def test_collection_flow() -> None:
    _reset_database()
    with TestClient(app) as client:
        orders_response = client.get('/api/v1/orders')
        orders = orders_response.json()
        order = next(item for item in orders if item['status'] == 'READY')

        generated_response = client.post(f"/api/v1/orders/{order['id']}/generate-collection")
        generated_payload = generated_response.json()['order']

        collect_response = client.post(
            '/api/v1/orders/collect/by-pin',
            json={'pin': generated_payload['pin']},
        )

    assert generated_response.status_code == 200
    assert collect_response.status_code == 200
    assert collect_response.json()['order']['status'] == 'COLLECTED'


def test_advisor_answers_are_readable_and_updatable() -> None:
    _reset_database()
    with TestClient(app) as client:
        list_response = client.get('/api/v1/advisors')
        update_response = client.put(
            '/api/v1/advisors/cx-professional-services-tool-matrix/questions/cx-1',
            json={'answer': 'YES'},
        )
        detail_response = client.get('/api/v1/advisors/cx-professional-services-tool-matrix')

    assert list_response.status_code == 200
    assert len(list_response.json()) == len(ADVISOR_CATALOG)
    assert update_response.status_code == 200
    assert update_response.json()['advisor']['questions'][0]['answer'] == 'YES'
    assert detail_response.status_code == 200
    assert detail_response.json()['questions'][0]['answer'] == 'YES'


def test_cx_advisor_progresses_one_node_at_a_time() -> None:
    _reset_database()
    with TestClient(app) as client:
        initial = client.get('/api/v1/advisors/cx-professional-services-tool-matrix')
        first_answer = client.put(
            '/api/v1/advisors/cx-professional-services-tool-matrix/questions/cx-1',
            json={'answer': 'YES'},
        )
        second_answer = client.put(
            '/api/v1/advisors/cx-professional-services-tool-matrix/questions/cx-2',
            json={'answer': 'YES'},
        )
        branch_answer = client.put(
            '/api/v1/advisors/cx-professional-services-tool-matrix/questions/cx-3',
            json={'answer': 'YES'},
        )
        outcome_answer = client.put(
            '/api/v1/advisors/cx-professional-services-tool-matrix/questions/cx-6',
            json={'answer': 'YES'},
        )
        reset_response = client.delete('/api/v1/advisors/cx-professional-services-tool-matrix/answers')

    assert initial.status_code == 200
    assert initial.json()['current_question_id'] == 'cx-1'
    assert first_answer.json()['advisor']['current_question_id'] == 'cx-2'
    assert second_answer.json()['advisor']['current_question_id'] == 'cx-3'
    assert branch_answer.json()['advisor']['current_question_id'] == 'cx-6'
    assert outcome_answer.json()['advisor']['current_outcome_id'] == 'cx-o13'
    assert reset_response.json()['advisor']['current_question_id'] == 'cx-1'