from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models import Income, Expense
from app.schemas import PaginatedTransactionResponse
from app.auth.firebase_auth import verify_firebase_token

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])


@router.get("/", response_model=PaginatedTransactionResponse)
async def get_transactions(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    category: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    price: Optional[float] = Query(None),
    user_id: str = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    # Sanitize inputs
    category = category if category and category.strip() else None
    type     = type     if type     and type.strip()     else None
    price    = price    if price is not None and price > 0 else None

    if type and type not in ("income", "expense"):
        raise HTTPException(status_code=400, detail="type must be 'income' or 'expense'")

    def fetch_records(model, label: str):
        query = db.query(model).filter(model.user_id == user_id)

        if category:
            query = query.filter(model.category == category)
        if price is not None:
            query = query.filter(model.amount.between(price - 0.01, price + 0.01))

        return [{
            "id":             str(item.id),
            "type":           label,
            "title":          item.title,
            "amount":         float(item.amount),
            "category":       item.category,
            "payment_method": getattr(item, "payment_method", None),
            "note":           getattr(item, "note", None),
            "date":           item.date,
            "created_at":     item.created_at,
        } for item in query.all()]

    try:
        if type == "income":
            final_list = fetch_records(Income, "income")
        elif type == "expense":
            final_list = fetch_records(Expense, "expense")
        else:
            final_list = fetch_records(Income, "income") + fetch_records(Expense, "expense")

        # Sort by created_at descending — most recent first
        final_list.sort(key=lambda x: x["created_at"], reverse=True)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    total_items = len(final_list)
    total_pages = max(1, (total_items + limit - 1) // limit)
    start       = (page - 1) * limit
    paginated   = final_list[start: start + limit]

    return {
        "items":       paginated,
        "total_items": total_items,
        "total_pages": total_pages,
    }

# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from typing import Optional
# from app.database import get_db
# from app.models import Income, Expense
# from app.schemas import PaginatedTransactionResponse
# from app.auth.firebase_auth import verify_firebase_token
# from datetime import date as DateType
# from app.schemas import PaginatedTransactionResponse

# router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

# @router.get("/", response_model=PaginatedTransactionResponse)
# async def get_transactions(
#     page: int = 1,
#     limit: int = 50,
#     category: Optional[str] = None,
#     date: Optional[DateType] = None,
#     type: Optional[str] = None,          # matches frontend param name
#     price: Optional[float] = None,
#     user_id: str = Depends(verify_firebase_token),
#     db: Session = Depends(get_db)
# ):
#     """
#     Get paginated transactions with optional filters.
#     """

#     # Ignore empty string filters sent from frontend
#     if not category:
#         category = None
#     if not type:
#         type = None
#     if not date:
#         date = None
#     if price == 0.0:
#         price = None

#     # Validate type
#     if type and type not in ("income", "expense"):
#         raise HTTPException(status_code=400, detail="type must be 'income' or 'expense'")

#     if page < 1:
#         raise HTTPException(status_code=400, detail="page must be >= 1")

#     if limit < 1 or limit > 200:
#         raise HTTPException(status_code=400, detail="limit must be between 1 and 200")

#     transactions = []

#     def build_query(model, t_type: str):
#         q = db.query(model).filter(model.user_id == user_id)

#         if category:
#             q = q.filter(model.category == category)
#         if date:
#             q = q.filter(model.date == date)
#         if price is not None:
#             q = q.filter(model.amount.between(price - 0.001, price + 0.001))

#         for item in q.all():
#             transactions.append({
#                 "id":             item.id,
#                 "type":           t_type,
#                 "title":          item.title,
#                 "amount":         float(item.amount),
#                 "category":       item.category,
#                 "payment_method": getattr(item, "payment_method", None),
#                 "note":           getattr(item, "note", None),
#                 "date":           item.date,
#                 "created_at":     item.created_at,
#             })

#     try:
#         if type in (None, "income"):
#             build_query(Income, "income")

#         if type in (None, "expense"):
#             build_query(Expense, "expense")

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

#     # Sort by date descending
#     transactions.sort(
#         key=lambda x: x["date"] or x["created_at"],
#         reverse=True
#     )

#     total_items = len(transactions)
#     total_pages = max(1, (total_items + limit - 1) // limit)

#     if page > total_pages and total_items > 0:
#         raise HTTPException(status_code=400, detail=f"page {page} exceeds total_pages {total_pages}")

#     # Paginate
#     start = (page - 1) * limit
#     paginated_items = transactions[start: start + limit]

#     return {
#         "items":       paginated_items,
#         "total_items": total_items,
#         "total_pages": total_pages,
#     }