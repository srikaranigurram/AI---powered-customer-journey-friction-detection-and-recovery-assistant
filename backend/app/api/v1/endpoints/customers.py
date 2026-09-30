from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.customer import CustomerCreate, CustomerResponse
from app.crud import crud_customer

router = APIRouter()


@router.post("/", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED, summary="Create a new customer profile")
def create_customer(customer_in: CustomerCreate, db: Session = Depends(get_db)):
    existing = crud_customer.get_customer_by_code(db, customer_code=customer_in.customer_code)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Customer with code '{customer_in.customer_code}' already exists"
        )
    return crud_customer.create_customer(db, customer_in=customer_in)


@router.get("/", response_model=List[CustomerResponse], summary="Retrieve customer list")
def list_customers(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    return crud_customer.get_customers(db, skip=skip, limit=limit)


@router.get("/{customer_id}", response_model=CustomerResponse, summary="Get customer by ID")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = crud_customer.get_customer(db, customer_id=customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return customer
