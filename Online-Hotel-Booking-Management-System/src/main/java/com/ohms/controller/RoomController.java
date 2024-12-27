package com.ohms.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ohms.exception.PhotoRetrievalException;
import com.ohms.exception.ResourceNotFoundException;
import com.ohms.model.BookedRoom;
import com.ohms.model.Room;
import com.ohms.response.BookingResponse;
import com.ohms.response.RoomResponse;
import com.ohms.service.BookingService;
import com.ohms.service.RoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomController {

	private final RoomService roomService;
	private final BookingService bookingService;

	// Add a new room to a hotel
	@PostMapping("/{email}/add")
	@PreAuthorize("hasRole('ROLE_MANAGER')")
	public ResponseEntity<RoomResponse> addNewRoom(@PathVariable String email,
			@RequestParam("photo") MultipartFile photo, @RequestParam("roomType") String roomType,
			@RequestParam("roomPrice") BigDecimal roomPrice) throws IOException, SQLException {

		Room savedRoom = roomService.addNewRoom(email, photo, roomType, roomPrice);
		RoomResponse response = new RoomResponse(savedRoom.getId(), savedRoom.getRoomType(), savedRoom.getRoomPrice(),
				savedRoom.getHotel().getId());
		return ResponseEntity.ok(response);
	}

	@GetMapping("/room/{id}")
	public ResponseEntity<?> getRoomById(@PathVariable Long id) {
		Optional<Room> theRoom = roomService.getRoomById(id);
		return theRoom.map(room -> {
			RoomResponse roomResponse = mapToRoomResponse(room);
			return ResponseEntity.ok(Optional.of(roomResponse));
		}).orElseThrow(() -> new ResourceNotFoundException("Room not found"));
	}

	// Get all room types for a specific hotel
	@GetMapping("/{hotelId}/types")
	public ResponseEntity<List<String>> getRoomTypes(@PathVariable Long hotelId) {
		List<String> roomTypes = roomService.getAllRoomTypes(hotelId);
		return ResponseEntity.ok(roomTypes);
	}

	@GetMapping("/room/types")
	public ResponseEntity<List<String>> getRoomTypes() {
		List<String> roomTypes = roomService.getAllRoomTypes();
		return ResponseEntity.ok(roomTypes);
	}

	// Get all rooms for a specific hotel
	@GetMapping("/{hotelId}/all-rooms")
	public ResponseEntity<List<RoomResponse>> getAllRooms(@PathVariable Long hotelId) {
		List<Room> rooms = roomService.getAllRooms(hotelId);
		List<RoomResponse> responses = rooms.stream().map(this::mapToRoomResponse).toList();
		return ResponseEntity.ok(responses);
	}
	@GetMapping("/all-rooms")
	public ResponseEntity<List<RoomResponse>> getAllRooms() {
		List<Room> rooms = roomService.getAllRooms();
		List<RoomResponse> responses = rooms.stream().map(this::mapToRoomResponse).toList();
		return ResponseEntity.ok(responses);
	}

	// Get photo of a specific room
	@GetMapping("/{hotelId}/{roomId}/photo")
	public ResponseEntity<byte[]> getRoomPhoto(@PathVariable Long hotelId, @PathVariable Long roomId)
			throws SQLException {
		byte[] photoBytes = roomService.getRoomPhotoByRoomId(hotelId, roomId);
		return photoBytes != null ? ResponseEntity.ok(photoBytes) : ResponseEntity.noContent().build();
	}

	// Delete a room from a hotel
	@DeleteMapping("/delete/{roomId}")
	@PreAuthorize("hasRole('ROLE_MANAGER')")
	public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
		roomService.deleteRoom(roomId);
		return ResponseEntity.noContent().build();
	}

	// Update a room for a specific hotel
	@PutMapping("/update/{roomId}")
	@PreAuthorize("hasRole('ROLE_MANAGER')")
	public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long roomId,
			@RequestParam(required = false) String roomType, @RequestParam(required = false) BigDecimal roomPrice,
			@RequestParam(required = false) MultipartFile photo) throws IOException {

		System.out.println(roomType+""+roomPrice);
		byte[] photoBytes = photo != null && !photo.isEmpty() ? photo.getBytes() : null;
		Room updatedRoom = roomService.updateRoom(roomId, roomType, roomPrice, photoBytes);
		RoomResponse response = mapToRoomResponse(updatedRoom);
		return ResponseEntity.ok(response);
	}

	// Get available rooms for a specific hotel
	@GetMapping("/{hotelId}/available")
	public ResponseEntity<List<RoomResponse>> getAvailableRooms(@PathVariable Long hotelId,
			@RequestParam("checkInDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
			@RequestParam("checkOutDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
			@RequestParam("roomType") String roomType) {

		List<Room> availableRooms = roomService.getAvailableRooms(hotelId, checkInDate, checkOutDate, roomType);
		List<RoomResponse> responses = availableRooms.stream().map(this::mapToRoomResponse).toList();
		return responses.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(responses);
	}

	@GetMapping("/available-rooms")
	public ResponseEntity<List<RoomResponse>> getAvailableRooms(
			@RequestParam("checkInDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
			@RequestParam("checkOutDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
			@RequestParam("roomType") String roomType) throws SQLException {
		List<Room> availableRooms = roomService.getAvailableRooms(checkInDate, checkOutDate, roomType);
		List<RoomResponse> roomResponses = new ArrayList<>();
		for (Room room : availableRooms) {
			byte[] photoBytes = roomService.getRoomPhotoByRoomId(room.getId());
			if (photoBytes != null && photoBytes.length > 0) {
				String photoBase64 = Base64.encodeBase64String(photoBytes);
				RoomResponse roomResponse = mapToRoomResponse(room);
				roomResponse.setPhoto(photoBase64);
				roomResponses.add(roomResponse);
			}
		}
		if (roomResponses.isEmpty()) {
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.ok(roomResponses);
		}
	}

	private RoomResponse mapToRoomResponse(Room room) {
		List<BookedRoom> bookings = getAllBookingsByRoomId(room.getId());
		List<BookingResponse> bookingInfo = bookings.stream().map(booking -> new BookingResponse(booking.getBookingId(),
				booking.getCheckInDate(), booking.getCheckOutDate(), booking.getBookingConfirmationCode())).toList();
		byte[] photoBytes = null;
		Blob photoBlob = room.getPhoto();
		if (photoBlob != null) {
			try {
				photoBytes = photoBlob.getBytes(1, (int) photoBlob.length());
			} catch (SQLException e) {
				throw new PhotoRetrievalException("Error retrieving photo");
			}
		}
		return new RoomResponse(room.getId(), room.getRoomType(), room.getRoomPrice(), room.isBooked(), photoBytes,
				bookingInfo, room.getHotel().getId(), room.getHotel().getHotelName());
	}

	private List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
		return bookingService.getAllBookingsByRoomId(roomId);

	}
}
