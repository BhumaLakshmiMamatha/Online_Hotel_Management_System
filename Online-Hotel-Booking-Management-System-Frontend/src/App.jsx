import React, { useEffect, useState } from "react"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "/node_modules/bootstrap/dist/js/bootstrap.min.js"
import ExistingRooms from "./components/room/ExistingRooms"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/home/Home"
import EditRoom from "./components/room/EditRoom"
import AddRoom from "./components/room/AddRoom"
import NavBar from "./components/layout/NavBar"
import Footer from "./components/layout/Footer"
import RoomListing from "./components/room/RoomListing"
import Admin from "./components/admin/Admin"
import Checkout from "./components/booking/Checkout"
// import BookingSuccess from "./components/booking/BookingSuccess"
import Bookings from "./components/booking/Bookings"
import FindBooking from "./components/booking/FindBooking"
import Login from "./components/auth/Login"
import ForgotPassword from "./components/auth/ForgotPassword.jsx"
import Registration from "./components/auth/Registration"
import Profile from "./components/auth/Profile"
import { AuthProvider } from "./components/auth/AuthProvider"
import RequireAuth from "./components/auth/RequireAuth"
import Room from "./components/room/Room"
import Hotellisting from "./components/room/Hotellisting"
import HotelProfile from "./components/room/HotelProfile"
import AllUsers from "./components/admin/AllUsers"
import UserAuthorization from "./components/admin/UserAuthorization"
import AllBookings from "./components/admin/AllBookings"
import AllRooms from "./components/admin/AllRooms.jsx"

function App() {

	const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const role = localStorage.getItem('userRole'); 
        setUserRole(role); 
    }, []);
	return (
		<AuthProvider>
			<main>
				<Router>
					<NavBar />
					<Routes>
						{/* <Route path="/" element={<Home />} />
						<Route path="/" element={<AllUsers />} /> */}
						<Route path="/" element={userRole === 'ROLE_ADMIN' ? <AllUsers /> : <Home />} />
						<Route path="/edit-room/:roomId" element={<EditRoom />} />
						<Route path="/existing-rooms" element={<ExistingRooms />} />
						<Route path="/hotel-profile" element={<HotelProfile />} />
						<Route path="/add-room" element={<AddRoom />} />

						<Route
							path="/book-room/:roomId/:hotelId"
							element={
								<RequireAuth>
									<Checkout />
								</RequireAuth>
							}
						/>
						{/* <Route path="/browse-all-rooms/" element={<RoomListing />} /> */}
						<Route path="/browse-all-rooms/" element={<Hotellisting />} />
						<Route path="/hotel/:hotelId/rooms" element={<RoomListing />} />
					

						<Route path="/admin" element={<Admin />} />
						{/* <Route path="/booking-success" element={<BookingSuccess />} /> */}
						<Route path="/existing-bookings" element={<Bookings />} />
						<Route path="/user-authorization" element={<UserAuthorization />} />
						<Route path="/all-rooms" element={<AllRooms />} />
						<Route path="/all-bookings" element={<AllBookings />} />
						<Route path="/find-booking" element={<FindBooking />} />

						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Registration />} />
						<Route path="/forgot-password" element={<ForgotPassword />} />


						<Route path="/profile" element={<Profile />} />
						<Route path="/logout" element={<FindBooking />} />


					
					
					</Routes>
				</Router>
				{/* <Footer /> */}
			</main>
		</AuthProvider>
	)
}

export default App
