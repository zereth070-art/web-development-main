package com.zion.pomodorozion;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HomeController {
    
 @GetMapping("/health")
public Map<String, Object> health() {
    return Map.of(
        "status", "UP",
        "app", "PomodoroZion",
        "version", "1.0"
    );
} 
}
