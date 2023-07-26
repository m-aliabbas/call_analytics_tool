import React,{useEffect, useState} from 'react'

export default function Mub() {
  const [fullData , setFullData] = useState(null);
 
  useEffect(() => {
    // Fetch data from API
    fetch('http://192.168.100.115:8000/get_full_transcripts')
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
   
<h1>M.U.B</h1>

   <div className='table-out'>
    <table className="table">
      <thead className="thead-light">
        <tr>
          <th>ID</th>
          <th>Name</th>
          {/* <th>Actions</th> */}
        </tr>
      </thead>
      {fullData ? (
       <tbody>
       {
          fullData.data.map((item,key) => {
            // console.log(item.full_transcript);

          return(
            <>
             
        
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
