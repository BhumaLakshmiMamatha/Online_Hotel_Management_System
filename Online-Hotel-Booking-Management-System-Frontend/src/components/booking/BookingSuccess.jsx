import React from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../common/Header"; // Uncomment if needed

const BookingSuccess = () => {
  const location = useLocation();
  const message = location.state?.message;
  const error = location.state?.error;

  return (
    <div className="container">
      {/* <Header title="Booking Success" /> */}
      <div className="mt-5 d-flex justify-content-center">
        <div className="card shadow-lg" style={{ maxWidth: "400px" }}>
          <div className="card-body">
            {message ? (
              <div>
                <h3 className="text-success">Booking Success!</h3>
                <p className="text-success">{message}</p>
              </div>
            ) : (
              <div>
                <h3 className="text-danger">Error Booking Room!</h3>
                <p className="text-danger">{error}</p>
              </div>
            )}
            <Link to="/" className="btn btn-primary mt-3">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
