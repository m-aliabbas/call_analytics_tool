from collections import Counter
import pandas as pd
from DB_Interface import DB_Interface
class CallAnalytics():

    def __init__(self):
        self.dict_list = []
        self.keywords = {"Hello":"ello", "Introduction":"how are you doing today", "Qualification":"qualif", "insuranceplan":"call is about a new state","decisionmaker":"are you capable enough", "iamdoinggreat":"i am doing great thanks for asking", "canyouhearme":"can you hear me", "sorrytohearthat":"sorry to hear that", "saythatagainplease": "say that again please", "transfer":"great let me bring the state", "notinterested":"i completely understand that but these new affordable", "busy":"i understand but it is not gonna take much time", "whereareyoulocated":"well we have different offices", "howmuchdoesitcost":"well that is a good question let me bring on the line my product specialist", "age":"may i ask how old are you", "alreadyhaveinsurance":"its great that you're thinking", "agecriteria":"between the age of 40 and 80 can qualify", "transfer2":"i can bring my product specialist on the line"}
        self.path = (r"C:\\Users\\danis\\Downloads\\Music\\")
        self.outfolder_path = "OUTPUT"
        self.files = None
        self.file_name = []
        self.splitted_trans = {}
        self.splitted_speaker_list = []
        self.sequence_dict = {}
        self.full_transcript = {}
        self.splitted_df = {}
        self.audios = {}
        self.most_common_ngrams = {}
        self.db_interface = DB_Interface()
        self.data = []


    def db_update(self):
        # Get the Updated data from the database
        self.db_data = self.db_interface.get_all()
        if self.db_data == []:
            self.dict_list = [
            {
            'file_id': '', 
            'SPEAKER_01_1': {'trascript': ""}, 
            'SPEAKER_00_1': {'trascript': ""},             },
            ]
        else: 
            self.dict_list = self.db_interface.get_all()


    def input_speaker_data(self,input_dict):
        # Getted the diarization result from server and insert data into the database and then call driver so the updated data is returned
        file_name = input_dict['file_id']
        whole_data = input_dict
        if file_name in self.file_name:
            print("Does Exist: " , file_name)
        else:
            # print("Doesnot Exist: " , file_name)
            self.db_interface.insert(filename=file_name,data=whole_data)
        self.driver()


    def splittedDF(self):  
        # Splitting the data into separate dataframes for each speaker
        for dict in self.dict_list:
            local_trans = []
            local_speaker = []
            for key, value in dict.items():
                if "file_id" in key:
                    file_id = value
                    self.file_name.append(value)
                    
                elif "SPEAKER" in key:
                    split_trans = value["trascript"]
                    local_trans.append(value["trascript"])
                    local_speaker.append(key.split("_")[1])
            self.splitted_trans[file_id] = local_trans

            df = pd.DataFrame({"speaker":local_speaker, "transcript":local_trans})
            self.splitted_df[file_id] = df
            # local_trans.clear()


    def fullTrasncript(self):
        # Creating a full transcript by joining the transcriptions from all speakers
        i = 0
        for id, trans in self.splitted_trans.items():
            new_trans = ' '.join(trans)
            self.full_transcript[id] =  new_trans
            i+=1
        # self.fulls_trans = self.full_transcript['20220328-102401_6623727904-all']


    def sequence(self,):
        # Finding sequences of keywords in the transcriptions
        for key, value in self.splitted_trans.items():
            sequence_list = []  
            lowercase_list = [item.lower() for item in value]
            
            for k, val in self.keywords.items():
                for each_trans in lowercase_list:       
                    if val in each_trans:
                        sequence_list.append(k.lower())                   
                    else:
                        continue

            self.sequence_dict[key] = (", ".join(sequence_list))
            # sequence_list.clear()


    def mostUsedPhrases(self):
        # Count the most used phrases in split phrase
        dataframes = list(self.splitted_df.values())
        
        combined_dataframe = pd.concat(dataframes, ignore_index=True)

        combined_dataframe["transcript"] = combined_dataframe["transcript"].str.lower()
        combined_dataframe["transcript"] = combined_dataframe["transcript"].str.replace('[^\w\s]', '')

        # Counting most common n-grams for each speaker
        n = 5  # length of phrase in words
        ngrams = {}
        for speaker in combined_dataframe["speaker"].unique():
            speaker_text = combined_dataframe.loc[combined_dataframe["speaker"] == speaker, 'transcript'].tolist()
            speaker_text = ' '.join(speaker_text)
            words = speaker_text.split()
            ngrams[speaker] = Counter(' '.join(words[i:i+n]) for i in range(len(words)-n+1))
        
        # Getting the most common n-grams for each speaker
        self.most_common_ngrams = {}
        for speaker in ngrams:
            self.most_common_ngrams[speaker] = ngrams[speaker].most_common(5)


    def driver(self,):
        # Driver function to execute the analysis steps
        self.db_update()
        self.splittedDF()
        self.sequence()
        self.fullTrasncript()
        self.mostUsedPhrases()


analytics = CallAnalytics()
analytics.driver()
