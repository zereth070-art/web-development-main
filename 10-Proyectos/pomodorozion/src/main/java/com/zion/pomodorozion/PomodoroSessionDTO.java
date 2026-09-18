package com.zion.pomodorozion;

import java.time.Instant;

public class PomodoroSessionDTO {
    private Long id;
    private TimerPhase phase;
    private Long taskId;
    private String taskTitle;
    private long durationSeconds;
    private Instant completedAt;
    
    public PomodoroSessionDTO() {
    }

    public PomodoroSessionDTO(Long id, TimerPhase phase, Long taskId, String taskTitle, long durationSeconds, Instant completedAt) {
        this.id = id;
        this.phase = phase;
        this.taskId = taskId;
        this.taskTitle = taskTitle;
        this.durationSeconds = durationSeconds;
        this.completedAt = completedAt;
    }

    public Long getId() {
        return id;
    }

    public TimerPhase getPhase() {
        return phase;
    }

    public Long getTaskId() {
        return taskId;
    }

    public String getTaskTitle() {
        return taskTitle;
    }

    public long getDurationSeconds() {
        return durationSeconds;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    
}
