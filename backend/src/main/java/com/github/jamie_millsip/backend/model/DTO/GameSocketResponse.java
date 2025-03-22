package com.github.jamie_millsip.backend.model.DTO;

import java.util.ArrayList;

public class GameSocketResponse {

    private String type;
    private String message;
    private ArrayList<ArrayList<CardResponse>> cards;
    private int state;
    private PositionData card1Data;
    private PositionData card2Data;


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

    public GameSocketResponse(String type, ArrayList<ArrayList<CardResponse>> cards, int state, String message, PositionData card1Data) {
        this.type = type;
        this.cards = cards;
        this.state = state;
        this.message = message;
        this.card1Data = card1Data;
    }

    public GameSocketResponse(String type, ArrayList<ArrayList<CardResponse>> cards, int state, String message, PositionData card1Data, PositionData card2Data) {
        this.type = type;
        this.cards = cards;
        this.state = state;
        this.message = message;
        this.card1Data = card1Data;
        this.card2Data = card2Data;
    }

    public GameSocketResponse(String type, ArrayList<ArrayList<CardResponse>> cards, int state) {
        this.type = type;
        this.cards = cards;
        this.state = state;
    }

    public PositionData getCard1Data() {
        return card1Data;
    }

    public void setCard1Data(PositionData card1Data) {
        this.card1Data = card1Data;
    }

    public PositionData getCard2Data() {
        return card2Data;
    }

    public void setCard2Data(PositionData card2Data) {
        this.card2Data = card2Data;
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

    public void setType(String type) {
        this.type = type;
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
