package com.github.jamie_millsip.backend.model.DTO.request;

import com.github.jamie_millsip.backend.model.Player;

public class ReadyUpRequest {

    private String lobbyID;
    private Player player;

    public ReadyUpRequest(String lobbyID, Player player) {
        this.lobbyID = lobbyID;
        this.player = player;
    }

    public String getLobbyID() {
        return lobbyID;
    }

    public Player getPlayer() {
        return player;
    }


}
