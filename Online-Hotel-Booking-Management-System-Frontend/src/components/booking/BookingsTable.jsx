import React, { useState, useEffect } from "react";
import { parseISO, format } from "date-fns"; // Import date-fns functions
import DateSlider from "../common/DateSlider";

const BookingsTable = ({ bookingInfo, handleBookingCancellation }) => {
	const [filteredBookings, setFilteredBookings] = useState(bookingInfo);
	const [successMessage, setSuccessMessage] = useState(""); // State for success message

	const filterBookings = (startDate, endDate) => {
		let filtered = bookingInfo;
		if (startDate && endDate) {
			filtered = bookingInfo.filter((booking) => {
				const bookingStartDate = parseISO(formatDate(booking.checkInDate)); // Ensure correct date format
				const bookingEndDate = parseISO(formatDate(booking.checkOutDate)); // Ensure correct date format
				return (
					bookingStartDate >= startDate &&
					bookingEndDate <= endDate &&
					bookingEndDate > startDate
				);
			});
		}
		setFilteredBookings(filtered);
	};

	useEffect(() => {
		setFilteredBookings(bookingInfo);
	}, [bookingInfo]);

	// Convert the array [year, month, day] to a proper ISO date string format (YYYY-MM-DD)
	const formatDate = (dateArray) => {
		if (Array.isArray(dateArray) && dateArray.length === 3) {
			// Construct the date in YYYY-MM-DD format
			const [year, month, day] = dateArray;
			const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
			return formattedDate;
		}
		return ""; // Return empty string if the array is not in the correct format
	};

	// Format date to "Month Day, Year" with validation
	const displayFormattedDate = (dateArray) => {
		const formattedDate = formatDate(dateArray);
		if (formattedDate) {
			const parsedDate = parseISO(formattedDate);
			if (parsedDate instanceof Date && !isNaN(parsedDate)) {
				return format(parsedDate, "MMMM dd, yyyy");
			}
		}
		return "Invalid date"; // Return "Invalid date" if invalid date
	};

	const handleDelete = (bookingId) => {
		handleBookingCancellation(bookingId);
		setSuccessMessage("Booking deleted successfully!");
	
		// Clear success message after 3 seconds
		setTimeout(() => {
			setSuccessMessage(""); // Clear message
			window.location.reload(); // Refresh the page
		});
	};
	

	return (
		<section className="p-4">
			<DateSlider onDateChange={filterBookings} onFilterChange={filterBookings} />
			
			{/* Conditionally render success message */}
			{successMessage && (
				<div className="alert alert-success" role="alert">
					{successMessage}
				</div>
			)}

			<table className="table table-bordered table-hover shadow">
				<thead>
					<tr>
						<th>S/N</th>
						<th>Booking ID</th>
						<th>Room ID</th>
						<th>Room Type</th>
						<th>Check-In Date</th>
						<th>Check-Out Date</th>
						<th>Guest Name</th>
						<th>Guest Email</th>
						<th>Adults</th>
						<th>Children</th>
						<th>Total Guest</th>
						<th>Confirmation Code</th>
						<th colSpan={2}>Actions</th>
					</tr>
				</thead>
				<tbody className="text-center">
					{filteredBookings.length > 0 ? (
						filteredBookings.map((booking, index) => (
							<tr key={booking.id}>
								<td>{index + 1}</td>
								<td>{booking.id}</td>
								<td>{booking.room.id}</td>
								<td>{booking.room.roomType}</td>
								<td>{displayFormattedDate(booking.checkInDate)}</td>
								<td>{displayFormattedDate(booking.checkOutDate)}</td>
								<td>{booking.guestName}</td>
								<td>{booking.guestEmail}</td>
								<td>{booking.numOfAdults}</td>
								<td>{booking.numOfChildren}</td>
								<td>{booking.totalNumOfGuests}</td>
								<td>{booking.bookingConfirmationCode}</td>
								<td>
									<button
										className="btn btn-danger btn-sm"
										onClick={() => handleDelete(booking.id)} // Trigger delete with success message
									>
										Cancel
									</button>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="13" className="text-center text-danger">
								No bookings found for the selected dates
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</section>
	);
};

export default BookingsTable;
