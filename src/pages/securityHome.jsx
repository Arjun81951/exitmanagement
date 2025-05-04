import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CameraView from './CameraView';


const SecurityHome = () => {
  const [notices, setNotices] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [latestVehicleEntry, setLatestVehicleEntry] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/hod/notices');
        setNotices(response.data.notices);
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    };

    const fetchLatestVehicleEntry = async () => {
      try {
        const response = await axios.get('http://localhost:5000/vechicle');
        setLatestVehicleEntry(response.data.data[0]?.vehicleNumber || null);
      } catch (error) {
        console.error('Error fetching latest vehicle entry:', error);
      }
    };

    fetchNotices();
    fetchLatestVehicleEntry();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/vehicle/add', {
        vehicleNumber,
      });
      setVehicleNumber('');
      alert('Vehicle added successfully!');
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  const handleQrScan = (text) => {
    alert(`QR Code Scanned: ${text}`);
   window.location.href=text
    console.log(text);
    
    setShowCamera(false);
  };

  return (
    <div className="security-container">
      <style>{`
        .security-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          background-color:rgb(52, 164, 244);
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .security-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .security-header h1 {
          font-size: 2rem;
          margin: 0;
        }

        .logout-button {
          background-color: #d9534f;
          color: white;
          border: none;
          padding: 0.5rem 1.2rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .logout-button:hover {
          background-color: #c9302c;
        }

        .security-section {
          background-color: #fff;
          border: 1px solid #e0e0e0;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .security-section h2 {
          margin-top: 0;
        }

        .camera-toggle-button {
          background-color: #0275d8;
          color: white;
          border: none;
          padding: 0.4rem 1rem;
          border-radius: 5px;
          margin-top: 0.8rem;
          cursor: pointer;
        }

        .camera-toggle-button:hover {
          background-color: #025aa5;
        }

        .notice-list {
          list-style: disc;
          margin-left: 1.5rem;
        }

        .security-form {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          background-color: #fff;
          border: 1px solid #e0e0e0;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .security-form input {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .security-form button {
          background-color: #5cb85c;
          color: white;
          border: none;
          padding: 0.6rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .security-form button:hover {
          background-color: #4cae4c;
        }
      `}</style>

      <header className="security-header">
        <h1>Security Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <section className="security-section">
        <h2>📷 QR Code Scan</h2>
        <p>Scan student QR code using your device camera.</p>
        <button className="camera-toggle-button" onClick={() => setShowCamera(!showCamera)}>
          {showCamera ? 'Close Camera' : 'Open Camera'}
        </button>
        {showCamera && <CameraView onScanSuccess={handleQrScan} />}
      </section>

      <section className="security-section">
        <h2>📢 Notices from HOD</h2>
        <ul className="notice-list">
          {notices.length > 0 ? (
            notices.map((notice, index) => <li key={index}>{notice.description}.{notice.department}</li>)
          ) : (
            <li>No notices available.</li>
          )}
        </ul>
      </section>

      <section className="security-section">
        <h2>🚗 Latest Vehicle Entry</h2>
        <p>{latestVehicleEntry || 'No vehicle entry recorded yet.'}</p>
      </section>

      <form className="security-form" onSubmit={handleFormSubmit}>
        <label htmlFor="vehicleNumber">Enter Vehicle Number:</label>
        <input
          type="text"
          id="vehicleNumber"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          placeholder="E.g. TN 01 AB 1234"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SecurityHome;
