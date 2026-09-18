package com.zion.pomodorozion;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
        private final UserRepository userRepository;

        public CustomUserDetailsService(UserRepository userRepository) {
            this.userRepository = userRepository;
        }
        
        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("no existe" + username));

            return org.springframework.security.core.userdetails.User.builder()
            .username(user.getUsername())
            .password(user.getPasswordHash())
            .build();
        }
}
