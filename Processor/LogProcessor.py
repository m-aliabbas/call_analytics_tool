import os
import re
import pandas as pd
from collections import Counter
import sys
import requests
import json
from zipfile import ZipFile
import streamlit as st

files_name = ["7C-D3-0A-1A-C3-78_1676679544.txt"]
file_names= ["zipper.zip"]
class LogAnalytics:
    def __init__(self):
        self.item_counts = None
        self.total_calls = 0
        self.valid_calls = 0
        self.total_states = 0
        self.class_count = 0
        self.call_drop = 0
        self.count_class = 0
        self.most_common_ngrams = []
        self.content = []
        self.files = []
        self.calls = []
        self.none_calls_1 = []
        self.none_calls_2 = []
        self.none_calls_3 = []
        self.state_str = []
        self.state_seq_call = []
        self.state_seq = []
        self.trans_list = []
        self.transcripts = []
        self.state_keywords = ['ello', 'ntro', 'nterested', 'AGE', 'Age', 'ransfer', 'achine', 'reeting', 'reetings', 'itch', 'OPT', 'arrier', 'panish', 'DNC', 'dnc', 'busy', 'Busy', 'ositive', 'egative', 'XFER', 'ualifies', 'ualified']
        self.number_data = {}
        self.filings = str
        self.filers_name = []
        self.splitted_calls_3 = []

    def zip_extractor(self,file_names):     
        path = "E://Python Practice//call_analytics_tool//uploaded_files//"    
        # opening the zip file in READ mode
        for filing in file_names:
            with ZipFile(os.path.join(path,filing), 'r') as zip:
                # printing all the contents of the zip file
                zip.printdir()
            
                # extracting all the files
                print('Extracting all the files now...')
                zip.extractall()
                print('Done!')

    def fileReader(self,file_name):
        path = "E://Python Practice//call_analytics_tool//uploaded_files//"
        for filing in file_name:
            self.filings = filing
            try:
                with open(os.path.join(path,filing), "r") as file:
                    data = file.read()
                    # .decode("utf-8")
                    self.files.append(filing)
                    self.content.append(data)
            except FileNotFoundError:
                print(f"file not found: {filing}")
            except IOError:
                print(f"error occured while reading file: {filing}")

    
    # def find_text_between_words(self, input_string, word1, word2):
    #     # Create a regular expression pattern to find the text between the two words
    #     pattern = r'{}(.*?){}'.format(re.escape(word1), re.escape(word2))

    #     # Search for matches using the regular expression
    #     matches = re.findall(pattern, input_string)

    #     return matches
    

    # def find_between(self, s, first, last ):
    #     try:
    #         start = s.index( first ) + len( first )
    #         end = s.index( last, start )
    #         return s[start:end]
    #     except ValueError:
    #         return ""


    def none_separator(self):
        for callContent in self.content:
            if "AI bot level= 2 : None" in callContent:
                splitted_calls_1 = callContent.split("AI bot level= 1 : None")
                splitted_calls_2 = callContent.split("AI bot level= 2 : None") 

                for call in splitted_calls_1:
                    self.none_calls_1.append(call)
                for call in splitted_calls_2:
                    self.none_calls_2.append(call)



    def none_text_separator_2(self):
        '''
        to extract number data ... 
        I made some changes and comment for that. 
        
        '''
       
        for call_index,call in enumerate(self.calls):
            number_transcript = [] #every time we make a transcript list
            if "AI bot got this data =" in call:
                splited_lines = call.splitlines()
                for line_index,line in enumerate(splited_lines):
                    if "AI bot got this data =" in line:
                        text = line.split("=")[1]
                        number_transcript.append(text)
                self.splitted_calls_3.append(number_transcript[0]) # getting only first Index of Transcript list
                
    def callSplitter(self):
        for callContent in self.content:
            if "call ended!!!" in callContent:
                splitted_calls = callContent.split("call ended!!!")
                for call in splitted_calls:
                    self.calls.append(call)


    def numberData(self):
        '''
        to extract number data ... 
        I made some changes and comment for that. 
        
        '''
        number_trans = []
        number_dis   = []
        numbers = []
       
        for call_index,call in enumerate(self.calls):

            number_transcript = [] #every time we make a transcript list
            if "AI bot got this data =" in call and "Incoming:" in call and "Disposition =" in call:
                splited_lines = call.splitlines()
                
                for line_index,line in enumerate(splited_lines):
                    if "Incoming:" in line:
                        number = line.split(" ")[1]
                        numbers.append(number)
                    if "AI bot got this data =" in line:
                        text = line.split("=")[1]
                        number_transcript.append(text)
                    if  "Disposition =" in line:
                        disposition = line.split("=")[1]
                        disposition = disposition[:-19] # remove the line containing slowing with 2sec etc (By. ALI)
                        number_dis.append(disposition)
                
                number_trans.append(number_transcript[0]) # getting only first Index of Transcript list

        # Display in One Dataframe
        try:
            df_number_data = {"file_id":self.filings,"Caller_ID":{self.filings:numbers}, "Transcript":{self.filings:number_trans}, "Disposition":{self.filings:number_dis}, "AI None Separater":{self.filings:self.splitted_calls_3},"State list":{self.filings:self.state_str}, "AI None Separater Counter":len(self.none_calls_1), "total_calls":self.total_calls, "valid_calls":self.valid_calls, "total_states": self.count_class, "call_drop": self.call_drop }
            self.number_data = df_number_data       
        except:
            pass 


    def callCounter(self):
        self.total_calls = len(self.calls)
        return self.total_calls


    def getStates(self):
        for data in self.content:
            for line in data.splitlines():
                # check if state line not exists in state_str (prevent duplicates) then append it.
                if line not in self.state_str:
                    for kw in self.state_keywords:
                        if "----" in line and kw in line:   
                            self.state_str.append(line)


    def stateSequence(self):
        # getting all states from a call storing into list state_seq

        for call in self.calls:
            # print(call)
            state_seq_call = []
            for line in call.splitlines():
                # print(line)
                # check if iterated line exists in state's list. Then append it in sequence list
                if line in self.state_str:   
                    # print(line)     
                    state_seq_call.append(line.lower())
            # print(self.state_seq_call)
            self.state_seq.append(state_seq_call)
            # print(self.state_seq)
            # self.state_seq_call.clear()


    def countValidCalls(self):
        for call_sequence in self.state_seq:
            if len(call_sequence)>=2:
                if "achine" not in call_sequence[-1] and "DNC" not in call_sequence[-1] and "dnc" not in call_sequence[-1] and "ualified" not in call_sequence[-1]:
                        self.valid_calls+=1
            else:
                continue


    def countCallDrops(self, class_name):
        for call_sequence in self.state_seq:
            if len(call_sequence)>=2:
                if class_name in call_sequence[-1]:
                    self.call_drop+=1
            else:
                continue             


    def countClass(self,class_name):
        for call_sequence in self.state_seq:
            for state in call_sequence:
                if class_name in state:
                    self.count_class+=1


    def countMostUsedPharses(self):
        
        for call_data in self.content:
            for line in call_data.splitlines():
                if "AI bot got this data =" in line:
                    trans_line = line.split("=")[-1]
                    self.trans_list.append(trans_line)
                    self.transcripts = list(set(self.trans_list))

        # WORKING TO EXTRACT MOST USED PHRASES

        # preprocess transcripts
        self.transcripts = [re.sub(r'[^\w\s]', '', transcript.lower()) for transcript in self.transcripts]

        # count n-grams
        n = 10 # length of phrase in words
        ngrams = Counter()
        for transcript in self.transcripts:
            words = transcript.split()
            ngrams.update(' '.join(words[i:i+n]) for i in range(len(words)-n+1))

        # get most common n-grams
        self.most_common_ngrams = ngrams.most_common(5)


    def driver(self,files_name):
        class_name = ""
        self.zip_extractor(file_names)        
        self.fileReader(files_name)
        self.callSplitter()
        self.callCounter()
        self.getStates()
        self.stateSequence()
        self.countCallDrops(class_name)
        self.countValidCalls()
        self.countClass(class_name)
        self.countMostUsedPharses()
        self.none_separator()
        self.none_text_separator_2()
        self.numberData()
        # AI None Separater
        st.write(self.splitted_calls_3)
        # AI state list
        st.write(self.state_str)
        # AI none separator Counter
        st.write(len(self.none_calls_1))
        self.total_calls = 0
        self.valid_calls = 0
        self.total_states = 0
        self.class_count = 0
        self.call_drop = 0
        self.count_class = 0
        self.most_common_ngrams = []
        self.content = []
        self.files = []
        self.calls = []
        self.state_str = []
        self.state_seq_call = []
        self.state_seq = []
        self.trans_list = []
        self.transcripts = []
        print(self.number_data)
        return self.number_data
    
logsinterfaces = LogAnalytics()
logsinterfaces.driver(files_name)