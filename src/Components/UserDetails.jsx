import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserDetails = () => {
  const { userId } = useParams(); // Get the userId from the URL
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://server-jphi.vercel.app/api/users/${userId}`);
        setUser(response.data); // Set the user data
        setErrorMessage(''); // Clear error message if the user is found
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // Handle blocked user case
          setErrorMessage('User is blocked');
        } else {
          // Handle other errors (e.g., user not found)
          setErrorMessage('Error fetching user data');
        }
        setUser(null); // Clear user data in case of error
      }
    };

    fetchUser();
  }, [userId]);

  if (errorMessage) {
    return <p className="error-message">{errorMessage}</p>; // Display the error message if any
  }

  if (!user) {
    return <p className="loading-message">Loading...</p>; // Show loading state while user data is being fetched
  }

  return (
    <div className="user-details-containered">
      <h1 className="user-details-headingd">User Details</h1>
      
      {/* Back Button */}

      <div className="user-details-cardsd">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr;
      </button>
        <div className="user-detail-itemd">
          <strong>Name:</strong> {user.name}
        </div>
        <div className="user-detail-itemd">
          <strong>Email:</strong> {user.email}
        </div>
        <div className="user-detail-itemd">
          <strong>Phone:</strong> {user.phone}
        </div>
        <div className="user-detail-itemd-add">
          <strong>Address:</strong> <p>{user.address}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
