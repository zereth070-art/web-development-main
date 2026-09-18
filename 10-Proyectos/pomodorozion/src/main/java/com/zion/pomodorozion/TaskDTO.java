package com.zion.pomodorozion;

public class TaskDTO {
    
    private long id;
    private String title;
    private TaskStatus status;
    private int estimatedPomodoros;
    private int completedPomodoros;

    public TaskDTO() {
    }

    public TaskDTO(long id, String title, TaskStatus status, int estimatedPomodoros, int completedPomodoros) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.estimatedPomodoros = estimatedPomodoros;
        this.completedPomodoros = completedPomodoros;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public int getEstimatedPomodoros() {
        return estimatedPomodoros;
    }

    public void setEstimatedPomodoros(int estimatedPomodoros) {
        this.estimatedPomodoros = estimatedPomodoros;
    }

    public int getCompletedPomodoros() {
        return completedPomodoros;
    }

    public void setCompletedPomodoros(int completedPomodoros) {
        this.completedPomodoros = completedPomodoros;
    }
    
}
