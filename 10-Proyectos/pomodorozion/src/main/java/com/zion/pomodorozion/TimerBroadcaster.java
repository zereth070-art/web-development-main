package com.zion.pomodorozion;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;

import tools.jackson.databind.ObjectMapper;

@Component
public class TimerBroadcaster {

    private record Client(WebSocketSession session, Long userId) {
    }

    private final TimerService timerService;
    private final ObjectMapper objectMapper;
    private final Map<String, Client> clients = new ConcurrentHashMap<>();

    public TimerBroadcaster(TimerService timerService, ObjectMapper objectMapper) {
        this.timerService = timerService;
        this.objectMapper = objectMapper;
    }

    public void addSession(WebSocketSession session, Long userId) {
        clients.put(session.getId(), new Client(session, userId));
    }

    public void removeSession(WebSocketSession session) {
        clients.remove(session.getId());
    }

    public void sendTo(WebSocketSession session, TimerState state) {
        try {
            WebSocketSession safe = new ConcurrentWebSocketSessionDecorator(session, 1024, 5000);
            safe.sendMessage(new TextMessage(objectMapper.writeValueAsString(state)));
        } catch (IOException e) {
            removeSession(session);
        }
    }

    public void broadcastToUser(Long userId, TimerState state) {
        clients.values().stream()
                .filter(client -> client.userId().equals(userId))
                .forEach(client -> sendTo(client.session(), state));
    }

    @Scheduled(fixedRate = 1000)
    public void tick() {
        Map<Long, List<Client>> byUser = clients.values().stream()
                .collect(java.util.stream.Collectors.groupingBy(Client::userId));

        byUser.forEach((userId, userClients) -> {
            TimerState state = timerService.getState(userId);
            userClients.forEach(client -> sendTo(client.session(), state));
        });
    }
}
