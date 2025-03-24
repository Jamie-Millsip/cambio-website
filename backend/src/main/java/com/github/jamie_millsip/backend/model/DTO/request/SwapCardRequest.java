package com.github.jamie_millsip.backend.model.DTO.request;

import com.github.jamie_millsip.backend.model.DTO.PositionData;

public class SwapCardRequest {

    private boolean swap;
    private PositionData card1;
    private PositionData card2;



    public SwapCardRequest(boolean swap, PositionData card1, PositionData card2) {
        this.swap = swap;
        this.card1 = card1;
        this.card2 = card2;
    }

    public boolean getSwap() {
        return swap;
    }

    public void setSwap(boolean swap) {
        this.swap = swap;
    }

    public PositionData getCard1() {
        return card1;
    }

    public void setCard1(PositionData card1) {
        this.card1 = card1;
    }

    public PositionData getCard2() {
        return card2;
    }

    public void setCard2(PositionData card2) {
        this.card2 = card2;
    }
}
