import React, {useState} from 'react'
import "./sidebar.css"

// import {useNavigate } from 'react-router-dom';
export default function Sidebar() {

    const [isSubItemsOpen, setIsSubItemsOpen] = useState(false);
    // const navigate = useNavigate();
    const toggleSubItems = () => {
      setIsSubItemsOpen(!isSubItemsOpen);
    //   navigate("/callanalytics");
    };

    return (
        <>
        <div className="sidebar">
            <div className='logo'>Sidebar</div>
      <ul>
        <li className='main-head'><a href="/">Home</a></li>
        <div className='d-flex'>

        <li className='main-head'><a href="/callanalytics">Call Analytics</a></li>

        <li className='main-head-icon' onClick={toggleSubItems}>
        v
          {isSubItemsOpen ? (
              <ul>
              <li className='sub-head'><a href="/ft">F.T</a></li>
              <li className='sub-head'><a href="/mub">M.U.B</a></li>
              <li className='sub-head'><a href="/sequence">Sequence</a></li>
            </ul>
          ) : null}
        </li>
          </div>
        
        <li className='main-head'><a href="/loganalytics">Log Analytics</a></li>
        <li className='main-head'><a href="/test">Test</a></li>
      </ul>
    </div>
            
        </>
    )
}

