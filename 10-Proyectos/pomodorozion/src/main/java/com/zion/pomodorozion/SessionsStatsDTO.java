package com.zion.pomodorozion;

public class SessionsStatsDTO {

    private long focusSeconds;
    private long breakSeconds;
    private int focusCount;
    private int breakCount;

    public SessionsStatsDTO() {
    }

    public SessionsStatsDTO(long focusSeconds, long breakSeconds, int focusCount, int breakCount) {
        this.focusSeconds = focusSeconds;
        this.breakSeconds = breakSeconds;
        this.focusCount = focusCount;
        this.breakCount = breakCount;
    }

    public long getFocusSeconds() {
        return focusSeconds;
    }

    public long getBreakSeconds() {
        return breakSeconds;
    }

    public int getFocusCount() {
        return focusCount;
    }

    public int getBreakCount() {
        return breakCount;
    }
}
