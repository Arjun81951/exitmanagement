// src/components/QRCodeGenerator.js
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Import QRCodeSVG
import axios from 'axios'; // Import axios for API calls

function StudentQr() {
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const request = localStorage.getItem('request');
    const email = localStorage.getItem('email');
    const time = localStorage.getItem('time');
    const id = localStorage.getItem('id')
    
    console.log('Request:', request);

    axios.get(`http://localhost:5000/student/request/${email}`)
      .then(response => {
        console.log('API Response:', time);
        if( response.data.recentRequest.status === 'Approved')
        {
            setInputText(`http://localhost:3000/result?time=${time}&id=${id}`); // Correctly set inputText with API response
        }
      
        // setStat(response.data.recentRequest.status)        
        
      })
      .catch(error => {
        console.error('API Error:', error);
      });
    //   console.log("status", stat);
  }, []); // Add an empty dependency array to avoid infinite re-renders

  return (
    <div className="App">
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>QR Code Generator</h1>
        <div style={{ marginTop: '20px' }}>
          {inputText && <QRCodeSVG value={inputText} size={256} />}
        </div>
      </div>
    </div>
  );
}

export default StudentQr;