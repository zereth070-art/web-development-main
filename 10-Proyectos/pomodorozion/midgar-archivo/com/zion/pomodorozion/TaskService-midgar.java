package com.zion.pomodorozion;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // ----------------
    // CREATE
    // ----------------

    public TaskDTO createTask(TaskCreateDTO dto) {
        Task task = new Task(
                dto.getTitle(),
                dto.getEstimatedPomodoros());

        Task saved = taskRepository.save(task);
        return mapToDTO(saved);
    }

    // ----------------
    // GET ALL
    // ----------------
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ----------------
    // GET BY ID
    // ----------------
    public TaskDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return mapToDTO(task);
    }

    // ----------------
    // UPDATE (simple)
    // ----------------
    public TaskDTO updateTask(Long id, TaskCreateDTO dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        task.setTitle(dto.getTitle());
        task.setEstimatedPomodoros(dto.getEstimatedPomodoros());

        Task updated = taskRepository.save(task);
        return mapToDTO(updated);
    }

    // ----------------
    // DELETE
    // ----------------
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        taskRepository.deleteById(id);
    }

    // ----------------
    // Mapper
    // ----------------
    private TaskDTO mapToDTO(Task task) {
        return new TaskDTO(
                task.getId(),
                task.getTitle(),
                task.getStatus(),
                task.getEstimatedPomodoros(),
                task.getCompletedPomodoros());
    }

    private void updateTaskStatus(Task task) {
        if (task.getCompletedPomodoros() >= task.getEstimatedPomodoros()) {
            task.setStatus(TaskStatus.COMPLETED);
            return;
        }

        if (task.getCompletedPomodoros() > 0) {
            task.setStatus(TaskStatus.IN_PROGRESS);
        }
    }

    public TaskDTO completePomodoro(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task with id " + id + " not found"));

        if (task.getCompletedPomodoros() >= task.getEstimatedPomodoros()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Task already completed");
        }
        
        task.setCompletedPomodoros(task.getCompletedPomodoros() + 1);
        updateTaskStatus(task);

        Task updated = taskRepository.save(task);
        return mapToDTO(updated);

    }

}