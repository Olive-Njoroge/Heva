package com.creditdecision.creditdecisionapplication.repository;

import com.creditdecision.creditdecisionapplication.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    @Query("SELECT u FROM User u WHERE LOWER(TRIM(u.email)) = LOWER(TRIM(:email))")
    User findByEmailIgnoreCaseAndTrim(@Param("email") String email);
    
    // Keep the original method for backward compatibility
    User findByEmail(String email);
}
