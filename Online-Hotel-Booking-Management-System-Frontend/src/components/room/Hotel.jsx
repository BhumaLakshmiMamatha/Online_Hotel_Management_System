import React, { useState, useEffect } from "react";
import { getAllHotels } from "../utils/ApiFunctions"; // Assuming this function fetches hotels
import { Row, Col, Container, Spinner } from "react-bootstrap";
import HotelCard from "./HotelCard";
import RoomPaginator from "../common/RoomPaginator"; // Assuming this is a reusable paginator component

const Hotel = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(5); // Show 5 hotels per page
  const [loading, setLoading] = useState(true); // State for loading spinner

  useEffect(() => {
    setLoading(true); // Show spinner while fetching data
    getAllHotels()
      .then((response) => {
        setData(response); // Assuming this fetches an array of hotels
        setLoading(false); // Hide spinner after data is loaded
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Hide spinner if there's an error
      });
  }, []);

  // Logic for pagination
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = data.slice(indexOfFirstHotel, indexOfLastHotel);

  const totalPages = Math.ceil(data.length / hotelsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      {loading ? (
        // Spinner displayed when loading
        <Row className="justify-content-center my-5">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Row>
      ) : (
        <>
          <Row>
            {currentHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </Row>

          {data.length > hotelsPerPage && (
            <Row>
              <Col className="d-flex justify-content-center">
                <RoomPaginator
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default Hotel;
