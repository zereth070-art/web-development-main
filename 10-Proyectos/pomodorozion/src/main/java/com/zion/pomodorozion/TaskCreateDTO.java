package com.zion.pomodorozion;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class TaskCreateDTO {

    @NotBlank(message = "El titulo es obligatorio")
    private String title;

   @Min(value = 1, message = "El numero de pomodoros estimados debe ser al menos 1") 
    private int estimatedPomodoros;

    public TaskCreateDTO() {
    }

    public TaskCreateDTO(String title, int estimatedPomodoros) {
        this.title = title;
        this.estimatedPomodoros = estimatedPomodoros;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getEstimatedPomodoros() {
        return estimatedPomodoros;
    }

    public void setEstimatedPomodoros(int estimatedPomodoros) {
        this.estimatedPomodoros = estimatedPomodoros;
    } 
    
}
