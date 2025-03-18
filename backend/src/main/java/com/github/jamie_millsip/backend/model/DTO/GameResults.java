package com.github.jamie_millsip.backend.model.DTO;

import java.util.ArrayList;

public class GameResults {

    ArrayList<String> playerNames = new ArrayList<>();
    ArrayList<Integer> playerScores = new ArrayList<>();

    public GameResults(ArrayList<String> playerNames, ArrayList<Integer> playerScores) {
        this.playerNames = playerNames;
        this.playerScores = playerScores;
    }

    public ArrayList<String> getPlayerNames() {
        return playerNames;
    }

    public void setPlayerNames(ArrayList<String> playerNames) {
        this.playerNames = playerNames;
    }

    public ArrayList<Integer> getPlayerScores() {
        return playerScores;
    }

    public void setPlayerScores(ArrayList<Integer> playerScores) {
        this.playerScores = playerScores;
    }
}
