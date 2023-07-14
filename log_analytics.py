import os
import re
import pandas as pd
from collections import Counter
class LogAnalytics:
    def __init__(self):
        self.total_calls = 0
        self.valid_calls = 0
        self.total_states = 0
        self.class_count = 0
        self.call_drop = 0
        self.count_class = 0
        self.fig = None
        self.fig2 = None
        self.most_common_ngrams = []
        self.files = []
        self.content = []
        self.calls = []
        self.state_str = []
        self.state_seq_call = []
        self.state_seq = []
        self.trans_list = []
        self.transcripts = []
        self.state_keywords = ['ello', 'ntro', 'nterested', 'AGE', 'Age', 'ransfer', 'achine', 'reeting', 'reetings', 'itch', 'OPT', 'arrier', 'panish', 'DNC', 'dnc', 'busy', 'Busy', 'ositive', 'egative', 'XFER', 'ualifies', 'ualified']
        self.number_data = {}
        # print(self.state_keywords)
    



    def fileReader(self,file_name):
        path = (f'{os.getcwd}//files')
        try:
            with open(os.path.join(path,file_name), "r") as file:
                data = file.read()
                # .decode("utf-8")
                self.files.append(file_name)
                self.content.append(data)
        except FileNotFoundError:
            print(f"file not found: {file_name}")
        except IOError:
            print(f"error occured while reading file: {file_name}")

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
            df_number_data = pd.DataFrame({"Caller ID":numbers, "Transcript":number_trans, "Disposition":number_dis})
            self.number_data[number] = df_number_data       
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
        # print(f"call drop:  {self.call_drop}")              

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


    def driver(self):
        # file_names = st.file_uploader("Upload log file", accept_multiple_files = True)
        # class_name = st.text_input("Class Name")
        # disposition_button = st.button("Dispositions")
        file_names = ["20220830-134129_27843595-all_results"]
        class_name = "dnc"
        class_name = class_name.lower()
        # for file_name in file_names:
        #     self.fileReader(file_name.name)
        self.callSplitter()
        self.numberData()
        self.callCounter()
        self.getStates()
        self.stateSequence()
        self.countCallDrops(class_name)
        self.countValidCalls()
        self.countClass(class_name)
        self.countMostUsedPharses()

        # st.write(f"Total Calls: {self.total_calls}")
        # st.write(f"Valid Calls: {self.valid_calls}")
        # st.write(f"Total States: {self.count_class}")

analaytics = LogAnalytics()
analaytics.driver()
    



        