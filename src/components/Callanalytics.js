import React,{useEffect, useState} from 'react'
import "./callanalytics.css";

import axios from 'axios';

export default function Callanalytics() {
  const https="http://192.168.100.100:8081"

  // const [selectedFiles, setSelectedFiles] = useState([]);
  const [fullData , setFullData] = useState(null);
  
  let userUrl="."
  const handleFileChange = (event) => {
    const files = event.target.files; 
    let formData = new FormData();
    for(let i = 0; i < files.length; i++) {
      formData.append("files", files[i], files[i].name);
    }
    sendFiles(formData);
    console.log(files)
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    let files = event.target.files; 
    let formData = new FormData();
    for(let i = 0; i < files.length; i++) {
      // Appending each file
      console.log(i)
      formData.append("files", files[i], files[i].name);
    }
    // console.log(selectedFiles);
    sendFiles(formData);
  };
  const sendFiles = async  (formData)  => {
    
    const response = 	axios({
      url: https+"/uploadfiles/",
      method: "POST",
        headers: {
            'Content-Type': 'multipart/form-data',
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Credentials': true,
          },
      data: formData,
      })
      .then((res) => { }) 
      .catch((err) => { });
    console.log(response.data);
}
useEffect(() => {
  // Fetch data from API
  fetch(https+'/get_full_data')
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok');
    })
    .then((data) => {
      // console.log(data);
      setFullData(data);
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation: ', error);
    });
}, []);
  return (
   <>
  
{/* form */}


<h1 className='heading'>Call Analytics</h1>
     <div className="form-container">
      
      <h2 className='file-heading'>File Upload Form</h2>
      <form method='POST' encType='multipart/form-data' onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="audioFiles">Select Audio File(s):</label>
          <input
            type="file"
            id="files"
            name="files"
            accept=".wav"
            multiple
            onChange={handleFileChange}
          />
        </div>
        {/* <button className='file-btn' type="submit">Upload</button> */}
      </form>
    </div>


    {/* table */}

<div className='table-out'>
    <table className="table">
      <thead className="thead-light">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      {fullData ? (
       <tbody>
       {
          fullData.data.map((item,key) => {
            // console.log(item.full_transcript);
            let userId="/getdetails/"+item.file_id
         
          return(
            <>
             <tr key={key}>
            <td>{item.file_id}</td>
            <td>{item.full_transcript[item.file_id]}</td>
            <td>
              
              <button>
                <a href={userUrl + userId}> Details</a>
                
              </button>
            </td>
          </tr>
            </>
          )
          })
      
       }
     </tbody>
     
      ) : (
        <tbody>
        <tr>
          <td>
            Loading
          </td>
        </tr>
        </tbody>
      )}
 
 </table>
    </div>
   </>
  )
}
