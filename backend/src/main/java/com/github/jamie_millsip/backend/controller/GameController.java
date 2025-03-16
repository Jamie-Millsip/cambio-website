package com.github.jamie_millsip.backend.controller;


import com.github.jamie_millsip.backend.model.DTO.*;
import com.github.jamie_millsip.backend.model.Lobby;
import com.github.jamie_millsip.backend.model.SharedService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class GameController {


    @Autowired
    private SharedService sharedService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    List<Lobby> lobbyList;

    @PostConstruct
    public void init() {
    lobbyList = sharedService.getLobbyList();
    }



    public void triggerBroadcast(String lobbyID, GameSocketResponse response){
        System.out.println("Broadcast Triggered");
        messagingTemplate.convertAndSend("/topic/game/" + lobbyID, response);
    }

    @RequestMapping("/drawCard/{lobbyID}")
    public void drawCard(@PathVariable String lobbyID, @RequestBody int pile){
        triggerBroadcast(lobbyID, new GameSocketResponse("changeState", 1));
    }

    @RequestMapping("/discardCard/{lobbyID}")
    public void discardCard(@PathVariable String lobbyID, @RequestBody DiscardCardRequest request){
        int pile = request.getPile();
        int cardsIndex = request.getPlayer();
        int row = request.getRow();
        int col = request.getCol();
        int ability = 0;

        int index = 4-(2*row);
        if (col == 1){
            index += 1;
        }
        for (Lobby lobby : lobbyList) {
            if (lobby.getId().equals(lobbyID)) {
                ArrayList<ArrayList<CardResponse>> cards = lobby.getCards();

                // if the discarded card is from a pile
                if (cardsIndex < 2){
                    CardResponse temp = cards.get(pile).getFirst();
                    cards.get(pile).removeFirst();
                    temp.getCard().setVisible(true);
                    cards.get(1).addFirst(temp);

                    if (cards.get(1).getFirst().getCard().getValue() > 6 && cards.get(1).getFirst().getCard().getValue() < 13 && cardsIndex == 0){
                        // i am certain there is a better way of doing this, but for now this is fine
                        System.out.println("SPECIAL CARD");
                        if (cards.get(1).getFirst().getCard().getValue() < 9){
                            ability = 2;
                        }
                        else if (cards.get(1).getFirst().getCard().getValue() < 11 ){
                            ability = 3;
                        }
                        else if (cards.get(1).getFirst().getCard().getValue() == 11){
                            ability = 4;
                        }
                        else if (cards.get(1).getFirst().getCard().getValue() == 12){
                            ability = 5;
                        }
                    }
                }
                else{
                    // remove the selected card from its pile and prepare it for the hand
                    CardResponse temp = cards.get(pile).getFirst();
                    temp.setRow(row);
                    temp.setCol(col);
                    temp.setPlayer(cardsIndex-2);
                    temp.getCard().setVisible(false);
                    cards.get(pile).removeFirst();

                    // add the discarded card to the discard pile
                    cards.get(1).addFirst(cards.get(cardsIndex).get(index));
                    cards.get(1).getFirst().setRow(-1);
                    cards.get(1).getFirst().setCol(-1);
                    cards.get(1).getFirst().setPlayer(-1);
                    cards.get(1).getFirst().getCard().setVisible(true);
                    // replaces the card in hand with the new card
                    cards.get(cardsIndex).set(index, temp);
                }

                if (cards.getFirst().isEmpty()){
                    System.out.println("draw pile is empty");
                    ArrayList<CardResponse> tempArray = new ArrayList<>(cards.get(1));
                    cards.removeFirst();
                    cards.addFirst(tempArray);
                    cards.get(1).clear();
                    CardResponse temp = cards.getFirst().getFirst();
                    cards.getFirst().removeFirst();
                    cards.get(1).addFirst(temp);
                    for (CardResponse card : cards.getFirst()){
                        card.getCard().setVisible(false);
                    }
                    Collections.shuffle(cards.getFirst());
                }

                triggerBroadcast(lobbyID, new GameSocketResponse("changeState", cards, ability));
            }
        }
    }

    @RequestMapping("/look/{lobbyID}")
    public void cardLook(@PathVariable String lobbyID){
        for (Lobby lobby : lobbyList) {
            if (lobby.getId().equals(lobbyID)) {
                ArrayList<ArrayList<CardResponse>> cards = lobby.getCards();
                triggerBroadcast(lobbyID, new GameSocketResponse("changeState", cards, 0));
            }
        }
    }

    @RequestMapping("/swapCards/{lobbyID}")
    public void swapCards(@PathVariable String lobbyID, @RequestBody SwapRequest swapRequest) {
        // if the user decided to swap the cards
        ArrayList<CardResponse> swapCards = new ArrayList<>();
        boolean swap = swapRequest.getSwap();
        if (swap) {
            for (Lobby lobby : lobbyList) {
                if (lobby.getId().equals(lobbyID)) {
                    ArrayList<ArrayList<CardResponse>> cards = lobby.getCards();
                    for (int x = 0; x < cards.size(); x++) {
                        if (x == swapRequest.getCard1().getPlayer() + 2) {
                            swapCards.add(findSwapCard(swapRequest.getCard1(), cards));
                        }
                        if (x == swapRequest.getCard2().getPlayer() + 2) {
                            swapCards.add(findSwapCard(swapRequest.getCard2(), cards));
                        }
                    }

                    for (int x = 0; x < cards.size(); x++) {
                            if (x == swapRequest.getCard1().getPlayer() + 2 || x == swapRequest.getCard2().getPlayer() + 2) {
                            for (int y = 0; y < cards.get(x).size(); y++) {
                                if (cards.get(x).get(y) != null){
                                    if (cards.get(x).get(y).getCol() == swapCards.get(0).getCol() && cards.get(x).get(y).getRow() == swapCards.get(0).getRow() && swapCards.get(0).getPlayer() == cards.get(x).get(y).getPlayer()){
                                        cards.get(x).get(y).setCard(swapCards.get(1).getCard());
                                    }
                                    else if (cards.get(x).get(y).getCol() == swapCards.get(1).getCol() && cards.get(x).get(y).getRow() == swapCards.get(1).getRow() && swapCards.get(1).getPlayer() == cards.get(x).get(y).getPlayer()) {
                                        cards.get(x).get(y).setCard(swapCards.get(0).getCard());
                                    }
                                }
                            }
                        }
                    }
                    triggerBroadcast(lobbyID, new GameSocketResponse("changeState", cards, 0));
                }
            }
        }
        else{
            triggerBroadcast(lobbyID, new GameSocketResponse("changeState", null, 0));
        }
    }


    public CardResponse findSwapCard (PositionData posData, ArrayList<ArrayList<CardResponse>> cards){
        for (CardResponse card : cards.get(posData.getPlayer() + 2)){
            if (card.getRow() == posData.getRow() && card.getCol() == posData.getColumn()) {
             return new CardResponse(card.getCard(), card.getPlayer(), card.getRow(), card.getCol());
            }
        }
        return null;
    }

    @RequestMapping("/flipCard/{lobbyID}")
    public void flipCard(@PathVariable String lobbyID, @RequestBody PositionData positionData){
        System.out.println("Flip Card");
        System.out.println("player inputted: " +  positionData.getPlayer());
        System.out.println("row: " + positionData.getRow());
        System.out.println("col inputted: " + positionData.getColumn());
        for (Lobby lobby : lobbyList) {
            if (lobby.getId().equals(lobbyID)) {
                System.out.println("test1");
                ArrayList<ArrayList<CardResponse>> cards = lobby.getCards();
                for (int x = 0; x < cards.size(); x++) {
                    if (x == positionData.getPlayer() + 2) {
                        System.out.println("test2");
                        for (int y = 0; y < cards.get(x).size(); y++) {
                            if (cards.get(x).get(y) != null){
                                System.out.println("test3");
                                if (cards.get(x).get(y).getCol() == positionData.getColumn() && cards.get(x).get(y).getRow() == positionData.getRow()) {
                                    System.out.println("test4");
                                    if (Objects.equals(cards.get(1).getFirst().getCard().getFace(), cards.get(x).get(y).getCard().getFace())){
                                        System.out.println("test5");
                                        CardResponse temp = new CardResponse(cards.get(x).get(y).getCard(), -1, -1, -1);
                                        temp.getCard().setVisible(true);
                                        cards.get(x).set(y, null);
                                        cards.get(1).addFirst(temp);
                                        break;
                                    }
                                    else{
                                        System.out.println("test6");
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
                triggerBroadcast(lobbyID, new GameSocketResponse("changeState", cards , 0));
                break;
            }
        }
    }

}
