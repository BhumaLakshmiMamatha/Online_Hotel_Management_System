package com.ohms.controller;

import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ohms.model.BookedRoom;
import com.ohms.model.Hotel;
import com.ohms.model.Room;
import com.ohms.response.BookingResponse;
import com.ohms.response.HotelResponse;
import com.ohms.response.RoomResponse;
import com.ohms.service.HotelService;

@RestController
@RequestMapping("/hotels")
public class HotelController {

    private final HotelService hotelService;

    @Autowired
    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    // Get all hotels
    @GetMapping("/all")
    public ResponseEntity<List<HotelResponse>> getAllHotels() {
        List<Hotel> hotels = hotelService.getAllHotels();
        List<HotelResponse> responses = hotels.stream()
                .map(this::mapToHotelResponse)
                .collect(Collectors.toList());
        return new ResponseEntity<>(responses, HttpStatus.FOUND);
    }

    // Get a hotel by ID
    @GetMapping("/{id}")
    public ResponseEntity<HotelResponse> getHotelById(@PathVariable Long id) {
        Optional<Hotel> hotelOpt = hotelService.getHotelById(id);

        if (hotelOpt.isPresent()) {
            HotelResponse response = mapToHotelResponse(hotelOpt.get());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/byEmail/{email}")
    public ResponseEntity<HotelResponse> getHotelByEmail(@PathVariable String email) {
    	Optional<Hotel> hotelOpt = hotelService.getHotelByEmail(email);
    
    	if (hotelOpt.isPresent()) {
    		HotelResponse response = mapToHotelResponse(hotelOpt.get());
    		return new ResponseEntity<>(response, HttpStatus.OK);
    	} else {
    		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    	}
    }

    // Create a new hotel
    @PostMapping("/register-hotel")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<HotelResponse> saveHotel(@RequestBody Hotel hotel) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        hotel.setEmail(email);
        Hotel savedHotel = hotelService.saveHotel(hotel);
        HotelResponse response = mapToHotelResponse(savedHotel);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
 // Update a hotel by ID
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<HotelResponse> updateHotel(@PathVariable Long id, @RequestBody Hotel hotel) {
        Optional<Hotel> existingHotelOpt = hotelService.getHotelById(id);

        if (existingHotelOpt.isPresent()) {
            Hotel existingHotel = existingHotelOpt.get();

            existingHotel.setHotelName(hotel.getHotelName());
            existingHotel.setHotelAddress(hotel.getHotelAddress());
            existingHotel.setCity(hotel.getCity());
            existingHotel.setPhoneNumber(hotel.getPhoneNumber());

            // Save the updated hotel
            Hotel updatedHotel = hotelService.saveHotel(existingHotel);
            HotelResponse response = mapToHotelResponseWithoutRooms(updatedHotel);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    // Delete a hotel by ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Add a room to a hotel
    @PostMapping("/{hotelId}/rooms")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<HotelResponse> addRoomToHotel(@PathVariable Long hotelId, @RequestBody Room room) {
        Hotel updatedHotel = hotelService.addRoomToHotel(hotelId, room);
        HotelResponse response = mapToHotelResponse(updatedHotel);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Mapping methods
    private HotelResponse mapToHotelResponse(Hotel hotel) {
        List<RoomResponse> roomResponses = hotel.getRooms() != null
                ? hotel.getRooms().stream()
                        .map(this::mapToRoomResponse)
                        .collect(Collectors.toList())
                : null;

        return new HotelResponse(
                hotel.getId(),
                hotel.getHotelName(),
                hotel.getHotelAddress(),
                hotel.getCity(),
                hotel.getPhoneNumber(),
                hotel.getEmail(),
                roomResponses
        );
    }
    private HotelResponse mapToHotelResponseWithoutRooms(Hotel hotel) {
  
    	return new HotelResponse(
    			hotel.getId(),
    			hotel.getHotelName(),
    			hotel.getHotelAddress(),
    			hotel.getCity(),
    			hotel.getPhoneNumber(),
    			hotel.getEmail()
    			);
    }

    private RoomResponse mapToRoomResponse(Room room) {
        List<BookingResponse> bookingResponses = room.getBookings() != null
                ? room.getBookings().stream()
                        .map(this::mapToBookingResponse)
                        .collect(Collectors.toList())
                : null;

        byte[] photoBytes = null;
        if (room.getPhoto() != null) {
            try (InputStream inputStream = room.getPhoto().getBinaryStream()) {
                photoBytes = inputStream.readAllBytes();
            } catch (IOException | SQLException e) {
                e.printStackTrace(); 
            }
        }
        return new RoomResponse(
                room.getId(),
                room.getRoomType(),
                room.getRoomPrice(),
                room.isBooked(),
                photoBytes,
                bookingResponses,
                room.getHotel().getId(),room.getHotel().getHotelName()
        );
    }

    private BookingResponse mapToBookingResponse(BookedRoom booking) {
        return new BookingResponse(
                booking.getBookingId(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getBookingConfirmationCode()

        );
    }
}
