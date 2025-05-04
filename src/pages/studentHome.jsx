import React, { useState, useEffect } from "react";
import "./studentHome.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentHome = () => {
  const [notices, setNotices] = useState([]);
  const [exitReason, setExitReason] = useState("");
  const [exitTime, setExitTime] = useState("");
  const [hodMessage, setHodMessage] = useState("");
  const [request, setRequest] = useState(null);
  const [fees, setFees] = useState(null);
  const navigate = useNavigate();
  const dep = localStorage.getItem("department");

  useEffect(() => {
    const email = localStorage.getItem("email");

    axios
      .get(`http://localhost:5000/hod/notice/${dep}`) // Updated to use department
      .then((response) => setNotices(response.data.notices))
      .catch((error) => console.error("Error fetching notices:", error));

    axios
      .get(`http://localhost:5000/student/request/${email}`)
      .then((response) => setRequest(response.data.recentRequest))
      .catch((error) => console.error("Error fetching request:", error));

    axios
      .get(`http://localhost:5000/message/${email}`)
      .then((response) => setHodMessage(response.data.messages[0]?.content || "No new messages"))
      .catch((error) => console.error("Error fetching HOD message:", error));

    axios
      .get(`http://localhost:5000/student/view/${email}`)
      .then((response) => setFees(response.data.fees || 0))
      .catch((error) => console.error("Error fetching fees:", error));
  }, []);

  const handleExitSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");
    try {
      await axios.post("http://localhost:5000/student/request", {
        email,
        reason: exitReason,
        time: exitTime,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  const handleViewRequest = () => {
    localStorage.setItem("request", request.status);
    localStorage.setItem("time", request.time);
    localStorage.setItem("id", request._id);
    navigate("/qr", { state: request.email });
  };

  const handlePayFees = () => {
    const email = localStorage.getItem("email");
    axios.post('http://localhost:5000/student/fee', {
      email: email,
      feeStat: "paid",
      fees
    })
    .then(() => {
    })
    .catch(() => alert('Error updating fee!'));
    navigate("/payfees");

  };
  

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="student-home">
      <header className="header">
        <h1>🎓 Student Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <div className="content-grid">
        <section className="card message">
          <h2>📢 Message from HOD</h2>
          <p>{hodMessage}</p>
        </section>

        <section className="card notices">
          <h2>📜 Notices</h2>
          <ul>
            {notices.length > 0 ? (
              notices.map((notice, index) => <li key={index}>{notice.description}</li>)
            ) : (
              <p>No new notices</p>
            )}
          </ul>
        </section>

        <section className="card request">
          <h2>📩 My Request</h2>
          <p>Status: <strong>{request ? request.status : "No requests"}</strong></p>
          {request?.status === "Approved" && (
            <button onClick={handleViewRequest} className="action-button">View Request</button>
          )}
        </section>

        {fees > 0 && (
          <section className="card fees">
            <h2>💳 Pay Fees</h2>
            <p>Amount Due: ₹{fees}</p>
            <button onClick={handlePayFees} className="action-button">Pay Now</button>
          </section>
        )}

        <section className="card exit-form">
          <h2>🏫 Exit College</h2>
          <form onSubmit={handleExitSubmit}>
            <div className="form-group">
              <label>Reason for Exit</label>
              <input
                type="text"
                value={exitReason}
                onChange={(e) => setExitReason(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Exit Time</label>
              <input
                type="time"
                value={exitTime}
                onChange={(e) => setExitTime(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="action-button">Submit</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default StudentHome;
