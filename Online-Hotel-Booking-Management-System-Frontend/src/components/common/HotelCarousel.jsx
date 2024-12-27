import React, { useEffect, useState } from "react";
import { getAllHotels } from "../utils/ApiFunctions";
import { Card, Carousel, Col, Container, Row, Spinner } from "react-bootstrap";
import HotelCard from "../room/HotelCard";
import { FaClock, FaStar, FaRegStar, FaCalendarCheck } from "react-icons/fa";

const HotelCarousel = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(3); // Show only 3 hotels per page

  useEffect(() => {
    setIsLoading(true);
    getAllHotels()
      .then((data) => {
        setHotels(data);
        setFilteredHotels(data); // Initialize filtered hotels with all hotels
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading hotels...</span>
        </Spinner>
      </div>
    );
  }

  if (errorMessage) {
    return <div className="text-danger text-center mt-5">Error: {errorMessage}</div>;
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  const renderHotels = () => {
    const startIndex = (currentPage - 1) * hotelsPerPage;
    const endIndex = startIndex + hotelsPerPage;
    return filteredHotels.slice(startIndex, endIndex).map((hotel) => (
      <HotelCard key={hotel.id} hotel={hotel} />
    ));
  };

  return (
    <section className="bg-light mb-5 mt-5 shadow py-4">
      <Row className="text-center mt-4">
        <Col>
          <h4 className="fw-bold service-heading">
            Select Your{" "}
            <span className="hotel-color text-primary">HOTELS</span>
          </h4>
          <p className="text-muted d-flex justify-content-center align-items-center mt-3">
            <FaStar className="icon-highlight text-warning me-2" /> Best Hotels{" "}
            <span className="text-success ms-2 fw-bold">24/7</span>
          </p>
          <p className="text-muted d-flex justify-content-center align-items-center mt-3">
            <FaRegStar className="text-primary me-2" /> Luxury Stay
            <FaCalendarCheck className="text-success ms-4 me-2" /> Book Now
          </p>
        </Col>
      </Row>

      <Container>
        <Carousel indicators={false} className="py-4">
          {[...Array(Math.ceil(filteredHotels.length / 3))].map((_, index) => (
            <Carousel.Item key={index}>
              <Row className="justify-content-center">
                {filteredHotels
                  .slice(index * 3, index * 3 + 3)
                  .map((hotel) => (
                    <Col key={hotel.id} className="mb-4 " xs={12} md={6} lg={4}>
                      <HotelCard hotel={hotel} />
                    </Col>
                  ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default HotelCarousel;
