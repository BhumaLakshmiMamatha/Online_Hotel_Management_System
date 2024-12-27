import React, { useEffect, useState } from "react";
import { getDisabledUsers, enableUser } from "../utils/ApiFunctions";
import { FaCheck, FaHotel } from "react-icons/fa";
import { Spinner, Alert } from 'react-bootstrap'; // Using Bootstrap for styling


const UserAuthorization = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(8);

    useEffect(() => {
        fetchDisabledUsers();
    }, []);

    const fetchDisabledUsers = async () => {
        setIsLoading(true);
        try {
            const result = await getDisabledUsers();
            setUsers(result);
        } catch (error) {
            setErrorMessage("Failed to fetch disabled users.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnableUser = async (email) => {
        try {
            const result = await enableUser(email, true);
            if (result) {
                setSuccessMessage(`User with ID ${email} has been authorized.`);
                fetchDisabledUsers();
            }
        } catch (error) {
            setErrorMessage("Failed to enable the user.");
        }
        setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 3000);
    };

    const calculateTotalPages = (users, usersPerPage) => {
        return Math.ceil(users.length / usersPerPage);
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const handlePaginationClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container col-md-8 col-lg-8 mt-5">
            {successMessage && <p className="alert alert-success">{successMessage}</p>}
            {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
            {/* {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>} */}
            {/* {errorMessage && <Alert variant="success" className="text-center">{errorMessage}</Alert>} */}


            {isLoading ? (
                 <div className="d-flex justify-content-center align-items-center">
                 <Spinner animation="border" role="status" variant="primary">
                     <span className="visually-hidden">Loading...</span>
                 </Spinner>
             </div>
            ) : (
                <div className="card shadow p-4 ">
                    <h3 className="text-center text-light fw-bold mb-4 bg-info" style={{ width: '100%', height: '60px', alignContent: 'center' }}>
                        <FaHotel className="me-2" /> Hotel Request Pending
                    </h3>                    {currentUsers.length > 0 ? (
                        <>
                            <table className="table table-hover table-bordered text-center">
                                <thead className="table-secondary">
                                    <tr>
                                        <th>ID</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.firstName}</td>
                                            <td>{user.lastName}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleEnableUser(user.email)}
                                                >
                                                    <FaCheck className="me-1" />
                                                    Authorize
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="d-flex justify-content-center mt-3">
                                {[...Array(calculateTotalPages(users, usersPerPage)).keys()].map((page) => (
                                    <button
                                        key={page + 1}
                                        className={`btn mx-1 ${currentPage === page + 1
                                            ? "btn-primary"
                                            : "btn-outline-primary"
                                            }`}
                                        onClick={() => handlePaginationClick(page + 1)}
                                    >
                                        {page + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-center">No disabled users found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserAuthorization;
