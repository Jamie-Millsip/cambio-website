package com.github.jamie_millsip.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Player {

    private String nickname;
    private boolean lobbyReady = false;
    private boolean gameReady = false;
    private Card[][] cards = new Card[3][2];

    @JsonCreator
    public Player(@JsonProperty String nickname) {
        this.nickname = nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public Card getCard(int row, int col) {
        return cards[row][col];
    }
    public void setCard(Card card, int row, int col) {
        cards[row][col] = card;
    }

    public String getNickname() {
        return nickname;
    }

    public void setLobbyReady(boolean lobbyReady) {
        this.lobbyReady = lobbyReady;
    }

    public boolean getLobbyReady() {
        return lobbyReady;
    }

    public void setGameReady(boolean gameReady) {
        this.gameReady = gameReady;
    }

    public boolean getGameReady() {
        return gameReady;
    }
}
