from fastapi import Depends, FastAPI
from fastapi.staticfiles import StaticFiles

from app.routers import uploader, templates

app = FastAPI()

app.include_router(uploader.router)
app.include_router(templates.router)
app.mount("/static", StaticFiles(directory="app/static"), name="static")
