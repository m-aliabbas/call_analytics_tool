from Processor.CallProcessor import CallProcessor
import pandas as pd
from utils.utils import extract_phrases,jsonify
from DataSource.Mongo_DB import Mongo_DB
import requests
import json
import os
class Interface:
    def __init__(self,keyword_file='Example_Data/insurance.json'):
        df_dict = pd.read_json(keyword_file).to_dict()
        keywords = extract_phrases(df_dict)
        self.call_processor = CallProcessor(keywords=keywords)
        self.DB = Mongo_DB() # paramaeters are inserted in Construct
        self.DB = Mongo_DB(address='mongodb://localhost:27017/',
                 db_name='call_analytics_tool',
                 collection_name='call_record5',)
    
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

    def get_diarizer_response(self,file_path=''):
        status=False
        msg='Went Wrong'
        # diarizer_response = self.get_diarizer_server_response()
        # print(file_path)
        status, msg = self.get_diarizer_server_response(file_path)
        print(status,msg)

        msg1 = msg['msg']
        msg1['file_id'] = os.path.basename(msg1['file_id'])
        splitted_trans,full_transcript,sequence_dict = self.call_processor.process_input(input_dict=msg1)
        
        file_id = list(full_transcript.keys())[0]
        print(file_id)
        # splitted_trans[file_id]
        data_to_save = {'file_id': file_id, 'spliited_trans':splitted_trans,'full_transcript':full_transcript,'sequence_dict':sequence_dict}
        print(data_to_save)
        status, msg = self.insert_to_db(data_to_save)
        return status,msg
        
    

    def insert_to_db(self,data):
        file_id = data['file_id']
        if  self.DB.check_if_exists(file_id=file_id):
            return True, 'Data  already exists'
        else:
            temp_=self.DB.insert(data=data)
            if temp_:
                return True, 'Data Added successfully'
            else:
                return False,'Something went wrong'

    def get_complete_data(self):
        data = self.DB.find()
        return data
        
    
    def get_full_transripts(self):
        data = self.DB.find({},['full_transcript','file_id'])
        return data

    def get_splitted_transcripts(self):
        data = self.DB.find({},['spliited_trans','file_id'])
        return data

    def get_sequences(self):
        data = self.DB.find({},['sequence_dict','file_id'])
        return data

    def get_particular_data(self,file_id):
        data = self.DB.find({'file_id':file_id})
        print(data)
        return data
        

if __name__ == "__main__":
    interface = Interface()
    msg,resp=interface.get_diarizer_response(diarizer_response={
        'file_id': '20220328-102401_6623727904-all231',
        'SPEAKER_01_1': {'trascript': ' Hello? Hello? Hi, this is Amy with American Senior Citizens Care. How are you doing today?'},
        'SPEAKER_00_1': {'trascript': " I'm five."},
        'SPEAKER_01_2': {'trascript': ' Sorry to hear that. This call is about a new state regulated final expense.'},
        'SPEAKER_00_2': {'trascript': ' Insurance Plan which covers 100% of your burial funerals.'},
        'SPEAKER_01_3': {'trascript': ' or cremation expenses. It is specifically designed for the people on fixed income or social security. Would you like to learn more about...'},
        'SPEAKER_00_3': {'trascript': ' Yes.'},
        'SPEAKER_01_4': {'trascript': ' qualify you for the plan, are you between the age of 40 and 80? Yes. Are you capable enough to make your own financial decisions?'},
        'SPEAKER_00_4': {'trascript': ' Yeah.'},
        'SPEAKER_01_5': {'trascript': ' Great! Let me bring the state licensed product specialist on the line to share information with you. Please hold.'}
        })
    print(msg,resp)
    