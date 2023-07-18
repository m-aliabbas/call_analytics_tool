from typing import Union
from fastapi import FastAPI
from Processor.Interface import Interface
from Processor.LogInterface import LogInterface
import json
from fastapi import FastAPI, UploadFile, File
from typing import List
import ast
from bson import json_util
from fastapi.middleware.cors import CORSMiddleware
import requests
import time
import os

app = FastAPI()



def parse_json(data):
    return json.loads(json_util.dumps(data))

origins = ["*"]
interface = Interface()
LogInterface = LogInterface()
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

def get_diarizer_server_response(self,file_path):
    # Specify the URL of the FastAPI server
    url = 'http://110.93.240.107:8080/uploadfile/'
    files = {'file': (file_path, open(file_path, 'rb'), 'audio/wav')}

    # Send a POST request to the FastAPI server with the file data
    response = requests.post(url, files=files)

    # Check the response
    if response.status_code == 200:
        print('File uploaded successfully.')
        resp_json = json.loads(response.text)
        return True,resp_json
    else:
        print('Error occurred while uploading the file:', response.text)
        return False,{}
    
# @app.post("/uploadfiles/")
# async def create_upload_files(files: List[UploadFile] = File(...)):
#     data = []
#     for file in files:
#         contents = await file.read()
#         data.append({"filename": file.filename, "content": contents})
#         status,msg=get_diarizer_server_response(file.filename)
#         if status:
#             results = interface.get_diarizer_response()

    
#     return {"uploaded_files": 'Yes'}


import os

@app.post("/uploadfiles/")
async def create_upload_files(files: List[UploadFile] = File(...)):
    data = []
    for file in files:
        # Save the uploaded file
        file_path = save_uploaded_file(file)
        print(file_path)
        status,msg = interface.get_diarizer_response(file_path)
    return {'status': 'done'}


def save_uploaded_file(file: UploadFile) -> str:
    # Generate a unique filename to avoid conflicts
    filename = file.filename
    print(file.filename,1234)
    # Define the directory to save the uploaded files
    upload_dir = "./uploaded_files"

    # Create the directory if it doesn't exist
    os.makedirs(upload_dir, exist_ok=True)

    # Save the file in the upload directory
    file_path = os.path.join(upload_dir, filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    return file_path


# Routes for logs


@app.get("/get_full_log")
def get_full_data():
    data=LogInterface.get_complete_data()
    data = {'data': data}
    json_data = parse_json(data)
    return json_data


