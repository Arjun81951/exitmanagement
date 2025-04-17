import React,{useState,useEffect }from 'react';
import { useLocation, cccc } from 'react-router-dom';
import axios from 'axios'; // Import Axios

const ScanResult = () => {
    const role = localStorage.getItem('role');
    const Location = useLocation();
    const queryParams = new URLSearchParams(Location.search);
    const time = queryParams.get('time');
    const id = queryParams.get('id');
    const [requestDetails, setRequestDetails] = useState(null); // State to store request details
    useEffect(() => {
        const fetchRequestDetails = async () => {
            console.log("data",id);
            
            try {
                const response = await axios.get(`http://localhost:5000/request/${id}`);
                console.log(response.data.request.status);
                if(response.data.request.status === 'Expired') {
                    setRequestDetails("Exited");
                }else{
                    setRequestDetails("Approved");
                }

                
                setRequestDetails(response.data.request.status); // Update state with request details
            } catch (error) {
                console.error("Error fetching request details:", error);
            }
        };

        if (id) {
            fetchRequestDetails(); // Call the function if id exists
        }
    }, [id]);



    const handleDone = async () => {
        if (role !== 'sec') {
            alert("Not valid");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/security/request', {
                status: "Expired",
                _id: id
                
            });

            if (response.status === 200) {
                console.log("Exit request updated successfully");
                window.location.reload();
            } else {
                console.error("Failed to update exit request");
            }
        } catch (error) {
            console.error("Error updating exit request:", error);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20%' }}>
            <h1 style={{ fontSize: '4rem', color: 'green' }}>{requestDetails}</h1>
            <p style={{ fontSize: '1.5rem', color: 'gray' }}>Time:{time}    </p>
            <button 
                onClick={handleDone} 
                style={{ marginTop: '20px', padding: '10px 20px', fontSize: '1rem', cursor: 'pointer' }}
            >
                Done
            </button>
        </div>
    );
};

export default ScanResult;
