import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './hodHome.css';
import { useNavigate } from 'react-router-dom';

const TeacherHome = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [exitRequests, setExitRequests] = useState([]);
  const dep = localStorage.getItem('department');
  const navigate = useNavigate();

  useEffect(() => {
   
    axios.get(`http://localhost:5000/student/accept/${dep}`)
      .then(response => setAllStudents(response.data.students))
      .catch(() => alert('Error fetching all students!'));

    axios.get(`http://localhost:5000/student/requests/${dep}`)
      .then(response => setExitRequests(response.data.requests))
      .catch(() => alert('Error fetching exit requests!'));
  }, [dep]);

  const handleApproveExit = (id) => {
    axios.post('http://localhost:5000/request/accept', { id, action: 'hod' })
      .then(() => window.location.reload())
      .catch(() => alert('Error approving exit request!'));
  };

  const handleRejectExit = (id) => {
    axios.post('http://localhost:5000/request/accept', { id, action: 'Reject' })
      .then(() => window.location.reload())
      .catch(() => alert('Error rejecting exit request!'));
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };
  const handleClick = () => {
    navigate('/report');
  };

  return (
    <div className="hod-container">
      <header className="hod-header">
        <h1>Teacher Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        <button className="logout-button" onClick={handleClick}>Exit Report</button>

      </header>

      

      <section className="hod-section">
        <h2>All Students</h2>
        <table className="hod-table">
          <thead>
            <tr><th>Admission No</th><th>Name</th><th>Department</th></tr>
          </thead>
          <tbody>
            {allStudents.map(student => (
              <tr key={student.id}>
                <td>{student.admission_no}</td>
                <td>{student.name}</td>
                <td>{student.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="hod-section">
        <h2>Exit Requests</h2>
        <table className="hod-table">
          <thead>
            <tr><th>Name</th><th>Reason</th><th>Time</th><th>Department</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {exitRequests.map(req => (
              <tr key={req._id}>
                <td>{req.name}</td>
                <td>{req.reason}</td>
                <td>{req.time}</td>
                <td>{req.department}</td>
                <td>
                  <button onClick={() => handleApproveExit(req._id)}>Approve</button>
                  <button onClick={() => handleRejectExit(req._id)} className="reject">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default TeacherHome;
