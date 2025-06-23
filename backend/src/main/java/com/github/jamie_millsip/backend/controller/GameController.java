package com.github.jamie_millsip.backend.controller;


import com.github.jamie_millsip.backend.model.Card;
import com.github.jamie_millsip.backend.model.DTO.*;
import com.github.jamie_millsip.backend.model.DTO.request.DiscardCardRequest;
import com.github.jamie_millsip.backend.model.DTO.request.FlipCardRequest;
import com.github.jamie_millsip.backend.model.DTO.request.SwapCardRequest;
import com.github.jamie_millsip.backend.model.DTO.response.CardResponse;
import com.github.jamie_millsip.backend.model.DTO.response.GameResultsResponse;
import com.github.jamie_millsip.backend.model.DTO.response.GameSocketResponse;
import com.github.jamie_millsip.backend.model.Lobby;
import com.github.jamie_millsip.backend.model.Player;
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
//@CrossOrigin(origins = "https://jamie-millsip.github.io")
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
        messagingTemplate.convertAndSend("/topic/game/" + lobbyID, response);
    }

    @RequestMapping("/drawCard/{lobbyID}")
    public void drawCard(@PathVariable String lobbyID, @RequestBody int pile){
        PositionData pileData = new PositionData(pile, -1, -1);
        triggerBroadcast(lobbyID, new GameSocketResponse(
            "changeState", null, 1, "draw", pileData, null, -1));
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
                    temp.setPlayer(1);
                    cards.get(pile).removeFirst();
                    firstDiscardAction(cards);
                    temp.getCard().setVisible(true);
                    cards.get(1).addFirst(temp);
                    int cardValue = cards.get(1).getFirst().getCard().getValue();
                    if (cardValue > 6 && cardValue < 13 /* && cardsIndex == 0*/){
                        if (cardValue < 9){
                            ability = 2;
                        }
                        else if (cardValue < 11 ){
                            ability = 3;
                        }
                        else if (cardValue == 11){
                            ability = 4;
                        }
                        else{
                            ability = 5;
                        }
                    }
                }
                else{
                    // remove the selected card from its pile and prepare it for the hand
                    CardResponse temp = cards.get(pile).removeFirst();
                    temp.setRow(row);
                    temp.setCol(col);
                    temp.setPlayer(cardsIndex);
                    temp.getCard().setVisible(false);

                    firstDiscardAction(cards);

                    // add the discarded card to the discard pile
                    cards.get(1).addFirst(cards.get(cardsIndex).get(index));
                    cards.get(1).getFirst().setRow(-1);
                    cards.get(1).getFirst().setCol(-1);
                    cards.get(1).getFirst().setPlayer(1);
                    cards.get(1).getFirst().getCard().setVisible(true);
                    // replaces the card in hand with the new card
                    cards.get(cardsIndex).set(index, temp);
                }
                // if the draw pile has < 6 cards, reshuffle the discarded cards into the draw pile
                // this allows for a constant buffer of 5 cards, used for flip actions
                cards = checkReshuffle(cards);
                PositionData card1Pos = new PositionData(pile, -1, -1);
                PositionData card2Pos = new PositionData(cardsIndex, row, col);
                triggerBroadcast(lobbyID, new GameSocketResponse(
                        "changeState", cards, ability, "discard", card1Pos, card2Pos, -1));
            }
        }
    }

    // if the discard pile is empty, add a card to act as a buffer for flip actions
    public void firstDiscardAction(ArrayList<ArrayList<CardResponse>> cards){
        if (cards.get(1).isEmpty()){
            CardResponse temp = cards.getFirst().removeFirst();
            cards.get(1).add(temp);
        }
    }

    public ArrayList<ArrayList<CardResponse>> checkReshuffle(ArrayList<ArrayList<CardResponse>> cards){
        if (cards.getFirst().size() < 6){
            ArrayList<CardResponse> tempArray = new ArrayList<>(cards.get(1));
            cards.removeFirst();
            cards.addFirst(tempArray);
            cards.get(1).clear();
            // leaves 5 cards in the discard pile to act as a buffer
            for (int x = 0; x < 6; x++){
                CardResponse temp = cards.getFirst().removeFirst();
                cards.get(1).addLast(temp);
            }
            for (CardResponse card : cards.getFirst()){
                card.getCard().setVisible(false);
            }
            Collections.shuffle(cards.getFirst());
            for (int x = 0; x < cards.getFirst().size(); x++){
                cards.getFirst().get(x).setPlayer(0);
            }
        }
        return cards;
    }

    @RequestMapping("/look/{lobbyID}")
    public void cardLook(@PathVariable String lobbyID, @RequestBody PositionData cardLookedAt){
        for (Lobby lobby : lobbyList) {
            if (lobby.getId().equals(lobbyID)) {
                ArrayList<ArrayList<CardResponse>> cards = lobby.getCards();
                triggerBroadcast(lobbyID, new GameSocketResponse(
                        "changeState", cards, 0, "look", cardLookedAt, null, -1));
            }
        }
    }

    @RequestMapping("/swapCards/{lobbyID}")
    public void swapCards(@PathVariable String lobbyID, @RequestBody SwapCardRequest swapRequest) {
        // if the user decided to swap the cards
        PositionData card1Pos = swapRequest.getCard1();
        PositionData card2Pos = swapRequest.getCard2();
        ArrayList<CardResponse> swapCards = new ArrayList<>();
        boolean swap = swapRequest.getSwap();
        if (swap) {
            for (Lobby lobby : lobbyList) {
                if (lobby.getId().equals(lobbyID)) {
                    ArrayList<ArrayList<CardResponse>> cards = lobby.getCards();
                    for (int x = 0; x < cards.size(); x++) {
                        if (x == card1Pos.getPlayer()) {
                            swapCards.add(findSwapCard(card1Pos, cards));
                        }
                        if (x == card2Pos.getPlayer()) {
                            swapCards.add(findSwapCard(card2Pos, cards));
                        }
                    }
                    for (int x = 0; x < cards.size(); x++) {
                            if (x == card1Pos.getPlayer() || x == card2Pos.getPlayer()) {
                            for (int y = 0; y < cards.get(x).size(); y++) {
                                if (cards.get(x).get(y) != null){
                                    if (cards.get(x).get(y).getCol() == swapCards.get(0).getCol()
                                            && cards.get(x).get(y).getRow() == swapCards.get(0).getRow()
                                            && swapCards.get(0).getPlayer() == cards.get(x).get(y).getPlayer()){
                                        cards.get(x).get(y).setCard(swapCards.get(1).getCard());
                                    }
                                    else if (cards.get(x).get(y).getCol() == swapCards.get(1).getCol()
                                            && cards.get(x).get(y).getRow() == swapCards.get(1).getRow()
                                            && swapCards.get(1).getPlayer() == cards.get(x).get(y).getPlayer()) {
                                        cards.get(x).get(y).setCard(swapCards.get(0).getCard());
                                    }
                                }
                            }
                        }
                    }
                    triggerBroadcast(lobbyID, new GameSocketResponse(
                            "changeState", cards, 0, "swap", card1Pos, card2Pos, -1));
                }
            }
        }
        else{
            System.out.println("noSwappy");
            triggerBroadcast(lobbyID, new GameSocketResponse(
                    "changeState", null, 0, "noSwap", null, null, -1));
        }
    }


    public CardResponse findSwapCard (PositionData posData, ArrayList<ArrayList<CardResponse>> cards){
        for (CardResponse card : cards.get(posData.getPlayer())){

            if (card!= null && (card.getRow() == posData.getRow() && card.getCol() == posData.getColumn())){
             return new CardResponse(card.getCard(), card.getPlayer(), card.getRow(), card.getCol());
            }
        }
        return null;
    }

    @RequestMapping("/flipCardSuccess/{lobbyID}")
    public void flipCardSuccess(@PathVariable String lobbyID, @RequestBody FlipCardRequest flipRequest){
        int state = flipRequest.getState();
        int cardIndex = 0;
        if (state == 1){
            cardIndex = 1;
        }
        PositionData positionData = flipRequest.getPositionData();
        for (Lobby lobby : lobbyList) {
            if (lobby.getId().equals(lobbyID)) {
                ArrayList<ArrayList<CardResponse>> cards = lobby.getCards();
                for (int x = 0; x < cards.size(); x++) {
                    if (x == positionData.getPlayer()) {
                        for (int y = 0; y < cards.get(x).size(); y++) {
                            CardResponse card = cards.get(x).get(y);
                            if (card != null){
                                if (card.getCol() == positionData.getColumn() && card.getRow() == positionData.getRow()) {
                                    if (Objects.equals(cards.get(1).getFirst().getCard().getFace(), card.getCard().getFace())){
                                        CardResponse temp = new CardResponse(card.getCard(), 1, -1, -1);
                                        temp.getCard().setVisible(true);
                                        card.setCard(null);
                                        cards.get(1).add(cardIndex, temp);
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
                lobby.setStateToReturnTo(flipRequest.getState());
                lobby.setPlayersToReturnTo(flipRequest.getCurrentTurn());
                lobby.setPlayerToGiveCard(flipRequest.getPositionData().getPlayer());
                if (positionData.getPlayer() == flipRequest.getThisPlayer()){
                    triggerBroadcast(lobbyID, new GameSocketResponse("flipCard", cards, flipRequest.getState(),
                            "flipCardSuccess", positionData, null, -1));
                }
                else{
                    triggerBroadcast(lobbyID, new GameSocketResponse("flipCard", cards , 6,
                            "flipCardSuccess", positionData, null, flipRequest.getThisPlayer()));
                }
                break;
            }
        }
    }

    @RequestMapping("/flipCardFail/{lobbyID}")
    public void flipCardFail(@PathVariable String lobbyID, @RequestBody FlipCardRequest flipRequest){
        int state = flipRequest.getState();
        int cardIndex = 0;
        if (state == 1){
            cardIndex = 1;
        }
        for (Lobby lobby : lobbyList) {
            if (lobby.getId().equals(lobbyID)) {
                PositionData card1Data = null;
                ArrayList<ArrayList<CardResponse>> cards = lobby.getCards();
                for (int x = 0; x < cards.get(flipRequest.getThisPlayer()).size(); x++) {
                    if (cards.get(flipRequest.getThisPlayer()).get(x).getCard() == null){
                        cards.get(flipRequest.getThisPlayer()).get(x).setCard(
                                new Card(cards.getFirst().get(cardIndex).getCard()));

                        cards.getFirst().remove(cardIndex);
                        cards = checkReshuffle(cards);

                        card1Data = new PositionData(
                                flipRequest.getThisPlayer(),
                                cards.get(flipRequest.getThisPlayer()).get(x).getRow(),
                                cards.get(flipRequest.getThisPlayer()).get(x).getCol()
                        );
                        break;
                    }
                }
                PositionData card2Data = flipRequest.getPositionData();
                triggerBroadcast(lobbyID, new GameSocketResponse("flipCard", cards , flipRequest.getState(),
                        "flipCardFail", card1Data, card2Data, -1));
            }
        }
    }

    @RequestMapping("/giveCard/{lobbyID}")
    public void giveCard(@PathVariable String lobbyID, @RequestBody PositionData cardToGivePos){
        PositionData card2Data = null;
        System.out.println("WEJFAEBHFINEA");
        for (Lobby lobby : lobbyList) {
            if (lobby.getId().equals(lobbyID)) {
                int playerToRecieve = lobby.getPlayerToGiveCard();
                ArrayList<ArrayList<CardResponse>> cards = lobby.getCards();
                Card temp = null;
                for (int x = 0; x < cards.get(cardToGivePos.getPlayer()).size(); x++) {
                    CardResponse card = cards.get(cardToGivePos.getPlayer()).get(x);
                    if (card.getRow() == cardToGivePos.getRow() && card.getCol() == cardToGivePos.getColumn()){
                        temp = new Card(card.getCard());
                        cards.get(cardToGivePos.getPlayer()).get(x).setCard(null);
                        break;
                    }
                }
                for (int x = 0; x < cards.get(playerToRecieve).size(); x++) {
                    if (cards.get(playerToRecieve).get(x).getCard() == null){
                        if (temp != null){
                            CardResponse card = cards.get(playerToRecieve).get(x);
                            card.setCard(temp);
                            card2Data = new PositionData(playerToRecieve, card.getRow(), card.getCol());
                            break;

                        }
                    }
                }
                System.out.println("about to broadcast");
                triggerBroadcast(lobbyID, new GameSocketResponse("flipCard", cards, lobby.getStateToReturnTo(),
                        "giveCard", cardToGivePos, card2Data, lobby.getPlayersToReturnTo()));
            }
        }
    }

    @RequestMapping("/cambio/{lobbyID}")
    public void callCambio (@PathVariable String lobbyID){
        triggerBroadcast(lobbyID, new GameSocketResponse(
                "changePlayer", null, 0, "callCambio"));
    }

    @RequestMapping("/endGame/{lobbyID}")
    public void endGame(@PathVariable String lobbyID){
        triggerBroadcast(lobbyID, new GameSocketResponse("endGame", null, 0, "endGame"));
    }

    @RequestMapping("/getGameResults/{lobbyID}")
    public GameResultsResponse getGameResults(@PathVariable String lobbyID){
        for (Lobby lobby : lobbyList) {
            if (lobby.getId().equals(lobbyID)) {
                ArrayList<String> players = new ArrayList<>();
                ArrayList<Integer> scores = new ArrayList<>();
                for (Player player : lobby.getAllPlayers()){
                    players.add(player.getNickname());
                }
                ArrayList<ArrayList<CardResponse>> cards = lobby.getCards();
                for (int x = 2; x < cards.size(); x++) {
                    int score = 0;
                    for (int y = 0; y < cards.get(x).size(); y++) {
                        if (cards.get(x).get(y).getCard() != null){
                            score += cards.get(x).get(y).getCard().getValue();
                        }
                    }
                    scores.add(score);
                }

                return new GameResultsResponse(players, scores);
            }
        }
        return null;
    }
}
