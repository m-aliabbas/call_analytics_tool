import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
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

  // pie chart
  const data = [
    { name: 'Category 1', value: 100 },
    { name: 'Category 2', value: 100 },
    { name: 'Category 3', value: 100 },
    { name: 'Category 4', value: 100 },
    { name: 'Category 5', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  return (
    <>

      <div className="form-container">

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

      {/* pie chart */}

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="30%" // Adjust this to align the Pie component
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {
                data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
              }
            </Pie>
            <Tooltip />
            <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ lineHeight: '40px', marginRight: '20%' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>


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
