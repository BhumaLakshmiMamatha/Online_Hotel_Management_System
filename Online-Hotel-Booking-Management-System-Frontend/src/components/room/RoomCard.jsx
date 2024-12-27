import React from "react";
import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBed, FaRupeeSign , FaHotel, FaTag } from "react-icons/fa";  // Added FaTag for discount
import { FiClock } from "react-icons/fi";  // Additional time icon for availability
import './RoomCard.css';

const RoomCard = ({ room }) => {
  return (
    <Col key={room.id} className="mb-4" xs={12} md={6} lg={4}>
      <Card className="room-card shadow-sm border-0 rounded-lg overflow-hidden">
        <Card.Body className="d-flex flex-column align-items-start">
          {/* Image Section */}
          <div className="mb-3">
            <Link to={`/book-room/${room.id}`}>
              <Card.Img
                variant="top"
                src={`data:image/png;base64, ${room.photo}`}
                alt="Room Photo"
                className="rounded-lg"
                style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "12px" }}
              />
            </Link>
          </div>

          {/* Room Details */}
          <div className="d-flex flex-column flex-grow-1 w-100">
            <Card.Title className="text-dark font-weight-bold room-type">
              <FaBed className="mr-2 text-warning" /> {room.roomType}
            </Card.Title>
            <Card.Text className="room-price text-success font-weight-bold">
              <FaRupeeSign  className="mr-2" /> {room.roomPrice} / night
            </Card.Text>
            <Card.Text className="hotel-name text-muted" style={{ fontSize: "1.1rem" }}>
              <FaHotel className="mr-2 text-primary" /> {room.hotelName}
            </Card.Text>
            {/* Discount Section */}
            <Card.Text className="discount-offer text-danger" style={{ fontSize: "1rem" }}>
              <FaTag className="mr-2" /> Discount Available
            </Card.Text>
            <Card.Text className="text-muted" style={{ fontSize: "0.9rem" }}>
              <FiClock className="mr-2 text-secondary" /> Available Now
            </Card.Text>
          </div>

          {/* Book Button */}
          <div className="mt-3 w-100">
            <Link
              to={`/book-room/${room.id}/${room.hotelId}`}
              className="btn btn-primary btn-block rounded-pill font-weight-bold"
            >
              <i className="bi bi-bookmark-fill mr-2"></i> Book Now
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default RoomCard;
