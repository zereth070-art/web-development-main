package com.zion.pomodorozion;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TimerRepository timerRepository;
    private final PomodoroSessionsRepository pomodoroSessionsRepository;
    private final TaskRepository taskRepository;



    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, TimerRepository timerRepository, PomodoroSessionsRepository pomodoroSessionsRepository, TaskRepository taskRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.timerRepository = timerRepository;
        this.pomodoroSessionsRepository = pomodoroSessionsRepository;
        this.taskRepository = taskRepository;
    }

    public UserDTO register(RegisterDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este usuario ya existe");

        }

        String hash = passwordEncoder.encode(dto.getPassword());
        User saved = userRepository.save(new User(dto.getUsername(), hash));

        return new UserDTO(saved.getId(), saved.getUsername());
    }

     public UserDTO changePassword( User user, String oldPassword, String newPassword) {
        user = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Contraseña incorrecta");
        } else {
            String hash = passwordEncoder.encode(newPassword);
            user.setPasswordHash(hash);
            userRepository.save(user);
            return new UserDTO(user.getId(), user.getUsername());
        }
    } 
    
    @Transactional
    public  void deleteAccount(Long userId) {
        // Eliminar tareas del usuario
        taskRepository.deleteByUserId(userId);
        // Eliminar sesiones de pomodoro del usuario
        pomodoroSessionsRepository.deleteByUserId(userId);
        // Eliminar temporizador del usuario
        timerRepository.deleteByUserId(userId);
        // Eliminar usuario
        userRepository.delete(userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado")) );
    }
}
