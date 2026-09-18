package com.zion.pomodorozion;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/timer")
public class TimerController {

    private final TimerService timerService;
    private final TimerBroadcaster broadcaster;
    private final AuthenticatedUserService authenticatedUserService;

    public TimerController(TimerService timerService, TimerBroadcaster broadcaster,
            AuthenticatedUserService authenticatedUserService) {
        this.timerService = timerService;
        this.broadcaster = broadcaster;
        this.authenticatedUserService = authenticatedUserService;
    }

    //GET STATE
    @GetMapping
    public ResponseEntity<TimerState> getState() {
        return ResponseEntity.ok(timerService.getState(authenticatedUserService.getUserId()));
    }

    //START
    @PostMapping("/start")
    public ResponseEntity<TimerState> start() {
        Long userId = authenticatedUserService.getUserId();
        TimerState state = timerService.start(userId);
        broadcaster.broadcastToUser(userId, state);
        return ResponseEntity.ok(state);
    }

    //PAUSE
    @PostMapping("/pause")
    public ResponseEntity<TimerState> pause() {
        Long userId = authenticatedUserService.getUserId();
        TimerState state = timerService.pause(userId);
        broadcaster.broadcastToUser(userId, state);
        return ResponseEntity.ok(state);
    }

    //RESET
    @PostMapping("/reset")
    public ResponseEntity<TimerState> reset() {
        Long userId = authenticatedUserService.getUserId();
        TimerState state = timerService.reset(userId);
        broadcaster.broadcastToUser(userId, state);
        return ResponseEntity.ok(state);
    }

    //FINISH (transición de fase)
    @PostMapping("/finish")
    public ResponseEntity<TimerState> finish() {
        Long userId = authenticatedUserService.getUserId();
        TimerState state = timerService.finish(userId);
        broadcaster.broadcastToUser(userId, state);
        return ResponseEntity.ok(state);
    }

    //SELECT TASK (o deseleccionar con taskId 0)
    @PostMapping("/task/{taskId}")
    public ResponseEntity<TimerState> selectTask(@PathVariable Long taskId) {
        Long userId = authenticatedUserService.getUserId();
        TimerState state = timerService.selectTask(taskId, userId);
        broadcaster.broadcastToUser(userId, state);
        return ResponseEntity.ok(state);
    }
}
