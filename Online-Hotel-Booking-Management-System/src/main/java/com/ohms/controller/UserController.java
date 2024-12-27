package com.ohms.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ohms.model.PasswordChangeRequest;
import com.ohms.model.User;
import com.ohms.repository.UserRepository;
import com.ohms.service.OTPService;
import com.ohms.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;
	private final UserRepository userRepository;

	@GetMapping("/all")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<User>> getUsers() {

		return new ResponseEntity<>(userService.getUsers(), HttpStatus.FOUND);
	}

	@GetMapping("/{email}")
	@PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
	public ResponseEntity<?> getUserByEmail(@PathVariable("email") String email) {
		try {
			User theUser = userService.getUser(email);
			return ResponseEntity.ok(theUser);
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching user");
		}
	}

	@GetMapping("/disabled")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<User>> getDisabledUsers() {
		List<User> disabledUsers = userService.getDisabledUsers();
		return ResponseEntity.ok(disabledUsers);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PutMapping("updateUser/{email}")
	public ResponseEntity<User> updateUser(@PathVariable("email") String email, @RequestBody User userDetails) {
		try {
			// Validate if the user exists
			User existingUser = userService.getUser(email);
			if (existingUser == null) {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}

			// Update user details
			existingUser.setFirstName(userDetails.getFirstName());
			existingUser.setLastName(userDetails.getLastName());
			existingUser.setEmail(userDetails.getEmail());
			existingUser.setRole(userDetails.getRole());

			// Save updated user
			User updatedUser = userRepository.save(existingUser);

			return new ResponseEntity<>(updatedUser, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

//	change password internal

	@PostMapping("/change-password")
	public ResponseEntity<String> changePassword(@RequestBody PasswordChangeRequest request) {
		userService.changePassword(request.getEmail(), request.getNewPassword());
		return ResponseEntity.ok("Password changed successfully.");
	}

	@PutMapping("/hotelVerification/{email}/{isVerified}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<?> hotelVerification(@PathVariable("email") String email,
			@PathVariable("isVerified") Boolean isVerified) {
		try {
			User theUser = userService.getUser(email);
			theUser.setEnabled(isVerified);
			theUser.setAuthorize(isVerified);
			userRepository.save(theUser);
			return ResponseEntity.ok("Hotel Verified Successfully");
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching user");
		}
	}

	@DeleteMapping("/delete/{userId}")
//	@PreAuthorize("hasRole('ROLE_ADMIN') or (hasRole('ROLE_USER') and #email == principal.username)")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<String> deleteUser(@PathVariable("userId") String email) {
		try {
			userService.deleteUser(email);
			return ResponseEntity.ok("User deleted successfully");
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error deleting user: " + e.getMessage());
		}
	}

	// Endpoint to check a user's authorization status
	@GetMapping("/authorization-status/{email}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<String> getUserAuthorizationStatus(@PathVariable("email") String email) {
		try {
			User user = userService.getUser(email);
			if (!user.getEnabled()) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User is disabled.");
			}
			if (!user.getAuthorize()) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User is not authorized.");
			}
			return ResponseEntity.ok("User is authorized and enabled.");
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error fetching user authorization status.");
		}
	}

	// Endpoint to enable authorization for a user
	@PutMapping("/enable-authorization/{email}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<String> enableAuthorization(@PathVariable("email") String email) {
		try {
			userService.enableAuthorization(email); // Enable authorization
			return ResponseEntity.ok("User authorization enabled.");
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error enabling user authorization.");
		}
	}

	// Endpoint to disable authorization for a user
	@PutMapping("/disable-authorization/{email}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<String> disableAuthorization(@PathVariable("email") String email) {
		try {
			userService.disableAuthorization(email); // Disable authorization
			return ResponseEntity.ok("User authorization disabled.");
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error disabling user authorization.");
		}
	}

	// Endpoint to get users where authorize is false and enabled is true
	@GetMapping("/authorize-disabled")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<User>> getAuthorizeDisabledUsers() {
		try {
			List<User> users = userService.getAuthorizeDisabledUsers();
			return ResponseEntity.ok(users);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
}
