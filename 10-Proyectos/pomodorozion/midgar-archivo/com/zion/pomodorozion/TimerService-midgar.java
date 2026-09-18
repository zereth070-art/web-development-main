package com.zion.pomodorozion;

import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TimerService {

    private final TimerRepository timerRepository;
    private final TaskService taskService;

    @Value("${pomodoro.duration:25}")
    private int focusMinutes;

    @Value("${pomodoro.short-break:5}")
    private int shortBreakMinutes;

    @Value("${pomodoro.long-break:15}")
    private int longBreakMinutes;

    public TimerService(TimerRepository timerRepository, TaskService taskService) {
        this.timerRepository = timerRepository;
        this.taskService = taskService;
    }

    // ----------------
    // GET STATE
    // ----------------
    public TimerState getState() {
        return toState(getTimer());
    }

    // ----------------
    // START
    // ----------------
    public TimerState start() {
        Timer timer = getTimer();

        if (!timer.isRunning()) {
            long remaining = secondsRemaining(timer);
            if (remaining == 0) {
                remaining = fullDuration(timer.getPhase()); // Reset the timer if it has finished
            }
            timer.setRemainingSecondsAtStart(remaining);   // Update the remaining seconds at start
            timer.setStartedAt(Instant.now());            //  Set the start time to now         
            timer.setRunning(true);              //  Set the timer as running
            timerRepository.save(timer);                 //  Save the updated timer state
        }

        return toState(timer);
    }

    // ----------------
    // PAUSE
    // ----------------
    public TimerState pause() {
        Timer timer = getTimer();

        if (timer.isRunning()) {
            timer.setRemainingSecondsAtStart(secondsRemaining(timer));
            timer.setStartedAt(null);
            timer.setRunning(false);
            timerRepository.save(timer);
        }

        return toState(timer);
    }

    // ----------------
    // RESET
    // ----------------
    public TimerState reset() {
        Timer timer = getTimer();

        timer.setRemainingSecondsAtStart(fullDuration(timer.getPhase()));
        timer.setStartedAt(null);
        timer.setRunning(false);
        timerRepository.save(timer);

        return toState(timer);
    }

    // ----------------
    // FINISH (transition)
    // ----------------
    public TimerState finish() {
        Timer timer = getTimer();

        if (timer.getPhase() == TimerPhase.FOCUS) {
            timer.setFocusCountInCycle(timer.getFocusCountInCycle() + 1);

            completePomodoroIfSelected(timer);

            boolean longBreak = timer.getFocusCountInCycle() % 4 == 0;
            timer.setPhase(longBreak ? TimerPhase.LONG_BREAK : TimerPhase.SHORT_BREAK);
        } else {
            boolean wasLongBreak = timer.getPhase() == TimerPhase.LONG_BREAK;
            timer.setPhase(TimerPhase.FOCUS);
            if (wasLongBreak) {
                timer.setFocusCountInCycle(0);
            }
        }

        timer.setRemainingSecondsAtStart(fullDuration(timer.getPhase()));
        timer.setStartedAt(null);
        timer.setRunning(false);
        timerRepository.save(timer);

        return toState(timer);
    }

    // ----------------
    // SELECT TASK
    // ----------------
    public TimerState selectTask(Long taskId) {
        Timer timer = getTimer();

        if (taskId == null || taskId <= 0) {
            timer.setSelectedTaskId(0);
        } else {
            taskService.getTaskById(taskId);
            timer.setSelectedTaskId(taskId);
        }
        timerRepository.save(timer);

        return toState(timer);
    }

    // ----------------
    // Helpers
    // ----------------

    private void completePomodoroIfSelected(Timer timer) {
        long taskId = timer.getSelectedTaskId();
        if (taskId <= 0) {
            return;
        }

        TaskDTO task = taskService.getTaskById(taskId);
        if (task.getStatus() != TaskStatus.COMPLETED) {
            taskService.completePomodoro(taskId);
        }
    }

    private Timer getTimer() {
        return timerRepository.findById(1L).orElseGet(() -> {
            Timer timer = new Timer();
            timer.setId(1L);
            timer.setPhase(TimerPhase.FOCUS);
            timer.setRemainingSecondsAtStart(fullDuration(TimerPhase.FOCUS));
            timer.setRunning(false);
            return timerRepository.save(timer);
        });
    }

    private long secondsRemaining(Timer timer) {
        if (!timer.isRunning()) {
            return timer.getRemainingSecondsAtStart();
        }

        long elapsed = Duration.between(timer.getStartedAt(), Instant.now()).getSeconds();
        return Math.max(0, timer.getRemainingSecondsAtStart() - elapsed);
    }

    private long fullDuration(TimerPhase phase) {
        long minutes = switch (phase) {
            case FOCUS -> focusMinutes;
            case SHORT_BREAK -> shortBreakMinutes;
            case LONG_BREAK -> longBreakMinutes;
        };
        return minutes * 60;
    }

    private TimerState toState(Timer timer) {
        return new TimerState(
                timer.getPhase(),
                timer.isRunning(),
                secondsRemaining(timer),
                timer.getFocusCountInCycle(),
                timer.getSelectedTaskId());
    }
}
