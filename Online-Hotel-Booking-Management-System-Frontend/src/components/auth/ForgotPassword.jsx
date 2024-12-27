import React, { useState,useEffect  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaEnvelope, FaLock, FaKey } from 'react-icons/fa'; // Import Font Awesome icons

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false); // State to track OTP request
  const navigate = useNavigate(); // Initialize useNavigate

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate the email format
    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    if (!isValidEmail) {
      setMessage('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      // Sending email in JSON format to request OTP
      const response = await axios.post('http://localhost:9192/auth/request-otp', { email });
      console.log('Response from OTP request:', response); // Log the response

      // Set message from the backend response
      setSuccess(response.data); // Directly display the response message (data)
      setIsOtpSent(true); // OTP is successfully sent
    } catch (error) {
      console.error('Error sending OTP:', error); // Log error
      setMessage(error.response?.data || 'Error sending OTP. Please try again.'); // Handle specific error message
    } finally {
      setLoading(false);
    }
  };


   // Clear error message after a timeout
   useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000); // Clear after 5 seconds
      return () => clearTimeout(timer); // Cleanup on component unmount or when errorMessage changes
    }
  }, [message]);
   // Clear error message after a timeout
   useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000); // Clear after 5 seconds
      return () => clearTimeout(timer); // Cleanup on component unmount or when errorMessage changes
    }
  }, [success]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
  
    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:9192/auth/reset-password', {
        email,
        otp,
        newPassword
      });
  
      if (response.status === 200) {
        // Show success alert
        setSuccess('Password reset successfully.');
  
        // Delay the navigation to login page
        setTimeout(() => {
          navigate('/login'); // Redirect to login after the timeout
        }, 2000); // Delay in milliseconds (2 seconds)
  
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('An error occurred while resetting your password. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container d-flex justify-content-center align-items-center bg-danger p-4" style={{
      backgroundImage: 'url("https://images2.alphacoders.com/815/thumb-1920-815029.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      
    }}>
      <div className="card shadow-lg" style={{ width: '400px' }}>
        <div className="card-body">
          <h4 className="card-title text-center mb-2 fs-3 mt-4 text-primary">BOOK IT</h4>
          <p className="card-title text-center  mb-4" style={{fontSize:'15px'}}>Forgot Password</p>
          {!isOtpSent ? (
            // Email form
            <form onSubmit={handleRequestOTP}>
              <div className="form-group mb-4">
                <label htmlFor="email" className='form-label'>Email</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text fs-4"><FaEnvelope /></span>
                  </div>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success btn-block" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            // OTP and password reset form
            <form onSubmit={handlePasswordReset}>
              <div className="form-group mb-4">
                <label htmlFor="otp" className='form-label'>OTP</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text fs-4"><FaKey /></span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group mb-4">
                <label htmlFor="newPassword" className='form-label'>New Password</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text fs-4"><FaLock /></span>
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group mb-4">
                <label htmlFor="confirmPassword" className='form-label'>Confirm Password</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text fs-4"><FaLock /></span>
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-success btn-block" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {message && <div className="alert alert-danger mt-3">{message}</div>} {/* Display backend message */}
          {success && <div className="alert alert-success">{success}</div>} {/* Display backend message */}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
