package com.github.jamie_millsip.backend.model.DTO.response;

import java.util.ArrayList;

public class getCardsResponse {

    private ArrayList<ArrayList<CardResponse>> cards;

    public getCardsResponse(ArrayList<ArrayList<CardResponse>> cards) {
        this.cards = cards;
    }

    public ArrayList<ArrayList<CardResponse>> getCards() {
        return cards;
    }

    public void setCards(ArrayList<ArrayList<CardResponse>> cards) {
        this.cards = cards;
    }

}
