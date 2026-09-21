from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    quantity: int = Field(default=0, ge=0)
    category: str | None = Field(default=None, max_length=100)
    description: str | None = None
    location: str | None = Field(default=None, max_length=100)


class ItemCreate(ItemBase):
    pass


class ItemUpdate(ItemBase):
    pass


class ItemResponse(ItemBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)