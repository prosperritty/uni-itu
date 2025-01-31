from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import date, datetime, timezone
from database import users, users_id, tasks, tasks_id, events, events_id, transactions, transactions_id,jars, jars_id, budget, achievements, dtypes, dtypes_id
from models_database import Event, Task, Transaction, User, Jar, Type
from models_request import UserRequest, TaskRequest, EventRequest, TransactionRequest, JarRequest, JarUpdateDeadlineRequest,JarUpdateAmountRequest, TypeRequest, BudgetRequest
from collections import defaultdict

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#*------------*USER ENDPOINTS*------------*
@app.get("/users_all")
async def get_users():
    return users


@app.get("/user/{userId}")
async def get_user(userId: int):
    user = next((u for u in users if u.id == userId), None)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    formatted_user = {
        "id": user.id,
        "avatar_id": user.avatar_id,
        "name": user.name,
        "surname": user.surname,
        "role": user.role,
        "dob": user.dob.strftime("%d.%m.%Y"),
        "done_tasks": user.done_tasks,
        "created_events": user.created_events,
        "created_tasks": user.created_tasks,
        "has_achievement": user.has_achievement,
    }

    return formatted_user


@app.get("/user/achievements/{userId}")
async def get_user_achievements(userId: int):
    user = next((u for u in users if u.id == userId), None)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user_achievements = [achievement for achievement in achievements if achievement.id in user.has_achievement]
    return user_achievements


@app.post("/user/add")
async def add_user(user_inf: UserRequest):
    global users_id
    user = User(
        id= users_id,
        avatar_id = user_inf.avatar_id,
        name=user_inf.name,
        surname=user_inf.surname,
        role=user_inf.role,
        dob=user_inf.dob)
    users_id = users_id + 1
    users.append(user)
    return user

@app.put("/user/{userId}/avatar/{avatarId}")
async def avatar_user(userId: int, avatarId: str):
    user = next((u for u in users if u.id == userId), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.avatar_id = avatarId
    return user

#*------------*TASK ENPOINTS*------------*
@app.get("/tasks/{userId}")
async def get_tasks_user(userId: int, filter: str = None):
    userId_tasks = [task for task in tasks if ((userId in task.participating) or (task.created_by == userId)) and task.done == False]
    return_task = []

    #No filter or deadline
    if filter == None or filter == "" or filter == "deadline":
        for task in userId_tasks:
            if task.deadline.tzinfo is None:
                task.deadline = task.deadline.replace(tzinfo=timezone.utc)
        filtered_tasks = [task for task in userId_tasks]
        return_task = sorted(filtered_tasks, key=lambda t: t.deadline)
    #Filter priority
    elif filter == "priority":
        return_task = sorted(userId_tasks, key=lambda t: t.priority, reverse=True)
    #Filter done
    elif filter == "done":
        return_task = [task for task in tasks if task.done == True]

    formatted_tasks = [
        {
            "id": task.id,
            "name": task.name,
            "description": task.description,
            "datecreation": task.datecreation.strftime("%d.%m.%Y"),
            "deadline": task.deadline.strftime("%d.%m.%Y %H:%M"),
            "priority": task.priority,
            "repeatable": task.repeatable,
            "repeatabletype": task.repeatabletype,
            "participating": task.participating,
            "done": task.done,
            "created_by": task.created_by,
            "from": next((u.name for u in users if u.id == task.created_by), "Unknown")
        }
        for task in return_task
    ]
    return formatted_tasks


@app.get("/task/{taskId}")
async def get_task(taskId: int):
    task = next((t for t in tasks if t.id == taskId), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    creator_name = next((u.name for u in users if u.id == task.created_by), "Unknown")

    formatted_task = {
        "id": task.id,
        "name": task.name,
        "description": task.description,
        "datecreation": task.datecreation.strftime("%d.%m.%Y"),
        "deadline": task.deadline.strftime("%d.%m.%Y %H:%M"),
        "priority": task.priority,
        "repeatable": task.repeatable,
        "repeatabletype": task.repeatabletype,
        "participating": task.participating,
        "done": task.done,
        "created_by": task.created_by,
        "from": creator_name
    }
    return formatted_task

@app.post("/tasks/{userId}/add")
async def add_task(task_inf: TaskRequest, userId: int):
    if len(task_inf.name) > 50:
        raise HTTPException(
            status_code=400,
            detail={"error": "NameTooLong", "message": "Failed: only 50 symbols for name"}
        )
    if len(task_inf.description) > 450:
        raise HTTPException(
            status_code=400,
            detail={"error": "DescTooLong", "message": "Failed: only 450 symbols for description"}
        )
    global tasks_id
    repeatable = task_inf.repeatable or task_inf.repeatabletype in {1, 2, 3}
    task = Task(
        id=tasks_id,
        name=task_inf.name,
        description=task_inf.description,
        datecreation=date.today(),
        deadline=task_inf.deadline,
        priority=task_inf.priority,
        repeatable=repeatable,
        repeatabletype=task_inf.repeatabletype,
        participating=task_inf.participating,
        done=False,
        created_by=userId)
    tasks_id = tasks_id + 1
    tasks.append(task)
    user = next((u for u in users if u.id == userId), None)
    if user:
        user.created_tasks += 1
    else:
        raise HTTPException(status_code=404, detail="User not found")
    if user.created_tasks == 5:
        user.has_achievement.append(4)
    elif user.created_tasks == 10:
        user.has_achievement.append(5)
    elif user.created_tasks == 100:
        user.has_achievement.append(6)

    return task

@app.put("/tasks/update/{taskId}")
async def update_task(task_inf: TaskRequest, taskId: int):
    if len(task_inf.name) > 50:
        raise HTTPException(
            status_code=400,
            detail={"error": "NameTooLong", "message": "Failed: only 50 symbols for name"}
        )
    if len(task_inf.description) > 450:
        raise HTTPException(
            status_code=400,
            detail={"error": "DescTooLong", "message": "Failed: only 450 symbols for description"}
        )

    task = next((t for t in tasks if t.id == taskId), None)
    repeatable = task_inf.repeatable or task_inf.repeatabletype in {1, 2, 3}
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update the task details with the new information
    task.name = task_inf.name
    task.description = task_inf.description
    task.deadline = task_inf.deadline
    task.priority = task_inf.priority
    task.repeatable = repeatable
    task.repeatabletype = task_inf.repeatabletype
    task.participating = task_inf.participating

    return task


@app.put("/tasks/{userId}/doneupdate/{taskId}")
async def complete_task(taskId: int, userId: int):
    task = next((t for t in tasks if t.id == taskId), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.done = not task.done
    user = next((u for u in users if u.id == userId), None)

    if user:
        if task.done == True:
            user.done_tasks += 1
        else:
            user.done_tasks -= 1
    else:
        raise HTTPException(status_code=404, detail="User not found")

    if user.done_tasks == 5:
        user.has_achievement.append(1)
    elif user.done_tasks == 10:
        user.has_achievement.append(2)
    elif user.done_tasks == 100:
        user.has_achievement.append(3)

    return {"message": "Task completed"}


@app.delete("/deltask/{taskId}")
async def delete_task(taskId: int):
    task_to_delete = next((task for task in tasks if task.id == taskId), None)
    if task_to_delete is None:
        raise HTTPException(status_code=404, detail="Task not found")
    tasks.remove(task_to_delete)
    return {"message": "Task deleted successfully"}


#*------------*EVENT ENDPOINTS*------------*
@app.get("/events/{userId}")
async def get_events_user(userId: int):
    userId_events = [event for event in events if event.created_by == userId or userId in event.participating]
    
    for event in userId_events:
        if event.starttime.tzinfo is None:
            event.starttime = event.starttime.replace(tzinfo=timezone.utc)

    events_by_date = defaultdict(list)
    for event in userId_events:
        event_date = event.starttime.date()
        creator = next((u.name for u in users if u.id == event.created_by), "Unknown")
        formatted_event = {
            "id": event.id,
            "name": event.name,
            "starttime": event.starttime.strftime("%d.%m.%Y %H:%M"),
            "endtime": event.endtime.strftime("%d.%m.%Y %H:%M"),
            "description": event.description,
            "participating": event.participating,
            "created_by": event.created_by,
            "from": creator
        }
        events_by_date[event_date].append(formatted_event)

    returnevent = [
        {
            "date": date.strftime("%d.%m.%Y"),
            "events": event_list
        }
        for date, event_list in sorted(events_by_date.items())
    ]

    return returnevent


@app.get("/events_last/{userId}")
async def get_last_event_user(userId: int):
    user_events = [event for event in events if event.created_by == userId or userId in event.participating]
    if not user_events:
        return None

    for event in user_events:
        if event.starttime.tzinfo is None:
            event.starttime = event.starttime.replace(tzinfo=timezone.utc)

    last_event =  min(user_events, key=lambda e: e.starttime)
    creator_name = next((u.name for u in users if u.id == last_event.created_by), "Unknown")
    formatted_last_event = {
        "id": last_event.id,
        "name": last_event.name,
        "starttime": last_event.starttime.strftime("%d.%m.%Y %H:%M"),
        "endtime": last_event.endtime.strftime("%d.%m.%Y %H:%M") if last_event.endtime else None,
        "description": last_event.description,
        "participating": last_event.participating,
        "created_by": last_event.created_by,
        "from": creator_name
    }

    return formatted_last_event


@app.get("/event/{eventId}")
async def get_event(eventId: int):
    event = next((e for e in events if e.id == eventId), None)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    creator_name = next((u.name for u in users if u.id == event.created_by), "Unknown")
    formatted_event = {
        "id": event.id,
        "name": event.name,
        "starttime": event.starttime.strftime("%d.%m.%Y %H:%M"),
        "endtime": event.endtime.strftime("%d.%m.%Y %H:%M") if event.endtime else None,
        "description": event.description,
        "participating": event.participating,
        "created_by": event.created_by,
        "from": creator_name
    }
    return formatted_event


@app.post("/events/{userId}/add")
async def add_event(event_inf: EventRequest, userId: int):
    if len(event_inf.name) > 50:
        raise HTTPException(
            status_code=400,
            detail={"error": "NameTooLong", "message": "Failed: only 50 symbols for name"}
        )
    if len(event_inf.description) > 450:
        raise HTTPException(
            status_code=400,
            detail={"error": "DescTooLong", "message": "Failed: only 450 symbols for description"}
        )

    global events_id
    event = Event(
        id=events_id,
        name=event_inf.name,
        starttime=event_inf.starttime,
        endtime=event_inf.endtime,
        description=event_inf.description,
        participating=event_inf.participating,
        created_by=userId
    )
    events_id = events_id + 1
    events.append(event)

    user = next((u for u in users if u.id == userId), None)
    if user:
        user.created_events += 1
    else:
        raise HTTPException(status_code=404, detail="User not found")

    if user.created_events == 5:
        user.has_achievement.append(7)
    elif user.created_events == 10:
        user.has_achievement.append(8)
    elif user.created_events == 100:
        user.has_achievement.append(9)

    return event

@app.put("/events/update/{eventId}")
async def update_event(event_inf: EventRequest, eventId: int):
    if len(event_inf.name) > 50:
        raise HTTPException(
            status_code=400,
            detail={"error": "NameTooLong", "message": "Failed: only 50 symbols for name"}
        )
    if len(event_inf.description) > 450:
        raise HTTPException(
            status_code=400,
            detail={"error": "DescTooLong", "message": "Failed: only 450 symbols for description"}
        )
    
    event = next((e for e in events if e.id == eventId), None)

    # If event not found, raise an exception
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Update the event details with the new information
    event.name = event_inf.name
    event.starttime = event_inf.starttime
    event.endtime = event_inf.endtime
    event.description = event_inf.description
    event.participating = event_inf.participating

    return event


@app.delete("/delevent/{eventId}")
async def delete_task(eventId: int):
    event_to_delete = next((event for event in events if event.id == eventId), None)
    if event_to_delete is None:
        raise HTTPException(status_code=404, detail="Task not found")
    events.remove(event_to_delete)
    return {"message": "Event deleted successfully"}


#*------------*TRANSACTION ENDPOINTS*------------*
@app.get("/transactions")
async def get_transactions(filter: str | None = None,  trantype: str = "all"):
    filtered_transactions = []
    if trantype == "income":
        filtered_transactions = [transaction for transaction in transactions if transaction.isIncome]
    elif trantype == "outcome":
        filtered_transactions = [transaction for transaction in transactions if not transaction.isIncome]
    else:
        filtered_transactions = transactions

    filtered_transactions = list(reversed(filtered_transactions))

    returntransactions = []
    if filter == "amount":
        returntransactions = sorted(filtered_transactions, key=lambda t: abs(t.amount), reverse=True) if trantype == "outcome" else sorted(filtered_transactions, key=lambda t: t.amount, reverse=True)
    elif filter:
        returntransactions = [transaction for transaction in filtered_transactions if transaction.dtype == filter]
    else:
        returntransactions = filtered_transactions

    formatted_transactions = [
        {
            "id": transaction.id,
            "amount": transaction.amount,
            "datecreation": transaction.datecreation.strftime("%d.%m.%Y %H:%M"),
            "isIncome": transaction.isIncome,
            "jarId": transaction.jarId,
            "dtype": transaction.dtype,
        }
        for transaction in returntransactions
    ]

    return formatted_transactions

@app.get("/transaction/{transactionId}")
async def get_transaction(transactionId: int):
    transaction = next((t for t in transactions if t.id == transactionId), None)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    formatted_transaction = {
        "id": transaction.id,
        "amount": transaction.amount,
        "datecreation": transaction.datecreation.strftime("%d.%m.%Y %H:%M"),
        "isIncome": transaction.isIncome,
        "jarId": transaction.jarId,
        "dtype": transaction.dtype,
    }

    return formatted_transaction

@app.get("/transaction_last")
async def get_last_transaction():
    if len(transactions) == 0 :
        return None
    last_transaction = sorted(transactions, key=lambda t: t.datecreation, reverse=True)[0]

    formatted_transaction = {
        "id": last_transaction.id,
        "amount": last_transaction.amount,
        "datecreation": last_transaction.datecreation.strftime("%d.%m.%Y %H:%M"),
        "isIncome": last_transaction.isIncome,
        "jarId": last_transaction.jarId,
        "dtype": last_transaction.dtype,
    }

    return formatted_transaction

@app.post("/transactions/add")
async def add_transaction(transaction_inf: TransactionRequest):
    if transaction_inf.amount == 0 :
        return {"message": "Amount cannot be zero"}

    global transactions_id
    transaction = Transaction(
        id=transactions_id,
        amount=0,
        datecreation=datetime.now(),
        isIncome=transaction_inf.isIncome,
        jarId=transaction_inf.jarId,
        dtype=transaction_inf.dtype,
    )
    transactions_id = transactions_id + 1

    if not transaction_inf.isIncome and transaction_inf.amount > 0:
        transaction.amount = transaction_inf.amount * (-1)
    elif transaction_inf.isIncome and transaction_inf.amount < 0:
        transaction.amount = transaction_inf.amount
        transaction.isIncome = False
    else:
        transaction.amount = transaction_inf.amount

    if transaction.jarId is not None:
        jar = next((jar for jar in jars if jar.id == transaction.jarId), None)
        jar.currentamount += abs(transaction.amount)
        jar.has_transactions.append(transaction.id)

        transaction.isIncome = False
        transaction.amount = (-1) * abs(transaction.amount)

    global budget
    budget = budget + transaction.amount
    transactions.append(transaction)
    return transaction


@app.delete("/deltransaction/{transactionId}")
async def delete_transaction(transactionId: int):
    transaction = next((transaction for transaction in transactions if transaction.id == transactionId), None)
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if transaction.jarId is not None:
        jar = next((jar for jar in jars if jar.id == transaction.jarId), None)
        jar.currentamount += transaction.amount
        jar.has_transactions.remove(transaction.id)
    global budget
    budget = budget - transaction.amount
    transactions.remove(transaction)
    return transactions


#*------------*JAR ENDPOINTS*------------*
@app.get("/jars")
async def get_jars():
    if len(jars) == 0:
        return None

    returnjars = []
    for jar in jars:
        percent = int((jar.currentamount / jar.totalamount) * 100) if jar.totalamount > 0 else 0

        jar_transactions = [
            {
                "id": transaction.id,
                "amount": transaction.amount,
                "datecreation": transaction.datecreation.strftime("%d.%m.%Y %H:%M"),
                "isIncome": transaction.isIncome,
                "jarId": transaction.jarId,
                "dtype": transaction.dtype,
            }
            for transaction in transactions if transaction.id in jar.has_transactions
        ]

        formatted_data = {
            "id": jar.id,
            "target": jar.target,
            "totalamount": jar.totalamount,
            "currentamount": jar.currentamount,
            "deadline": jar.deadline.strftime("%d.%m.%Y") if jar.deadline else None,
            "has_transactions": jar.has_transactions,
        }

        returnjars.append({
            "percent": percent,
            "data": formatted_data,
            "transactions": jar_transactions
        })

    return returnjars


@app.get("/jars/highest")
async def get_highest_jar():
    if len(jars) == 0:
        return None
    jar_with_highest_percent = max(jars, key=lambda jar: (jar.currentamount / jar.totalamount * 100) if jar.totalamount > 0 else 0)

    percent = int((jar_with_highest_percent.currentamount / jar_with_highest_percent.totalamount) * 100) \
        if jar_with_highest_percent.totalamount > 0 else 0

    jar_transactions = [transaction for transaction in transactions if transaction.id in jar_with_highest_percent.has_transactions]

    formatted_jar = {
        "id": jar_with_highest_percent.id,
        "target": jar_with_highest_percent.target,
        "totalamount": jar_with_highest_percent.totalamount,
        "currentamount": jar_with_highest_percent.currentamount,
        "deadline": jar_with_highest_percent.deadline.strftime("%d.%m.%Y") if jar_with_highest_percent.deadline else None,
        "has_transactions": jar_with_highest_percent.has_transactions,
    }

    return {
        "percent": percent,
        "data": formatted_jar,
        "transactions": jar_transactions
    }

@app.get("/jar/{jarId}")
async def get_jar(jarId: int):
    if len(jars) == 0:
        return None
    jar = next((jar for jar in jars if jar.id == jarId), None)
    percent = int((jar.currentamount / jar.totalamount) * 100) if jar.totalamount > 0 else 0
    jar_transactions = [
        {
            "id": transaction.id,
            "amount": transaction.amount,
            "datecreation": transaction.datecreation.strftime("%d.%m.%Y %H:%M"),
            "isIncome": transaction.isIncome,
            "jarId": transaction.jarId,
            "dtype": transaction.dtype,
        }
        for transaction in transactions if transaction.id in jar.has_transactions
    ]

    formatted_jar = {
        "id": jar.id,
        "target": jar.target,
        "totalamount": jar.totalamount,
        "currentamount": jar.currentamount,
        "deadline": jar.deadline.strftime("%d.%m.%Y") if jar.deadline else None,
        "has_transactions": jar.has_transactions,
    }

    return ({
        "percent": percent,
        "data": formatted_jar,
        "transactions": jar_transactions
    })

@app.post("/jars/add")
async def add_jar(jar_inf: JarRequest):
    global jars_id
    if jar_inf.totalamount < 0.0:
        raise HTTPException(
            status_code=400,
            detail={"error": "TargetLessZero", "message": "Failed: target amount less than 0"}
        )

    jar = Jar(
        id=jars_id,
        target=jar_inf.target,
        totalamount=jar_inf.totalamount,
        currentamount=0,
        deadline=jar_inf.deadline,
        has_transactions=[]
    )
    jars_id = jars_id + 1
    jars.append(jar)
    return jar

@app.put("/jars/{jarId}/deadline")
async def update_jar_deadline(jarId: int, deadline: JarUpdateDeadlineRequest):
    jar = next((jar for jar in jars if jar.id == jarId), None)
    if jar is None:
        raise HTTPException(status_code=404, detail="Jar not found")
    jar.deadline = deadline.deadline
    return jar

@app.put("/jars/{jarId}/amount")
async def update_jar_deadline(jarId: int, amounts: JarUpdateAmountRequest):
    jar = next((jar for jar in jars if jar.id == jarId), None)
    if jar is None:
        raise HTTPException(status_code=404, detail="Jar not found")
    if jar.totalamount != amounts.totalamount:
        jar.totalamount = amounts.totalamount
        return jar
    elif jar.currentamount != amounts.currentamount:
        isBigger = jar.currentamount > amounts.currentamount
        global transactions_id
        transaction = Transaction(
            id=transactions_id,
            amount=jar.currentamount - amounts.currentamount,
            datecreation=datetime.now(),
            isIncome= isBigger,
            jarId=jarId,
            dtype="Jar",
        )
        transactions_id = transactions_id + 1
        jar.currentamount = amounts.currentamount
        global transactions
        transactions.append(transaction)
        global budget
        budget = budget + transaction.amount
        jar.has_transactions.append(transaction.id)
    return jar

@app.delete("/deljar/{jarId}")
async def del_jar(jarId: int):
    jar = next((jar for jar in jars if jar.id == jarId), None)
    if jar is None:
        raise HTTPException(status_code=404, detail="Jar not found")
    for transaction in transactions:
        if transaction.jarId == jarId:
            transaction.jarId = None
    jars.remove(jar)
    return {"message": "Jar deleted successfully"}


#*------------*TYPE ENDPOINTS*------------*
@app.get("/type/{relate}")
async def get_related_type(relate: str):
    returntypes = [t for t in dtypes if t.relate == relate]
    return returntypes

@app.post("/type/{relate}/add")
async def add_type(type_inf: TypeRequest):
    global dtypes_id
    newtype = Type(
        id= dtypes_id,
        name=type_inf.name,
        relate=type_inf.relate
    )
    dtypes_id = dtypes_id + 1
    dtypes.append(newtype)
    return newtype


#*------------*BUDGET ENDPOINTS*------------*
@app.get("/budget")
async def get_budget():
    if budget == 0:
        return {"amount" : 0}
    roundedbudget = round(budget, 2)
    return {"amount" : roundedbudget}

@app.get("/budget/statistics")
async def get_budget_statistics():
    current_month = datetime.now().month
    current_year = datetime.now().year

    monthly_transactions = [ tx for tx in transactions if tx.datecreation.month == current_month and tx.datecreation.year == current_year]
    total_income = sum(tx.amount for tx in monthly_transactions if tx.isIncome)
    total_outcome = sum(tx.amount for tx in monthly_transactions if not tx.isIncome)
    total = total_income + total_outcome
    return {
        "total_income" : round(total_income, 2),
        "total_outcome" : round(total_outcome, 2),
        "total" : round(total, 2)
    }

@app.put("/budget/update")
async def update_budget(req: BudgetRequest):
    if req.amount < 0:
        raise HTTPException(
            status_code=400,
            detail="Number must be between 0 and 100"
        )
    global budget
    budget = req.amount
    return budget
