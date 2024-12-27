import React, { useEffect, useState } from "react";
import moment from "moment";
import { Form, FormControl, Button, Modal, Alert } from "react-bootstrap";
import BookingSummary from "./BookingSummary";
import { bookRoom, getRoomById } from "../utils/ApiFunctions";
import { useParams, useNavigate } from "react-router-dom";
import "./BookingForm.css"; // Import custom styles

const BookingForm = () => {
  const [validated, setValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [roomPrice, setRoomPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(""); // State for success/error message
  const currentUser = localStorage.getItem("userId");
  const navigate = useNavigate(); // Hook for navigation

  const [booking, setBooking] = useState({
    guestFullName: "",
    guestEmail: currentUser,
    checkInDate: "",
    checkOutDate: "",
    numOfAdults: "",
    numOfChildren: "",
  });

  const { roomId } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
    setErrorMessage("");
  };

  const getRoomPriceById = async (roomId) => {
    try {
      const response = await getRoomById(roomId);
      setRoomPrice(response.roomPrice);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getRoomPriceById(roomId);
  }, [roomId]);

  const calculatePayment = () => {
    const checkInDate = moment(booking.checkInDate);
    const checkOutDate = moment(booking.checkOutDate);
    const diffInDays = checkOutDate.diff(checkInDate, "days");
    return diffInDays * roomPrice;
  };

  const isGuestCountValid = () => {
    const adultCount = parseInt(booking.numOfAdults);
    const childrenCount = parseInt(booking.numOfChildren);
    return adultCount + childrenCount >= 1 && adultCount >= 1;
  };

  const isCheckOutDateValid = () => {
    if (!moment(booking.checkOutDate).isSameOrAfter(moment(booking.checkInDate))) {
      setErrorMessage("Check-out date must be after check-in date");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false || !isGuestCountValid() || !isCheckOutDateValid()) {
      e.stopPropagation();
    } else {
      setIsSubmitted(true);
      setShowModal(true);
    }
    setValidated(true);
  };

  const handleFormSubmit = async () => {
    try {
      const confirmationCode = await bookRoom(roomId, booking);
      setSubmissionMessage(`Booking confirmed! Your confirmation code is: ${confirmationCode}`);
      
      // Set a timeout before navigating to the homepage
      setTimeout(() => {
        navigate("/", { state: { message: confirmationCode } });  // Navigate to homepage with the success message
      }, 13000); // 3000ms = 3 seconds

      setShowModal(false); // Close modal after submission
    } catch (error) {
      setSubmissionMessage(`Booking failed: ${error.message}`);
      setShowModal(false); // Close modal after submission
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container" style={{ width: '450px' }}>
      <div className="card shadow-lg rounded p-3">
        <h4 className="text-center text-primary mb-4 fw-bold">Reserve Your Room</h4>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <FormControl
              required
              type="text"
              name="guestFullName"
              value={booking.guestFullName}
              placeholder="Enter your fullname"
              onChange={handleInputChange}
              className="rounded"
            />
            <Form.Control.Feedback type="invalid">Please enter your fullname.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <FormControl
              required
              type="email"
              name="guestEmail"
              value={booking.guestEmail}
              disabled
              className="rounded"
            />
            <Form.Control.Feedback type="invalid">Please enter a valid email address.</Form.Control.Feedback>
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Check-in Date</Form.Label>
                <FormControl
                  required
                  type="date"
                  name="checkInDate"
                  value={booking.checkInDate}
                  min={moment().format("YYYY-MM-DD")}
                  onChange={handleInputChange}
                  className="rounded"
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Check-out Date</Form.Label>
                <FormControl
                  required
                  type="date"
                  name="checkOutDate"
                  value={booking.checkOutDate}
                  min={moment().format("YYYY-MM-DD")}
                  onChange={handleInputChange}
                  className="rounded"
                />
              </Form.Group>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Number of Adults</Form.Label>
                <FormControl
                  required
                  type="number"
                  name="numOfAdults"
                  value={booking.numOfAdults}
                  min={1}
                  onChange={handleInputChange}
                  className="rounded"
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Number of Children</Form.Label>
                <FormControl
                  type="number"
                  name="numOfChildren"
                  value={booking.numOfChildren}
                  min={0}
                  onChange={handleInputChange}
                  className="rounded"
                />
              </Form.Group>
            </div>
          </div>

          <div className="text-center">
            <Button type="submit" className="btn-primary px-4 py-2">Continue</Button>
          </div>
        </Form>

        {/* Display success/error message after form submission */}
        {submissionMessage && (
          <Alert variant={submissionMessage.includes("failed") ? "danger" : "success"} className="mt-3">
            {submissionMessage}
          </Alert>
        )}
      </div>

      {/* Modal for Booking Summary */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Body>
          <BookingSummary
            booking={booking}
            payment={calculatePayment()}
            onConfirm={handleFormSubmit}
            isFormValid={validated}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BookingForm;
