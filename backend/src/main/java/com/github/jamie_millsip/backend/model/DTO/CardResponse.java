package com.github.jamie_millsip.backend.model.DTO;

import com.github.jamie_millsip.backend.model.Card;

public class CardResponse {

    private Card card;
    private int player;
    private int row;
    private int col;

    public CardResponse() {
    }

    public CardResponse(Card card, int player, int row, int col) {
        this.card = card;
        this.player = player;
        this.row = row;
        this.col = col;
    }

    public CardResponse(Card card, int player) {
        this.card = card;
        this.player = player;
        this.row = -1;
        this.col = -1;
    }

    public CardResponse(Card card) {
        this.card = card;
        this.player = -1;
        this.row = -1;
        this.col = -1;
    }

    public Card getCard() {
        return card;
    }

    public void setCard(Card card) {
        this.card = card;
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
