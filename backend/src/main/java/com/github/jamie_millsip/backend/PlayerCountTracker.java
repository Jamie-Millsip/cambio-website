package com.github.jamie_millsip.backend;

import org.springframework.context.event.EventListener;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

public class PlayerCountTracker {

    public static int userCount = 0;

    @EventListener
    public void onSocketConnect(SessionConnectedEvent event) {
        userCount++;
        System.out.println("new user connected, user count now is :" + userCount);
    }


    @EventListener
    public void onSocketDisconnect(SessionDisconnectEvent event) {
        userCount--;
        System.out.println("new user disconnected, user count now is :" + userCount);
    }

    public static int getUserCount(){
        return userCount;
    }
}
