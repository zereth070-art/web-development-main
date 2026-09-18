package com.zion.pomodorozion;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class TimerWebSocketHandler extends TextWebSocketHandler {

    private final TimerBroadcaster broadcaster;
    private final TimerService timerService;
    private final UserRepository userRepository;

    public TimerWebSocketHandler(TimerBroadcaster broadcaster, TimerService timerService,
            UserRepository userRepository) {
        this.broadcaster = broadcaster;
        this.timerService = timerService;
        this.userRepository = userRepository;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Long userId = resolveUserId(session);
        if (userId == null) {
            session.close(CloseStatus.POLICY_VIOLATION);
            return;
        }

        broadcaster.addSession(session, userId);
        broadcaster.sendTo(session, timerService.getState(userId));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        broadcaster.removeSession(session);
    }

    private Long resolveUserId(WebSocketSession session) {
        Object contextObj = session.getAttributes()
                .get(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);

        if (contextObj instanceof SecurityContext securityContext
                && securityContext.getAuthentication() != null) {
            String username = securityContext.getAuthentication().getName();
            return userRepository.findByUsername(username)
                    .map(user -> user.getId())
                    .orElse(null);
        }

        return null;
    }
}
