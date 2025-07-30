from fastapi import FastAPI, Request, UploadFile, File
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os
import shutil

#to run: python -m uvicorn main:app --reload
# to view: http://localhost:8000

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

STORAGE_DIR = "storage"
os.makedirs(STORAGE_DIR, exist_ok=True)

@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/data")
async def get_data():
    return {"message": "Hello from Python!"}

@app.get("/storage")
async def get_files():
    folder_path = "storage"  # relative to where you run main.py
    try:
        fileslist = os.listdir(folder_path)
        return {"files": fileslist}
    except FileNotFoundError:
        return {"error": "storage folder not found"}
    
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_location = os.path.join(STORAGE_DIR, file.filename)
    with open(file_location, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"message": f"Saved {file.filename}"}
