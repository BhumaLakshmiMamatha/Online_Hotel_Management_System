import React, { useState } from "react";
import moment from "moment";
import { cancelBooking, getBookingByConfirmationCode } from "../utils/ApiFunctions";

const FindBooking = () => {
	const [confirmationCode, setConfirmationCode] = useState("");
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [bookingInfo, setBookingInfo] = useState({
		id: "",
		bookingConfirmationCode: "",
		room: { id: "", roomType: "" },
		roomNumber: "",
		checkInDate: "",
		checkOutDate: "",
		guestName: "",
		guestEmail: "",
		numOfAdults: "",
		numOfChildren: "",
		totalNumOfGuests: ""
	});

	const emptyBookingInfo = {
		id: "",
		bookingConfirmationCode: "",
		room: { id: "", roomType: "" },
		roomNumber: "",
		checkInDate: "",
		checkOutDate: "",
		guestName: "",
		guestEmail: "",
		numOfAdults: "",
		numOfChildren: "",
		totalNumOfGuests: ""
	};

	const [isDeleted, setIsDeleted] = useState(false);

	const handleInputChange = (event) => {
		setConfirmationCode(event.target.value);
	};

	const handleFormSubmit = async (event) => {
		event.preventDefault();
		setIsLoading(true);

		try {
			const data = await getBookingByConfirmationCode(confirmationCode);
			setBookingInfo(data);
			setError(null);
		} catch (error) {
			setBookingInfo(emptyBookingInfo);
			if (error.response && error.response.status === 404) {
				setError(error.response.data.message);
			} else {
				setError(error.message);
			}
		}

		setTimeout(() => setIsLoading(false), 2000);
	};

	const handleBookingCancellation = async (bookingId) => {
		try {
			await cancelBooking(bookingInfo.id);
			setIsDeleted(true);
			setSuccessMessage("Booking has been cancelled successfully!");
			setBookingInfo(emptyBookingInfo);
			setConfirmationCode("");
			setError(null);
		} catch (error) {
			setError(error.message);
		}
		setTimeout(() => {
			setSuccessMessage("");
			setIsDeleted(false);
		}, 2000);
	};

	// Helper function to format dates with debug logs
	const formatDate = (dateArray) => {
		if (!dateArray || dateArray.length !== 3) return "N/A"; // Check if the array is valid
	
		const dateString = `${dateArray[0]}-${String(dateArray[1]).padStart(2, '0')}-${String(dateArray[2]).padStart(2, '0')}`;
		
		const formattedDate = moment(dateString, "YYYY-MM-DD").isValid()
			? moment(dateString).format("MMM Do, YYYY") // Format the date if valid
			: "Invalid Date"; // If invalid, return "Invalid Date"
	
		console.log("Formatted date:", formattedDate); // Debug log to check the formatted date
		return formattedDate;
	};
	

	return (
		<>
			<div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
				<h2 className="text-center mb-4 text-primary" style={{ fontWeight: "bold" }}>
					Track My Booking
				</h2>

				<form
					onSubmit={handleFormSubmit}
					className="col-md-6 p-4 bg-white shadow rounded-lg"
					style={{
						transition: "transform 0.3s ease",
						border: "1px solid #ddd",
						boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
					}}
				>
					<div className="input-group mb-3">
						<input
							type="text"
							className="form-control mt-2"
							id="confirmationCode"
							name="confirmationCode"
							value={confirmationCode}
							onChange={handleInputChange}
							placeholder="Enter booking code"
							required
							style={{
								borderRadius: "30px",
								padding: "12px 15px",
								border: "1px solid #ccc",
								fontSize: "16px",
							}}
						/>
						<button
							type="submit"
							className="btn btn-primary ms-3 mt-2 input-group-text"
							style={{
								borderRadius: "30px",
								padding: "12px 20px",
								fontWeight: "bold",
								backgroundColor: "#007bff",
								borderColor: "#007bff",
							}}
							onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
							onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
						>
							Find Booking
						</button>
					</div>
				</form>

				{isLoading ? (
					<div className="mt-3 " style={{ color: "#007bff", fontSize: "18px" }}>
						Finding your booking...
					</div>
				) : error ? (
					<div className="alert alert-danger mt-3" style={{ fontSize: "16px" }}>
						Error: {error}
					</div>
				) : bookingInfo.bookingConfirmationCode ? (
					<div className="col-md-8 mt-5 mb-5 border rounded p-5 shadow-sm bg-white">
						<h3 className="text-success text-center fw-bold">Booking Information</h3>
						<table className="table table-striped table-bordered" style={{ height: '600px' }}>
							<thead style={{ backgroundColor: "#007bff", color: "white" }}>
								<tr>
									<th>Field</th>
									<th>Details</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th>Confirmation Code</th>
									<td>{bookingInfo.bookingConfirmationCode}</td>
								</tr>
								<tr>
									<th>Room Number</th>
									<td>{bookingInfo.room.id}</td>
								</tr>
								<tr>
									<th>Room Type</th>
									<td>{bookingInfo.room.roomType}</td>
								</tr>
								<tr>
									<th>Check-in Date</th>
									<td>{formatDate(bookingInfo.checkInDate)}</td>
								</tr>
								<tr>
									<th>Check-out Date</th>
									<td>{formatDate(bookingInfo.checkOutDate)}</td>
								</tr>
								<tr>
									<th>Guest Name</th>
									<td>{bookingInfo.guestName}</td>
								</tr>
								<tr>
									<th>Email Address</th>
									<td>{bookingInfo.guestEmail}</td>
								</tr>
								<tr>
									<th>Adults</th>
									<td>{bookingInfo.numOfAdults}</td>
								</tr>
								<tr>
									<th>Children</th>
									<td>{bookingInfo.numOfChildren}</td>
								</tr>
								<tr>
									<th>Total Guests</th>
									<td>{bookingInfo.totalNumOfGuests}</td>
								</tr>
							</tbody>
						</table>

						{!isDeleted && (
							<button
								onClick={() => handleBookingCancellation(bookingInfo.id)}
								className="btn btn-danger mt-3"
								style={{
									borderRadius: "30px",
									padding: "12px 20px",
									fontWeight: "bold",
									backgroundColor: "#dc3545",
									borderColor: "#dc3545",
								}}
								onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c82333")}
								onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#dc3545")}
							>
								Cancel Booking
							</button>
						)}
					</div>
				) : (
					<div className="mt-3 text-secondary" style={{ fontSize: "16px" }}>
						Enter a booking confirmation code to find your booking.
					</div>
				)}

				{isDeleted && (
					<div
						className="alert alert-success mt-3 fade show"
						style={{
							animation: "fadeIn 1s ease-in-out",
							fontSize: "16px",
							fontWeight: "bold",
						}}
					>
						{successMessage}
					</div>
				)}
			</div>
		</>
	);
};

export default FindBooking;
