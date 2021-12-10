FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9-slim-2021-10-02
# FROM continuumio/anaconda3:latest

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN apt update
RUN apt-get --yes install libsndfile1
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
