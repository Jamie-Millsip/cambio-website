package com.github.jamie_millsip.backend.model.DTO.response;

import com.github.jamie_millsip.backend.model.DTO.PlayerReady;

public class LobbySocketResponse {

    private String type;
    private String message;
    private PlayerReady[] playerReadyArray;

    public LobbySocketResponse(String type, PlayerReady[] playerReadyArray) {
        this.type = type;
        this.playerReadyArray = playerReadyArray;
    }

    public PlayerReady[] getPlayerReadyArray() {
        return playerReadyArray;
    }


    public String getType() {
        return type;
    }

    public String getMessage() {
        return message;
    }

}
