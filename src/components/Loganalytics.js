import React, { useEffect, useState } from 'react'
import Plotly from 'plotly.js-dist';
import axios from 'axios';
import "./loganalytics.css"

export default function Loganalytics() {
  const https = "http://192.168.0.157:8000"

  const [fullData, setFullData] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState([]);


  // const handleFileChange = (event) => {
  //   const files = event.target.files;
  //   let formData = new FormData();
  //   for (let i = 0; i < files.length; i++) {
  //     formData.append("files", files[i], files[i].name);
  //   }
  //   sendFiles(formData);
  //   console.log(files)
  // };
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
    console.log(files);
  };





  const handleSubmit = (event) => {
    event.preventDefault();
    let files = event.target.files;
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      // Appending each file
      console.log(i)
      formData.append("files", files[i], files[i].name);
    }
    // console.log(selectedFiles);
    sendFiles(formData);
  };
  // const sendFiles = async (formData) => {

  //   const response = axios({
  //     url: https+"/uploadfiles/",
  //     method: "POST",
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //       "Access-Control-Allow-Origin": "*",
  //       'Access-Control-Allow-Credentials': true,
  //     },
  //     data: formData,
  //   })
  //     .then((res) => { })
  //     .catch((err) => { });
  //   console.log(response.data);
  // }
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const sendFiles = async (formData) => {
    const response = await axios({
      url: https + "/uploadfiles/",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      data: formData,
      onUploadProgress: (progressEvent) => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setUploadPercentage(percentCompleted);
      },
    })
      // .then((res) => { })
      .then((res) => {
        setUploadingFiles([]);
      })

      .catch((err) => { console.log(err) });
    console.log(response.data);
  }



  useEffect(() => {
    // Fetch data from API
    fetch(https + '/get_full_log')
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
  // console.log(fullData)
  console.log(fullData);


  // bar chart
  const [dataPoints, setDataPoints] = useState([
    { country: "Italy", value: 55 },
    { country: "France", value: 49 },
    { country: "Spain", value: 44 },
    { country: "USA", value: 24 },
    { country: "Argentina", value: 15 },
    { country: "Pakistan", value: 80 },
    { country: "Islamic State Pakistan", value: 10 },
  ]);

  useEffect(() => {
    const xArray = dataPoints.map(point => point.country);
    const yArray = dataPoints.map(point => point.value);

    const data = [{
      x: xArray,
      y: yArray,
      type: "bar",
      orientation: "v",
      marker: { color:  "rgba(0, 0, 255, 0.6)"} // Use the color for bar
    }];

    const layout = { title: "" };

    Plotly.newPlot("myPlot", data, layout);

    return () => Plotly.purge("myPlot");
  }, [dataPoints]);


  return (
    <>

      <div className="form-container mt-3">

        <h2 className='file-heading'>File Upload Form</h2>
        <form method='POST' encType='multipart/form-data' onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="audioFiles">Select Audio File(s):</label>
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
              <p key={index}>Uploading: {filename}</p>
            ))}
          </div>


          <div className="progress-bar-container">
            <progress max="100" value={uploadPercentage} className="upload-progress"></progress>
            <span>{uploadPercentage}%</span>
          </div>

          {/* <button className='file-btn' type="submit">Upload</button> */}
        </form>
      </div>

      {/* bar chart */}

      {/* <div style={{ width: '100%', height: 300 }}>  </div> */}
        <div className='bar-graph' id="myPlot" style={{ width: "100%", maxWidth: "1200px" }}></div>


      {/* class Name */}

      <div className='main-log'>
        <div className='in-log'>



          <div>
            <h6>Class Name</h6>
          </div>

          <div>
            <input type="text" className='input-log' />
          </div>





          {fullData ? (
            <div>
              {fullData.data.map((item, key) => {
                console.log(item.file_id);


                return (
                  <>
                    <div key={key}>

                      <h2>{item.file_id}</h2>
                      <div>
                        <h6> Total Calls: <span> {item.total_calls}</span></h6>
                      </div>

                      <div>
                        <h6> Valid Calls: <span>  {item.valid_calls} </span></h6>
                      </div>

                      <div>
                        <h6> Totle States: <span>  {item.total_states} </span></h6>
                      </div>

                      <div>
                        <h6> Call Drop: <span>  {item.call_drop} </span></h6>
                      </div>

                      <div className='table-out-log '>
                        <table className="table table-log">
                          <thead>
                            <tr>

                              <th scope="col">Caller_ID</th>
                              <th scope="col">Transcript</th>
                              <th scope="col">Disposition</th>
                            </tr>
                          </thead>
                          <tbody>

                            {item.Disposition[item.file_id].map((item1, key) => {

                              return (
                                <>
                                  <tr>
                                    <td>{item.Caller_ID[item.file_id][key]}</td>
                                    <td>{item.Transcript[item.file_id][key]}</td>
                                    <td>{item.Disposition[item.file_id][key]}</td>
                                  </tr>
                                </>
                              )
                            })}
                            {/* <th scope="row">{item.id}</th> */}


                          </tbody>
                        </table>

                      </div>


                    </div>
                  </>
                )
              })

              }
            </div>
          ) : (

            <tr>
              <td>
                Loading
              </td>
            </tr>

          )}



        </div>
      </div>



    </>
  )
}
