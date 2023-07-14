import React,{useState} from 'react'
import "./callanalytics.css";

import axios from 'axios';

export default function Callanalytics() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = event.target.files; 
    setSelectedFiles({files});
    console.log("send")
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(selectedFiles);
    sendFiles(selectedFiles);
  };

  const data = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
    { id: 3, name: 'Bob Johnson', age: 35 },
  ];
  const sendFiles = async  (files)  => {
    const formData = new FormData();
    formData.append("files", selectedFiles.files[0], 'files')
    
    const response = 	axios({
      url: "http://192.168.100.115:8000/uploadfiles/",
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
  return (
   <>
  
{/* form */}

<h1>Call Analytics</h1>

     <div className="form-container">
      <h2>File Upload Form</h2>
      <form method='POST' encType='multipart/form-data' onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="audioFiles">Select Audio File(s):</label>
          <input
            type="file"
            id="files"
            name="files"
            // accept=".wav"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Upload</button>
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
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>
              <button className="btn btn-danger">Detail</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
   </>
  )
}
