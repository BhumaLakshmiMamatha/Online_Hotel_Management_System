package com.ohms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ohms.model.BookedRoom;



public interface BookingRepository extends JpaRepository<BookedRoom, Long> {

    List<BookedRoom> findByRoomId(Long roomId);

 Optional<BookedRoom> findByBookingConfirmationCode(String confirmationCode);

    List<BookedRoom> findByGuestEmail(String email);
    
    @Query("SELECT b FROM BookedRoom b WHERE b.hotelId = :hotelId")
    List<BookedRoom> findAllByHotelId(@Param("hotelId") Long hotelId);
}
