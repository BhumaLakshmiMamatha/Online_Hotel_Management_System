package com.ohms.service;

import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.ohms.model.User;
import com.ohms.repository.UserRepository;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class OTPService {

	@Autowired
	private JavaMailSender mailSender;
	@Autowired
	private UserRepository userRepository;

	private static final int OTP_EXPIRATION_TIME_IN_MINUTES = 5;

	// Thread-safe storage for OTPs and metadata
	private final Map<String, OTPDetails> otpStore = new ConcurrentHashMap<>();

	// Generate a random 6-digit OTP
	public String generateOTP() {
		Random random = new Random();
		int otp = random.nextInt(999999); // Generates a random 6-digit OTP
		return String.format("%06d", otp); // Format to 6 digits
	}

	// Send OTP via email
	public void sendOTPToEmail(String email, String otp) {
		try {
			// Fetch user details from the database
			Optional<User> userOpt = userRepository.findByEmail(email);
			if (!userOpt.isPresent()) {
				log.error("User not found for email: {}", email);
				return;
			}

			User user = userOpt.get(); // Get the user object
			String firstName = user.getFirstName(); // Retrieve the first name

			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

			String subject = "Password Reset OTP";
			String body = "<html>"
					+ "<body style='font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;'>"
					+ "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 2px solid #ddd; border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;'>"
					+ "  <div style='background-color: #f5f5f5; color: #ffffff; padding: 20px; text-align: center;'>"
					+ "    <h1 style='margin: 0; font-size: 2.2em; color: #0d6efd;'>BOOK IT</h1>"
					+ "    <p style='margin: 0; font-size: 1.2em; color: #555;'>Password Reset OTP Request</p>"
					+ "  </div>" + "  <div style='padding: 30px;'>" + "    <p>Dear <strong>" + firstName
					+ "</strong>,</p>"
					+ "    <p>Your OTP for resetting your password is: <strong style='color: #e74c3c;'>" + otp
					+ "</strong></p>" + "    <p>This OTP is valid for <strong>" + OTP_EXPIRATION_TIME_IN_MINUTES
					+ " minutes</strong>.</p>" + "    <p>If you did not request this, please ignore this email.</p>"
					+ "    <p style='margin-top: 20px;'>Regards,<br><strong style='color: #0d6efd;font-size: 1em;'>BOOK IT</strong></p>"
					+ "  </div>"
					+ "  <div style='background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 0.9em; color: #555;'>"
					+ "    <p>If you have any questions, feel free to contact our support team at <a href='mailto:support@bookit.com' style='color: #0d6efd; text-decoration: none;'>support@bookit.com</a>.</p>"
					+ "  </div>" + "</div>" + "</body>" + "</html>";

			helper.setTo(email);
			helper.setSubject(subject);
			helper.setText(body, true); // Enable HTML content
			helper.setFrom("your-email@gmail.com");

			mailSender.send(mimeMessage);
			log.info("OTP sent to email: {}", email);
		} catch (Exception e) {
			log.error("Failed to send OTP to email: {}", email, e);
		}
	}

	// Request an OTP for a specific email
	public String requestOTP(String email) {
		if (otpStore.containsKey(email)) {
			return "An OTP has already been generated for this email.";
		}
		String otp = generateOTP();
		otpStore.put(email, new OTPDetails(otp, System.currentTimeMillis()));
		sendOTPToEmail(email, otp);
		return "OTP sent to email.";
	}

	// Verify OTP entered by the user
	public String verifyOTP(String email, String otp) {
		OTPDetails otpDetails = otpStore.get(email);
		if (otpDetails == null) {
			return "No OTP generated for this email.";
		}

		// Check if OTP is expired
		long timeElapsed = System.currentTimeMillis() - otpDetails.getGeneratedTime();
		if (timeElapsed > TimeUnit.MINUTES.toMillis(OTP_EXPIRATION_TIME_IN_MINUTES)) {
			otpStore.remove(email); // Clean up expired OTP
			return "OTP has expired.";
		}

		// Validate OTP
		if (otpDetails.getOtp().equals(otp)) {
			otpStore.remove(email); // Remove OTP after successful verification
			log.info("OTP verified successfully for email: {}", email);
			return "OTP verified successfully.";
		} else {
			log.warn("Invalid OTP entered for email: {}", email);
			return "Invalid OTP.";
		}
	}

	// Inner class to store OTP details
	private static class OTPDetails {
		private final String otp;
		private final long generatedTime;

		public OTPDetails(String otp, long generatedTime) {
			this.otp = otp;
			this.generatedTime = generatedTime;
		}

		public String getOtp() {
			return otp;
		}

		public long getGeneratedTime() {
			return generatedTime;
		}
	}
}
