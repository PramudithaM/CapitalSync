from fastapi import APIRouter, File, UploadFile, HTTPException
from app.schemas import InvoiceData
from app.services.google import extract_invoice as google_extract

router = APIRouter(prefix="/extract", tags=["Extract"])


@router.post("/invoice", response_model=InvoiceData)
async def extract_invoice_endpoint(file: UploadFile = File(...)):
    try:
        result = await google_extract(file)
        return InvoiceData(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))