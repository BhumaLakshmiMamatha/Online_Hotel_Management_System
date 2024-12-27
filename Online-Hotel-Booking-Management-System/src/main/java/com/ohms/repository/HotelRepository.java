package com.ohms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ohms.model.Hotel;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
//	@Query("SELECT h FROM Hotel h WHERE h.email = :email")
	Optional<Hotel> findByEmail(String email);
}
