from Processor.LogProcessor import LogAnalytics
from DataSource.Mongo_DB import Mongo_DB
import requests
import json
import os
import pandas as pd

class LogInterface:
    def __init__(self,):
        self.log_processor = LogAnalytics()
        self.DB = Mongo_DB(address='mongodb://localhost:27017/',
                 db_name='call_analytics_tool',
                 collection_name='log_record',)

    def insert_to_db(self,file_name):
        print("files_name: ",file_name)
        data = self.log_processor.driver(files_name=file_name)
        file_id = data["file_id"]
        # print(data)
        if  self.DB.check_if_exists(file_id=file_id):
            print('Already Exists')
            return True, 'Data  already exists'
        else:
            temp_=self.DB.insert(data=data)
            if temp_:
                print('Inserted')
                return True, 'Data Added successfully'
            else:
                print('Error')
                return False,'Something went wrong'
    
    def get_complete_data(self,):
        data = self.DB.find()
        # print(data)
        return data

    def get_particular_data(self,file_id):
        data = self.DB.find({'file_id':file_id})
        return data
    
    # in sary functions me mongo db se data lena he ; us data k none ai responsis wali key me jana he; us ki frequency k lie aik df bnaien us se asain hojae gi; df[TEct col].value_counts ; or dobra dictionary bna k return krni he anwar ko 
    def get_none_responsis_pharase_freq(self):
        data = self.DB.find({},['AI None Separater','file_id'])
        df = pd.DataFrame(data)
        print(df)
        
        
    def get_none_responis_word_freq(self):
        pass

    def get_none_bot_hanged_up(self):
        pass

files_name = ["7C-D3-0A-1A-C3-56_1676588618.txt"]
logsinterface = LogInterface()
logsinterface.insert_to_db(files_name)
# logsinterface.get_none_responsis_pharase_freq()