package com.zion.pomodorozion;

import java.time.Instant;

import jakarta.annotation.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Timer {
   @Id
   @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
   private Long id; 

   @Enumerated(EnumType.STRING)
   private TimerPhase phase = TimerPhase.FOCUS;
   private boolean running;
   private long remainingSecondsAtStart;
   private Instant startedAt;
   private int focusCountInCycle  = 0;
   @Nullable
   private long selectedTaskId;
   
   // Getters and Setters
   public Long getId() {
      return id;
   }
   public void setId(Long id) {
      this.id = id;
   }

   public boolean isRunning() {
      return running;
   }
   public void setRunning(boolean running) {
      this.running = running;
   }
   public long getRemainingSecondsAtStart() {
      return remainingSecondsAtStart;
   }
   public void setRemainingSecondsAtStart(long remainingSecondsAtStart) {
      this.remainingSecondsAtStart = remainingSecondsAtStart;
   }
   public Instant getStartedAt() {
      return startedAt;
   }
   public void setStartedAt(Instant startedAt) {
      this.startedAt = startedAt;
   }
   public int getFocusCountInCycle() {
      return focusCountInCycle;
   }
   public void setFocusCountInCycle(int focusCountInCycle) {
      this.focusCountInCycle = focusCountInCycle;
   }
   public long getSelectedTaskId() {
      return selectedTaskId;
   }
   public void setSelectedTaskId(long selectedTaskId) {
      this.selectedTaskId = selectedTaskId;
   }
   public TimerPhase getPhase() {
      return phase;
   }
   public void setPhase(TimerPhase phase) {
      this.phase = phase;
   }
 
}
