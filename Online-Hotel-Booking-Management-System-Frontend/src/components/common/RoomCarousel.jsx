import React, { useEffect, useState } from "react";
import { getRoomsByHotelId } from "../utils/ApiFunctions";
import { Link, useParams } from "react-router-dom";
import { Card, Carousel, Col, Container, Row } from "react-bootstrap";
import './RoomCarousel.css';

const RoomCarousel = () => {
  const { hotelId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRoomsByHotelId(hotelId)
      .then((data) => {
        setRooms(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setIsLoading(false);
      });
  }, [hotelId]);

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading rooms...</span>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="text-center text-danger mt-5">
        <h5>Error: {errorMessage}</h5>
      </div>
    );
  }

  return (
    <section className="bg-light py-5 shadow-sm">
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="hotel-color">Explore Our Rooms</h2>
          <p className="lead">Choose the perfect room for your stay.</p>
        </div>

        <Link
          to="/browse-all-rooms"
          className="d-block text-center mb-4 text-decoration-none hotel-color"
        >
          <strong>Browse All Rooms</strong>
        </Link>

        <Carousel indicators={false} interval={5000}>
          {[...Array(Math.ceil(rooms.length / 4))].map((_, index) => (
            <Carousel.Item key={index}>
              <Row>
                {rooms.slice(index * 4, index * 4 + 4).map((room) => (
                  <Col key={room.id} xs={12} md={6} lg={3} className="mb-4">
                    <Card className="shadow-sm rounded card-subtle">
                      <Link to={`/book-room/${room.id}`}>
                        <Card.Img
                          variant="top"
                          src={`data:image/png;base64, ${room.photo}`}
                          alt="Room Photo"
                          className="w-100 card-img"
                        />
                      </Link>
                      <Card.Body className="text-center d-flex align-items-center">
                        <Card.Title className="hotel-color">{room.roomType}</Card.Title>
                        <Card.Text className="room-price">₹ {room.roomPrice}/night</Card.Text>
                        <div className="d-flex justify-content-center">
                          <Link to={`/book-room/${room.id}`} className="btn btn-primary btn-sm">
                            Book Now
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default RoomCarousel;
