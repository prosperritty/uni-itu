from datetime import date, datetime
from models_database import Achievement, Event, Jar, Task, Transaction, User, Type

budget: float = 1559.85

users: list[User] = [
    User(id=1,avatar_id="1.png", name="Anna", surname="Schneider", role="Mother" ,dob=date(1970, 11, 1),done_tasks=5,created_events=3,created_tasks=12, has_achievement=[1, 4, 5]),
    User(id=2,avatar_id="2.png", name="Lukas", surname="Schneider", role="Father" ,dob=date(1969, 1, 12), done_tasks=4,created_events=5,created_tasks=4,has_achievement=[7]),
    User(id=3,avatar_id="3.png", name="Noa", surname="Schneider", role="Son" ,dob=date(2012, 9, 1), done_tasks=10,created_events=4,created_tasks=4,has_achievement=[1, 2]),
]

users_id: int = 4

tasks: list[Task] =[
    Task(id=1, name="Clean kitchen", description="It has to be done..",             datecreation=date(2024, 11, 1), deadline=datetime(2024,11,2,15,00), priority=1, repeatable=False,repeatabletype=0, participating=[1,2,3],done=False, created_by=1),
    Task(id=2, name="Get out with dog", description="The best time of our day..",   datecreation=date(2024, 11, 1), deadline=datetime(2024,11,2,16,00,00), priority=2, repeatable=True, repeatabletype=1,participating=[1,2,3],done=False, created_by=1),
    Task(id=5, name="Print documents", description="Sorry, i forgot to..",          datecreation=date(2024, 11, 6), deadline=datetime(2024,11,20,20,00,), priority=3, repeatable=False,repeatabletype=0, participating=[2],done=False, created_by=1),
    Task(id=3, name="Clear car", description="I hate it",                           datecreation=date(2024, 11, 7), deadline=datetime(2024,11,21,13,30), priority=2, repeatable=False,repeatabletype=0, participating=[1,2],done=False, created_by=2),
    Task(id=4, name="Buy me a pencil", description="Father, you should do it..",    datecreation=date(2024, 11, 7), deadline=datetime(2024,11,12,15,00), priority=3, repeatable=False,repeatabletype=0, participating=[2,3],done=False, created_by=3),
    Task(id=6, name="Take son to school", description="It has to be done..",        datecreation=date(2024, 11, 8), deadline=datetime(2024,11,13,8,00,00), priority=1, repeatable=False,repeatabletype=0, participating=[1,2,3],done=False, created_by=1),
    Task(id=7, name="Groceries", description="Tomatoes, apples, milk, water, juice, cat food", datecreation=date(2024, 11, 10), deadline=datetime(2024,5,16,18,40), priority=3, repeatable=False,repeatabletype=0, participating=[1,2,3],done=False, created_by=1),
]

tasks_id: int = 8

events: list[Event] = [
    Event(id=1, name="Going to amusement park", starttime=datetime(2024,10,16,18,00), endtime=datetime(2024,10,16,22,00), description="Son wanted for a while", participating=[1,2,3], created_by=1),
    Event(id=2, name="Visit grandma", starttime=datetime(2024,11,3,20,00), endtime=datetime(2024,11,3,22,00), description="", participating=[1,2,3], created_by=1),
    Event(id=3, name="Scene in my school", starttime=datetime(2024,11,4,9,00), endtime=datetime(2024,11,4,11,00), description="We all should really go, you'll like it", participating=[1,2,3], created_by=3),
    Event(id=4, name="Dentist appointment for Noa", starttime=datetime(2024,11,20,14,00), endtime=datetime(2024,11,20,16,30), description="", participating=[3], created_by=1),
]

events_id: int = 5

transactions: list[Transaction] = [
    Transaction(id=1,amount=3020.25,datecreation=datetime(2024,11,1,17,36),isIncome=True,jarId=None,dtype="Work"),
    Transaction(id=2,amount=-104,datecreation=datetime(2024,11,2,9,36),isIncome=False,jarId=None,dtype="Transport"),
    Transaction(id=3,amount=-200,datecreation=datetime(2024,11,3,15,16),isIncome=False,jarId=None,dtype="Groceries"),
    Transaction(id=4,amount=-356.40,datecreation=datetime(2024,11,3,20,1),isIncome=False,jarId=None,dtype="Groceries"),
    Transaction(id=5,amount=-200,datecreation=datetime(2024,11,4,22,1),isIncome=False,jarId=1,dtype="Jar"),
    Transaction(id=6,amount=-300,datecreation=datetime(2024,11,7,10,12),isIncome=False,jarId=1,dtype="Jar"),
    Transaction(id=7,amount=-300,datecreation=datetime(2024,11,8,10,12),isIncome=False,jarId=2,dtype="Jar"),
]

transactions_id: int = 8

jars: list[Jar] = [
    Jar(id=1, target="Trip to Japan", totalamount=1000.0, currentamount=500.0, deadline=date(2024, 12, 31), has_transactions=[5, 6]),
    Jar(id=2, target="Buy a new laptop", totalamount=1500.0, currentamount=300.0,deadline=date(2024, 11, 15), has_transactions=[7]),
]

jars_id: int = 3

achievements: list[Achievement] = [
    Achievement(id=1,name="Not lazy!",description="Done 5 tasks"),
    Achievement(id=2,name="Definitely hard worker!",description="Done 10 tasks"),
    Achievement(id=3,name="Invincible",description="Done 100 tasks"),

    Achievement(id=4,name="Run the family",description="Create 5 tasks"),
    Achievement(id=5,name="Merciless",description="Create 10 tasks"),
    Achievement(id=6,name="Boss",description="Create 100 tasks"),

    Achievement(id=7,name="Some fun",description="Create 5 events"),
    Achievement(id=8,name="Chill",description="Create 10 events"),
    Achievement(id=9,name="Party maker",description="Create 100 events"),
]

dtypes: list[Type] =[
    Type(id=1, name="Work", relate="transaction"),
    Type(id=2, name="Transport", relate="transaction"),
    Type(id=3, name="Groceries", relate="transaction"),
    Type(id=4, name="Jar", relate="transaction"),
]

dtypes_id: int = 6
