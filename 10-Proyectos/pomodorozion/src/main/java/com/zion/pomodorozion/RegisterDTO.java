package com.zion.pomodorozion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterDTO {
    
    @NotBlank
    @Size(min = 6)
    private String username;
    
    @NotBlank
    @Size(min = 6)
    private String password;

    public RegisterDTO(){}

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
