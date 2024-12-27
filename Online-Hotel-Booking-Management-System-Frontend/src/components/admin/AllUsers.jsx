import React, { useEffect, useState } from "react";
import { deleteUser, getAllUsers, updateUser, disableAuthorization } from "../utils/ApiFunctions";
import { Col, Row, Modal, Button, Form } from "react-bootstrap";
import { FaPencilAlt } from "react-icons/fa"; // Edit icon
import { FaTrashAlt } from "react-icons/fa"; // Delete icon
import { FaUserTimes } from "react-icons/fa"; // Disable icon
import { Link, useNavigate } from "react-router-dom";
import DisabledUsers from "./DisabledUsers"; // Import DisabledUsers component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserSlash, faUserCheck, faHotel, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';



const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [disabledModal, setDisabledModal] = useState(false); // New state for disabled users modal
    const [roleFilter, setRoleFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (roleFilter) {
            const filtered = users.filter(user => user.role === roleFilter);
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [roleFilter, users]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = users.filter(user => user.email.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users); // Reset to full list if search query is empty
        }
    }, [searchQuery, users]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const result = await getAllUsers();
            setUsers(result);
            setFilteredUsers(result);
            setIsLoading(false);
        } catch (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
        }
    };

    const handlePaginationClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (userId) => {
        try {
            const result = await deleteUser(userId);
            if (result === "User deleted successfully") {
                setSuccessMessage(`User with ID ${userId} was deleted successfully.`);
                fetchUsers();
            } else {
                console.error(`Error deleting user: ${result.message}`);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
        setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 3000);
    };

    const handleDisabeUser = async (email) => {
        try {
            const result = await disableAuthorization(email);
            if (result) {
                setSuccessMessage(`User with Email ${email} has been disabled.`);
                fetchUsers();
            }
        } catch (error) {
            setErrorMessage("Failed to disable the user.");
        }

        setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 3000);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 5000);

        return () => clearTimeout(timer);
    }, [successMessage, errorMessage]);

    const calculateTotalPages = (users, usersPerPage) => {
        return Math.ceil(users.length / usersPerPage);
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const emptyRows = currentUsers.length < usersPerPage ? usersPerPage - currentUsers.length : 0;

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser({ ...selectedUser, [name]: value });
    };

    const handleSaveChanges = async () => {
        try {
            const result = await updateUser(selectedUser.email, selectedUser);
            if (result) {
                setShowModal(false);
                setSuccessMessage(`User with ID ${selectedUser.id} updated successfully.`);
                fetchUsers();
            }
        } catch (error) {
            setErrorMessage("Failed to update user.");
        }
    };

    return (
        <>
            <div className="container col-md-8 col-lg-6 text-center">
                {successMessage && <p className="alert alert-success mt-5">{successMessage}</p>}
                {errorMessage && <p className="alert alert-danger mt-5">{errorMessage}</p>}
            </div>

            {isLoading ? (
                <p>Loading users...</p>
            ) : (
                <>
                    <section className="mt-5 mb-5 container">
                        <div className="container mt-5">
                            <div className="d-flex justify-content-between mb-3 align-items-center">
                                <h2 className="text-center font-weight-bold users-heading" style={{ fontSize: '2rem', color: '#343a40', textTransform: 'uppercase', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
                                    Existing Users
                                </h2>
                                <div className="d-flex justify-content-center align-items-center">
                                    {/* Card for Total Users */}
                                    <div className="card mr-3 shadow-sm" style={{ width: '14rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
                                        <div className="card-body d-flex align-items-center">
                                            <FontAwesomeIcon icon={faUsers} className="text-info mr-2" />
                                            <div>
                                                <h5 className="card-title mb-1" style={{ fontSize: '1.1rem', fontWeight: '600' }}>Total Users</h5>
                                                <p className="card-text mb-0 text-center" style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                                                    <strong>{users.length}</strong>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Card for Request Pending Users */}
                                    <div className="card shadow-sm ms-4" style={{ width: '14rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
                                        <div className="card-body d-flex align-items-center">
                                            <FontAwesomeIcon icon={faUserCheck} className="text-success  mr-2" />
                                            <div>
                                                <h5 className="card-title mb-1" style={{ fontSize: '1.1rem', fontWeight: '600' }}>Active </h5>
                                                <p className="card-text text-center mb-0" style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                                                    <strong>{users.filter(user => user.authorize && user.enabled).length}</strong>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card for Disabled Users */}
                                    <div className="card shadow-sm ms-4" style={{ width: '14rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
                                        <div className="card-body d-flex align-items-center">
                                            <FontAwesomeIcon icon={faUserSlash} className="text-danger mr-2" />
                                            <div>
                                                <h5 className="card-title mb-1" style={{ fontSize: '1.1rem', fontWeight: '600' }}>Disabled Users</h5>
                                                <p className="card-text text-center mb-0" style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                                                    <strong>{users.filter(user => !user.authorize && user.enabled).length}</strong>
                                                </p>
                                            </div>
                                        </div>
                                    </div>




                                    {/* Card for Request Pending Users */}
                                    <div className="card shadow-sm ms-4" style={{ width: '14rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
                                        <div className="card-body d-flex align-items-center">
                                            <FontAwesomeIcon icon={faHotel} className="text-primary  mr-2" />
                                            <div>
                                                <h5 className="card-title mb-1" style={{ fontSize: '1.1rem', fontWeight: '600' }}>Hotel Request</h5>
                                                <p className="card-text text-center mb-0" style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                                                    <strong>{users.filter(user => !user.authorize && !user.enabled).length}</strong>
                                                </p>
                                            </div>
                                        </div>
                                    </div>



                                </div>
                            </div>
                        </div>

                        <div className="d-flex mb-4">
                            <Row className="w-100">
                                <Col xs={12} md={6} lg={3}>
                                    <Form.Control
                                        as="select"
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        style={{ width: "100%", height: "45px" }}
                                    >
                                        <option value="">All Roles</option>
                                        <option value="ROLE_USER">ROLE_USER</option>
                                        <option value="ROLE_MANAGER">ROLE_MANAGER</option>
                                        <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                                    </Form.Control>
                                </Col>

                                <Col xs={12} md={6} lg={5}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by Email ID"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ width: "100%",height:'45px' }}
                                    />
                                </Col>

                                <Col xs={12} md={6} lg={4}>
                                    <Button
                                        variant="info text-light"
                                        className="w-100 d-flex align-items-center justify-content-center"
                                        onClick={() => setDisabledModal(true)} // Open modal on click
                                        style={{ width: "100%",height:'45px' }}
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-2 fw-bold" /> {/* Left arrow icon */}
                                       <span  className=" fw-bold"> Active - Disabled Users </span>
                                        <FontAwesomeIcon icon={faArrowRight} className="ms-2 fw-bold" /> {/* Right arrow icon */}
                                    </Button>
                                </Col>

                            </Row>
                        </div>

                        <table className="table table-bordered  table-hover shadow-lg rounded-lg mb-4">
                            <thead className="thead-dark bg-primary text-white text-center">
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user.id} className="text-center">
                                        <td>{user.id}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <span
                                                className="btn btn-warning btn-sm mx-2"
                                                onClick={() => handleEditClick(user)}
                                            >
                                                <FaPencilAlt />
                                            </span>
                                            <button
                                                className="btn btn-danger btn-sm mx-2"
                                                onClick={() => handleDelete(user.email)}
                                            >
                                                <FaTrashAlt />
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm mx-2"
                                                onClick={() => handleDisabeUser(user.email)}
                                            >
                                                <FaUserTimes />
                                            </button>
                                        </td>
                                        <td>
                                            {user.authorize && user.enabled ? (
                                                <span className="badge bg-success">Enabled</span>
                                            ) : !user.authorize && !user.enabled ? (
                                                <span className="badge bg-warning">Request Pending</span>
                                            ) : (
                                                <span className="badge bg-danger">Disabled</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, index) => (
                                    <tr key={index} className="text-center">
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                        <div className="pagination d-flex justify-content-center mt-4">
                            {Array.from({ length: calculateTotalPages(filteredUsers, usersPerPage) }).map((_, index) => (
                                <button
                                    key={index}
                                    className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1 px-3 py-2`}
                                    onClick={() => handlePaginationClick(index + 1)}
                                    style={{
                                        transition: 'background-color 0.3s, transform 0.2s',
                                    }}
                                    onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                                    onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                    </section>

                    {/* Modal for Disabled Users */}
                    <Modal
                        show={disabledModal}
                        onHide={() => setDisabledModal(false)}
                        size="lg" // Increased modal size
                        centered
                    >
                        {/* <Modal.Header closeButton>
                            <Modal.Title>Disabled Users</Modal.Title>
                        </Modal.Header> */}
                        <Modal.Body>
                            <DisabledUsers /> {/* Render Disabled Users Component */}
                        </Modal.Body>
                        {/* <Modal.Footer>
                            <Button variant="secondary" onClick={() => setDisabledModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer> */}
                    </Modal>

                    {/* Edit User Modal */}
                    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedUser && (
                                <Form>
                                    <Form.Group>
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            value={selectedUser.firstName}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="lastName"
                                            value={selectedUser.lastName}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={selectedUser.email}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Role</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="role"
                                            value={selectedUser.role}
                                            onChange={handleInputChange}
                                        >
                                            <option value="ROLE_USER">ROLE_USER</option>
                                            <option value="ROLE_MANAGER">ROLE_MANAGER</option>
                                            <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Form>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSaveChanges}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </>
    );
};

export default AllUsers;
