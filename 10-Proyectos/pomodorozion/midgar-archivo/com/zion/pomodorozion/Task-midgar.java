package com.zion.pomodorozion;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;


@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    private int estimatedPomodoros;

    private int completedPomodoros;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Task() {
    }
    

    public Task(String title, int estimatedPomodoros) {
        this.title = title;
        this.estimatedPomodoros = estimatedPomodoros;
        this.completedPomodoros = 0;
        this.status = TaskStatus.PENDING;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
     }

     @PreUpdate
     protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
     }


    public int getEstimatedPomodoros() {
        return estimatedPomodoros;
    }

     public void setEstimatedPomodoros(int estimatedPomodoros) {
         this.estimatedPomodoros = estimatedPomodoros;
     }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }


    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getCompletedPomodoros() {
        return completedPomodoros;
    }

    public void setCompletedPomodoros(int completedPomodoros) {
        this.completedPomodoros = completedPomodoros;
    }


    public TaskStatus getStatus() {
        return status;
    }


    public void setStatus(TaskStatus status) {
        this.status = status;
    }


}