import React from 'react'
import Sidebar from './Sidebar'
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import Home from './Home';
import Ft from './Ft';
import Mub from './Mub';
import Sequence from './Sequence';
import Loganalytics from './Loganalytics';
import Callanalytics from './Callanalytics';
export default function Index1() {
    return (
        <>
            <div className='row'>

                <div className='col-md-2 st '>
                <Sidebar />

                </div>
                <div className='col-md-10 nd'>

                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/callanalytics" element={<Callanalytics/>} />
                            <Route path="/ft" element={<Ft />} />
                            <Route path="/mub" element={<Mub/>} />
                            <Route path="/sequence" element={<Sequence/>} />
                            <Route path="/loganalytics" element={<Loganalytics/>} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        </>
    )
}

