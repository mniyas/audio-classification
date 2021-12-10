from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="app/views")


@router.get("/", response_class=HTMLResponse)
async def read_item(request: Request):
    """
    Render the index page
    """
    return templates.TemplateResponse("index.html", {"request": request})
