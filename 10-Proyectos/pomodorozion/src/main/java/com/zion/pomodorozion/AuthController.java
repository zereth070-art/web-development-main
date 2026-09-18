package com.zion.pomodorozion;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    public AuthController(AuthService authService,
                          UserRepository userRepository,
                          AuthenticationManager authenticationManager,
                          SecurityContextRepository securityContextRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
    }


    
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@Valid @RequestBody RegisterDTO dto) {
        UserDTO created = authService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody LoginDTO dto,
                                        HttpServletRequest request,
                                        HttpServletResponse response) {
        
        try {
            Authentication  auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword()));
                
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, request, response);

            User user = userRepository.findByUsername(auth.getName()).orElseThrow();

            return ResponseEntity.ok(new UserDTO(user.getId(), user.getUsername()));

        } catch (BadCredentialsException e  ) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(Authentication authentication) {
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();

        return ResponseEntity.ok(new UserDTO(user.getId(), user.getUsername()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response){
        new SecurityContextLogoutHandler().logout(request, response, null);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/change-password")

    public ResponseEntity<UserDTO> changePassword(@Valid @RequestBody CambiarPasswordDTO dto, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        UserDTO updated = authService.changePassword(user, dto.getCurrentPassword(), dto.getNewPassword());
        return ResponseEntity.ok(updated);

    }

    @DeleteMapping("/account")
    public ResponseEntity<Void> deleteAccount(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        // sin sesion (peticion anonima) no hay cuenta que borrar -> 401,
        // igual que hace /me. Sin esto daba 500 al intentar buscar al anonimo.
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        authService.deleteAccount(user.getId());
        new SecurityContextLogoutHandler().logout(request, response, null); 
        return ResponseEntity.noContent().build();
    }
}

