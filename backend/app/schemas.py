from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from decimal import Decimal


# ── Income Schemas ─────────────────────────────────────────────────────────────

class IncomeCreate(BaseModel):
    title: Optional[str] = Field(None, max_length=255, description="Income title/description")
    amount: Decimal = Field(..., gt=0, description="Amount must be positive")
    category: str = Field(..., description="Income category")
    date: Optional[datetime] = None

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Monthly Salary",
                "amount": 5000.00,
                "category": "Salary/Wages",
                "date": "2025-01-08T10:00:00Z"
            }
        }


class IncomeResponse(BaseModel):
    id: str
    user_id: str
    title: Optional[str]
    amount: Decimal
    category: str
    date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ── Expense Schemas ────────────────────────────────────────────────────────────

class ExpenseCreate(BaseModel):
    title: Optional[str] = Field(None, max_length=255, description="Expense title")
    amount: Decimal = Field(..., gt=0, description="Amount must be positive")
    category: str = Field(..., description="Expense category")
    payment_method: Optional[str] = Field(None, description="Payment method: Cash or Bank")
    note: Optional[str] = Field(None, description="Optional note")
    date: Optional[datetime] = None

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Grocery Shopping",
                "amount": 150.50,
                "category": "Food & Drink",
                "payment_method": "Cash",
                "note": "Weekly groceries",
                "date": "2025-01-08T10:00:00Z"
            }
        }


class ExpenseResponse(BaseModel):
    id: str
    user_id: str
    title: Optional[str]
    amount: Decimal
    category: str
    payment_method: Optional[str]
    note: Optional[str]
    date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ── Transaction Schemas (Combined Income + Expense) ────────────────────────────

class TransactionItem(BaseModel):
    """Represents a single transaction (income or expense)."""
    id: str
    type: str                           # "income" or "expense"
    title: Optional[str] = None
    amount: Decimal
    category: str
    payment_method: Optional[str] = None
    note: Optional[str] = None
    date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedTransactionResponse(BaseModel):
    """Paginated wrapper returned by GET /api/transactions/"""
    items: List[TransactionItem]
    total_items: int
    total_pages: int


# ── Update Schemas ─────────────────────────────────────────────────────────────

class IncomeUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[Decimal] = None
    category: Optional[str] = None
    date: Optional[datetime] = None


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[Decimal] = None
    category: Optional[str] = None
    payment_method: Optional[str] = None
    note: Optional[str] = None
    date: Optional[datetime] = None


# ── Goal Schemas ───────────────────────────────────────────────────────────────

class GoalCreate(BaseModel):                          # ← fixed indentation (was broken)
    goal_type: str = Field(..., description="income or expense")
    category: Optional[str] = Field(None, description="Specific category or None for overall")
    target_amount: Decimal = Field(..., gt=0)
    month: str = Field(..., pattern=r"^\d{4}-\d{2}$", description="YYYY-MM format")

    class Config:                                     # ← was outside the class before
        json_schema_extra = {
            "example": {
                "goal_type": "expense",
                "category": "Food & Drink",
                "target_amount": 500.00,
                "month": "2024-02"
            }
        }


class GoalResponse(BaseModel):
    id: str
    user_id: str
    goal_type: str
    category: Optional[str]
    target_amount: Decimal
    month: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
# from pydantic import BaseModel, Field
# from datetime import datetime
# from typing import Optional
# from decimal import Decimal

# # Income Schemas
# class IncomeCreate(BaseModel):
#     title: Optional[str] = Field(None, max_length=255, description="Income title/description")
#     amount: Decimal = Field(..., gt=0, description="Amount must be positive")
#     category: str = Field(..., description="Income category")
#     date: Optional[datetime] = None

#     class Config:
#         json_schema_extra = {
#             "example": {
#                 "title": "Monthly Salary",
#                 "amount": 5000.00,
#                 "category": "Salary/Wages",
#                 "date": "2025-01-08T10:00:00Z"
#             }
#         }


# class IncomeResponse(BaseModel):
#     id: str
#     user_id: str
#     title: Optional[str]
#     amount: Decimal
#     category: str
#     date: Optional[datetime]
#     created_at: datetime
#     updated_at: datetime
    
#     class Config:
#         from_attributes = True


# # Expense Schemas
# class ExpenseCreate(BaseModel):
#     title: Optional[str] = Field(None, max_length=255, description="Expense title")
#     amount: Decimal = Field(..., gt=0, description="Amount must be positive")
#     category: str = Field(..., description="Expense category")
#     payment_method: Optional[str] = Field(None, description="Payment method: Cash or Bank")
#     note: Optional[str] = Field(None, description="Optional note")
#     date: Optional[datetime] = None

#     class Config:
#         json_schema_extra = {
#             "example": {
#                 "title": "Grocery Shopping",
#                 "amount": 150.50,
#                 "category": "Food & Drink",
#                 "payment_method": "Cash",
#                 "note": "Weekly groceries",
#                 "date": "2025-01-08T10:00:00Z"
#             }
#         }


# class ExpenseResponse(BaseModel):
#     id: str
#     user_id: str
#     title: Optional[str]
#     amount: Decimal
#     category: str
#     payment_method: Optional[str]
#     note: Optional[str]
#     date: Optional[datetime]
#     created_at: datetime
#     updated_at: datetime
    
#     class Config:
#         from_attributes = True


# # Transaction Response (Combined)
# class TransactionResponse(BaseModel):
#     id: str
#     type: str  # "income" or "expense"
#     title: Optional[str]
#     amount: Decimal
#     category: str
#     payment_method: Optional[str] = None  # Only for expenses
#     note: Optional[str] = None  # Only for expenses
#     date: Optional[datetime]
#     created_at: datetime


# # Update Schemas (for future use)
# class IncomeUpdate(BaseModel):
#     title: Optional[str] = None
#     amount: Optional[Decimal] = None
#     category: Optional[str] = None
#     date: Optional[datetime] = None


# class ExpenseUpdate(BaseModel):
#     title: Optional[str] = None
#     amount: Optional[Decimal] = None
#     category: Optional[str] = None
#     payment_method: Optional[str] = None
#     note: Optional[str] = None
#     date: Optional[datetime] = None

# class GoalCreate(BaseModel):
#     goal_type: str = Field(..., description="income or expense")
#     category: Optional[str] = Field(None, description="Specific category or None for overall")
#     target_amount: Decimal = Field(..., gt=0)
#     #month: str = Field(..., regex=r"^\d{4}-\d{2}$", description="YYYY-MM format")
# month: str = Field(..., pattern=r"^\d{4}-\d{2}$", description="YYYY-MM format")

# class Config:
#     json_schema_extra = {
#         "example": {
#             "goal_type": "expense",
#             "category": "Food & Drink",
#             "target_amount": 500.00,
#             "month": "2024-02"
#         }
#     }

# class GoalResponse(BaseModel):
#     id: str
#     user_id: str
#     goal_type: str
#     category: Optional[str]
#     target_amount: Decimal
#     month: str
#     created_at: datetime
#     updated_at: datetime

#     class Config:
#         from_attributes = True