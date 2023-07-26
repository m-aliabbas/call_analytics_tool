import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./callanalytics.css";

export default function Callanalytics() {
  const https = "http://192.168.0.157:8000";

  const [fullData, setFullData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handleFileChange = (event) => {
    const files = event.target.files;
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i], files[i].name);
    }
    sendFiles(formData);
    console.log(files);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let files = event.target.files;
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i], files[i].name);
    }
    sendFiles(formData);
  };

  const sendFiles = async (formData) => {
    const response = axios({
      url: https + "/uploadfiles/",
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
  };

  useEffect(() => {
    // Fetch data from API
    fetch(https + '/get_full_data')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((data) => {
        setFullData(data);
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation: ', error);
      });
  }, []);

  // Calculate the total number of pages
  // const totalPages = Math.ceil(fullData?.data.length / itemsPerPage);

  // ...

// Calculate the total number of pages
const totalPages = fullData ? Math.ceil(fullData.data.length / itemsPerPage) : 0;

// ...


  // Get current items
  const currentItems = fullData ? fullData.data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

  // Change page
  const handleChangePage = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
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
        </form>
      </div>

      <div className='table-out'>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          {currentItems.length > 0 ? (
            <tbody>
              {currentItems.map((item, key) => {
                let userId = "/getdetails/" + item.file_id;
                return (
                  <tr key={key}>
                    <td>{item.file_id}</td>
                    <td>{item.full_transcript[item.file_id]}</td>
                    <td>
                      <button>
                        <a href={userId}>Details</a>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td>Loading</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {/* Add page dropdown */}
      <div>
        <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
          <option value="2">2 per page</option>
          <option value="4">4 per page</option>
          <option value="8">8 per page</option>
          <option value="12">12 per page</option>
        </select>
      </div>

      {/* Add pagination */}
      <div className='pagination'>
        {[...Array(totalPages).keys()].map((num) => (
          <button key={num} onClick={() => handleChangePage(num + 1)}>
            {num + 1}
          </button>
        ))}
      </div>
    </>
  );
}
