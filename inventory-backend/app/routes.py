from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .database import get_db
from .models import Item
from .schemas import ItemCreate, ItemResponse, ItemUpdate


router = APIRouter(
    prefix="/items",
    tags=["Items"],
)


@router.get(
    "",
    response_model=list[ItemResponse],
)
def get_items(db: Session = Depends(get_db)):
    return (
        db.query(Item)
        .order_by(Item.id.desc())
        .all()
    )


@router.get(
    "/{item_id}",
    response_model=ItemResponse,
)
def get_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    item = (
        db.query(Item)
        .filter(Item.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )

    return item


@router.post(
    "",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_item(
    item_data: ItemCreate,
    db: Session = Depends(get_db),
):
    item = Item(
        name=item_data.name,
        quantity=item_data.quantity,
        category=item_data.category,
        description=item_data.description,
        location=item_data.location,
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


@router.put(
    "/{item_id}",
    response_model=ItemResponse,
)
def update_item(
    item_id: int,
    item_data: ItemUpdate,
    db: Session = Depends(get_db),
):
    item = (
        db.query(Item)
        .filter(Item.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )

    item.name = item_data.name
    item.quantity = item_data.quantity
    item.category = item_data.category
    item.description = item_data.description
    item.location = item_data.location

    db.commit()
    db.refresh(item)

    return item


@router.delete(
    "/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    item = (
        db.query(Item)
        .filter(Item.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )

    db.delete(item)
    db.commit()

    return None