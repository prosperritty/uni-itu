# Startup
First of all I prefer to create a Python environment:
```console
$ python -m venv env
$ . env/bin/activate
```

Install all dependencies:
```console
$ pwd
.../uni-itu/api
$ pip install -r requirements.txt
```

The API can now be launched:
```console
$ uvicorn app:app
INFO:     Started server process [30303]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

# Description
To implement API, I used the `FastAPI` library. Using a database was not mandatory, so we decided to create our own simplified database. To create models for our database I used `pydantic` library. All endpoints are in the **app.py** file.

# ERD

<p align="center">
  <img src="../img/erd.png" alt="ERD"/>
</p>