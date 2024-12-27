import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Header from "./Header";
import {
  FaClock,
  FaCocktail,
  FaParking,
  FaSnowflake,
  FaTshirt,
  FaUtensils,
  FaWifi,
} from "react-icons/fa";
import "./HotelService.css"; // Custom styles

const HotelService = () => {
  return (
    <>
      <div className="services-section py-5">
        {/* Header */}
        <Container>
          {/* <Header title={"Our Services"} /> */}

          {/* Subheading */}
          <Row className="text-center mt-4">
            <Col>
              <h4 className="fw-bold service-heading">
                Services at{" "}
                <span className="hotel-color text-primary">BOOK IT</span>
              </h4>
              <p className="text-muted d-flex justify-content-center align-items-center mt-3">
                <FaClock className="icon-highlight text-danger me-2" /> Available <span className="text-success ms-2 fw-bold"> 24/7</span>
              </p>

            </Col>
          </Row>

          <hr className="my-4" />

          {/* Services Grid */}
          <Row xs={1} md={2} lg={3} className="g-4">
            {/* WiFi */}
            <Col>
              <Card className="service-card text-center">
                <div className="icon-circle mx-auto">
                  <FaWifi className="service-icon" />
                </div>
                <Card.Body>
                  <Card.Title className="hotel-color fw-bold">WiFi</Card.Title>
                  <Card.Text>
                    Stay connected with high-speed internet access.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Breakfast */}
            <Col>
              <Card className="service-card text-center">
                <div className="icon-circle mx-auto">
                  <FaUtensils className="service-icon" />
                </div>
                <Card.Body>
                  <Card.Title className="hotel-color fw-bold">Breakfast</Card.Title>
                  <Card.Text>
                    Start your day with a delicious breakfast buffet.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Laundry */}
            <Col>
              <Card className="service-card text-center">
                <div className="icon-circle mx-auto">
                  <FaTshirt className="service-icon" />
                </div>
                <Card.Body>
                  <Card.Title className="hotel-color fw-bold">Laundry</Card.Title>
                  <Card.Text>
                    Keep your clothes clean and fresh with our laundry service.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Mini-bar */}
            <Col>
              <Card className="service-card text-center">
                <div className="icon-circle mx-auto">
                  <FaCocktail className="service-icon" />
                </div>
                <Card.Body>
                  <Card.Title className="hotel-color fw-bold">Mini-bar</Card.Title>
                  <Card.Text>
                    Enjoy a refreshing drink or snack from our in-room mini-bar.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Parking */}
            <Col>
              <Card className="service-card text-center">
                <div className="icon-circle mx-auto">
                  <FaParking className="service-icon" />
                </div>
                <Card.Body>
                  <Card.Title className="hotel-color fw-bold">Parking</Card.Title>
                  <Card.Text>
                    Park your car conveniently in our on-site parking lot.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Air Conditioning */}
            <Col>
              <Card className="service-card text-center">
                <div className="icon-circle mx-auto">
                  <FaSnowflake className="service-icon" />
                </div>
                <Card.Body>
                  <Card.Title className="hotel-color fw-bold">
                    Air Conditioning
                  </Card.Title>
                  <Card.Text>
                    Stay cool and comfortable with our air conditioning system.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default HotelService;
