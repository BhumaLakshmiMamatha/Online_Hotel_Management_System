import React, { useState } from "react";
import { Row, Col, Button, Form, Container } from "react-bootstrap";

const RoomFilter = ({ data, setFilteredData }) => {
  const [filter, setFilter] = useState("");

  const handleSelectChange = (e) => {
    const selectedType = e.target.value;
    setFilter(selectedType);

    const filteredRooms = data.filter((room) =>
      room.roomType.toLowerCase().includes(selectedType.toLowerCase())
    );
    setFilteredData(filteredRooms);
  };

  const clearFilter = () => {
    setFilter("");
    setFilteredData(data);
  };

  const roomTypes = ["", ...new Set(data.map((room) => room.roomType))];

  return (
    <Container className="d-flex mb-4 mt-3 justify-content-end">
      <div className="p-3 bg-light rounded border shadow-sm">
        <Row className="align-items-center g-2">
          {/* Label */}
          <Col xs={12} md={4} className="text-center text-md-start">
            <span className="fw-semibold text-dark">Filter Rooms</span>
          </Col>

          {/* Dropdown */}
          <Col xs={12} md={5}>
            <Form.Select
              value={filter}
              onChange={handleSelectChange}
              aria-label="Room type filter"
              className="shadow-sm"
              style={{
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              <option value="">Select a room type...</option>
              {roomTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type || "All Types"}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Clear Button */}
          <Col xs={12} md={3} className="text-center">
            <Button
              variant="outline-secondary"
              onClick={clearFilter}
              className="px-3 py-2 w-100 w-md-auto shadow-sm"
              style={{
                fontSize: "14px",
                borderRadius: "6px",
              }}
            >
              Clear
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default RoomFilter;
