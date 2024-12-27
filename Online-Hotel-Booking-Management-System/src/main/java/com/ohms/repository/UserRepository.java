package com.ohms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ohms.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	boolean existsByEmail(String email);

	
	void deleteByEmail(String email);

	Optional<User> findByEmail(String email);

	List<User> findByEnabledFalse();
	List<User> findByAuthorizeFalse();
    List<User> findByAuthorizeFalseAndEnabledTrue();
	

	}
