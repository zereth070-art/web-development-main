package com.zion.pomodorozion;

import jakarta.validation.constraints.NotBlank;

public class CambiarPasswordDTO {
    @NotBlank
    private String currentPassword;
    @NotBlank
    private String newPassword;

    public CambiarPasswordDTO() {
    }
    
    public String getCurrentPassword() {
        return currentPassword;
    }
    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }
    public String getNewPassword() {
        return newPassword;
    }
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
