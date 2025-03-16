package com.github.jamie_millsip.backend.model.DTO;

import java.util.ArrayList;

public class GameSocketResponse {

    private String type;
    private int pile;
    private String message;
    private ArrayList<ArrayList<CardResponse>> cards;
    private int state;

    public GameSocketResponse(String type, int state) {
        this.type = type;
        this.state = state;
    }

    public GameSocketResponse(String type, String message) {
        this.type = type;
        this.message = message;
    }

    public GameSocketResponse(String type, ArrayList<ArrayList<CardResponse>> cards, int state, String message) {
        this.type = type;
        this.cards = cards;
        this.state = state;
        this.message = message;
    }

    public GameSocketResponse(String type, ArrayList<ArrayList<CardResponse>> cards, int state) {
        this.type = type;
        this.cards = cards;
        this.state = state;
    }

    public int getState(){
        return state;
    }

    public void setState(int state){
        this.state = state;
    }

    public String getType() {
        return type;
    }

    public int getPile() {
        return pile;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setPile(int pile) {
        this.pile = pile;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public ArrayList<ArrayList<CardResponse>> getCards() {
        return cards;
    }

    public void setCards(ArrayList<ArrayList<CardResponse>> cards) {
        this.cards = cards;
    }
}
