import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadVideo from "./pages/UploadPage.js";
//import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
        <Routes>
          {/* Landing page is UploadVideo */}
          <Route path="/" element={<UploadVideo />} />
        </Routes>
    </Router>
    );
    {/*
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    */}
}

export default App;
