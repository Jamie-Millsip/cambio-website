package com.github.jamie_millsip.backend.model.DTO.request;

public class DiscardCardRequest {

    private int pile;
    private int player;
    private int row;
    private int col;
    private int cardIndex;

    public DiscardCardRequest(int pile, int cardIndex,  int player, int row, int col) {
        this.pile = pile;
        this.cardIndex = cardIndex;
        this.player = player;
        this.row = row;
        this.col = col;
    }

    public int getCardIndex() {
        return cardIndex;
    }

    public void setCardIndex(int cardIndex) {
        this.cardIndex = cardIndex;
    }

    public int getPile() {
        return pile;
    }

    public void setPile(int pile) {
        this.pile = pile;
    }

    public int getPlayer() {
        return player;
    }

    public void setPlayer(int player) {
        this.player = player;
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public int getCol() {
        return col;
    }

    public void setCol(int col) {
        this.col = col;
    }
}
