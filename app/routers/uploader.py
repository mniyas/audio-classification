from fastapi import APIRouter, File, UploadFile

from datetime import datetime
from ..core import classifier


router = APIRouter()
model = classifier.load_model("app/model.pkl")


@router.post("/upload")
async def upload_file(audio_file: UploadFile = File(...)):
    """
    Upload the audio file to the server and classify it.
    """
    now = datetime.now()
    now = now.strftime("%d-%b-%Y-%H:%M:%S")
    file_location = f"app/files/{now}-{audio_file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(audio_file.file.read())
    prediction = classifier.predict(model, file_location)
    mapper = {0: "Potter", 1: "StarWars"}
    return {"prediction": mapper[prediction]}
