from __future__ import annotations

from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class OrderStatus(StrEnum):
    PENDING = 'PENDING'
    READY = 'READY'
    COLLECTED = 'COLLECTED'


class Order(Base):
    __tablename__ = 'orders'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_ref: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    customer_name: Mapped[str] = mapped_column(String(120))
    advisor_name: Mapped[str] = mapped_column(String(120))
    counter_name: Mapped[str] = mapped_column(String(160))
    counter_code: Mapped[str] = mapped_column(String(16))
    item_name: Mapped[str] = mapped_column(String(160))
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    total_amount: Mapped[float] = mapped_column(Float, default=0)
    status: Mapped[str] = mapped_column(String(16), default=OrderStatus.PENDING)
    pin: Mapped[str | None] = mapped_column(String(6), nullable=True)
    qr_payload: Mapped[str | None] = mapped_column(String(255), nullable=True)
    qr_generated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    collected_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)