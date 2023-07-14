from typing import Union
from fastapi import FastAPI
from Processor.Interface import Interface
import json
from fastapi import FastAPI, UploadFile, File
from typing import List
import ast
from bson import json_util
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()



def parse_json(data):
    return json.loads(json_util.dumps(data))

origins = ["*"]
interface = Interface()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/get_full_data")
def get_full_data():
    data=interface.get_complete_data()
    data = {'data': data}
    json_data = parse_json(data)
    return json_data

@app.get("/get_full_transcripts")
def get_full_transcript():
    data=interface.get_full_transripts()
    data = {'data': data}
    json_data = parse_json(data)
    return json_data

@app.get("/get_sequences")
def get_sequence():
    data=interface.get_sequences()
    data = {'data': data}
    json_data = parse_json(data)
    return json_data

@app.get("/get_splitted_transcripts")
def get_splitted():
    data=interface.get_splitted_transcripts()
    data = {'data': data}
    json_data = parse_json(data)
    return json_data

@app.get("/get_full_data/{file_id}")
def get_particular(file_id: str):
    data=interface.get_particular_data(file_id=file_id)
    data = {'data': data}
    json_data = parse_json(data)
    return json_data


@app.post("/uploadfiles/")
async def create_upload_files(files: List[UploadFile] = File(...)):
    data = []
    for file in files:
        contents = await file.read()
        data.append({"filename": file.filename, "content": contents})
        print('Yes')
    return {"uploaded_files": 'Yes'}
