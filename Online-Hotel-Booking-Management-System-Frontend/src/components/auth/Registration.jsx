import React, { useState } from "react";
import { registerUser, registerManager } from "../utils/ApiFunctions";
import { Link, useNavigate } from "react-router-dom";
import { Person, Envelope, Lock } from 'react-bootstrap-icons'; // Importing Icons

const Registration = () => {
  const [registration, setRegistration] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isHotelRegistration, setIsHotelRegistration] = useState(false);


  const navigate = useNavigate(); // Initialize useNavigate



  const handleInputChange = (e) => {
    setRegistration({ ...registration, [e.target.name]: e.target.value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      if (isHotelRegistration) {
        const result = await registerManager(registration);
        setSuccessMessage(result);
      } else {
        const result = await registerUser(registration);
        setSuccessMessage(result);
      }
      setErrorMessage("");
      setRegistration({ firstName: "", lastName: "", email: "", password: "" });
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(`Registration error: ${error.message}`);
    }

    // Set timeout to clear messages and navigate to the login page
    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
      navigate("/login"); // Navigate to login page
    }, 3000);
  };

  return (
    <section className="container-fluid" style={{ backgroundImage: 'url(https://images2.alphacoders.com/815/thumb-1920-815029.jpg)', backgroundSize: 'cover', minHeight: '100vh' }}>
      <div className="row justify-content-end align-items-center" style={{ minHeight: '100vh' }}>
        {/* Left Section: Registration Form */}
        <div className="col-lg-3 col-md-4 col-sm-6">
          <div className="card shadow-sm rounded p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '10px', border: 'none', maxHeight: '550px', overflowY: 'auto' }}>

            <h2 className="text-center mb- text-primary fw-bold" style={{ fontSize: '1.5rem' }}>BOOK IT</h2>
            <h2 className="text-center mb- text-secondary" style={{ fontSize: '1rem' }}>Register</h2>

            {/* Success and Error Messages */}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {/* Registration Form */}
            <form onSubmit={handleRegistration}>
              {/* First Name */}
              <div className="mb-">
                <label htmlFor="firstName" className="form-label">
                  <Person /> First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="form-control"
                  value={registration.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Last Name */}
              <div className="mb-">
                <label htmlFor="lastName" className="form-label">
                  <Person /> Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="form-control"
                  value={registration.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-">
                <label htmlFor="email" className="form-label">
                  <Envelope /> Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  value={registration.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-">
                <label htmlFor="password" className="form-label">
                  <Lock /> Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={registration.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Registration Type Selection */}
              <div className="mb-1 mt-2">
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className={`btn ${!isHotelRegistration ? 'btn-success' : 'btn-outline-danger'}`}
                    onClick={() => setIsHotelRegistration(false)}
                  >
                    User
                  </button>
                  <button
                    type="button"
                    className={`btn ${isHotelRegistration ? 'btn-success' : 'btn-outline-danger'}`}
                    onClick={() => setIsHotelRegistration(true)}
                  >
                    Hotel Manager
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mb-3 mt-2">
                <button type="submit" className="btn btn-primary w-100">
                  Register
                </button>
              </div>

              {/* Redirect to Login */}
              <div className="text-center">
                <span className="text-muted">
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-none text-primary fw-bold">
                    Login
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
