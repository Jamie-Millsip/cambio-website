package com.github.jamie_millsip.backend.model.DTO.response;

import com.github.jamie_millsip.backend.model.PlayerReady;

public class LobbySocketResponse {

    private String type;
    private String playerName;
    private PlayerReady[] playerReadyArray;

    public LobbySocketResponse(String type, PlayerReady[] playerReadyArray) {
        this.type = type;
        this.playerReadyArray = playerReadyArray;
    }

    public LobbySocketResponse(String type, String playerName) {
        this.type = type;
        this.playerName = playerName;
    }

    public PlayerReady[] getPlayerReadyArray() {
        return playerReadyArray;
    }


    public String getType() {
        return type;
    }

    public String getPlayerName() {
        return playerName;
    }

}
