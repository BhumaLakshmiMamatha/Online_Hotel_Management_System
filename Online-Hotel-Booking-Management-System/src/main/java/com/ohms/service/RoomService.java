package com.ohms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ohms.exception.InternalServerException;
import com.ohms.exception.ResourceNotFoundException;
import com.ohms.model.Hotel;
import com.ohms.model.Room;
import com.ohms.repository.HotelRepository;
import com.ohms.repository.RoomRepository;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;

    // Add a new room for a specific hotel
    public Room addNewRoom(String email, MultipartFile file, String roomType, BigDecimal roomPrice) throws SQLException, IOException {
        Hotel hotel = hotelRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + email));

        Room room = new Room();
        room.setRoomType(roomType);
        room.setRoomPrice(roomPrice);
        room.setHotel(hotel); // Associate the room with the hotel

        if (!file.isEmpty()) {
            byte[] photoBytes = file.getBytes();
            Blob photoBlob = new SerialBlob(photoBytes);
            room.setPhoto(photoBlob);
        }

        return roomRepository.save(room);
    }

    // Get all room types for a specific hotel
    public List<String> getAllRoomTypes(Long hotelId) {
        if (!hotelRepository.existsById(hotelId)) {
            throw new ResourceNotFoundException("Hotel not found with ID: " + hotelId);
        }
        return roomRepository.findDistinctRoomTypesByHotelId(hotelId);
    }

    public List<String> getAllRoomTypes() {
        return roomRepository.findDistinctRoomTypes();
    }
    // Get all rooms for a specific hotel
    public List<Room> getAllRooms(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + hotelId));
        return hotel.getRooms(); // Retrieve rooms associated with the hotel
    }
    public List<Room> getAllRooms() {
    	return roomRepository.findAll(); 
    }

    // Get the photo of a specific room in a hotel
    public byte[] getRoomPhotoByRoomId(Long hotelId, Long roomId) throws SQLException {
        Room room = roomRepository.findByIdAndHotelId(roomId, hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found in the specified hotel!"));

        Blob photoBlob = room.getPhoto();
        if (photoBlob != null) {
            return photoBlob.getBytes(1, (int) photoBlob.length());
        }
        return null;
    }
    
    public byte[] getRoomPhotoByRoomId(Long roomId) throws SQLException {
        Optional<Room> theRoom = roomRepository.findById(roomId);
        if(theRoom.isEmpty()){
            throw new ResourceNotFoundException("Sorry, Room not found!");
        }
        Blob photoBlob = theRoom.get().getPhoto();
        if(photoBlob != null){
            return photoBlob.getBytes(1, (int) photoBlob.length());
        }
        return null;
    }
    // Delete a room from a specific hotel
    public void deleteRoom( Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found in the specified hotel!"));

        roomRepository.delete(room);
    }

    // Update a room for a specific hotel
    public Room updateRoom(Long roomId, String roomType, BigDecimal roomPrice, byte[] photoBytes) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found in the specified hotel!"));

        if (roomType != null) room.setRoomType(roomType);
        if (roomPrice != null) room.setRoomPrice(roomPrice);
        if (photoBytes != null && photoBytes.length > 0) {
            try {
                room.setPhoto(new SerialBlob(photoBytes));
            } catch (SQLException ex) {
                throw new InternalServerException("Failed to update room photo");
            }
        }
       
        return roomRepository.save(room);
    }
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    // Get available rooms for a specific hotel
    public List<Room> getAvailableRooms(Long hotelId, LocalDate checkInDate, LocalDate checkOutDate, String roomType) {
        if (!hotelRepository.existsById(hotelId)) {
            throw new ResourceNotFoundException("Hotel not found with ID: " + hotelId);
        }
        return roomRepository.findAvailableRoomsByHotelIdAndDatesAndType(hotelId, checkInDate, checkOutDate, roomType);
    }
    
    public List<Room> getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, String roomType) {
        return roomRepository.findAvailableRoomsByDatesAndType(checkInDate, checkOutDate, roomType);
    }
}
