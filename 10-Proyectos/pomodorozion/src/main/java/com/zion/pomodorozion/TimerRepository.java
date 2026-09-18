package com.zion.pomodorozion;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimerRepository extends JpaRepository<Timer, Long> {

    Optional<Timer> findByUserId(Long userId);

    // Para la cascada "borrar cuenta": elimina el temporizador del usuario
    void deleteByUserId(Long userId);

}
