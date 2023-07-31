import React,{useState, useEffect} from 'react'
import "./loganalytics2.css"
import axios from 'axios';
export default function Loganalytics2() {
  const https = "http://110.93.240.107:8081"

  const [pharsesData, setpharsesData] = useState(null);
  const [wordData, setWordData] = useState(null);
  const [botData, setBotData] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("Please Wait Processing .... ");


  
  useEffect(() => {
    // Fetch data from API
    fetch(https + '/get_phrase_freq')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((data) => {
        setpharsesData(data.data);
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation: ', error);
      });
  }, []);

  useEffect(() => {
    // Fetch data from API
    fetch(https + '/get_word_freq')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((data) => {
        setWordData(data.data);
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation: ', error);
      });
  }, []);
  // console.log(wordData)

  useEffect(() => {
    // Fetch data from API
    fetch(https + '/get_bot_hanged')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((data) => {
        setBotData(data.data);
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation: ', error);
      });
  }, []);

  

  // file upload


  const handleFileChange = (event) => {
    const files = event.target.files;
    let formData = new FormData();
    let fileNames = [];
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i], files[i].name);
      fileNames.push(files[i].name);
    }
    setUploadingFiles(fileNames);
    sendFiles(formData);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    let files = event.target.files;
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i], files[i].name);
    }
  };
  const sendFiles = async (formData) => {
    setUploadStatus("Please Wait Processing .... ")
    const response = axios({
      url: https+"/uploadlogfiles/",
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data',
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Credentials': true,
      },
      data: formData,
    })
      .then((res) => {
        setUploadStatus("Done Processing .... ")
       })
      .catch((err) => { });
    // console.log(response);
  }
  const itemsPerPage = 20;

  // State variables for pagination
  const [currentPagePhrases, setCurrentPagePhrases] = useState(1);
  const [currentPageWords, setCurrentPageWords] = useState(1);
  const [currentPageBotData, setCurrentPageBotData] = useState(1);
    // Functions to handle pagination
    const handleNextPagePhrases = () => {
      setCurrentPagePhrases(currentPagePhrases + 1);
    };
    const handlePreviousPagePhrases = () => {
      setCurrentPagePhrases(currentPagePhrases - 1);
    };
    const handleNextPageWords = () => {
      setCurrentPageWords(currentPageWords + 1);
    };
    const handlePreviousPageWords = () => {
      setCurrentPageWords(currentPageWords - 1);
    };
    const handleNextPageBotData = () => {
      setCurrentPageBotData(currentPageBotData + 1);
    };
    const handlePreviousPageBotData = () => {
      setCurrentPageBotData(currentPageBotData - 1);
    };

  return (
    <>

<div className="form-container mt-3">
<h2 className='file-heading'>File Upload Form</h2>
<form method='POST' encType='multipart/form-data' onSubmit={handleSubmit}>
  <div className="form-group">
    <label htmlFor="audioFiles">Select Zip File(s):</label>
    <input
      type="file"
      id="files"
      name="files"
      accept=".zip"
      multiple
      onChange={handleFileChange}
    />
  </div>

  <div className="uploading-files">
    {uploadingFiles.map((filename, index) => (
      <p key={index}>{uploadStatus} {filename}</p>
    ))}
  </div>
</form>
</div>


    <div className='main-log'>
      <div className='in-log'>

      

      {/* table 1 */}
    <h2 className='heading'>
      Phrases
    </h2>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>
              Sr
            </th>
            <th>
              Phrase
            </th>
            <th>
              Frequency
            </th>
          </tr>
        </thead>
        
        { pharsesData && (
          
            <tbody>
              {Object.entries(pharsesData.data)
                .slice((currentPagePhrases - 1) * itemsPerPage, currentPagePhrases * itemsPerPage)
                .map((item, key) => {
              return (
              <>
              <tr>
                <td>
                  {(currentPagePhrases - 1) * itemsPerPage+key+1 }
                </td>
                <td>
                  {item[0]}
                </td>
                <td>
                {item[1]}
                </td>
            </tr>
              </>)
             })}
             </tbody>
           )}
           <button onClick={handlePreviousPagePhrases} disabled={currentPagePhrases <= 1}>
             Previous
           </button>
           {
            pharsesData ? <button onClick={handleNextPagePhrases} disabled={currentPagePhrases >= Math.ceil(pharsesData.data.length / itemsPerPage)}>
            Next
          </button> : console.log('no')
           }
           {/*  */}
        

      </table>



       {/* table 2 */}
    <h2  className='heading'>
      Words
    </h2>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>
              Sr
            </th>
            <th>
              Word
            </th>
            <th>
              Frequency
            </th>
          </tr>
        </thead>
        
        {wordData && (
            <tbody>
              {Object.entries(wordData.data)
                .slice((currentPageWords - 1) * itemsPerPage, currentPageWords * itemsPerPage)
                .map((item, key) => {
              return (
              <>
              <tr>
                <td>
                {(currentPageWords - 1) * itemsPerPage+key+1}
                </td>
                <td>
                  {item[0]}
                </td>
                <td>
                {item[1]}
                </td>
            </tr>
              </>)
           })}
           </tbody>
         )}
         <button onClick={handlePreviousPageWords} disabled={currentPageWords <= 1}>
           Previous
         </button>
         {
            pharsesData ?
         <button onClick={handleNextPageWords} disabled={currentPageWords >= Math.ceil(wordData.data.length / itemsPerPage)}>
           Next
         </button> : console.log('no')
           }
      </table>




{/* table 3 */}
<h2  className='heading'>
      Bot Hanged Up
    </h2>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>
              Sr
            </th>
            <th>
              Phrase
            </th>
          </tr>
        </thead>
        
        {botData && (
            <tbody>
              {Object.entries(botData.data)
                .slice((currentPageBotData - 1) * itemsPerPage, currentPageBotData * itemsPerPage)
                .map((item, key) => {
              return (
              <>
              <tr>
                <td>
                {(currentPageBotData - 1) * itemsPerPage+key+1}
                </td>
                <td>
                  {item[1]}
                </td>
            </tr>
              </>)
            })}
            </tbody>
          )}
          <button onClick={handlePreviousPageBotData} disabled={currentPageBotData <= 1}>
            Previous
          </button>
          {
            pharsesData ?
          <button onClick={handleNextPageBotData} disabled={currentPageBotData >= Math.ceil(botData.data.length / itemsPerPage)}>
            Next
          </button>: console.log('no')
           }
        

      </table>



      </div>
      </div>
    </>
  )
}
