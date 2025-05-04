import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Requests = () => {
  const [reportType, setReportType] = useState('daily'); // State to toggle between daily and monthly reports
  const [dailyReportData, setDailyReportData] = useState([]); // State for daily report data
  const [lastMonthData, setLastMonthData] = useState([]); // State for last month's data
  const dep = localStorage.getItem('department'); // Get department from local storage

  const handleReportChange = (type) => {
    setReportType(type);
  };

  // Fetch daily report data from API
  useEffect(() => {
    if (reportType === 'daily') {
      axios
        .get(`http://localhost:5000/request/report/day/${dep}`) // Replace 'departmentName' with the actual department
        .then((response) => {
          setDailyReportData(response.data.requests); // Assuming the API returns an array of daily report data
          console.log('Daily Report Data:', response.data);
        })
        .catch((error) => {
          console.error('Error fetching daily report data:', error);
        });
    }
  }, [reportType]);

  // Fetch last month's report data from API
  useEffect(() => {
    if (reportType === 'monthly') {
      axios
        .get(`http://localhost:5000/request/report/month/${dep}`) // Replace 'departmentName' with the actual department
        .then((response) => {
          setLastMonthData(response.data); // Assuming the API returns an array of last month's report data
          console.log(
            'Last Month Report Data:', response.data // Log the data for debugging
          );
          
        })
        .catch((error) => {
          console.error('Error fetching last months report data:', error);
        });
    }
  }, [reportType]);

  return (
    <div>
      <h1>Exited Students Reports</h1>
      <div>
        <button onClick={() => handleReportChange('daily')} disabled={reportType === 'daily'}>
          Daily Report
        </button>
        <button onClick={() => handleReportChange('monthly')} disabled={reportType === 'monthly'}>
          Last Month Report
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        {reportType === 'daily' ? (
          <div>
            <h2>Daily Report</h2>
            <table border="1" style={{ width: '100%', textAlign: 'left', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Time</th>
                  <th>Reason</th>

                </tr>
              </thead>
              <tbody>
                {dailyReportData.length > 0 ? (
                  dailyReportData.map((entry, index) => (
                    <tr key={index}>
                      <td>{new Date(entry.date).toLocaleDateString('en-GB')}</td>
                      <td>{entry.name}</td>
                        <td>{entry.time}</td>
                      <td>{entry.reason}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No data available for today</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <h2>Last Month Report</h2>
            <table border="1" style={{ width: '100%', textAlign: 'left', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student Name</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {lastMonthData.length > 0 ? (
                  lastMonthData.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.date}</td>
                      <td>{entry.studentName}</td>
                      <td>{entry.reason}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No data available for last month</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;