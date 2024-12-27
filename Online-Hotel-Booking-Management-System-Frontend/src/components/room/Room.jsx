import React, { useEffect, useState } from "react";
import { getAllRooms, getRoomsByHotelId } from "../utils/ApiFunctions";
import RoomCard from "./RoomCard";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import RoomFilter from "../common/RoomFilter";
import RoomPaginator from "../common/RoomPaginator";
import { useParams } from "react-router-dom";

const Room = () => {
    const { hotelId } = useParams();
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(6);
    const [filteredData, setFilteredData] = useState([{ id: "" }]);

    useEffect(() => {
        setIsLoading(true);
        getRoomsByHotelId(hotelId)
            .then((data) => {
                setData(data);
                setFilteredData(data);
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setIsLoading(false);
            });
    }, [hotelId]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading rooms...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return <div className="text-danger">Error: {error}</div>;
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredData.length / roomsPerPage);

    const renderRooms = () => {
        const startIndex = (currentPage - 1) * roomsPerPage;
        const endIndex = startIndex + roomsPerPage;
        return filteredData
            .slice(startIndex, endIndex)
            .map((room) => <RoomCard key={room.id} room={room} />);
    };

    return (
        <Container>
            <Row>
                <Col md={12} className="mb-3 mb-md-0">
                    <RoomFilter data={data} setFilteredData={setFilteredData} />
                </Col>
            </Row>

            <Row>{renderRooms()}</Row>

            <Row>
                <Col md={6} className="d-flex align-items-center mb-4 justify-content-end">
                    <RoomPaginator
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Room;
