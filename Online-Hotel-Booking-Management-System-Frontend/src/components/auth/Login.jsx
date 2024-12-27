import React, { useState } from "react";
import { loginUser } from "../utils/ApiFunctions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Envelope, Lock } from 'react-bootstrap-icons'; // Importing icons
import { Modal, Button } from 'react-bootstrap'; // Importing Bootstrap Modal

// ForgotPassword Component (Importing)
import ForgotPassword from './ForgotPassword';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Added successMessage state
  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();
  const redirectUrl = location.state?.path || "/";

  const handleInputChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser(login);

    if (success) {
      const token = success.token;
      auth.handleLogin(token);

      // Display success message and navigate after 3 seconds
      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => {
        setSuccessMessage(""); // Clear the success message
        navigate(redirectUrl); // Navigate to the next page
      }, 3000);
    } else {
      setErrorMessage("Invalid username or password.");
    }

    // Clear the error message after 4 seconds
    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
  };

  return (
    <section
      className="container-fluid min-vh-100 d-flex justify-content-end align-items-center"
      style={{
        backgroundImage: 'url("https://wallpapercave.com/wp/wp8991752.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="p-4 shadow rounded"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-3">
            <h4 className="fw-bold fs-2 text-primary">BOOK IT</h4>
            <h4 className="fw-bold mt-4 fs-5">Login</h4>
          </div>

          {/* Success and Error Messages */}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          {/* Email Field */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              User ID
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Envelope /> {/* Email Icon */}
              </span>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="Enter Your Email ID"
                value={login.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Lock /> {/* Password Icon */}
              </span>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                placeholder="Enter Your Password"
                value={login.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <div className="mb-3">
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-center mb-3">
            <button
              className="btn btn-link text-primary"
              onClick={() => setShowModal(true)} // Show Modal when clicked
            >
              Forgot Password?
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <span className="text-muted">
              Don't have an account?
              <Link
                to="/register"
                className="text-decoration-none text-primary fw-bold ms-2"
              >
                Register
              </Link>
            </span>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      <Modal 
      show={showModal} 
      onHide={() => setShowModal(false)}
      size="lg"
       centered
       >
        {/* <Modal.Header closeButton>
          <Modal.Title>Reset Your Password</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <ForgotPassword  />  
          {/* onClose={() => setShowModal(false)} */}
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Login;
