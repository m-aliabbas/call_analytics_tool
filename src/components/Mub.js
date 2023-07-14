import React from 'react'

export default function Mub() {
  
  const data = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
    { id: 3, name: 'Bob Johnson', age: 35 },
  ];
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
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            {/* <td>
              <button className="btn btn-danger">Detail</button>
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
    </div>

   
   </>
  )
}
