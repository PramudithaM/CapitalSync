from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from dateutil.relativedelta import relativedelta
from app.database import get_db
from app.models import Income, Expense, Goal
from app.schemas import IncomeResponse, ExpenseResponse, GoalCreate, GoalResponse
from app.auth.firebase_auth import verify_firebase_token
import uuid

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


def get_three_months_ago():
    return datetime.now() - relativedelta(months=3)


def get_last_3_month_strings() -> list:
    months = []
    for i in range(3):
        month_date = datetime.now() - relativedelta(months=i)
        months.append(month_date.strftime("%Y-%m"))
    return months


# ── Income (last 3 months) ─────────────────────────────────────────────────────

@router.get("/income", response_model=List[IncomeResponse])
async def get_income(
    user_id: str = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    """Get authenticated user's income records for the last 3 months"""
    three_months_ago = get_three_months_ago()

    income_records = db.query(Income).filter(
        Income.user_id == user_id,
        Income.date >= three_months_ago
    ).order_by(Income.date.desc()).all()

    return income_records


# ── Expenses (last 3 months) ───────────────────────────────────────────────────

@router.get("/expenses", response_model=List[ExpenseResponse])
async def get_expenses(
    user_id: str = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    """Get authenticated user's expense records for the last 3 months"""
    three_months_ago = get_three_months_ago()

    expense_records = db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.date >= three_months_ago
    ).order_by(Expense.date.desc()).all()

    return expense_records


# ── Summary ────────────────────────────────────────────────────────────────────

@router.get("/summary")
async def get_summary(
    user_id: str = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    """Get authenticated user's summary for last 3 months"""
    three_months_ago = get_three_months_ago()

    income_records = db.query(Income).filter(
        Income.user_id == user_id,
        Income.date >= three_months_ago
    ).all()

    expense_records = db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.date >= three_months_ago
    ).all()

    total_income   = sum(float(r.amount) for r in income_records)
    total_expenses = sum(float(r.amount) for r in expense_records)

    return {
        "user_id":       user_id,
        "total_income":  total_income,
        "total_expenses": total_expenses,
        "net_balance":   total_income - total_expenses,
        "income_count":  len(income_records),
        "expense_count": len(expense_records),
    }


# ── Last 3 months breakdown ────────────────────────────────────────────────────

@router.get("/last-3-months")
async def get_last_3_months(
    user_id: str = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    """Get authenticated user's data grouped by month for last 3 months"""
    three_months_ago = get_three_months_ago()

    income_records = db.query(Income).filter(
        Income.user_id == user_id,
        Income.date >= three_months_ago
    ).order_by(Income.date).all()

    expense_records = db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.date >= three_months_ago
    ).order_by(Expense.date).all()

    monthly_data = {}

    for record in income_records:
        if record.date:
            month_key = record.date.strftime("%Y-%m")
            monthly_data.setdefault(month_key, {"income": [], "expenses": []})
            monthly_data[month_key]["income"].append({
                "id":       record.id,
                "user_id":  record.user_id,
                "title":    record.title,
                "amount":   float(record.amount),
                "category": record.category,
                "date":     record.date.isoformat(),
            })

    for record in expense_records:
        if record.date:
            month_key = record.date.strftime("%Y-%m")
            monthly_data.setdefault(month_key, {"income": [], "expenses": []})
            monthly_data[month_key]["expenses"].append({
                "id":             record.id,
                "user_id":        record.user_id,
                "title":          record.title,
                "amount":         float(record.amount),
                "category":       record.category,
                "payment_method": record.payment_method,
                "note":           record.note,
                "date":           record.date.isoformat(),
            })

    result = []
    for month in sorted(monthly_data.keys()):
        month_income   = monthly_data[month]["income"]
        month_expenses = monthly_data[month]["expenses"]
        total_income   = sum(i["amount"] for i in month_income)
        total_expenses = sum(e["amount"] for e in month_expenses)

        result.append({
            "month":          month,
            "income":         month_income,
            "expenses":       month_expenses,
            "total_income":   total_income,
            "total_expenses": total_expenses,
            "balance":        total_income - total_expenses,
        })

    return result


# ── Category breakdown ─────────────────────────────────────────────────────────

@router.get("/categories")
async def get_category_breakdown(
    user_id: str = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    """Get authenticated user's category breakdown for last 3 months"""
    three_months_ago = get_three_months_ago()

    income_records = db.query(Income).filter(
        Income.user_id == user_id,
        Income.date >= three_months_ago
    ).all()

    income_by_category = {}
    for record in income_records:
        income_by_category[record.category] = (
            income_by_category.get(record.category, 0) + float(record.amount)
        )

    expense_records = db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.date >= three_months_ago
    ).all()

    expense_by_category = {}
    for record in expense_records:
        expense_by_category[record.category] = (
            expense_by_category.get(record.category, 0) + float(record.amount)
        )

    return {
        "user_id":            user_id,
        "income_by_category":  income_by_category,
        "expense_by_category": expense_by_category,
    }


# ── Goals ──────────────────────────────────────────────────────────────────────

@router.post("/goals", response_model=GoalResponse)
async def create_goal(
    goal: GoalCreate,
    user_id: str = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    """Create or update a goal for a specific month"""
    existing_goal = db.query(Goal).filter(
        Goal.user_id   == user_id,
        Goal.goal_type == goal.goal_type,
        Goal.month     == goal.month,
        Goal.category  == goal.category
    ).first()

    if existing_goal:
        existing_goal.target_amount = goal.target_amount
        existing_goal.updated_at    = datetime.now()
        db.commit()
        db.refresh(existing_goal)
        return existing_goal

    new_goal = Goal(
        id            = str(uuid.uuid4()),
        user_id       = user_id,
        goal_type     = goal.goal_type,
        category      = goal.category,
        target_amount = goal.target_amount,
        month         = goal.month,
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal


@router.get("/goals", response_model=List[GoalResponse])
async def get_goals(
    user_id: str = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    """Get all goals for the last 3 months"""
    months = get_last_3_month_strings()

    goals = db.query(Goal).filter(
        Goal.user_id == user_id,
        Goal.month.in_(months)
    ).all()

    return goals


# ── Summary with goals ─────────────────────────────────────────────────────────

@router.get("/summary-with-goals")
async def get_summary_with_goals(
    user_id: str = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    """Get summary with goal comparison for last 3 months"""
    three_months_ago = get_three_months_ago()
    current_month    = datetime.now().strftime("%Y-%m")

    income_records = db.query(Income).filter(
        Income.user_id == user_id,
        Income.date >= three_months_ago
    ).all()

    expense_records = db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.date >= three_months_ago
    ).all()

    total_income   = sum(float(r.amount) for r in income_records)
    total_expenses = sum(float(r.amount) for r in expense_records)

    income_goal = db.query(Goal).filter(
        Goal.user_id   == user_id,
        Goal.goal_type == "income",
        Goal.month     == current_month
    ).first()

    expense_goal = db.query(Goal).filter(
        Goal.user_id   == user_id,
        Goal.goal_type == "expense",
        Goal.month     == current_month
    ).first()

    income_goal_amt  = float(income_goal.target_amount)  if income_goal  else None
    expense_goal_amt = float(expense_goal.target_amount) if expense_goal else None

    return {
        "user_id":          user_id,
        "total_income":     total_income,
        "total_expenses":   total_expenses,
        "net_balance":      total_income - total_expenses,
        "income_goal":      income_goal_amt,
        "expense_goal":     expense_goal_amt,
        "income_progress":  (total_income   / income_goal_amt  * 100) if income_goal_amt  else None,
        "expense_progress": (total_expenses / expense_goal_amt * 100) if expense_goal_amt else None,
        "income_count":     len(income_records),
        "expense_count":    len(expense_records),
    }


# ── Last 3 months with goals ───────────────────────────────────────────────────

@router.get("/last-3-months-with-goals")
async def get_last_3_months_with_goals(
    user_id: str = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    """Get monthly data with goal comparison"""
    three_months_ago = get_three_months_ago()

    income_records = db.query(Income).filter(
        Income.user_id == user_id,
        Income.date >= three_months_ago
    ).order_by(Income.date).all()

    expense_records = db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.date >= three_months_ago
    ).order_by(Expense.date).all()

    monthly_data = {}

    for record in income_records:
        if record.date:
            month_key = record.date.strftime("%Y-%m")
            monthly_data.setdefault(month_key, {"income": [], "expenses": []})
            monthly_data[month_key]["income"].append({
                "id":       record.id,
                "user_id":  record.user_id,
                "title":    record.title,
                "amount":   float(record.amount),
                "category": record.category,
                "date":     record.date.isoformat(),
            })

    for record in expense_records:
        if record.date:
            month_key = record.date.strftime("%Y-%m")
            monthly_data.setdefault(month_key, {"income": [], "expenses": []})
            monthly_data[month_key]["expenses"].append({
                "id":             record.id,
                "user_id":        record.user_id,
                "title":          record.title,
                "amount":         float(record.amount),
                "category":       record.category,
                "payment_method": record.payment_method,
                "note":           record.note,
                "date":           record.date.isoformat(),
            })

    result = []
    for month in sorted(monthly_data.keys()):
        month_income   = monthly_data[month]["income"]
        month_expenses = monthly_data[month]["expenses"]
        total_income   = sum(i["amount"] for i in month_income)
        total_expenses = sum(e["amount"] for e in month_expenses)

        result.append({
            "month":          month,
            "income":         month_income,
            "expenses":       month_expenses,
            "total_income":   total_income,
            "total_expenses": total_expenses,
            "balance":        total_income - total_expenses,
        })

    # Fetch goals for last 3 months
    months = get_last_3_month_strings()

    goals = db.query(Goal).filter(
        Goal.user_id == user_id,
        Goal.month.in_(months)
    ).all()

    goals_by_month = {}
    for goal in goals:
        goals_by_month.setdefault(goal.month, {"income_goal": None, "expense_goal": None})
        if goal.goal_type == "income":
            goals_by_month[goal.month]["income_goal"]  = float(goal.target_amount)
        else:
            goals_by_month[goal.month]["expense_goal"] = float(goal.target_amount)

    for item in result:
        month_goals = goals_by_month.get(item["month"], {})
        income_goal  = month_goals.get("income_goal")
        expense_goal = month_goals.get("expense_goal")

        item["income_goal"]  = income_goal
        item["expense_goal"] = expense_goal
        item["income_goal_progress"]  = (item["total_income"]   / income_goal  * 100) if income_goal  else None
        item["expense_goal_progress"] = (item["total_expenses"] / expense_goal * 100) if expense_goal else None

    return result