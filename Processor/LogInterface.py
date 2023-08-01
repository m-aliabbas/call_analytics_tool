from Processor.LogProcessor import LogAnalytics
from DataSource.Mongo_DB import Mongo_DB
import requests
import json
import os
import re
import pandas as pd
from collections import Counter

def cleanify(text):
    # Convert the text to lowercase
    lower_text = text.lower()

    # Remove special characters using regular expression
    cleaned_text = re.sub(r'[^a-zA-Z0-9\s]', '', lower_text)

    return cleaned_text

def split_string_into_words(input_string):
    return input_string.strip().split()

class LogInterface:
    def __init__(self,):
        self.log_processor = LogAnalytics()
        self.DB = Mongo_DB(address='mongodb://localhost:27017/',
                 db_name='call_analytics_tool',
                 collection_name='log_record16',)

    
    def insert_to_db(self,file_name):
        print("files_name: ",file_name)
        data = self.log_processor.driver(files_name=file_name)
        file_id = data["file_id"]
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
    
    def get_none_responsis_pharase_freq(self,state = 'all'):
        data = self.DB.find({},['AI None Separater','file_id'])
        try:
            key = list(data[0]['AI None Separater'].keys())[0]
            df_temp = pd.DataFrame(data[0]['AI None Separater'][key])

            df_list = []
            if len(data)>1:
                for i in range(1,len(data)):
                    key = list(data[i]['AI None Separater'].keys())[0]
                    df_temp1 = pd.DataFrame(data[i]['AI None Separater'][key])
                    df_list.append(df_temp1)
            df_concat = pd.concat(df_list)
            df_temp = pd.concat([df_temp,df_concat])
            if state != 'all':
                counting = []
                for index, row in df_temp.iterrows():         
                    if row['Current State'] == state: 
                        counting.append(row['AI bot got this data'])
                        # current state jab state k equal ho to wo row nikalo
                counters = Counter(counting)
            else:    
                counting =    df_temp['AI bot got this data'].apply(cleanify).value_counts()
                counters = counting.to_dict()
            data_response = {"status":True,"data":counters,"msg":"data got"}
            
        except Exception as e:
            print(e)
            data_response = {"status":False,"data":{},"msg":f"You got the error {e}"}
        return data_response
        
    def get_none_responis_word_freq(self):
        data = self.get_none_responsis_pharase_freq()
        if data['status']:
            data = data['data']
            data = list(data.keys())
            list_of_words = [word for string in data for word in split_string_into_words(string)]
            frequency_dict = {}
            for item in list_of_words:
                frequency_dict[item] = frequency_dict.get(item, 0) + 1

            sorted_frequency_dict = {k: v for k, v in sorted(frequency_dict.items(), key=lambda item: item[1], reverse=True)}
            data_response = {"status":True,"data":sorted_frequency_dict,"msg":"data got"}
        else:
            data_response = {"status":False,"data":{},"msg":f"You got the error "}
        return data_response

    def get_none_bot_hanged_up(self):
        data = self.DB.find({},['AI None Separater','file_id'])
        try:
            key = list(data[0]['AI None Separater'].keys())[0]
            df_temp = pd.DataFrame(data[0]['AI None Separater'][key])
            df_list = []
            if len(data)>1:
                for i in range(1,len(data)):
                    key = list(data[i]['AI None Separater'].keys())[0]
                    df_temp1 = pd.DataFrame(data[i]['AI None Separater'][key])
                    df_list.append(df_temp1)
            df_concat = pd.concat(df_list)
            df_temp = pd.concat([df_temp,df_concat])
            # please make changes for bot hangedup
            filtered_rows = df_temp[df_temp['Next State'].apply(lambda states: 'Bot Hanged UP' in states)]
            row_data = list(filtered_rows['AI bot got this data'])
            data_response = {"status":True,"data":row_data,"msg":"data got"}
            # print(data_response)
        except Exception as e:
            print(e)
            data_response = {"status":False,"data":[],"msg":f"You got the error {e}"}
        # print(data_response)
        return data_response

# files_name = ["7C-D3-0A-1A-C3-C4_1676679530.txt"]
# logsinterface = LogInterface()
# logsinterface.insert_to_db(files_name)
# logsinterface.get_none_responsis_pharase_freq()
