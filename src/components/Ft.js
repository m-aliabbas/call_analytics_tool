import React, { useEffect, useState } from 'react';

import "./ft.css"

export default function Ft() {
  const https = "http://192.168.100.58:8000"

  const [fullData, setFullData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("5"); // Initialize as string

  useEffect(() => {
    fetch(https + '/get_full_transcripts')
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

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = fullData ? fullData.data.filter((item) =>
    item.file_id.toString().includes(searchTerm) ||
    item.full_transcript[item.file_id].toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredData.length / parseInt(itemsPerPage, 10)); // Parse as integer

  // Get current items
  const currentItems = filteredData.slice((currentPage - 1) * parseInt(itemsPerPage, 10), currentPage * parseInt(itemsPerPage, 10)); // Parse as integer

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className='main-ft'>
        <h1 className='heading'>Full Transcript</h1>
        <div className='input-div'>
          <input
            style={{
              padding: "10px",
              fontSize: "14px",
              borderRadius: "5px",
              border: "none",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
              width: "30%"
            }}
            type="text"
            placeholder="Type a Keyword..."
            value={searchTerm}
            onChange={handleSearchChange}
          />

          {/* Add dropdown for items per page */}
          <span className='dropdown-ft'
          style={{
            padding: "10px",
            fontSize: "14px",
            borderRadius: "5px",
            border: "none",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
            width: "9%"
          }}
          >
          <select value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)}> {/* Use the event value directly */}
         
          <option value="5">-- Select --</option>
            <option value="2">2 per page</option>
            <option value="4">4 per page</option>
            <option value="8">8 per page</option>
            <option value="12">12 per page</option>
          </select>
          </span>

        </div>

        <div className='table-out table-ft'>
          <table className="table ">
            <thead className="thead-light">
              <tr>
                <th>File ID</th>
                <th>Full Transcript</th>
              </tr>
            </thead>
            {currentItems.length > 0 ? (
              <tbody>
                {currentItems.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td>{item.file_id}</td>
                      <td>{item.full_transcript[item.file_id]}</td>
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

       

        {/* Add pagination */}
        <div className='pagess' 
        style={{
          padding: "10px",
          fontSize: "14px",
          borderRadius: "5px",
          boxShadow: " 0px 2px 5px rgba(0, 0, 0, 0.15)",
          width: "80%"
        }}>
           {/* Display the total result count */}
        <p className='result'>Total Results: {filteredData.length}</p>
          {[...Array(totalPages).keys()].map((num) => (
            <button className='btn-ft' key={num} onClick={() => paginate(num + 1)}>
              {num + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
