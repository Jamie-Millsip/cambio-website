package com.github.jamie_millsip.backend.model.DTO;

public class LobbySocketResponse {

    private String type;
    private String message;
    private PlayerReady[] playerReadyArray;

    public LobbySocketResponse(String type, String message) {
        this.type = type;
        this.message = message;
    }

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
