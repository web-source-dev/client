import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const QRForm = () => {
  const [formData, setFormData] = useState({
     name: '',
    email: '',
    work_email: '', // Added work_email
    organization: '', // Added organization
    phone: '',
    address: '',
    youtube_url: '',
    facebook_url: '',
    linkden_url: '',
    twitter_url: '',
    profileImage: null // New state for profile image
  });
  const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission status
  const [userId, setUserId] = useState(null); // Store user ID after submission
  const [message, setMessage] = useState(''); // Message to show below the button
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [namedata, setNamedata] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profileImage: e.target.files[0]
    }));
  };
  // Send form data to backend
  const handleFormSubmit = async (e) => {
    e.preventDefault();

       const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    try {
      // Send form data to backend
      const response = await axios.post(`https://server-jphi.vercel.app/api/qrdata`, data,{
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 201) {
        const { userId } = response.data; // Extract userId from the response
        setUserId(userId); // Set the userId state
        setIsSubmitted(true); // Mark the form as submitted
        setMessage('Form submitted successfully!'); // Success message
        setMessageType('success'); // Message type is success
        setNamedata(response.data.qrdata);
        setFormData({
          name: '',
          email: '',
          work_email: '',
          organization: '',
          phone: '',
          address: '',
          youtube_url: '',
          facebook_url: '',
          linkden_url: '',
          twitter_url: '',
          profileImage: null
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Email already exsists'); // Error message
      setMessageType('error'); // Message type is error
    }
  };

  const downloadQRCode = () => {
    const canvas = document.createElement('canvas');
    const qrCanvas = document.getElementById('qr-code-canvas');
    const qrCodeSize = 300;
    const padding = 50;

    canvas.width = qrCodeSize + padding * 2;
    canvas.height = qrCodeSize + 150;

    const context = canvas.getContext('2d');
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#000000';
    context.font = '20px Arial';
    context.textAlign = 'center';
    context.fillText(namedata.name, canvas.width / 2, 30);

    context.drawImage(qrCanvas, padding, 50, qrCodeSize, qrCodeSize);

    context.fillText(`ID: ${userId}`, canvas.width / 2, qrCodeSize + 80);

    const pngUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = 'user-qr-code.png';
    a.click();
  };

  return (
    <div className="qr-form-container">
      <h1>Form Submission</h1>

      {/* Show form only if not submitted */}
      {!isSubmitted ? (
                <form className="qr-form" onSubmit={handleFormSubmit} encType="multipart/form-data">
            <div className="form-inputs-flex">
              <div className="left-side-form">
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
                />
                <input
                  type="email"
                  name="work_email"
                  placeholder="Work Email"
                  value={formData.work_email}
                  onChange={handleInputChange}
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
                {/* Profile image upload input */}
              </div>
              <div className="right-side-form">

                <input
                  type="text"
                  name="organization"
                  placeholder="Organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="url"
                  name="youtube_url"
                  placeholder="YouTube URL"
                  value={formData.youtube_url}
                  onChange={handleInputChange}
                />
                <input
                  type="url"
                  name="facebook_url"
                  placeholder="Facebook URL"
                  value={formData.facebook_url}
                  onChange={handleInputChange}
                />
                <input
                  type="url"
                  name="linkden_url"
                  placeholder="LinkedIn URL"
                  value={formData.linkden_url}
                  onChange={handleInputChange}
                />
                <input
                  type="url"
                  name="twitter_url"
                  placeholder="Twitter URL"
                  value={formData.twitter_url}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <input
            className='profile-img-form'
                  type="file"
                  name="profileImage"
                  onChange={handleImageChange}
                  accept="image/*"
                  required
                />
            <button className="submit-btn" type="submit">Submit</button>
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
              <h2>{namedata.name}</h2>
            <QRCodeCanvas
              id="qr-code-canvas"
              value={`https://client-delta-taupe.vercel.app/user/${userId}`} // The URL with the correct userId
              size={300}  // Increase the size (larger value = higher resolution)
              fgColor="#000000" // Optional: set foreground color for better contrast
              bgColor="#ffffff" // Optional: set background color
            />
              <p>ID: {userId}</p>
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
