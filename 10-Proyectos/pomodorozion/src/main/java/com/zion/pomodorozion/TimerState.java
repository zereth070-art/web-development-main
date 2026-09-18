package com.zion.pomodorozion;

public class TimerState {

    private TimerPhase phase;
    private boolean running;
    private long remainingSeconds;
    private int focusCountInCycle;
    private Long selectedTaskId;

    public TimerState() {
    }

    public TimerState(TimerPhase phase, boolean running, long remainingSeconds, int focusCountInCycle, Long selectedTaskId) {
        this.phase = phase;
        this.running = running;
        this.remainingSeconds = remainingSeconds;
        this.focusCountInCycle = focusCountInCycle;
        this.selectedTaskId = selectedTaskId;
    }

    public TimerPhase getPhase() {
        return phase;
    }

    public void setPhase(TimerPhase phase) {
        this.phase = phase;
    }

    public boolean isRunning() {
        return running;
    }

    public void setRunning(boolean running) {
        this.running = running;
    }

    public long getRemainingSeconds() {
        return remainingSeconds;
    }

    public void setRemainingSeconds(long remainingSeconds) {
        this.remainingSeconds = remainingSeconds;
    }

    public int getFocusCountInCycle() {
        return focusCountInCycle;
    }

    public void setFocusCountInCycle(int focusCountInCycle) {
        this.focusCountInCycle = focusCountInCycle;
    }

    public Long getSelectedTaskId() {
        return selectedTaskId;
    }

    public void setSelectedTaskId(Long selectedTaskId) {
        this.selectedTaskId = selectedTaskId;
    }
}