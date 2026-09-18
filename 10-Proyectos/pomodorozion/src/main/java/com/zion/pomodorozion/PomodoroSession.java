package com.zion.pomodorozion;

import java.time.Instant;

import jakarta.annotation.Generated;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;

@Entity
public class PomodoroSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Enumerated(EnumType.STRING)
    private TimerPhase phase;

    private Long taskId;

    private String taskTitle;
    
    private Instant startedAt;

    private Instant completedAt;

    private long durationSeconds;

    public PomodoroSession() {
    }

    @PrePersist
    protected void onCreate() {
        this.completedAt = Instant.now();
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }

    public void setUserId(Long userId) { this.userId = userId; }

    public TimerPhase getPhase() { return phase;  }

    public void setPhase(TimerPhase phase) { this.phase = phase;  }

    public Long getTaskId() { return taskId; }

    public void setTaskId(Long taskId) { this.taskId = taskId;  }

    public String getTaskTitle() { return taskTitle; }

    public void setTaskTitle(String taskTitle) { this.taskTitle = taskTitle;  }

    public Instant getStartedAt() { return startedAt; }

    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }

    public Instant getCompletedAt() { return completedAt;  }

    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt;  }

    public long getDurationSeconds() { return durationSeconds;  }

    public void setDurationSeconds(long durationSeconds) { this.durationSeconds = durationSeconds; }
}
