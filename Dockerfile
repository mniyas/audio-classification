FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9-slim-2021-10-02

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN apt update
RUN apt-get install libsndfile1-dev -y
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
