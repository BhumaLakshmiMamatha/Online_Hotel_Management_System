import React, { useContext, useEffect, useState } from "react"
import MainHeader from "../layout/MainHeader"
import HotelService from "../common/HotelService.jsx"
import Parallax from "../common/Parallax.jsx"
import RoomCarousel from "../common/RoomCarousel.jsx"
import RoomSearch from "../common/RoomSearch.jsx"
import { useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"
import HotelCarousel from "../common/HotelCarousel.jsx"
import Footer from '../layout/Footer.jsx'

const Home = () => {
	const location = useLocation()
	const [message, setMessage] = useState(location.state?.message || ""); // Initialize with location.state.message if present4

	const [showUserMessage, setShowUserMessage] = useState(true)
	const currentUser = localStorage.getItem("userId")


	useEffect(() => {
		if (message) {
			const timer = setTimeout(() => {
				setMessage(""); // Clear the message after 4 seconds
			}, 4000);

			return () => clearTimeout(timer); // Cleanup the timer on component unmount
		}
	}, [message]);


	useEffect(() => {
		if (currentUser) {
			const timeout = setTimeout(() => setShowUserMessage(false), 4000)
			return () => clearTimeout(timeout)
		}
	}, [currentUser])
	return (
		<section>
			{/* {message && <p className="text-warning px-5">{message}</p>}
			{currentUser && showUserMessage && (
				<h6 className="text-success text-center">
					You are logged-In as {currentUser}
				</h6>
			)} */}
			<MainHeader />
			<div className="container">
				<RoomSearch />
				<HotelCarousel />
				{/* <Parallax /> */}
				{/* <HotelCarousel /> */}
				<HotelService />
				{/* <Parallax /> */}
				{/* <HotelCarousel /> */}
			</div>
			{/* <Footer /> */}
		</section>
	)
}

export default Home
