import React, { useState, useEffect } from 'react';
import { getAllBookings, getHotelById } from '../utils/ApiFunctions'; // Import the API function
import { Button, Modal, Table, Spinner, Alert } from 'react-bootstrap'; // Using Bootstrap for styling
import { FaEye, FaClipboardList } from 'react-icons/fa';

const AllBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [hotelName, setHotelName] = useState(''); // State to store hotel name
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const result = await getAllBookings();
            setBookings(result);
            setIsLoading(false);
        } catch (error) {
            setErrorMessage('Failed to fetch bookings');
            setIsLoading(false);
        }
    };

    const calculateDays = (checkInDate, checkOutDate) => {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDifference = checkOut - checkIn;
        const dayDifference = timeDifference / (1000 * 3600 * 24);
        return dayDifference;
    };

    // Format date from array (e.g. [2024, 12, 1] to "01/12/2024")
    const formatDate = (dateArray) => {
        const [year, month, day] = dateArray;
        return `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
    };

    const handleViewBooking = async (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);

        // Fetch hotel details by hotelId from the booking information
        try {
            const hotelData = await getHotelById(booking.hotelId); // Call API to get hotel by ID
            setHotelName(hotelData.hotelName); // Set hotel name from response
        } catch (error) {
            setHotelName('N/A'); // In case of error, set default value
            console.error('Error fetching hotel details:', error);
        }
    };

    const closeModal = () => setShowModal(false);

    return (
        <div className="container mt-5">
            {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center">
                    <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <div className="card shadow p-4 ">
                    <h3 className="text-center text-light fw-bold mb-4  bg-success" style={{ width: '100%', height: '70px', alignContent: 'center' }}>
                        <FaClipboardList className="me-2 " />All Bookings
                    </h3>
                    <Table striped bordered hover responsive className="shadow-sm">
                        <thead className="table-dark text-center">
                            <tr>
                                <th>Booking ID</th>
                                <th>Customer Name</th>
                                <th>Check-in Date</th>
                                <th>Check-out Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {bookings.map((booking) => (
                                <tr key={booking.id} >
                                    <td>{booking.id}</td>
                                    <td>{booking.guestName}</td>
                                    <td>{formatDate(booking.checkInDate)}</td>
                                    <td>{formatDate(booking.checkOutDate)}</td>
                                    <td className="text-center">
                                        <Button
                                            variant="info"
                                            onClick={() => handleViewBooking(booking)}
                                        >
                                            <FaEye />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* Modal for Viewing Booking Details */}
            {selectedBooking && (
                <Modal show={showModal} onHide={closeModal} size="lg">
                    {/* <Modal.Header closeButton>
                        <Modal.Title>Booking Details</Modal.Title>
                    </Modal.Header> */}
                    <Modal.Body>
                        {/* Table for booking details */}
                        <table className="table table-bordered" style={{ width: '100%', height: 'auto' }}>
                            <thead style={{ backgroundColor: '#f8f9fa', height: '60px' }}>
                                <tr>
                                    <th className='bg-success' colSpan="2" style={{ fontSize: '1.5rem', textAlign: 'center', padding: '20px' }}>
                                        <strong className='text-light fs-3 '>Booking Details</strong>
                                    </th>
                                </tr>
                            </thead>
                            <tbody style={{ height: '60px' }}>
                                <tr style={{ textAlign: 'left,', height: '50px' }}>
                                    <td style={{ width: '30%', paddingLeft: '20px' }}><strong> Name</strong></td>
                                    <td style={{ width: '70%', paddingLeft: '20px' }}>{selectedBooking.guestName || 'N/A'}</td>
                                </tr>
                                <tr style={{ textAlign: 'left', height: '50px' }}>
                                    <td style={{ width: '30%', paddingLeft: '20px' }}><strong> Email</strong></td>
                                    <td style={{ width: '70%', paddingLeft: '20px' }}>{selectedBooking.guestEmail || 'N/A'}</td>
                                </tr>
                                <tr style={{ textAlign: 'left', height: '50px' }}>
                                    <td style={{ width: '30%', paddingLeft: '20px' }}><strong>Hotel Name</strong></td>
                                    <td style={{ width: '70%', paddingLeft: '20px' }}>{hotelName || 'N/A'}</td>
                                </tr>
                                <tr style={{ textAlign: 'left', height: '50px' }}>
                                    <td style={{ width: '30%', paddingLeft: '20px' }}><strong>Adults</strong></td>
                                    <td style={{ width: '70%', paddingLeft: '20px' }}>{selectedBooking.numOfAdults || 'N/A'}</td>
                                </tr>
                                <tr style={{ textAlign: 'left', height: '50px' }}>
                                    <td style={{ width: '30%', paddingLeft: '20px' }}><strong>Children</strong></td>
                                    <td style={{ width: '70%', paddingLeft: '20px' }}>{selectedBooking.numOfChildren || 'N/A'}</td>
                                </tr>

                                <tr style={{ textAlign: 'left', height: '50px' }}>
                                    <td style={{ width: '30%', paddingLeft: '20px' }}><strong>Check-in Date</strong></td>
                                    <td style={{ width: '70%', paddingLeft: '20px' }}>{selectedBooking.checkInDate ? formatDate(selectedBooking.checkInDate) : 'N/A'}</td>
                                </tr>
                                <tr style={{ textAlign: 'left', height: '50px' }}>
                                    <td style={{ width: '30%', paddingLeft: '20px' }}><strong>Check-out Date</strong></td>
                                    <td style={{ width: '70%', paddingLeft: '20px' }}>{selectedBooking.checkOutDate ? formatDate(selectedBooking.checkOutDate) : 'N/A'}</td>
                                </tr>



                                <tr style={{ textAlign: 'left', height: '50px' }}>
                                    <td style={{ width: '30%', paddingLeft: '20px' }}><strong>Number of Days</strong></td>
                                    <td style={{ width: '70%', paddingLeft: '20px' }}>
                                        {selectedBooking.checkInDate && selectedBooking.checkOutDate
                                            ? calculateDays(selectedBooking.checkInDate, selectedBooking.checkOutDate)
                                            : 'N/A'}
                                    </td>
                                </tr>

                                {/* <tr className="table-info" style={{ textAlign: 'left' }}>
                                    <td><strong>Total Payment:</strong></td>
                                    <td>${selectedBooking.payment || 'N/A'}</td>
                                </tr> */}
                            </tbody>
                        </table>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

        </div>
    );
};

export default AllBookings;
