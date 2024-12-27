import React, { useState, useEffect } from 'react';
import { getAllRooms } from '../utils/ApiFunctions'; // Import the API functions
import { Button, Table, Form, Spinner, Pagination } from 'react-bootstrap'; // Using Bootstrap for styling
import { FaBed } from 'react-icons/fa'; // Icon for rooms
import { MdSearch } from 'react-icons/md'; // Icon for search/filter

const AllRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]); // State to store filtered rooms
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hotelNameFilter, setHotelNameFilter] = useState(''); // State for hotel name filter
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const roomsPerPage = 10; // Number of rooms per page

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        // Filter rooms based on the hotel name filter
        if (hotelNameFilter) {
            const filtered = rooms.filter(room =>
                room.hotelName.toLowerCase().includes(hotelNameFilter.toLowerCase())
            );
            setFilteredRooms(filtered);
        } else {
            setFilteredRooms(rooms);
        }
    }, [hotelNameFilter, rooms]); // Re-run filter whenever filter or rooms change

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const result = await getAllRooms(); // Fetch rooms from API
            setRooms(result);
            setFilteredRooms(result); // Set all rooms as default filtered rooms
            setIsLoading(false);
        } catch (error) {
            setErrorMessage('Failed to fetch rooms');
            setIsLoading(false);
        }
    };

    // Get current rooms to display on the page
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate total pages
    const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

    return (
        <div className="container my-5">
            {errorMessage && <p className="alert alert-danger text-center">{errorMessage}</p>}
            {isLoading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                    {/* <p className="ml-3">Loading rooms...</p> */}
                </div>
            ) : (
                <div>
                    <h2 className="text-center mb-4 text-success">
                        <FaBed className="mr-2" /> All Rooms
                    </h2>

                    {/* Rooms Count */}
                    <div className="text-center mb-4">
                        <p>
                            <strong>Total Rooms: </strong>{rooms.length} | 
                            <strong> Filtered Rooms: </strong>{filteredRooms.length}
                        </p>
                    </div>

                    {/* Hotel Name Filter */}
                    <Form.Group controlId="hotelNameFilter" className="mb-4">
                        <Form.Label>
                            <MdSearch className="mr-2" /> Filter by Hotel Name
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter hotel name"
                            value={hotelNameFilter}
                            onChange={(e) => setHotelNameFilter(e.target.value)}
                            className="rounded-pill border-success p-3"
                        />
                    </Form.Group>

                    {/* Rooms Table */}
                    <Table striped bordered hover responsive variant="light" className="mb-4">
                        <thead className="text-center bg-success text-white">
                            <tr>
                                <th>Room ID</th>
                                <th>Room Type</th>
                                <th>Price</th>
                                <th>Hotel Name</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {currentRooms.length > 0 ? (
                                currentRooms.map((room) => (
                                    <tr key={room.id}>
                                        <td>{room.id}</td>
                                        <td>{room.roomType}</td>
                                        <td>₹ {room.roomPrice}</td>
                                        <td>{room.hotelName || 'N/A'}</td> {/* Display hotel name */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No rooms found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination>
                            <Pagination.Prev
                                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                            {[...Array(totalPages)].map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => paginate(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllRooms;
