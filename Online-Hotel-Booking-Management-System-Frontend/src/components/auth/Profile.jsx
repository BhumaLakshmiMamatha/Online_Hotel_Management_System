import React, { useEffect, useState } from "react";
import { deleteUser, getBookingsByUserId, getUser } from "../utils/ApiFunctions";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "./Profile.css";
import ManagerPic from "/src/assets/images/DeadPool.jpg";
import AdminPic from "/src/assets/images/MonkeyDLuffy.png";
import UserPic from "/src/assets/images/BlackPandhar.jpg";


const Profile = () => {
  const [user, setUser] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    profilePic: "" // Add profilePic property
  });

  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(userId, token);
        setUser(userData); // Ensure userData contains a profilePic field
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [userId, token]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookingsByUserId(userId, token);
        setBookings(response);
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
        setErrorMessage(error.message);
      }
    };

    fetchBookings();
  }, [userId, token]);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      await deleteUser(userId)
        .then((response) => {
          setMessage(response.data);
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("userRole");
          navigate("/");
          window.location.reload();
        })
        .catch((error) => {
          setErrorMessage(error.data);
        });
    }
  };

  const getProfilePic = () => {
    if (user.profilePic) return user.profilePic;

    switch (user.role) {
      case "ROLE_ADMIN":
        return AdminPic;
      case "ROLE_MANAGER":
        return ManagerPic;
      case "ROLE_USER":
        return UserPic;
      default:
        // return "https://4kwallpapers.com/images/walls/thumbs_3t/14997.png";
    }
  };

  // Helper function to convert array to date string
  const formatDateFromArray = (dateArray) => {
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    return moment(date).isValid() ? moment(date).format("MMM Do, YYYY") : "Invalid Date";
  };

  return (
    <div className="container mt-5">
      {errorMessage && (
        <div className="alert alert-danger text-center">{errorMessage}</div>
      )}
      {message && (
        <div className="alert alert-success text-center">{message}</div>
      )}

      {user ? (
        <div
          className="card p-5 shadow-lg rounded-3"
          style={{ backgroundColor: "#f9f9f9" }}
        >
          <h4 className="card-title text-center text-primary mb-4">User Information</h4>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card mb-3 shadow-sm">
                <div className="row g-0 align-items-center">
                  <div className="col-md-4 d-flex justify-content-center align-items-center">
                    <img
                      src={getProfilePic()}
                      alt="Profile"
                      className="rounded-circle border border-4 border-info"
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <div className="mb-3">
                        <p className="fw-bold">
                          ID: <span className="text-muted">{user.id}</span>
                        </p>
                      </div>
                      <div className="mb-3">
                        <p className="fw-bold">
                          Name: <span className="text-muted">{user.firstName} {user.lastName}</span>
                        </p>
                      </div>
                      <div className="mb-3">
                        <p className="fw-bold">
                          Email: <span className="text-muted">{user.email}</span>
                        </p>
                      </div>
                      <div className="mb-3">
                        <p className="fw-bold">
                          Role: <span className="text-muted">{user.role || "No roles assigned"}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h4 className="card-title text-center text-primary ">Booking History</h4>
          {bookings.length > 0 ? (
            <table className="table table-striped table-bordered table-hover shadow-sm mt-3">
              <thead className="table-info">
                <tr>
                  <th scope="col">Booking ID</th>
                  <th scope="col">Room ID</th>
                  <th scope="col">Room Type</th>
                  <th scope="col">Check In</th>
                  <th scope="col">Check Out</th>
                  <th scope="col">Confirmation Code</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => {
                  const currentDate = new Date();
                  const checkoutDate = new Date(booking.checkOutDate);
                  const status = checkoutDate < currentDate ? "Expired" : "On-going";

                  return (
                    <tr key={index}>
                      <td>{booking.id}</td>
                      <td>{booking.room.id}</td>
                      <td>{booking.room.roomType}</td>
                      <td>{formatDateFromArray(booking.checkInDate)}</td>
                      <td>{formatDateFromArray(booking.checkOutDate)}</td>
                      <td>{booking.bookingConfirmationCode}</td>
                      <td className={status === "Expired" ? "text-danger" : "text-success"}>
                        {status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-muted mt-3">You have not made any bookings yet.</p>
          )}

          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-danger btn-lg shadow-sm"
              onClick={handleDeleteAccount}
              style={{ width: "200px" }}
            >
              <i className="bi bi-trash"></i> Close Account
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center mt-5">Loading user data...</p>
      )}
    </div>
  );
};

export default Profile;
