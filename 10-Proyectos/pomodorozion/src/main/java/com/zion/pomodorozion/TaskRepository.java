package com.zion.pomodorozion;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>{

    List<Task> findByUserId(Long userId);

    // Spring Data genera el DELETE FROM task WHERE user_id = ? a partir del nombre
    void deleteByUserId(Long userId);

}
