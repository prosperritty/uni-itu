from pydantic import BaseModel
from datetime import date, datetime

class UserRequest(BaseModel):
    avatar_id: str = "1.png"
    name: str
    surname: str
    role: str
    dob: date

class TaskRequest(BaseModel):
    name: str
    description: str
    deadline: datetime
    priority: int
    repeatable: bool
    repeatabletype: int
    participating : list[int]

class EventRequest(BaseModel):
    name: str
    starttime: datetime
    endtime: datetime
    description: str
    participating: list[int]

class TransactionRequest(BaseModel):
    amount: float
    isIncome: bool
    jarId: int | None = None
    dtype: str

class JarRequest(BaseModel):
    target: str
    totalamount: float
    deadline: date

class JarUpdateDeadlineRequest(BaseModel):
    deadline: date

class JarUpdateAmountRequest(BaseModel):
    currentamount: float
    totalamount: float

class TypeRequest(BaseModel):
    name: str
    relate: str

class BudgetRequest(BaseModel):
    amount: float
