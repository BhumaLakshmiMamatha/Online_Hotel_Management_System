package com.ohms.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class HotelResponse {
    private Long id;
    private String hotelName;
    private String hotelAddress;
    private String city;
    private Long phoneNumber;
    private String email;
    private List<RoomResponse> rooms;

    // Constructor without rooms
    public HotelResponse(Long id, String hotelName, String hotelAddress, String city,
                         Long phoneNumber, String email) {
        this.id = id;
        this.hotelName = hotelName;
        this.hotelAddress = hotelAddress;
        this.city = city;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }

    // Constructor with rooms
    public HotelResponse(Long id, String hotelName, String hotelAddress, String city,
                         Long phoneNumber, String email, List<RoomResponse> rooms) {
        this.id = id;
        this.hotelName = hotelName;
        this.hotelAddress = hotelAddress;
        this.city = city;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.rooms = rooms;
    }
}
