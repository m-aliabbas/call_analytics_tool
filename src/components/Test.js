import React, { useState, useEffect } from 'react'

export default function Test() {
    const [state, setState] = useState(null);
    const https = "http://110.93.240.107:8081"
    const [wordData, setWordData] = useState(null);
    const [pharsesData, setpharsesData] = useState(null);


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
      const handleChangeSelect =(e)=>{
        // console.log(e.target.value)
        const option = e.target.value;
        fetch(https + '/get_phrase_freq/'+ option)
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
    }





    useEffect(() => {
        // Fetch data from API
        fetch(https + '/get_states')
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                setState(data.data);
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation: ', error);
            });
    }, []);
    // console.log(state)

    useEffect(() => {
        // Fetch data from API
        fetch(https + '/get_phrase_freq/all')
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

    const itemsPerPage = 5;

    // State variables for pagination
    const [currentPagePhrases, setCurrentPagePhrases] = useState(1);
    const [currentPageWords, setCurrentPageWords] = useState(1);
    const [currentPageBotData, setCurrentPageBotData] = useState(1);
    // Functions to handle pagination
    const handleNextPagePhrases = () => {
        setCurrentPagePhrases(currentPagePhrases + 1);
    };
    const handleOnChangeSelect =(e)=>{
        // console.log(e.target.value)
        const option = e.target.value;
        fetch(https + '/get_phrase_freq/'+ option)
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
    }
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
            {state && (

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
                    <select onChange={handleOnChangeSelect}> {/* Use the event value directly */}
                        {Object.entries(state.data)
                            .map((item, key) => {
                                return (
                                    <>
                                        <option>{item[1]}</option>
                                    </>)
                            })}
                    </select>
                </span>
            )}




            {pharsesData ?
                <div>
                    {/* table 1 */}
                    <h2 className='heading'>
                        Phrases
                    </h2>
                    <table className="table">
                        <thead className="thead-light">
                            <tr>
                                <th className='td-border col-1'>
                                    Sr
                                </th>
                                <th className='td-border-c col-7'>
                                    Phrase
                                </th>
                                <th className='td-border col-2'>
                                    Frequency
                                </th>
                            </tr>
                        </thead>

                        {pharsesData && (

                            <tbody>
                                {Object.entries(pharsesData.data)
                                    .slice((currentPagePhrases - 1) * itemsPerPage, currentPagePhrases * itemsPerPage)
                                    .map((item, key) => {
                                        return (
                                            <>
                                                <tr>
                                                    <td className='td-border col-1'>
                                                        {(currentPagePhrases - 1) * itemsPerPage + key + 1}
                                                    </td>
                                                    <td className='td-border-c col-7'>
                                                        {item[0]}
                                                    </td>
                                                    <td className='td-border col-2'>
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
                    </table>
                </div>
                : <p>Loading ...</p>}



{state && (

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
    <select onChange={handleChangeSelect}> {/* Use the event value directly */}
        {Object.entries(state.data)
            .map((item, key) => {
                return (
                    <>
                        <option>{item[1]}</option>
                    </>)
            })}
    </select>
</span>
)}


{wordData ? 
       <div>

       {/* table 2 */}
    <h2  className='heading'>
      Words
    </h2>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th className='td-border col-1'>
              Sr
            </th>
            <th className='td-border-c col-7'>
              Word
            </th>
            <th className='td-border col-2'>
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
                <td className='td-border col-1'>
                {(currentPageWords - 1) * itemsPerPage+key+1}
                </td>
                <td className='td-border-c col-7'>
                  {item[0]}
                </td>
                <td className='td-border col-2'>
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
      </div>
       : <p>Loading ...</p>}
        </>
    )
}
