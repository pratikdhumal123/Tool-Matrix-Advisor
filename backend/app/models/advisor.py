from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class AdvisorAnswer(Base):
    __tablename__ = 'advisor_answers'
    __table_args__ = (
        UniqueConstraint('advisor_id', 'question_id', name='uq_advisor_question_answer'),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    advisor_id: Mapped[str] = mapped_column(String(120), index=True)
    question_id: Mapped[str] = mapped_column(String(120), index=True)
    answer: Mapped[str] = mapped_column(String(3))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )