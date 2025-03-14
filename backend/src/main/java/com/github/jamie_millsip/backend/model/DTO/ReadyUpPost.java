package com.github.jamie_millsip.backend.model.DTO;

import com.github.jamie_millsip.backend.model.Lobby;
import com.github.jamie_millsip.backend.model.Player;

public class ReadyUpPost {

    private String lobbyID;
    private Player player;

    public ReadyUpPost(String lobbyID, Player player) {
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
