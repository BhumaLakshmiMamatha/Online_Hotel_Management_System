import React, { useState, useEffect } from "react";
import moment from "moment";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Card, Col, Row, Container, Spinner, Table } from "react-bootstrap";
import "./BookingSummary.css"; // Custom styles for further fine-tuning

const BookingSummary = ({ booking, payment, isFormValid, onConfirm }) => {
  const checkInDate = moment(booking.checkInDate);
  const checkOutDate = moment(booking.checkOutDate);
  const numberOfDays = checkOutDate.diff(checkInDate, "days");
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();

  const handleConfirmBooking = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsBookingConfirmed(true);
      onConfirm();
    }, 3000);
  };

  useEffect(() => {
    if (isBookingConfirmed) {
      navigate("");
    }
  }, [isBookingConfirmed, navigate]);

  return (
    <Container className="p-4  d-flex align-items-center justify-content-center "  >
      {/* style={{backgroundImage: 'url("https://images2.alphacoders.com/815/thumb-1920-815029.jpg")'}} */}
      <Row className="">
        <Col md={8}>
          <Card className="shadow-lg rounded-lg border-0" style={{width:'470px', height:'550px' }}>
            <Card.Header className="bg-primary text-white text-center py-3">
              <h4 className="m-0">Reservation Summary</h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Table responsive bordered hover className="mb-4" >
                <tbody>
                  <tr>
                    <td><strong>Name</strong></td>
                    <td>{booking.guestFullName}</td>
                  </tr>
                  <tr>
                    <td><strong>Email</strong></td>
                    <td>{booking.guestEmail}</td>
                  </tr>
                  <tr>
                    <td><strong>Check-in Date</strong></td>
                    <td>{moment(booking.checkInDate).format("MMM Do YYYY")}</td>
                  </tr>
                  <tr>
                    <td><strong>Check-out Date</strong></td>
                    <td>{moment(booking.checkOutDate).format("MMM Do YYYY")}</td>
                  </tr>
                  <tr>
                    <td><strong>Number of Days</strong></td>
                    <td>{numberOfDays}</td>
                  </tr>
                  <tr>
                    <td><strong>Adults</strong></td>
                    <td>{booking.numOfAdults}</td>
                  </tr>
                  <tr>
                    <td><strong>Children</strong></td>
                    <td>{booking.numOfChildren}</td>
                  </tr>
                  <tr className="table-info">
                    <td><strong>Total Payment</strong></td>
                    <td>₹ {payment}</td>
                  </tr>
                </tbody>
              </Table>

              {payment > 0 ? (
                <>
                  {isFormValid && !isBookingConfirmed ? (
                    <div className="text-center">
                      <Button
                        variant="success"
                        onClick={handleConfirmBooking}
                        className="px-4 py-2 w-100 mb-3 shadow-sm"
                        size="lg"
                        disabled={isProcessingPayment}
                      >
                        {isProcessingPayment ? (
                          <>
                            <Spinner
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Processing Payment...
                          </>
                        ) : (
                          "Confirm Booking & Proceed to Payment"
                        )}
                      </Button>
                    </div>
                  ) : isBookingConfirmed ? (
                    <div className="text-center mt-3">
                      <Spinner animation="grow" variant="primary" />
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-danger text-center mt-3">
                  Check-out date must be after check-in date.
                </p>
              )}
            </Card.Body>
            <Card.Footer className="bg-light text-center">
              <p className="m-0 text-muted">
                Please double-check your details before confirming your reservation.
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingSummary;
