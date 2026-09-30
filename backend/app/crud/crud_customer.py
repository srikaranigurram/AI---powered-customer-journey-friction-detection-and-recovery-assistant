from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate


def get_customer(db: Session, customer_id: int) -> Optional[Customer]:
    return db.query(Customer).filter(Customer.id == customer_id).first()


def get_customer_by_code(db: Session, customer_code: str) -> Optional[Customer]:
    return db.query(Customer).filter(Customer.customer_code == customer_code).first()


def get_customers(db: Session, skip: int = 0, limit: int = 100) -> List[Customer]:
    return db.query(Customer).offset(skip).limit(limit).all()


def create_customer(db: Session, customer_in: CustomerCreate) -> Customer:
    db_obj = Customer(
        customer_code=customer_in.customer_code,
        name=customer_in.name,
        email=customer_in.email,
        segment=customer_in.segment
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
