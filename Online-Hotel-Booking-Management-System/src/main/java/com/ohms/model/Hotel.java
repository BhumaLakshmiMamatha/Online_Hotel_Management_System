package com.ohms.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Hotel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String hotelName;
	private String hotelAddress;
	private String city;
	private Long phoneNumber;
	@Column(unique=true,nullable=false)
	private String email;

	
	@OneToMany(mappedBy = "hotel", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Room> rooms;

	public void addRoom(Room room) {

		if (rooms == null) {
			rooms = new ArrayList<>();
		}
		room.setHotel(this);
		rooms.add(room);
		
		
	}
	public String getEmail() {
        return email;
    }

}
