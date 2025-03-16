package com.github.jamie_millsip.backend.model.DTO;

public class FlipRequest {

    private PositionData positionData;
    private int state;

    public FlipRequest(PositionData positionData, int state) {
        this.positionData = positionData;
        this.state = state;
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
}
