package com.github.jamie_millsip.backend.model.DTO.request;

import com.github.jamie_millsip.backend.model.DTO.PositionData;

public class FlipCardRequest {

    private PositionData positionData;
    private int thisPlayer;
    private int state;
    private int currentTurn;

    public FlipCardRequest(PositionData positionData, int state, int thisPlayer, int currentTurn) {
        this.positionData = positionData;
        this.state = state;
        this.thisPlayer = thisPlayer;
        this.currentTurn = currentTurn;
    }

    public void setThisPlayer(int thisPlayer) {
        this.thisPlayer = thisPlayer;
    }

    public int getThisPlayer() {
        return thisPlayer;
    }

    public PositionData getPositionData() {
        return positionData;
    }

    public void setPositionData(PositionData positionData) {
        this.positionData = positionData;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    public int getCurrentTurn() {
        return currentTurn;
    }

    public void setCurrentTurn(int currentTurn) {
        this.currentTurn = currentTurn;
    }
}
