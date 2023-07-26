import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
// import Test from './Test';
import "./getdetails.css"
export default function Getdetails() {
  const { id } = useParams();
  const [fullData, setFullData] = useState(null);
  const [speaker, setSpeaker] = useState(null);
  const [transcript, setTranscript] = useState(null);
  // console.log(fullData.data[0].spliited_trans.splitted_transcript[id])
  useEffect(() => {
    // Fetch data from API
    fetch('http://192.168.100.115:8000/get_full_data/' + id)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((data) => {
        // console.log(data);
        setFullData(data);
        // let transcripts=fullData.data[0].spliited_trans.splitted_transcript[id];
        // let speakers=fullData.data[0].spliited_trans.speakers[id];
        // setSpeaker(speakers);
        // setTranscript(transcripts);
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation: ', error);
      });
  }, []);

  // console.log(fullData.data[0].spliited_trans.splitted_transcript[id])
  return (
    <>

      {
        fullData ?
          <div className="pl-3 pt-3">
                        <div>
            <h1>
               Sequence :
            </h1>
            {fullData.data[0].sequence_dict[id]}
            </div>
            <div>
            <h1>
                Full Transcript:
            </h1>
            {fullData.data[0].full_transcript[id]}
            </div>

            <div>
              <section>
              <div className="container py-5">

                <div className="row d-flex justify-content-center">
                  <div className="col-md-10 col-lg-8 col-xl-6">

                    <div className="card" id="chat2">
                      <div className="card-header d-flex justify-content-between align-items-center p-3">
                        <h5 className="mb-0">Conversation</h5>
                      </div>
                      
                      {fullData.data[0].spliited_trans.splitted_transcript[id].map((item, index) => (

                        // <p key={index}>
                        //   <strong>Speaker {fullData.data[0].spliited_trans.speakers[id][index]}:</strong> {item}
                          
                        // </p>

                       parseInt(fullData.data[0].spliited_trans.speakers[id][index])%2 === 0 ? <div className="card-body" style={{ position: 'relative', }}>
                        {/* Your chat messages go here */}

                        <div className="d-flex flex-row justify-content-start">
                          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                            alt="avatar 1" style={{ width: '45px', height: '100%' }} />
                          <div>
                            <p className="small p-2 ms-3 mb-1 rounded-3" style={{ backgroundColor: '#f5f6f7' }}>{item}</p>
                            {/* Other messages go here */}
                          </div>
                        </div>
                        {/* Other similar chat messages go here */}
                      </div> : 
                            <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                            <div>
                              <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">{item}</p>
                            </div>
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                              alt="avatar 1" style={{ width: '45px', height: '100%' }} />
                          </div>

                      ))}

                      
                      


                      


                    
                    </div>

                  </div>
                </div>

              </div>
            </section>

            </div>

            {/* Code for chat bot conversation separater */}
            







          </div>
          :
          console.log('nothing')
      }

      {/* <Test /> */}

    </>
  )
}
