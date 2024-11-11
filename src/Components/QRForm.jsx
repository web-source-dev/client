import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

const QRForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission status
  const [userId, setUserId] = useState(null); // Store user ID after submission
  const [message, setMessage] = useState(''); // Message to show below the button
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Send form data to backend
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send form data to backend
      const response = await axios.post(`https://server-jphi.vercel.app/api/qrdata`, formData);

      if (response.status === 201) {
        const { userId } = response.data; // Extract userId from the response
        setUserId(userId); // Set the userId state
        setIsSubmitted(true); // Mark the form as submitted
        setMessage('Form submitted successfully!'); // Success message
        setMessageType('success'); // Message type is success
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: ''
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Email already exsists'); // Error message
      setMessageType('error'); // Message type is error
    }
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code-canvas');
    const scaleFactor = 4; // Increase scale factor for better resolution

    // Get the image data URL at a higher resolution
    const pngUrl = canvas.toDataURL('image/png', scaleFactor);

    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = 'user-qr-code.png'; // Set default file name for download
    a.click();
  };

  return (
    <div className="qr-form-container">
      <h1>Form Submission</h1>

      {/* Show form only if not submitted */}
      {!isSubmitted ? (
        <form className="qr-form" onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Submit</button>

          {/* Display messages if any */}
          {message && (
            <p className={messageType === 'success' ? 'success-message' : 'error-message'}>
              {message}
            </p>
          )}
        </form>
      ) : (
        // After submission, show success message and QR code
        <div className="form-submitted">
          <div className="qr-code-container">
            {/* Show the QR code */}
            <QRCodeCanvas
              id="qr-code-canvas"
              value={`https://client-delta-taupe.vercel.app/user/${userId}`} // The URL with the correct userId
              size={300}  // Increase the size (larger value = higher resolution)
              fgColor="#000000" // Optional: set foreground color for better contrast
              bgColor="#ffffff" // Optional: set background color
            />
          </div>
          <button onClick={downloadQRCode}>Download QR Code</button>
          <button className='back-red' onClick={() => setIsSubmitted(false)}>Back</button>

          {/* Display messages if any */}
          {message && (
            <p className={messageType === 'success' ? 'success-message' : 'error-message'}>
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QRForm;
