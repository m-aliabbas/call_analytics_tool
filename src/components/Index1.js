import React from 'react'
import "./index1.css"
import Sidebar from './Sidebar'
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import Home from './Home';
import Ft from './Ft';
import Mub from './Mub';
import Sequence from './Sequence';
import Loganalytics from './Loganalytics';
import Callanalytics from './Callanalytics';
import Getdetails from './Getdetails';
import Test from './Test';
import Loganalytics2 from './Loganalytics2';
export default function Index1() {
    return (
        <>
            <div className='row main'>

                <div className='col-2'>
                <Sidebar />

                </div>
                <div className='col-10'>

                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/callanalytics" element={<Callanalytics/>} />
                            <Route path="/ft" element={<Ft />} />
                            <Route path="/mub" element={<Mub/>} />
                            <Route path="/sequence" element={<Sequence/>} />
                            <Route path="/loganalytics" element={<Loganalytics/>} />
                            <Route path="/getdetails/:id" element={<Getdetails/>} />
                            <Route path="/loganalytics2" element={<Loganalytics2/>} />
                             <Route path="/test" element={<Test/>} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        </>
    )
}

