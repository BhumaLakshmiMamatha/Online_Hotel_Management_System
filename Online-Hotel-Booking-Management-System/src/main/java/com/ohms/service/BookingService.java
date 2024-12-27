package com.ohms.service;

import java.util.List;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.ohms.exception.InvalidBookingRequestException;
import com.ohms.exception.ResourceNotFoundException;
import com.ohms.model.BookedRoom;
import com.ohms.model.Room;
import com.ohms.repository.BookingRepository;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

	private final BookingRepository bookingRepository;
	private final RoomService roomService;
	private final JavaMailSender mailSender;

	public List<BookedRoom> getAllBookings() {
		return bookingRepository.findAll();
	}

	public List<BookedRoom> getAllBookingsByHotelId(Long hotelId) {
		return bookingRepository.findAllByHotelId(hotelId);
	}

	public List<BookedRoom> getBookingsByUserEmail(String email) {
		return bookingRepository.findByGuestEmail(email);
	}

	public void cancelBooking(Long bookingId) {
		bookingRepository.deleteById(bookingId);
	}

	public List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
		return bookingRepository.findByRoomId(roomId);
	}

	public String saveBooking(Long roomId, BookedRoom bookingRequest) {
		if (bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())) {
			throw new InvalidBookingRequestException("Check-in date must come before check-out date");
		}

		Room room = roomService.getRoomById(roomId)
				.orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));

		List<BookedRoom> existingBookings = room.getBookings();
		boolean roomIsAvailable = roomIsAvailable(bookingRequest, existingBookings);

		if (roomIsAvailable) {
			room.addBooking(bookingRequest);
			bookingRepository.save(bookingRequest);

			// Send confirmation email with styles
			sendConfirmationEmailWithStyles(bookingRequest, roomId);

			return bookingRequest.getBookingConfirmationCode();
		} else {
			throw new InvalidBookingRequestException("Sorry, this room is not available for the selected dates.");
		}
	}

	public BookedRoom findByBookingConfirmationCode(String confirmationCode) {
		return bookingRepository.findByBookingConfirmationCode(confirmationCode).orElseThrow(
				() -> new ResourceNotFoundException("No booking found with booking code: " + confirmationCode));
	}

	private boolean roomIsAvailable(BookedRoom bookingRequest, List<BookedRoom> existingBookings) {
		return existingBookings.stream()
				.noneMatch(existingBooking -> bookingRequest.getCheckInDate().equals(existingBooking.getCheckInDate())
						|| bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckOutDate())
						|| (bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckInDate())
								&& bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()))
						|| (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())
								&& bookingRequest.getCheckOutDate().equals(existingBooking.getCheckOutDate()))
						|| (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())
								&& bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckOutDate()))
						|| (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
								&& bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate()))
						|| (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
								&& bookingRequest.getCheckOutDate().equals(bookingRequest.getCheckInDate())));
	}

	private void sendConfirmationEmailWithStyles(BookedRoom bookingRequest, Long roomId) {
		try {
			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

			String subject = "Booking Confirmation - " + bookingRequest.getBookingConfirmationCode();
			String body = "<html>"
					+ "<body style='font-family: Arial, sans-serif; line-height: 1.6; background-color: #ffffff; padding: 20px;'>"
					+ "<div style='max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); overflow: hidden;'>"
					+ "  <div style='background-color: #f5f5f5; color: #ffffff; padding: 15px; text-align: center;'>"
					+ "    <h1 style='margin: 0; font-size: 2em; color: #0d6efd;'>BOOK IT</h1>"
					+ "    <p style='margin: 0; font-size: 1.1em; color: #555;'>Your Trusted Booking Partner</p>"
					+ "  </div>" + "  <div style='padding: 20px;'>" + "    <p>Dear <strong>"
					+ bookingRequest.getGuestFullName() + "</strong>,</p>"
					+ "    <p>Your booking has been successfully confirmed. Below are your booking details:</p>" +

					"    <p style='font-size: 1.1em; color: #0d6efd;'>"
					+ "        Booking Code: <span style='color: #e74c3c;'>"
					+ bookingRequest.getBookingConfirmationCode() + "</span>" + "    </p>" +

					"    <table style='border-collapse: collapse; width: 100%; margin: 15px 0; border: 1px solid #ddd;'>"
					+ "      <tr>"
					+ "        <th style='text-align: left; padding: 10px; background-color: #f1f1f1; color: #333;'>Name</th>"
					+ "        <td style='padding: 10px; border: 1px solid #ddd;'>" + bookingRequest.getGuestFullName()
					+ "</td>" + "      </tr>" + "      <tr>"
					+ "        <th style='text-align: left; padding: 10px; background-color: #f1f1f1; color: #333;'>Adults</th>"
					+ "        <td style='padding: 10px; border: 1px solid #ddd;'>" + bookingRequest.getNumOfAdults()
					+ "</td>" + "      </tr>" + "      <tr>"
					+ "        <th style='text-align: left; padding: 10px; background-color: #f1f1f1; color: #333;'>Children</th>"
					+ "        <td style='padding: 10px; border: 1px solid #ddd;'>" + bookingRequest.getNumOfChildren()
					+ "</td>" + "      </tr>" + "      <tr>"
					+ "        <th style='text-align: left; padding: 10px; background-color: #f1f1f1; color: #333;'>Check-in Date</th>"
					+ "        <td style='padding: 10px; border: 1px solid #ddd;'>" + bookingRequest.getCheckInDate()
					+ "</td>" + "      </tr>" + "      <tr>"
					+ "        <th style='text-align: left; padding: 10px; background-color: #f1f1f1; color: #333;'>Check-out Date</th>"
					+ "        <td style='padding: 10px; border: 1px solid #ddd;'>" + bookingRequest.getCheckOutDate()
					+ "</td>" + "      </tr>" + "    </table>"
					+ "    <p style='margin-bottom: 0;'>Thank you for choosing <span style='color: #0d6efd;'>BOOK IT</span>. We look forward to hosting you!</p>"
					+ "  </div>"
					+ "  <div style='background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 0.9em; color: #555;'>"
					+ "    <p>If you have any questions, feel free to contact our support team at <a href='mailto:support@bookit.com' style='color: #0d6efd; text-decoration: none;'>support@bookit.com</a>.</p>"
					+ "  </div>" + "</div>" + "</body>" + "</html>";

			helper.setTo(bookingRequest.getGuestEmail());
			helper.setSubject(subject);
			helper.setText(body, true); // Enable HTML content
			helper.setFrom("your-email@gmail.com");

			mailSender.send(mimeMessage);
			log.info("Styled confirmation email sent to: {}", bookingRequest.getGuestEmail());
		} catch (Exception e) {
			log.error("Failed to send styled confirmation email to: {}", bookingRequest.getGuestEmail(), e);
		}
	}
}