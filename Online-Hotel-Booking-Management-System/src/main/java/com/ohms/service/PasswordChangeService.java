package com.ohms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ohms.model.PasswordChangeRequest;

@Service
public class PasswordChangeService {

    @Autowired
    private OTPService otpService;  // Dependency on OTPService

    @Autowired
    private PasswordEncoder passwordEncoder;  // Dependency for encoding password

    // Method to change password after OTP verification
    public String changePasswordAfterOTP(String email, String otp, String newPassword) {
        // Verify OTP
        String otpVerificationResponse = otpService.verifyOTP(email, otp);
        if (!otpVerificationResponse.equals("OTP verified successfully.")) {
            return otpVerificationResponse; // Return if OTP verification fails
        }

        // Validate new password (basic length check here, add more checks as required)
        if (newPassword.length() < 8) {
            return "Password must be at least 8 characters long.";
        }

        // Here, we can update the user's password in the database (assuming user exists).
        // For simplicity, we're just returning a success message.
        // You would replace this with actual user repository logic.

        // Encode new password
        String encodedPassword = passwordEncoder.encode(newPassword);

        // Logic to update user password in the database goes here
        // For example: userRepository.updatePassword(email, encodedPassword);

        return "Password successfully changed.";
    }
}
