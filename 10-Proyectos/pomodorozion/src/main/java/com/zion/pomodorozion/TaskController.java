package com.zion.pomodorozion;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;
    private final AuthenticatedUserService authenticatedUserService;

    public TaskController(TaskService taskService, AuthenticatedUserService authenticatedUserService) {
        this.taskService = taskService;
        this.authenticatedUserService = authenticatedUserService;
    }

    //CREATE
    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@Valid @RequestBody TaskCreateDTO dto) {
        Long userId = authenticatedUserService.getUserId();
        return ResponseEntity.ok(taskService.createTask(dto, userId));
    }
    
    //GET ALL
    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks(authenticatedUserService.getUserId()));
    }

    //GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id, authenticatedUserService.getUserId()));
    }

    //UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @Valid @RequestBody TaskCreateDTO dto) {
        return ResponseEntity.ok(taskService.updateTask(id, dto, authenticatedUserService.getUserId()));
    }

    //DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id, authenticatedUserService.getUserId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/pomodoro")
    public ResponseEntity<TaskDTO> completePomodoro(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.completePomodoro(id, authenticatedUserService.getUserId()));
    }
    
}
