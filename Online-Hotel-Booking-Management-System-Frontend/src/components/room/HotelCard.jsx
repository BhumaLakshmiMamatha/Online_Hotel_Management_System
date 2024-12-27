import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import './HotelCard.css';
// import Hotel from "/src/assets/HotelIMG.jpg";


// Import the images directly
import HotelImage1 from "/src/assets/hotelImages/1.jpg";
import HotelImage2 from "/src/assets/hotelImages/2.jpg";
import HotelImage3 from "/src/assets/hotelImages/3.jpg";
import HotelImage4 from "/src/assets/hotelImages/4.jpg";
import HotelImage5 from "/src/assets/hotelImages/5.jpg";
import HotelImage6 from "/src/assets/hotelImages/6.jpg";
import HotelImage7 from "/src/assets/hotelImages/7.jpg";


// Define logic for changing images for the first 7 hotels
const hotelImages = [
  HotelImage1,
  HotelImage2,
  HotelImage3,
  HotelImage4,
  HotelImage5,
  HotelImage6,
  HotelImage7
];



const HotelCard = ({ hotel }) => {
  
  // Determine the image to display based on the hotel id
  const hotelImage = hotelImages[hotel.id % 7] || HotelImage1;  // Default image if no specific image found


  return (


    <Col key={hotel.id} xs={12} className="mb-4 mt-4  "> {/* Full width on all screen sizes */}
      <Card className="shadow-lg border-0 rounded-lg hotel-card">
        <Row className="g-0 align-items-stretch">
          {/* Image Section */}
          <Col xs={12} md={4} className="">
            <Card.Img
              src={hotelImage}
              alt={hotel.hotelName}
              className="img-fluid rounded "
              style={{ height: "250px", objectFit: "cover" }}
            />
          </Col>

          {/* Hotel Information Section */}
          <Col xs={12} md={8} className="">
            <Card.Body className="d-flex flex-column justify-between  rounded bg-light p-4">
              <Card.Title className="hotel-name text-primary fs-3 mb-2">
                {hotel.hotelName}
              </Card.Title>

              {/* Email with Icon */}
              <Card.Text className="text-muted mb-3">
                <FaEnvelope className="text-warning me-2" /> {hotel.email}
              </Card.Text>

              {/* Phone Number with Icon */}
              <Card.Text className="text-muted mb-2">
                <FaPhoneAlt className="text-success me-2" /> {hotel.phoneNumber}
              </Card.Text>

              {/* Hotel Address with Icon */}
              <Card.Text className="hotel-address text-secondary mb-2">
                <FaMapMarkerAlt className="text-danger me-2" /> {hotel.hotelAddress}, {hotel.city}
              </Card.Text>

              {/* View Rooms Button */}
              <div className="mt-auto text-end">
                <Link to={`/hotel/${hotel.id}/rooms`} className="btn btn-primary rounded-pill shadow-sm hotel-card-btn">
                  View Rooms
                </Link>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Col>
  );
};

export default HotelCard;
