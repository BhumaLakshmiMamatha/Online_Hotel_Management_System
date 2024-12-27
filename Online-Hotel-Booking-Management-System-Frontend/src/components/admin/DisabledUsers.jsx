import React, { useState, useEffect } from 'react';
import { api, getHeader } from '../utils/ApiFunctions'; // Import the axios instance and header function
import { Table, Button, Form, Spinner } from 'react-bootstrap'; // Import Bootstrap components

const DisabledUsers = () => {
  const [disabledUsers, setDisabledUsers] = useState([]); // State to store the list of disabled users
  const [filteredUsers, setFilteredUsers] = useState([]); // State to store filtered users (based on search query)
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const [successMessage, setSuccessMessage] = useState(''); // Success message state
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [usersPerPage, setUsersPerPage] = useState(5); // Number of users per page
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination

  // Fetch disabled users from the API
  useEffect(() => {
    const fetchDisabledUsers = async () => {
      try {
        const response = await api.get('/users/authorize-disabled', {
          headers: getHeader()
        });
        setDisabledUsers(response.data); // Set the list of disabled users
        setFilteredUsers(response.data); // Initially, display all users
        setTotalPages(Math.ceil(response.data.length / usersPerPage)); // Calculate total pages
      } catch (err) {
        setErrorMessage('Failed to fetch disabled users');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisabledUsers();
  }, [usersPerPage]);

  // Handle the search input and filter the users by email
  useEffect(() => {
    if (searchQuery) {
      setFilteredUsers(
        disabledUsers.filter(user =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(disabledUsers); // Reset to all users if search is empty
    }
  }, [searchQuery, disabledUsers]);

  // Handle enabling a user
  const handleEnableUser = async (userEmail) => {
    try {
      // API call to enable user (replace with actual API)
      await api.put(`/users/enable-authorization/${userEmail}`, {}, { headers: getHeader() });
      setSuccessMessage(`User with email ${userEmail} has been enabled successfully.`);
      setTimeout(() => setSuccessMessage(''), 3000); // Hide success message after 3 seconds
      setFilteredUsers(filteredUsers.filter(user => user.email !== userEmail)); // Remove enabled user from the list
    } catch (err) {
      setErrorMessage('Failed to enable the user');
      console.error(err);
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Handle page click for pagination
  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading disabled users...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-4 bg-secondary fw-bold p-3 fs-3 text-light rounded-3">Disabled Users</h2>
      
      {successMessage && <p className="alert alert-success">{successMessage}</p>}
      {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}

      {/* Search Box */}
      <div className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search by email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-50 mx-auto text-center rounded-3"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p>No disabled users found.</p>
      ) : (
        <>
          {/* Table of disabled users */}
          <Table striped bordered hover className="text-center">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <Button
                        variant="success"
                        className="badge bg-success text-center"
                        size="sm"
                        onClick={() => handleEnableUser(user.email)}
                      >
                        Enable
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No users found with the given email.</td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination Buttons */}
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li className={`page-item ${currentPage === index + 1 ? "active" : ""}`} key={index + 1}>
                    <button
                      className="page-link shadow-sm border-primary rounded-3"
                      onClick={() => handlePaginationClick(index + 1)}
                      style={{ transition: 'all 0.3s ease' }}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default DisabledUsers;
