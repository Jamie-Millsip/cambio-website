package com.github.jamie_millsip.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.github.jamie_millsip.backend.model.DTO.response.CardResponse;

import java.util.*;

public class Lobby {

    private String id;

    private ArrayList<Player> players = new ArrayList<>();
    private ArrayList<ArrayList<CardResponse>> cards = new ArrayList<>();
    private boolean gameStarted = false;
    private int currentPlayer = 0;
    private int stateToReturnTo = -1;
    private int playersToReturnTo = -1;
    private int playerToGiveCard = -1;



    @JsonCreator
    public Lobby(@JsonProperty String id) {
        this.id = id;
    }

    public void initCards(){
        // empties any cards from previous rounds
        cards.clear();

        // initialises draw pile and discard pile, adds them to cards 2d arraylist
        int[] values = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13};
        String[] suits = {"Diamonds", "Hearts", "Clubs", "Spades"};
        String[] specialFaces = {"J", "Q", "K", "Jo"};

        ArrayList<CardResponse> drawPile = new ArrayList<>();
        ArrayList<CardResponse> discardPile = new ArrayList<>();
        cards.add(drawPile);
        cards.add(discardPile);

        for (int i = 0; i < 13; i++) {
            for (int j = 0; j < 4; j++) {
                if (i < 10){
                    drawPile.add(new CardResponse(new Card(values[i], suits[j], String.valueOf(values[i])), 0));
                }
                else{
                    if (i == 12 && j < 2) drawPile.add(new CardResponse(new Card(-2, suits[j], specialFaces[i-10]), 0));

                    else if (i == 12)drawPile.add(new CardResponse(new Card(values[12], suits[j], specialFaces[i-10]), 0));

                    else drawPile.add(new CardResponse(new Card(values[i], suits[j], specialFaces[i-10]), 0));
                }
            }
        }
        drawPile.add(new CardResponse(new Card(-1, suits[0], specialFaces[3]), 0));
        drawPile.add(new CardResponse(new Card(-1, suits[2], specialFaces[3]), 0));

        // shuffles drawpile cards
        Collections.shuffle(cards.getFirst());


        // deals out player hands
        for (int x = 0; x < getAllPlayers().size(); x++) {
            ArrayList<CardResponse> playerHand = new ArrayList<>();
            for (int i = 2; i > -1; i--){
                for (int j = 0; j < 2; j++){
                    if (i == 0) {
                            playerHand.add(new CardResponse(null, x+2, i, j));
                            getPlayer(x).setCard(null, i, j);
                    }
                    else{
                        CardResponse newPlayerCard = cards.getFirst().getLast();
                        newPlayerCard.setPlayer(x+2);
                        newPlayerCard.setRow(i);
                        newPlayerCard.setCol(j);
                        playerHand.add(newPlayerCard);
                        getPlayer(x).setCard(cards.getFirst().getFirst().getCard(), i, j);
                        cards.getFirst().remove(cards.getFirst().getLast());
                    }
                }
            }
            cards.add(playerHand);
        }


        for (ArrayList<CardResponse> cardSet : cards) {
            for (CardResponse card : cardSet) {
                if (card == null || card.getCard() == null){
                    System.out.println("this card is null");
                }
                else{
                    System.out.println("card value: " + card.getCard().getValue());
                }
            }
        }
    }


    public void addPlayer(Player player) {
        players.add(player);
    }

    public void removePlayer(Player player) {
        players.remove(player);
    }

    public void removeAllPlayers() {
        players.clear();
    }

    public ArrayList<Player> getAllPlayers() {
        return players;
    }

    public Player getPlayer(String nickname) {
        if (players.isEmpty()) {
            return null;
        }
        for (Player player : players) {
            if (player.getNickname().equals(nickname)) {
                return player;
            }
        }
        return null;
    }

    public Player getPlayer(int index){
        return players.get(index);
    }

    public boolean containsPlayer(String nickname) {
        return getPlayer(nickname) != null;
    }


    public void setId(String id) {
        this.id = id;
    }
    public String getId() {
        return id;
    }

    public void setGameStarted(boolean gameStarted) {
        this.gameStarted = gameStarted;
    }

    public boolean getGameStarted() {
        return gameStarted;
    }

    public ArrayList<ArrayList<CardResponse>> getCards() {
        return cards;
    }

    public int getStateToReturnTo(){
        return stateToReturnTo;
    }

    public void setStateToReturnTo(int stateToReturnTo){
        this.stateToReturnTo = stateToReturnTo;
    }

    public int getPlayersToReturnTo(){
        return playersToReturnTo;
    }

    public void setPlayersToReturnTo(int playersToReturnTo){
        this.playersToReturnTo = playersToReturnTo;
    }

    public int getPlayerToGiveCard(){
        return playerToGiveCard;
    }

    public void setPlayerToGiveCard(int playerToGiveCard){
        this.playerToGiveCard = playerToGiveCard;
    }
}
