from Processor.LogProcessor import LogAnalytics
from DataSource.Mongo_DB import Mongo_DB
import requests
import json
import os

class LogInterface:
    def __init__(self,):
        self.log_processor = LogAnalytics()
        self.data = self.log_processor.driver()
        self.DB = Mongo_DB(address='mongodb://localhost:27017/',
                 db_name='call_analytics_tool',
                 collection_name='log_record',)

    def insert_to_db(self,):
        file_id = self.data["file_id"]
        if  self.DB.check_if_exists(file_id=file_id):
            return True, 'Data  already exists'
        else:
            temp_=self.DB.insert(data=self.data)
            if temp_:
                return True, 'Data Added successfully'
            else:
                return False,'Something went wrong'
    
    def get_complete_data(self,):
        data = self.DB.find()
        return data

    def get_particular_data(self,file_id):
        data = self.DB.find({'file_id':file_id})
        return data

logsinterface = LogInterface()
        
    
    