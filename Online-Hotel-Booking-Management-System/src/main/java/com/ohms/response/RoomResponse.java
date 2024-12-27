package com.ohms.response;


import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;

import java.math.BigDecimal;
import java.util.List;


@Data
@NoArgsConstructor
public class RoomResponse {
    private Long id;
    private String roomType;
    private BigDecimal roomPrice;
    private boolean isBooked;
    private String photo;
    private Long hotelId;
    private String hotelName;
    private List<BookingResponse>bookings;

    public RoomResponse(Long id, String roomType, BigDecimal roomPrice,Long hotelId) {
        this.id = id;
        this.roomType = roomType;
        this.roomPrice = roomPrice;
        this.hotelId=hotelId;

    }
    public RoomResponse(Long id, String roomType, BigDecimal roomPrice, byte[] photoBytes,Long hotelId) {
    	this.id = id;
    	this.roomType = roomType;
    	this.roomPrice = roomPrice;
    	this.hotelId=hotelId;
    	this.photo = photoBytes != null ? Base64.encodeBase64String(photoBytes) : null;
    	
    }

    public RoomResponse(Long id, String roomType, BigDecimal roomPrice, boolean isBooked,
                        byte[] photoBytes , List<BookingResponse> bookings,Long hotelId,String hotelName) {
        this.id = id;
        this.roomType = roomType;
        this.roomPrice = roomPrice;
        this.isBooked = isBooked;
        this.photo = photoBytes != null ? Base64.encodeBase64String(photoBytes) : null;
       this.bookings = bookings;
       this.hotelId=hotelId;
       this.hotelName=hotelName;

    }

}
