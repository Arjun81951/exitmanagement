// NotFound.jsx
import React from 'react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">Ooops!</h1>
        <p className="notfound-message">The QR is distracted !</p>
        <p className="notfound-subtext">Your content was not found..</p>
        <a href="/" className="notfound-button">Go Home</a>
      </div>
    </div>
  );
};

export default NotFound;
