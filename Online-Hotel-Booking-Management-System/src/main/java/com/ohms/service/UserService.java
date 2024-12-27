package com.ohms.service;

import java.util.List;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ohms.exception.UserAlreadyExistsException;
import com.ohms.model.User;
import com.ohms.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException("User with email " + user.getEmail() + " already exists.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteUser(String email) {
        User user = getUser(email); // Ensure user exists
        userRepository.deleteByEmail(email);
    }


    public User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

 
    public List<User> getDisabledUsers() {
        return userRepository.findByEnabledFalse();
    }

    // Enable authorization for a user
    public void enableAuthorization(String email) {
        User user = getUser(email);
        user.setAuthorize(true);
        userRepository.save(user); // Save changes to the user
    }

    // Disable authorization for a user
    public void disableAuthorization(String email) {
        User user = getUser(email);
        user.setAuthorize(false);
        userRepository.save(user); // Save changes to the user
    }
    
    public List<User> getAuthorizeDisabledUsers() {
        return userRepository.findByAuthorizeFalseAndEnabledTrue();
    }
    @Transactional
    public void changePassword(String email, String newPassword) {
        User user = getUser(email); // Ensure user exists

        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user); // Save the updated password
    }


    
    public boolean userExists(String email) {
        return userRepository.existsByEmail(email);
    }

}
