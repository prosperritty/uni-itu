from pydantic import BaseModel
from datetime import date, datetime

class User(BaseModel):
    id: int
    avatar_id: str
    name: str
    surname: str
    role: str
    dob: date
    done_tasks: int = 0
    created_events: int = 0
    created_tasks: int = 0
    #Relational
    has_achievement: list[int] = []

class Task(BaseModel):
    id: int
    name: str
    description: str
    datecreation: date
    deadline: datetime
    priority: int #1-2-3 easy-medium-hard
    repeatable: bool
    repeatabletype: int #1-2-3 daily-weekly-monthly
    participating: list[int]
    done:bool
    #Relational
    created_by:int

class Event(BaseModel):
    id: int
    name: str
    starttime: datetime
    endtime: datetime | None
    description: str
    participating: list[int]
    #Relational
    created_by: int
    
class Transaction(BaseModel):
    id:int
    amount: float
    datecreation: datetime
    isIncome: bool
    jarId: int | None = None
    dtype: str

class Jar(BaseModel):
    id:int
    target:str
    totalamount:float
    currentamount:float
    deadline: date
    #Relational
    has_transactions: list[int]

class Achievement(BaseModel):
    id: int
    name: str
    description: str

class Type(BaseModel):
    id: int
    name: str
    #Relational
    relate: str
