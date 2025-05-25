package com.github.jamie_millsip.backend.model;

public class Card {

    private final int value;
    private final String face;
    private final String suit;



    private boolean visible = false;

    public Card (Card newCard){
        this.value = newCard.getValue();
        this.face = newCard.getFace();
        this.suit = newCard.getSuit();
    }

    public Card(int value, String suit, String face) {
        this.value = value;
        this.suit = suit;
        this.face = face;
    }

    public int getValue() {
        return value;
    }

    public String getSuit() {
        return suit;
    }

    public boolean getVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public String getFace() {
        return face;
    }


}
