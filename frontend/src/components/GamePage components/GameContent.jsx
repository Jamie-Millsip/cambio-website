import React, { useContext, useEffect, useRef, useState } from "react";
import { swapCards } from "../../utilities/CardAPIs"
import { gameReadyUp, cambioClick, sendEndgameRequest } from "../../utilities/GameAPIs"
import {animateDrawCard, animateDiscardCard, animateLookCard, 
    animateSwapCard, animateFlipCardSuccess, animateFlipCardFail,
    animateGiveCard} from "../../utilities/AnimateCard";
import LobbyContext from "../../pages/LobbyContext";
import GameContext from "../../pages/GameContext";
import Stomp from 'stompjs';
import Card from "./GameContent components/Card";
import EndGamePage from "../../pages/EndGamePage";

/**
 * this page is used to display the game board and cards
 * 
 * @param {int} players - stores how many players are in the game currently
 * @returns well it returns the game board and cards for the users to play the game, isnt that a bit obvious
 */
const GameContent = ({ players, thisUser, setGameScreen, cards, setCards }) => {





    const setCardRef = (key, el) => { el ? cardRefs.current.set(key, el) : cardRefs.current.delete(key);};

    const {lobbyID, nickname, selectedSwapCards, setSelectedSwapCards, backendSite, webSocketSite} = useContext(LobbyContext);
    const {currentTurn, setCurrentTurn, state, setState,lastToDiscard,
        setLastToDiscard, setCanFlip, trigger, triggerVar, setHasActed, sleep} = useContext(GameContext);
    const [gameStarted, setGameStarted] = useState(false)

    const [hasFlipped, setHasFlipped] = useState(false)
    const [readyButtonStyle, setReadyButtonStyle] = useState("button-unready")
    const [buttonMessage, setButtonMessage] = useState("Ready")
    const [cambio, setCambio] = useState(false)
    const [cambioStyle, setCambioStyle] = useState("")
    const [endGameScreen, setEndGameScreen] = useState(false)
    const [webSocketData, setWebSocketData] = useState(null)

    // define vars used in correctly displaying the dynamic game board
    let radius = 270 + players*4;
    let scaleFactor = 1.4 - players/40;
    let centerScaleFactor = scaleFactor*1.4
    let tableRotation = -((thisUser-2) * 360) / players;
    let centerCardRotation = -tableRotation
    let scale = `scale(${scaleFactor})`;

    const cardRefs = useRef(new Map());





    
        // useEffect to connect to websocket and to handle any broadcasts sent from that websocket
        useEffect(() => {
            const socket = new WebSocket(webSocketSite);
            const client = Stomp.over(socket);
            client.debug = () => {};
    
            client.connect({}, () => {
                client.subscribe(`/topic/game/${lobbyID}`, (message) => {
                    const recievedMessage = JSON.parse(message.body);
                    setWebSocketData(recievedMessage)
                    if (recievedMessage.type === "gameStart"){
                        setGameStarted(true)
                        setCurrentTurn(2)
                    }
                },
                (error) => {console.error("error subscribing: ", error)}
            )},
            (error) => {console.error("websocket connection failed: ", error)})
    
            window.addEventListener("beforeunload", handleUnload)
            return() => {window.removeEventListener("beforeunload", handleUnload)}   
        }, [lobbyID]);
        const handleUnload = () =>{}






        const getAngle = (card2) => {
                return( -((((card2.player-2) * 360) / players) + 90) + ((((thisUser-2) * 360) / players) + 90))
        }



        // runs after websocket broadcast and animates cards in response to the new info
        useEffect(()=>{
            const checkMessage = async () => {
                // if the previous user called cambio, move to the next turn
                if (webSocketData.message === "callCambio"){
                    currentTurn + 1 < players+2 ? setCurrentTurn(currentTurn+1): setCurrentTurn(2);
                }   
                // ends the game if told to by backend
                else if (webSocketData.message === "endGame"){
                    await endGame()
                }
                // if the game state has changed, animates the moved cards
                else if (webSocketData && webSocketData.type === "changeState"){
                    console.log("WEBSOCKETDATA: ", webSocketData)
                    const card1Data = webSocketData.card1Data;
                    // if the user drew a card, animate the card being drawn from the pile
                    if (webSocketData.message === "draw"){
                        await animateDrawCard(cardRefs.current, card1Data.player)
                    }
                    // if the user discarded a card, animate the card getting sent to the discard pile
                    // and potentially animate the drawn card entering the players hand
                    else if (webSocketData.message === "discard"){
                        setHasFlipped(false);
                        setLastToDiscard(currentTurn);
                        const card2Data = webSocketData.card2Data;
                        const pileCard = cards[card1Data.player][0];
                        const discardedCard = cards[card2Data.player].find((card) => 
                            card === null ? false : card.row === card2Data.row && card.col === card2Data.column);

                        await animateDiscardCard(cardRefs.current, pileCard, discardedCard, 
                            getAngle(card2Data), radius, trigger, triggerVar);
                    }
                    // if the user looked at a card, animate the card getting looked a
                    else if (webSocketData.message === "look"){
                        let isMyTurn;
                        if (thisUser === currentTurn){
                            isMyTurn = true;
                        }
                        else{
                            isMyTurn = false;
                        }
                        const cardToAnimate = cards[card1Data.player].find((card) => 
                            card === null ? false : card.row === card1Data.row && card.col === card1Data.column);
                        await animateLookCard(cardRefs.current, cardToAnimate, trigger, triggerVar, isMyTurn);
                    }
                    // if the user swapped 2 cards, animate the cards moving to their new positions
                    else if (webSocketData.message === "swap"){
                        console.log("WEBSOCKET contents on swap: ", webSocketData);
                        const card2Data = webSocketData.card2Data;
                        const card1 = cards[card1Data.player].find((card) => 
                            card === null ? false : card.row === card1Data.row && card.col === card1Data.column);
                        const card2 = cards[card2Data.player].find((card) => 
                            card === null ? false : card.row === card2Data.row && card.col === card2Data.column);

                        await animateSwapCard(cardRefs.current, card1, card2, getAngle(card1Data), getAngle(card2Data), radius);
                    }
                    // updates the cards and state to match what was broadcast
                    webSocketData.cards !== null ? setCards(webSocketData.cards) : null;
                    setState(webSocketData.state);
                    setHasActed(false);
                }
                // if the user flipped a card
                else if (webSocketData && webSocketData.type === "flipCard"){
                    // if the user has just flipped a card, animate that card
                    console.log("WENSOCKETDAAT FLOP: ", webSocketData)
                    const card1Data = webSocketData.card1Data
                    if (webSocketData.message === "flipCardSuccess"){
                        setHasFlipped(true)
                        console.log("SUCCESS")
                        const card1 = cards[card1Data.player].find((card) => 
                            card === null ? false : card.row === card1Data.row && card.col === card1Data.column)
                        await animateFlipCardSuccess(cardRefs.current, card1, 
                            getAngle(card1Data), radius, trigger, triggerVar)
                        if (webSocketData.newCurrentPlayer !== -1){
                            setCurrentTurn(webSocketData.newCurrentPlayer)
                        }
                    }
                    else if (webSocketData.message === "flipCardFail"){
                        const card2Data = webSocketData.card2Data;
                        const card1 = cards[card1Data.player].find((card) => 
                            card === null ? false : card.row === card1Data.row && card.col === card1Data.column)
                        const card2 = cards[card2Data.player].find((card) => 
                            card === null ? false : card.row === card2Data.row && card.col === card2Data.column)
                        console.log("CARDEFF 1", card1)
                        await animateFlipCardFail(cardRefs.current, card1, card2, getAngle(card1Data), radius, trigger, triggerVar)
                    }
                    // if the user needs to give one of their cards away after a flip,
                    // animate that card moving to it's new hand
                    else if (webSocketData.message === "giveCard"){
                        await animateGiveCard()
                        setCurrentTurn(webSocketData.newCurrentPlayer)
                    }
                    // update the cards / state accordingly
                    webSocketData.cards !== null ? setCards(webSocketData.cards) : null;
                    setState(webSocketData.state)
                    if (state === 5){
                        for (let x = 0; x < selectedSwapCards.length; x++){
                            for (let y = 0; y < cards[selectedSwapCards[x].player].length; y++){
                                if (cards[selectedSwapCards[x].player][y]. row === selectedSwapCards.row
                                    && cards[selectedSwapCards[x].player][y].col === selectedSwapCards.col){
                                    if (cards[selectedSwapCards[x].player][y].card){
                                        cards[selectedSwapCards[x].player][y].card.visible = true;        
                                    }
                                }
                            }
                        }
                    }
                    trigger(triggerVar+1)
                }
            }
            if (webSocketData){
                checkMessage();
            }
        }, [webSocketData])






        useEffect(()=>{
            if (gameStarted){
                cards[thisUser][0].card.visible = false
                cards[thisUser][1].card.visible = false
            }
        }, [gameStarted])






        // updates necessary vars on game state change after websocket broadcast
        useEffect(()=>{
            // if the state resets to draw, update the current player

            if (webSocketData === null || webSocketData.type === null || webSocketData.type !== "flipCard"){
                if (state == 0 && gameStarted){
                    currentTurn + 1 < players+2 ? setCurrentTurn(currentTurn+1): setCurrentTurn(2);
                }
            // if the player needs to swap cards, update the buttons for the active user to represent s wapping
                else if (state === 4 || state == 5){
                    thisUser === currentTurn ? setButtonMessage("Swap") : setButtonMessage("Cambio");
                }
            }   
        }, [state])






        // tells the backend to end the game if this user has previously called cambio and it is now their turn again
        useEffect(()=>{
            if (thisUser === currentTurn && cambio){
                sendEndgameRequest(sleep, backendSite, lobbyID)
            }
        }, [currentTurn])






    // updates bool deciding whether this user is currently able to flip cards
    useEffect(()=> {
        // cannot flip if the discard pile is empty
        const cardLength = Array.isArray(cards[1]) ? cards[1].length : 0;
        // cannot flip if this user was the last to discard a card
        cardLength === 0 || lastToDiscard === thisUser || hasFlipped 
        || (thisUser === currentTurn && state !== 0) ? setCanFlip(false) : setCanFlip(true);
    }, [cards, lastToDiscard, hasFlipped])






    // when the game ends, sets all cards to visible for 5 seconds before entering engGame page
    const endGame = async () => {
        setState(-1)
        for (let x = 2; x < cards.length; x++){
            for (let y = 0; y < cards[x].length; y++){
                if (cards[x][y] !== null && cards[x][y].card !== null){
                    cards[x][y].card.visible = true;
                }
            }
        }
        await sleep(20)
        trigger(-1)
        await sleep(5000)
        setEndGameScreen(true)
    }






    // when the game starts, update the button text and resets its visual indicator
    useEffect(()=>{
        if (gameStarted){
            setButtonMessage("Cambio")
            setReadyButtonStyle("button-unready"); 
        }
    }, [gameStarted])






    if (!endGameScreen){
        return (
            <div className = "body-container" key = "body">
                <div 
                    className="game-table" 
                    style = {{transform: `rotate(${tableRotation}deg)`}}
                    >
                    <div 
                        className="card-row-container" 
                        style = {{transform: `rotate(${centerCardRotation}deg) scale(${centerScaleFactor})`}}
                        >
                        <div className="card-row">
                            {// places 2 cards in the middle of the game table to act as a draw and discard pile
                            Array.from({length: 2}).map((_, index) =>{
                                return(
                                    <Card key={`centerCard-${index}`}
                                    ref={el => setCardRef(`${index}-${-1}-${-1}`, el)}
                                    thisUser={thisUser}
                                    cardIndex={index}
                                    row={-1} 
                                    col={-1}
                                    cards={cards}/>
                                )
                            })}
                        </div>
                        <div className="button-row">
                            {/* Creates 2 buttons below the draw / discard pile */}
                            <button 
                                className=
                                    {`game-button 
                                    ${readyButtonStyle} 
                                    ${buttonMessage === "Cambio" ? cambioStyle : "" } `} 
                                onClick=
                                    { buttonMessage === "Ready" ? () => 
                                        gameReadyUp(readyButtonStyle, setReadyButtonStyle, backendSite, lobbyID, nickname) 
                                    : buttonMessage === "Swap" ? () => 
                                        swapCards(true, selectedSwapCards, setSelectedSwapCards, setButtonMessage, state, lobbyID, setHasActed) 
                                    : buttonMessage === "Cambio" ? () => 
                                        cambioClick(thisUser, currentTurn, state, backendSite, lobbyID, setCambio) 
                                    : null}
                            >
                                {buttonMessage}
                            </button>
                            {(state === 5 || state === 4) && thisUser == currentTurn && (
                                <button 
                                    className= {`game-button ${readyButtonStyle}`} 
                                    onClick= {() => swapCards(false, selectedSwapCards, 
                                        setSelectedSwapCards, setButtonMessage, state, lobbyID)}
                                >
                                    keep
                                </button>
                            )}
                        </div>
                    </div>
                    {// iterates through every player, ensuring each player has a hand, 
                    // and updating the position of the cards according to the player index
                    Array.from({ length: players }).map((_, index) => {
                        const angle = (index * 360) / players + 90;
                        return (
                            <div 
                                className = {`card-row-container`} 
                                key={`card-row-container-${index}`} 
                                style = {{transform: `rotate(${angle}deg) translate(${radius}%) rotate(-90deg) ${scale}`}}
                            >
                                {// splits the hand of cards into 3 rows
                                Array.from({length: 3}).map((_, row) => (
                                    <div className = {`card-row`} key={`card-row-${row}-${index}`}>
                                    {// creates 2 cards per row of a player's hand
                                    Array.from({length: 2}).map((_, col) => {
                                        return(
                                            <Card key={`card-${index+2}-${row}-${col}`}
                                            ref={el => setCardRef(`${index+2}-${row}-${col}`, el)}
                                            thisUser={thisUser} 
                                            cardIndex={index+2}
                                            row={row}
                                            col={col}
                                            cards={cards}/>
                                        )
                                    })}
                                </div>  
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
    else{
        return( <EndGamePage setGameScreen={setGameScreen}/> );
    }
};

export default GameContent;