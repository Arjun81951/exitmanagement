import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './hodHome.css';
import { useNavigate } from 'react-router-dom';

const HodHome = () => {
  const [unapprovedStudents, setUnapprovedStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [exitRequests, setExitRequests] = useState([]);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [selectedStudentEmail, setSelectedStudentEmail] = useState('');
  const [fees, setFees] = useState('');
  const dep = localStorage.getItem('department');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/student/unapprovedlist/${dep}`)
      .then(response => setUnapprovedStudents(response.data.students))
      .catch(() => alert('Error fetching unapproved students!'));

    axios.get(`http://localhost:5000/student/accept/${dep}`)
      .then(response => setAllStudents(response.data.students))
      .catch(() => alert('Error fetching all students!'));

    axios.get(`http://localhost:5000/student/requests/${dep}`)
      .then(response => setExitRequests(response.data.requests))
      .catch(() => alert('Error fetching exit requests!'));
  }, [dep]);

  const handleAccept = (email) => {
    axios.post('http://localhost:5000/student/accept', { email, action: 'accept' })
      .then(() => window.location.reload())
      .catch(() => alert('Error accepting student!'));
  };

  const handleReject = (id) => console.log(`Rejected student with ID: ${id}`);

  const handleApproveExit = (id) => {
    axios.post('http://localhost:5000/request/accept', { id, action: 'Approve' })
      .then(() => window.location.reload())
      .catch(() => alert('Error approving exit request!'));
  };

  const handleRejectExit = (id) => {
    axios.post('http://localhost:5000/request/accept', { id, action: 'Reject' })
      .then(() => window.location.reload())
      .catch(() => alert('Error rejecting exit request!'));
  };

  const handleCreateNotice = () => {
    axios.post('http://localhost:5000/hod/notice', {
      title: noticeTitle,
      description: noticeContent,
      department: dep
    })
    .then(() => window.location.reload())
    .catch(() => alert('Error creating notice!'));
  };

  const handleSendMessage = (email) => {
    setSelectedStudentEmail(email);
    setIsModalOpen(true);
  };

  const handleUpdateFee = (email) => {
    setSelectedStudentEmail(email);
    setIsFeeModalOpen(true);
  };

  const handleSend = () => {
    axios.post('http://localhost:5000/message/sent', {
      email: selectedStudentEmail,
      content: messageContent
    })
    .then(() => {
      setIsModalOpen(false);
      setMessageContent('');
    })
    .catch(() => alert('Error sending message!'));
  };

  const handlUpdate = () => {
    axios.post('http://localhost:5000/student/fee', {
      email: selectedStudentEmail,
      fees
    })
    .then(() => {
      setIsFeeModalOpen(false);
      setFees('');
    })
    .catch(() => alert('Error updating fee!'));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessageContent('');
  };

  const handleCloseFeeModal = () => setIsFeeModalOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="hod-container">
      <header className="hod-header">
        <h1>HOD Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <section className="hod-section">
        <h2>Unapproved Students</h2>
        <table className="hod-table">
          <thead>
            <tr><th>Admission No</th><th>Name</th><th>Department</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {unapprovedStudents.map(student => (
              <tr key={student.id}>
                <td>{student.admission_no}</td>
                <td>{student.name}</td>
                <td>{student.department}</td>
                <td>
                  <button onClick={() => handleAccept(student.email)}>Accept</button>
                  <button onClick={() => handleReject(student.email)} className="reject">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="hod-section">
        <h2>All Students</h2>
        <table className="hod-table">
          <thead>
            <tr><th>Admission No</th><th>Name</th><th>Department</th><th>Fees</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {allStudents.map(student => (
              <tr key={student.id}>
                <td>{student.admission_no}</td>
                <td>{student.name}</td>
                <td>{student.department}</td>
                <td><button onClick={() => handleUpdateFee(student.email)}>Update Fees</button></td>
                <td><button onClick={() => handleSendMessage(student.email)}>Message</button></td>
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

      <section className="hod-section">
        <h2>Create Notice</h2>
        <input type="text" placeholder="Title" value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} />
        <textarea placeholder="Content" value={noticeContent} onChange={(e) => setNoticeContent(e.target.value)} />
        <button onClick={handleCreateNotice}>Create Notice</button>
      </section>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Send Message</h3>
            <textarea value={messageContent} onChange={(e) => setMessageContent(e.target.value)} />
            <div className="modal-actions">
              <button onClick={handleSend}>Send</button>
              <button onClick={handleCloseModal} className="reject">Close</button>
            </div>
          </div>
        </div>
      )}

      {isFeeModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Update Fees</h3>
            <textarea value={fees} onChange={(e) => setFees(e.target.value)} />
            <div className="modal-actions">
              <button onClick={handlUpdate}>Update</button>
              <button onClick={handleCloseFeeModal} className="reject">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HodHome;
