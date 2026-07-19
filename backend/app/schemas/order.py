from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class OrderCreate(BaseModel):
    order_ref: str
    customer_name: str
    advisor_name: str
    counter_name: str
    counter_code: str
    item_name: str
    quantity: int = 1
    total_amount: float = 0
    status: str = 'PENDING'


class OrderRead(OrderCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    pin: str | None = None
    qr_payload: str | None = None
    qr_generated_at: datetime | None = None
    created_at: datetime
    collected_at: datetime | None = None


class DashboardSummary(BaseModel):
    total_orders: int
    ready_orders: int
    pending_orders: int
    collected_orders: int
    collection_rate: int
    revenue_in_queue: float


class DashboardResponse(BaseModel):
    summary: DashboardSummary
    spotlight: list[OrderRead]
    recent_collections: list[OrderRead]


class GenerateCollectionResponse(BaseModel):
    order: OrderRead


class CollectOrderRequest(BaseModel):
    pin: str = Field(min_length=4, max_length=6)


class CollectOrderResponse(BaseModel):
    order: OrderRead


class ImportResponse(BaseModel):
    imported: int
    updated: int
    errors: list[str]