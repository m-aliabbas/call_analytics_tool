from Processor.LogProcessor import LogAnalytics
from DataSource.Mongo_DB import Mongo_DB
import requests
import json
import os
import re
import pandas as pd
from collections import Counter
import itertools

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
                   collection_name='log_record32',)

    
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
    

    def empty_db(self,):
        temp = self.DB.empty()
        if temp:
            print('Eliminated')
            return True, 'Data Eliminated successfully'
        else:
            print('Error')
            return False,'Something went wrong'
        

    def get_new_data(self,):
        # Query the database and retrieve all records
        data = self.DB.find()

        # Initialize an empty list to store the results
        results = {}

        # Loop through each entry (or record) in the data
        for entry in data:
            
            # Extract the 'AI None Separater' dictionary from the current entry
            record = entry['AI None Separater']
            
            # Loop through all values in the 'AI None Separater' dictionary
            for value in record.values():
                
                # Assuming each value is a list (or iterable), loop through its elements
                for phrase in value:
                    
                    # Append each element (phrase) to the results list
                    results[phrase['Phone Number']] = phrase['Current State'] 
        return data
    

    def count_words(self,word_list):
        return dict(Counter(word_list))
    

    def get_all_logs(self, state):
        # Fetching data from the database
        data_lists = self.DB.find()
        
        # Converting the state to lowercase
        state = state.lower()
        
        # Initializing counters and lists
        total_calls = 0
        valid_calls = 0
        call_drop = 0
        Caller_ID_List = []
        Transcript_List = []
        Disposition_List = []
        File_ID_List = []
        states_number = []
        
        # Iterating over the fetched data
        for data_list in data_lists:
            file_id = data_list.get('file_id', None)
            if not file_id:
                continue
            # Using the 'get' method to safely access dictionary keys
            states_number.append(data_list.get('states_number', {}).get(file_id, {}))
            total_calls += data_list.get('total_calls', 0)
            valid_calls += data_list.get('valid_calls', 0)
            Caller_ID_List += data_list.get('Caller_ID', {}).get(file_id, [])
            Transcript_List += data_list.get('Transcript', {}).get(file_id, [])
            Disposition_List += data_list.get('Disposition', {}).get(file_id, [])
            File_ID_List += [os.path.basename(file_id)[:-4]] * len(data_list.get('Caller_ID', {}).get(file_id, []))
        
        last_items = []
        for item in states_number:
            for values in item.values():
                if values:  
                    last_items.append(values[-1])
        count = Counter(last_items)
        
        if state == 'all':
            call_drop = sum(count.values())
        else:
            call_drop = count.get(state, 0)

        # Merging the state numbers
        merged_dict = {}
        for d in states_number:
            merged_dict.update(d)

        States_new = [merged_dict.get(number, None) for number in Caller_ID_List]
        
        # Ensuring all lists are of the same length
        min_number = min(len(Caller_ID_List), len(Disposition_List), len(Transcript_List), len(File_ID_List), len(States_new))

        
        # Constructing the final data structure to be returned
        complete_data = {
            'total_calls': total_calls,
            'valid_calls': valid_calls,
            'call_drop': call_drop,
            'disposition_table': {
                'caller_id': Caller_ID_List[:min_number],
                'transcript': Transcript_List[:min_number],
                'disposition': Disposition_List[:min_number],
                'file_id': File_ID_List[:min_number],
                'states': States_new[:min_number]
            }
        }
        df = pd.DataFrame(complete_data['disposition_table'])
        
        if state != 'all':
            # Select rows where the last value of the list in 'states' column is 'pitch opt'
            selected_rows = df[df['states'].apply(lambda x: x[-1] if x else None) == state]

            # Convert the selected rows to dictionary
            dict_representation = selected_rows.to_dict()
            complete_data['disposition_table'] = dict_representation
            complete_data['disposition_table']['caller_id'] = list(complete_data['disposition_table']['caller_id'] .values())
            complete_data['disposition_table']['transcript'] = list(complete_data['disposition_table']['transcript'] .values())
            complete_data['disposition_table']['disposition'] = list(complete_data['disposition_table']['disposition'] .values())
            complete_data['disposition_table']['file_id'] = list(complete_data['disposition_table']['file_id'] .values())
            complete_data['disposition_table']['states'] = list(complete_data['disposition_table']['states'] .values())

            word_counts = self.count_words(complete_data['disposition_table']['disposition'])
            
            complete_data['disposition_table']['disposition_freq']  = word_counts

        return complete_data
    

    def get_complete_data(self,):
        data = self.DB.find()
        data_lists = data
        total_calls = 0
        valid_calls = 0
        call_drop = 0
        Caller_ID_List = []
        Transcript_List = []
        Disposition_List = []
        File_ID_List = []
        for data_list in data_lists:
            file_id = data_list['file_id']
            total_calls += data_list['total_calls']
            valid_calls += data_list['valid_calls']
            call_drop += data_list['call_drop']
            # print(data_list['Disposition'][file_id])
            Caller_ID_List += data_list['Caller_ID'][file_id]
            Transcript_List += data_list['Transcript'][file_id]
            Disposition_List += data_list['Disposition'][file_id]
            temp = []
            print(file_id,len(data_list['Disposition'][file_id]),len(data_list['Transcript'][file_id]),len(data_list['Caller_ID'][file_id]),)
            File_ID_List += [os.path.basename(file_id)[:-4]]*len(data_list['Caller_ID'][file_id])
        # this is not a perfect thing; Only adding because of less usecase
        min_number = min(len(Caller_ID_List),len(Disposition_List),len(Transcript_List),len(File_ID_List))

        complete_data = {
            'total_calls':total_calls,
            'valid_calls':valid_calls,
            'call_drop' : call_drop,
            'disposition_table':{'caller_id':Caller_ID_List[:min_number],
                                 'transcript':Transcript_List[:min_number],
                                 'disposition':Disposition_List[:min_number],
                                 'file_id':File_ID_List[:min_number],
                                 }
        }
        return complete_data


    def get_particular_data(self,file_id):
        data = self.DB.find({'file_id':file_id})
        return data
    
    
    def get_most_phrases(self,):
        data = self.DB.find({},)
        try:
            # Extract and flatten all 'Transcript' values
            all_phrases = [phrase for record in [entry['Transcript'] for entry in data] for value in record.values() for phrase in value]

            # Filter phrases longer than 3 words
            filtered_phrases = [phrase for phrase in all_phrases if len(phrase.split()) >= 4]

            # Count occurrences of each phrase
            phrase_counts = Counter(filtered_phrases)

            # Sort phrases by their counts
            sorted_phrases = sorted(phrase_counts.items(), key=lambda x: x[1], reverse=True)

            # Extract only the top 5 phrases
            result = dict(sorted_phrases[:5])

            data_response = {"status": True, "data": result, "msg": "data got"}

        except Exception as e:
            print(e)
            data_response = {"status":False,"data":{},"msg":f"You got the error {e}"}

        return data_response
    
    


    def get_disposition_freq(self,):
        data = self.DB.find({},)
        try:
            result = []

            for record in data:
                for value in record['Disposition'].values():
                    for phrase in value:
                        result.append(phrase)
            # Sort phrases by their counts
            word_counts = self.count_words(result)

            # Return the result
            data_response = {"status": True, "data": word_counts, "msg": "data got"}

        except Exception as e:
            print(e)
            data_response = {"status":False,"data":{},"msg":f"You got the error {e}"}

        return data_response
    

    def get_states(self):
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

            new_list =  df_temp['Current State'].value_counts().keys()
            new_list = new_list.insert(0, 'all')
            data_response = {"status":True,"data":new_list,"msg":"data got"}
            
        except Exception as e:
            print(e)
            data_response = {"status":False,"data":[],"msg":f"You got the error {e}"}
        return data_response


    def get_new_states(self):
        data = self.DB.find({},)
        try:
            data_lists = data
            states_number = []
            for data_list in data_lists:
                file_id = data_list['file_id']
                states_number.append(data_list['states_number'][file_id])
            # data_response = {"status":True,"data":new_list,"msg":"data got"}

            for state in states_number:
                # Using a set to store unique values
                unique_values = set()

                for key, value_list in state.items():
                    for item in value_list:
                        unique_values.add(item)

                # Convert set to list
                unique_list = list(unique_values)

                unique_list = sorted(unique_list)
                # Insert a value at the beginning of the list
                value_to_insert_first = 'all'
                unique_list.insert(0, value_to_insert_first)
                


            data_response = {"status":True,"data":unique_list,"msg":"data got"}

        except Exception as e:
            data_response = {"status":False,"data":[],"msg":f"You got the error {e}"}

        return data_response


    def word_counts(self,text):
        return len(text.split(' '))


    def get_states_call_drops(self,class_name):
        try:
            class_name = class_name.lower()
            data = self.DB.find()

            data_lists = data
            states_number = []
            total_calls = 0
            valid_calls = 0
            dicts = {}
            for data_list in data_lists:
                file_id = data_list['file_id']
                total_calls += data_list['total_calls']
                valid_calls += data_list['valid_calls']
                states_number.append(data_list['states_number'][file_id])

            # asssigning values to dict
            dicts['total_calls'] = total_calls
            dicts['valid_calls'] = valid_calls

            last_items = []
            
            for item in states_number:
                for values in item.values():
                    if values:  # Checks if the list is not empty
                        last_items.append(values[-1])

            count = Counter(last_items)

            if class_name == 'all':
                dicts['call_drops'] = sum(count.values())
            else:
                dicts['call_drops'] = count[class_name]
            
            data_response = {"status":True,"data":dicts,"msg":"data got"}

        except Exception as e:
            data_response = {"status":True,"data":{},"msg":f"You got the error {e}"}

        return data_response
 

    def get_none_responsis_pharase_freq(self,direct_flag = False, state = 'all'):
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
            df_temp['length'] = df_temp['AI bot got this data'].apply(self.word_counts)
            if not direct_flag:
                df_temp= df_temp[df_temp['length']>=3]
            print(df_temp.columns)
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

            sorted_frequency_dict = {k: v for k, v in sorted(counters.items(), key=lambda item: item[1], reverse=True)}
            data_response = {"status":True,"data":sorted_frequency_dict,"msg":"data got"}
            
        except Exception as e:
            print(e)
            data_response = {"status":False,"data":{},"msg":f"You got the error {e}"}
        return data_response


    def get_none_responis_word_freq(self,state = 'all',direct_flag=True):
        data = self.get_none_responsis_pharase_freq(direct_flag=direct_flag,state=state)
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
            # print(df_temp)
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
            # print(filtered_rows)
            filtered_rows.to_dict('records')
            row_data = filtered_rows.to_dict('records')
            data_response = {"status":True,"data":row_data,"msg":"data got"}
            # print(data_response)
        except Exception as e:
            print(e)
            data_response = {"status":False,"data":[],"msg":f"You got the error {e}"}
        # print(data_response)
        return data_response

# files_name = ["7C-D3-0A-1A-C3-C4_1676679530.txt","7C-D3-0A-1A-C3-56_1676588618.txt","7C-D3-0A-1A-C3-78_1676679544.txt","7C-D3-0A-1A-D3-A5_1676666312.txt"]
# logsinterface = LogInterface()
# logsinterface.insert_to_db(files_name)
# logsinterface.get_none_responsis_pharase_freq()
