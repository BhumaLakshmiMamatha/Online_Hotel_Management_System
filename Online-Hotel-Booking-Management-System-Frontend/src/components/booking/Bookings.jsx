import React, { useState, useEffect } from "react"
import { cancelBooking, getAllBookings, getAllBookingsByHotelId } from "../utils/ApiFunctions"
import Header from "../common/Header"
import BookingsTable from "./BookingsTable"
import { useNavigate } from "react-router-dom"

const Bookings = () => {
	const [bookingInfo, setBookingInfo] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState("")
	const navigate = useNavigate()
	const hotelId = localStorage.getItem("hotelId")

	useEffect(() => {
		setTimeout(() => {
			getAllBookingsByHotelId(hotelId)
				.then((data) => {
					setBookingInfo(data)
					setIsLoading(false)
				})
				.catch((error) => {
					setError(error.message)
					// navigate("/hotel-profile")
					setIsLoading(false)
				})
		}, 1000)
	}, [])

	const handleBookingCancellation = async (bookingId) => {
		try {
			await cancelBooking(bookingId)
			const data = await getAllBookings()
			setBookingInfo(data)
		} catch (error) {
			setError(error.message)
		}
	}

	return (
		<section style={{ backgroundColor: "whitesmoke" }}>
			{/* <Header title={"Existing Bookings"} /> */}
			{error && <div className="text-danger">{error}</div>}
			{isLoading ? (
				<div className="d-flex justify-content-center my-4">
					<div className="spinner-border text-primary" role="status">
						<span className="visually-hidden">Loading...</span>
					</div>
				</div>
			) : (
				<BookingsTable
					bookingInfo={bookingInfo}
					handleBookingCancellation={handleBookingCancellation}
				/>
			)}
		</section>
	)
}

export default Bookings
