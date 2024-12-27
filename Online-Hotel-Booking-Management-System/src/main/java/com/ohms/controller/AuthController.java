package com.ohms.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ohms.exception.UserAlreadyExistsException;
import com.ohms.model.PasswordChangeRequest;
import com.ohms.model.User;
import com.ohms.request.LoginRequest;
import com.ohms.response.JwtResponse;
import com.ohms.security.jwt.JwtUtils;
import com.ohms.security.user.HotelUserDetails;
import com.ohms.service.OTPService;
import com.ohms.service.PasswordChangeService;
import com.ohms.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
	private final OTPService otpService;
	
    private PasswordChangeService passwordChangeService;


    @PostMapping("/register-user")
    public ResponseEntity<?> registerUser(@RequestBody User user){
        try{
        	user.setRole("ROLE_USER");
        	user.setEnabled(true);
        	user.setAuthorize(true);
            userService.registerUser(user);
            return ResponseEntity.ok("Registration successful!");

        }catch (UserAlreadyExistsException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
    
    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@RequestBody User user){
    	try{
    		user.setRole("ROLE_ADMIN");
    		user.setEnabled(true);
    	 	user.setAuthorize(true);
    		userService.registerUser(user);
    		return ResponseEntity.ok("Registration successful!");
    		
    	}catch (UserAlreadyExistsException e){
    		return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    	}
    }
    
    @PostMapping("/register-HotelManager")
    public ResponseEntity<?> registerHotel(@RequestBody User user){
    	try{
    		user.setRole("ROLE_MANAGER");
    		user.setEnabled(false);
    	 	user.setAuthorize(false);
    		userService.registerUser(user);
    		return ResponseEntity.ok("Registration successful!");
    		
    	}catch (UserAlreadyExistsException e){
    		return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    	}
    }
    
    

//	  Request otp

    @PostMapping("/request-otp")
    public ResponseEntity<String> requestOTP(@RequestBody PasswordChangeRequest emailRequest) {
        try {
            // Extract email from request body
            String email = emailRequest.getEmail();

            // Check if the user exists
            if (!userService.userExists(email)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            // Request OTP
            String response = otpService.requestOTP(email);
            return ResponseEntity.ok(response);  // Return success response
        } catch (Exception e) {
            // Handle any exceptions that occur during OTP request
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send OTP.");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOTP(@RequestBody Map<String, String> requestBody) {
        // Extract email and otp from the request body
        String email = requestBody.get("email");
        String otp = requestBody.get("otp");

        // Verify OTP (implement the logic in your otpService)
        String result = otpService.verifyOTP(email, otp);

        // Return the appropriate response based on the verification result
        if ("OTP verified successfully.".equals(result)) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }
    
    
    
    
    

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordChangeRequest passwordChangeRequest) {
        try {
            // Verify OTP
            String otpVerification = otpService.verifyOTP(passwordChangeRequest.getEmail(), passwordChangeRequest.getOtp());
            if (!otpVerification.equals("OTP verified successfully.")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(otpVerification);
            }

            // Reset the password
            userService.changePassword(passwordChangeRequest.getEmail(), passwordChangeRequest.getNewPassword());
            return ResponseEntity.ok("Password reset successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to reset password.");
        }
    }

    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request){
        Authentication authentication =
                authenticationManager
                        .authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtTokenForUser(authentication);
        HotelUserDetails userDetails = (HotelUserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority).toList();
        return ResponseEntity.ok(new JwtResponse(
                userDetails.getId(),
                userDetails.getEmail(),
                jwt,
                roles));
    }
}
