import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonWalkingArrowRight, faUserCircle } from "@fortawesome/free-solid-svg-icons"; // Added user circle icon as fallback
import ManagerPic from "/src/assets/images/DeadPool.jpg";
import AdminPic from "/src/assets/images/MonkeyDLuffy.png";
import UserPic from "/src/assets/images/BlackPandhar.jpg";





const NavBar = () => {
  const [profileImageUrl, setProfileImageUrl] = useState(null); // State to store the profile image URL
  const isLoggedIn = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();

  // Define the getProfilePic function to handle role-based profile images
  const getProfilePic = () => {
    // if (user.profilePic) return user.profilePic;

    switch (userRole) {
      case "ROLE_ADMIN":
        return AdminPic;
      case "ROLE_MANAGER":
        return ManagerPic;
      case "ROLE_USER":
        return UserPic;
      default:
        // return "https://4kwallpapers.com/images/walls/thumbs_3t/14997.png"; // Default profile pic
    }
  };

  // Fetch the profile image from the backend if needed (optional)
  useEffect(() => {
    if (isLoggedIn) {
      const fetchProfileImage = async () => {
        try {
          const response = await fetch("http://your-backend-api.com/profile-image", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = await response.json();
          setProfileImageUrl(data.profileImageUrl); // Assuming the backend returns the image URL
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      };
      fetchProfileImage();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    // Clear token and role from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("hotelId");
    navigate("/");
    window.location.reload(); // Reload the page after logout to reflect changes
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white px-5 shadow sticky-top" style={{ position: 'sticky', top: 0, zIndex: 999 }}>
      <div className="container-fluid">
        {/* Brand Logo with Icon */}
        <Link to="/" className="navbar-brand d-flex align-items-center text-primary fw-bold">
          <img src="" alt="BOOK IT" />
        </Link>

        {/* Toggler Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
            {isLoggedIn && userRole === "ROLE_MANAGER" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link text-secondary hover-effect" to="/existing-rooms">
                    Existing Rooms
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-secondary hover-effect" to="/existing-bookings">
                    Manage Bookings
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-secondary hover-effect" to="/hotel-profile">
                    Hotel Details
                  </NavLink>
                </li>
              </>
            )}

            {isLoggedIn && userRole === "ROLE_ADMIN" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link text-secondary hover-effect" to="/user-authorization">
                    Hotel Request
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-secondary hover-effect" to="/all-bookings">
                    All Bookings
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-secondary hover-effect" to="/all-rooms">
                    All Rooms
                  </NavLink>
                </li>
              </>
            )}

            {/* Hide Hotels and Track Booking for Manager and Admin */}
            {(!isLoggedIn || userRole !== "ROLE_MANAGER") && (
              <li className="nav-item">
                <NavLink className="nav-link text-secondary hover-effect" to="/browse-all-rooms">
                  Hotels
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Links */}
          <ul className="navbar-nav d-flex align-items-center">
            {(isLoggedIn && userRole === "ROLE_USER") && (
              <li className="nav-item">
                <NavLink className="nav-link text-secondary hover-effect" to="/find-booking">
                  Track Booking
                </NavLink>
              </li>
            )}

            {/* Search Bar */}
            <li className="nav-item mx-3">
              <form className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search rooms..."
                  aria-label="Search"
                />
                <button className="btn btn-outline-primary" type="submit">
                  Search
                </button>
              </form>
            </li>

            {/* Login Link */}
            {!isLoggedIn && (
              <li className="nav-item text-secondary hover-effect">
                <Link
                  className="nav-link"
                  to="/login"
                  style={{
                    color: "white",
                    backgroundColor: "#007bff",
                    padding: "8px 16px",
                    borderRadius: "30px",
                    fontWeight: "bold",
                    textDecoration: "none",
                    transition: "transform 0.3s ease",
                  }}
                >
                  Login / Register
                </Link>
              </li>
            )}

            {/* Profile Image or Icon */}
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link text-secondary hover-effect" to="/profile">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "3px solid #007bff",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <img
                        src={getProfilePic()} // Use the role-based profile picture here
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                </Link>
              </li>
            )}

            {/* Logout Icon */}
            {isLoggedIn && (
              <li className="nav-item">
                <FontAwesomeIcon
                  icon={faPersonWalkingArrowRight}
                  size="2x"
                  className="text-danger fs-3"
                  style={{
                    cursor: "pointer",
                    marginLeft: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  title="Logout"
                  onClick={handleLogout}
                />
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
