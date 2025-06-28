package com.github.jamie_millsip.backend.model.DTO.request;

public class CambioRequest {

    private String lobbyID;
    private int playerIndex;

    public CambioRequest(String lobbyID, int playerIndex) {
        this.lobbyID = lobbyID;
        this.playerIndex = playerIndex;
    }

    public String getLobbyID() {
        return lobbyID;
    }

    public void setLobbyID(String lobbyID) {}

    public int getPlayerIndex() {
        return playerIndex;
    }

    public void setPlayerIndex(int playerIndex) {}
}
