import React, { useState } from "react";
import { Form, Button, Row, Col, Container, Card, Spinner } from "react-bootstrap";
import moment from "moment";
import { getAvailableRooms } from "../utils/ApiFunctions";
import RoomSearchResults from "./RoomSearchResult";
import RoomTypeSelector from "./RoomTypeSelector";

const RoomSearch = () => {
	const [searchQuery, setSearchQuery] = useState({
		checkInDate: "",
		checkOutDate: "",
		roomType: "",
	});

	const [errorMessage, setErrorMessage] = useState("");
	const [availableRooms, setAvailableRooms] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleSearch = (e) => {
		e.preventDefault();
		const checkInMoment = moment(searchQuery.checkInDate);
		const checkOutMoment = moment(searchQuery.checkOutDate);
		if (!checkInMoment.isValid() || !checkOutMoment.isValid()) {
			setErrorMessage("Please enter valid dates");
			return;
		}
		if (!checkOutMoment.isSameOrAfter(checkInMoment)) {
			setErrorMessage("Check-out date must be after check-in date");
			return;
		}
		setIsLoading(true);
		getAvailableRooms(searchQuery.checkInDate, searchQuery.checkOutDate, searchQuery.roomType)
			.then((response) => {
				console.log(response.data);
				setAvailableRooms(response.data);
				setTimeout(() => setIsLoading(false), 2000);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setSearchQuery({ ...searchQuery, [name]: value });
		const checkInDate = moment(searchQuery.checkInDate);
		const checkOutDate = moment(searchQuery.checkOutDate);
		if (checkInDate.isValid() && checkOutDate.isValid()) {
			setErrorMessage("");
		}
	};

	const handleClearSearch = () => {
		setSearchQuery({
			checkInDate: "",
			checkOutDate: "",
			roomType: "",
		});
		setAvailableRooms([]);
	};

	return (
		<>
			<Container className="mt-5">
				<Card className="shadow-lg border-0">
					<Card.Header className="bg-primary text-white text-center">
						<h4 className="mb-0 p-2 fw-bold fs-3">Search Your Rooms..❤️</h4>
						<p className="fs-6 mt-2">Find the best rooms for your stay at amazing prices.</p>
					</Card.Header>
					<Card.Body>
						<Form onSubmit={handleSearch}>
							<Row className="justify-content-center mb-4">
								<Col xs={12} md={4} className="mb-3 mb-md-0 mt-3">
									<Form.Group controlId="checkInDate">
										<Form.Label className="fw-bold   fs-4 text-secondary">Check-in Date</Form.Label>
										<Form.Control
											type="date"
											name="checkInDate"
											value={searchQuery.checkInDate}
											onChange={handleInputChange}
											min={moment().format("YYYY-MM-DD")}
											className="shadow-sm mt-3 text-center fs-4 text-secondary"
											style={{ height: '60px' }}

										/>
									</Form.Group>
								</Col>
								<Col xs={12} md={4} className="mb-3 mb-md-0 mt-3">
									<Form.Group controlId="checkOutDate">
										<Form.Label className="fw-bold fs-4   text-secondary">Check-out Date</Form.Label>
										<Form.Control
											type="date"
											name="checkOutDate"
											value={searchQuery.checkOutDate}
											onChange={handleInputChange}
											min={moment().format("YYYY-MM-DD")}
											className="shadow-sm mt-3 fs-4  text-center text-secondary "
											style={{ height: '60px' }}
										/>
									</Form.Group>
								</Col>
								<Col xs={12} md={4} className="mb-3 mb-md-0 p-3">
									<Form.Group controlId="roomType">
										<Form.Label className="fw-bold fs-4  text-secondary">Room Type</Form.Label>
										<div className="d-flex align-items-center  p-2" style={{ height: '60px' }}>
											<RoomTypeSelector
												handleRoomInputChange={handleInputChange}
												newRoom={searchQuery}
												className="flex-grow-1 shadow-sm form-control-lg p-5 "

											/>
											<Button
												variant="primary"
												type="submit"
												className="ms-3 shadow-sm   mt-3 "
												style={{ width: '150px', height: '60px' }}
											>
												Search
											</Button>
										</div>
									</Form.Group>
								</Col>
							</Row>
						</Form>
						{isLoading && (
							<div className="text-center mt-4">
								<Spinner animation="border" variant="primary" />
								<p className="mt-2">Finding available rooms...</p>
							</div>
						)}
						{!isLoading && availableRooms.length > 0 && (
							<RoomSearchResults results={availableRooms} onClearSearch={handleClearSearch} />
						)}
						{!isLoading && availableRooms.length === 0 && errorMessage === "" && (
							<p className="text-muted text-center mt-4">
								No rooms available for the selected dates and room type.
							</p>
						)}
						{errorMessage && <p className="text-danger text-center mt-4">{errorMessage}</p>}
					</Card.Body>
				</Card>
			</Container>
		</>
	);
};

export default RoomSearch;
