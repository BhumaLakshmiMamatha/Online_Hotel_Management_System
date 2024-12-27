package com.ohms.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ohms.model.Hotel;
import com.ohms.model.Room;
import com.ohms.repository.HotelRepository;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;

    @Autowired
    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    // Create or Update a hotel
    public Hotel saveHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    // Get all hotels
	public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    // Get a hotel by its ID
    public Optional<Hotel> getHotelById(Long id) {
        return hotelRepository.findById(id);
    }
    public Optional<Hotel> getHotelByEmail(String email) {
        return hotelRepository.findByEmail(email);
    }
    // Delete a hotel by its ID
    public void deleteHotel(Long id) {
        hotelRepository.deleteById(id);
    }

    // Add a room to a hotel
    public Hotel addRoomToHotel(Long hotelId, Room room) {
        Optional<Hotel> hotelOpt = hotelRepository.findById(hotelId);
        if (hotelOpt.isPresent()) {
            Hotel hotel = hotelOpt.get();
            hotel.addRoom(room);
            hotelRepository.save(hotel);  // Save the updated hotel with the new room
            return hotel;
        }
        return null; // Return null if hotel not found
    }
}
