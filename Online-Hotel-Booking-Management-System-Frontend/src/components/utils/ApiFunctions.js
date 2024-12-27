import axios from "axios"
import { useNavigate } from "react-router-dom"

export const api = axios.create({
	baseURL: "http://localhost:9192"
})

export const getHeader = () => {
	const token = localStorage.getItem("token")
	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json"
	}
}

/* This function adds a new room room to the database */
export async function addRoom(photo, roomType, roomPrice) {
	const formData = new FormData()
	formData.append("photo", photo)
	formData.append("roomType", roomType)
	formData.append("roomPrice", roomPrice)
	const userId=localStorage.getItem("userId");
	const token=localStorage.getItem("token")
	const response = await api.post(`/rooms/${userId}/add`, formData,{
		headers:{Authorization: `Bearer ${token}`,
		"Content-Type": "multipart/form-data"}
	
	})
	if (response.status === 201) {
		return true
	} else {
		return false
	}
}

/* This function gets all room types from thee database */
export async function getRoomTypes() {
	try {
		const response = await api.get("/rooms/room/types")
		return response.data
	} catch (error) {
		throw new Error("Error fetching room types")
	}
}
/* This function gets all rooms from the database */
export async function getAllRooms() {
	try {
		const result = await api.get("/rooms/all-rooms")
		return result.data
	} catch (error) {
		throw new Error("Error fetching rooms")
	}
}

/* This function deletes a room by the Id */
export async function deleteRoom(roomId) {
	try {
		const result = await api.delete(`/rooms/delete/${roomId}`, {
			headers: getHeader()
		})
		return result.data
	} catch (error) {
		throw new Error(`Error deleting room ${error.message}`)
	}
}
/* This function update a room */
export async function updateRoom(roomId, roomData) {
	const formData = new FormData()
	console.log( roomData.roomType)
	const token = localStorage.getItem("token")

	formData.append("roomType", roomData.roomType)
	formData.append("roomPrice", roomData.roomPrice)
	formData.append("photo", roomData.photo)
	const response = await api.put(`/rooms/update/${roomId}`, formData,{
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "multipart/form-data"
			
		},

		
	})
	return response
}

/* This funcction gets a room by the id */
export async function getRoomById(roomId) {
	try {
		const result = await api.get(`/rooms/room/${roomId}`)
		return result.data
	} catch (error) {
		throw new Error(`Error fetching room ${error.message}`)
	}
}

/* This function saves a new booking to the databse */
export async function bookRoom(roomId, booking) {
	try {
		const response = await api.post(`/bookings/room/${roomId}/booking`, booking)
		console.log(response.data)
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error booking room : ${error.message}`)
		}
	}
}

/* This function gets alll bokings from the database */
export async function getAllBookings() {
	try {
		const result = await api.get("/bookings/all-bookings", {
			headers: getHeader()
		})
		return result.data
	} catch (error) {
		throw new Error(`Error fetching bookings : ${error.message}`)
	}
}
export async function getAllBookingsByHotelId(hotelId) {
	try {
		
		const result = await api.get(`/bookings/by-hotel/${hotelId}`, {
			headers: getHeader()
		})
		return result.data
	} catch (error) {
		throw new Error(`Error fetching bookings : ${error.message}`)
	}
}

/* This function get booking by the cnfirmation code */
export async function getBookingByConfirmationCode(confirmationCode) {
	try {
	  const result = await api.get(`/bookings/confirmation/${confirmationCode}`);
	  console.log("Booking details:", result.data); // Added logging for response data
	  return result.data;
	} catch (error) {
	  if (error.response && error.response.data) {
		console.error("API Error Response:", error.response.data); // Log API error response
		throw new Error(error.response.data);
	  } else {
		console.error("Error during API call:", error.message); // Log generic error message
		throw new Error(`Error finding booking: ${error.message}`);
	  }
	}
  }
  

/* This is the function to cancel user booking */
export async function cancelBooking(bookingId) {
	try {
		const result = await api.delete(`/bookings/booking/${bookingId}/delete`)
		return result.data
	} catch (error) {
		throw new Error(`Error cancelling booking :${error.message}`)
	}
}

/* This function gets all availavle rooms from the database with a given date and a room type */
export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
	const result = await api.get(
		`rooms/available-rooms?checkInDate=${checkInDate}
		&checkOutDate=${checkOutDate}&roomType=${roomType}`
	)
	return result
}

/* This function register a new user */
export async function registerUser(registration) {
	try {
		const response = await api.post("/auth/register-user", registration)
		return response.data
	} catch (error) {
		if (error.reeponse && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`User registration error : ${error.message}`)
		}
	}
}
export async function registerManager(registration) {
	try {
		const response = await api.post("/auth/register-HotelManager", registration)
		return response.data
	} catch (error) {
		if (error.reeponse && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`User registration error : ${error.message}`)
		}
	}
}

/* This function login a registered user */
export async function loginUser(login) {
	try {
		const response = await api.post("/auth/login", login)
		if (response.status >= 200 && response.status < 300) {
			return response.data
		} else {
			return null
		}
	} catch (error) {
		console.error(error)
		return null
	}
}

/*  This is function to get the user profile */
export async function getUserProfile(userId, token) {
	try {
		const response = await api.get(`users/profile/${userId}`, {
			headers: getHeader()
		})
		console.log(response.data)
		return response.data
	} catch (error) {
		throw error
	}
}

/* This isthe function to delete a user */
export async function deleteUser(userId) {
	try {
		const response = await api.delete(`/users/delete/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		return error.message
	}
}

/* This is the function to get a single user */
export async function getUser(userId, token) {
	try {
		const response = await api.get(`/users/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}

/* This is the function to get user bookings by the user id */
export async function getBookingsByUserId(userId, token) {
	try {
		const response = await api.get(`/bookings/user/${userId}/bookings`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		console.error("Error fetching bookings:", error.message)
		throw new Error("Failed to fetch bookings")
	}
}
// utils/ApiFunctions.js

// utils/ApiFunctions.js

export const getAllHotels = async () => {
	try {
		const response = await fetch('http://localhost:9192/hotels/all') // Replace with your actual API endpoint
		// if (!response.ok) {
		// 	throw new Error('Failed to fetch hotels')
		// }
		const data = await response.json()
		return data
	} catch (error) {
		console.error(error)
		throw error
	}
}

// Function to fetch rooms of a specific hotel
export const getRoomsByHotelId = async (hotelId) => {
	try {

		// console.log("Making API call with hotelId:", hotelId);
		
		const response = await fetch(`http://localhost:9192/rooms/${hotelId}/all-rooms`)
		// if (!response.ok) {
		// 	throw new Error('Failed to fetch rooms')
		// }
		const data = await response.json()
		
		return data
	} catch (error) {
		console.error(error)
		throw error
	}
}
export const getHotelByEmail = async (email) => {
	try {

		// console.log("Making API call with hotelId:", hotelId);
		
		const response = await fetch(`http://localhost:9192/hotels/byEmail/${email}`)
		// if (!response.ok) {
		// 	throw new Error('Failed to fetch rooms')
		// }
		const data = await response.json()
		
		return data
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const getHotelById = async (hotelId) => {
    try {
        const response = await api.get(`/hotels/${hotelId}`);
		
        return response.data;
    } catch (error) {
        throw new Error("Error fetching hotel details: " + error.message);
    }
};

// Function to update hotel details by hotel ID
export const updateHotelDetails = async (hotelId, hotelData) => {
    try {
        const response = await api.put(`/hotels/update/${hotelId}`, hotelData, {
			headers: getHeader()
		});
        return response.data;
    } catch (error) {
        throw new Error("Error updating hotel details: " + error.message);
    }
};

export const addHotel = async (hotelInfo) => {
    try {
        const response = await api.post(`/hotels/register-hotel`,hotelInfo, {
			headers: getHeader()
		});
        return response.data; // Return the response data (e.g., hotel object with ID)
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

export const getAllUsers = async () => {
	try {
	  const response = await api.get(`/users/all`, {
		headers: getHeader(),
		validateStatus: (status) => status < 400 || status === 302, // Allow 302 as valid
	  });
  
	  return response.data; 
	} catch (error) {
	  console.error("Error fetching users:", error.response || error);
	  throw new Error(
		error.response?.data?.message || "Error fetching users"
	  );
	}
  };
  export const updateUser = async (email, userDetails) => {
	const API_URL = `http://localhost:9192/users/updateUser/${email}`; // Adjust URL as needed
	
	const token = localStorage.getItem("token"); // Retrieve the token from localStorage or another secure location
  
	try {
	  const response = await axios.put(API_URL, userDetails, {
		headers: {
		  Authorization: `Bearer ${token}`, // Include token in the Authorization header
		  "Content-Type": "application/json", // Ensure the request is sent as JSON
		},
	  });
	  return response.data; // Returning the updated user object from the response
	} catch (error) {
	  throw new Error(
		error.response?.data?.message || "Error updating user details"
	  );
	}
  };

  export const getDisabledUsers = async () => {
	try {
	  const response = await api.get(`/users/disabled`, {
		headers: getHeader()
	  });
	  return response.data;
	} catch (error) {
	  console.error("Error fetching disabled users:", error);
	  throw error; // Propagate the error for handling by the caller
	}
  };

  export const enableUser = async (email, isVerified) => {
	try {
	  const response = await api.put(
		`/users/hotelVerification/${email}/${isVerified}`, 
		{}, 
		{
		  headers: getHeader(), 
		}
	  );
	  return response.data; 
	} catch (error) {
	  console.error(`Error enabling user with email ${email}:`, error);
	  throw error;
	}
  };


  export const disableAuthorization = async (email) => {
	try {
	  const response = await api.put(
		`/users/disable-authorization/${email}`, 
		{}, 
		{
		  headers: getHeader(), 
		}
	  );
	  return response.data; 
	} catch (error) {
	  console.error(`Error enabling user with email ${email}:`, error);
	  throw error;
	}
  };

  export const auth = async (email) => {
	try {
	  const response = await api.put(
		`/users/authorize-disabled/${email}`, 
		{}, 
		{
		  headers: getHeader(), 
		}
	  );
	  return response.data; 
	} catch (error) {
	  console.error(`Error enabling user with email ${email}:`, error);
	  throw error;
	}
  };