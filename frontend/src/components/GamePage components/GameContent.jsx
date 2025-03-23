import React, { useContext, useEffect, useRef, useState } from "react";
import "../../pages/Game.css"
import "../../pages/Body.css"
import {animateDrawCard, animateDiscardCard, animateLookCard, animateSwapCard, animateFlipCard} from "../../utilities/AnimateCard";
import LobbyContext from "../../pages/LobbyContext";
import GameContext from "../../pages/GameContext";
import axios from "axios";
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

    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

    const setCardRef = (key, el) => { el ? cardRefs.current.set(key, el) : cardRefs.current.delete(key);};

    const {lobbyID, nickname, selectedSwapCards, setSelectedSwapCards, backendSite, webSocketSite} = useContext(LobbyContext);
    const {currentTurn, setCurrentTurn, state, setState, lastToDiscard, setLastToDiscard, setCanFlip, trigger, triggerVar} = useContext(GameContext);
    const [gameStarted, setGameStarted] = useState(false)


    const [readyButtonStyle, setReadyButtonStyle] = useState("button-unready")
    const [buttonMessage, setButtonMessage] = useState("Ready")
    const [message, setMessage] = useState("")
    const [cambio, setCambio] = useState(false)
    const [cambioStyle, setCambioStyle] = useState("")
    const [endGameScreen, setEndGameScreen] = useState(false)
    const [webSocketData, setWebSocketData] = useState()

    const tableRef = useRef(null)

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
                    else {setMessage(recievedMessage.message)}
                },
                (error) => {console.error("error subscribing: ", error)}
            )},
            (error) => {console.error("websocket connection failed: ", error)})
    
            window.addEventListener("beforeunload", handleUnload)
            return() => {window.removeEventListener("beforeunload", handleUnload)}   
        }, [lobbyID]);
        const handleUnload = () =>{
            // implement later not important atm -- also not sure if i am gonna need this
        }


        const getAngle = (card2) => {
                return( -((((card2.player-2) * 360) / players) + 90) + ((((thisUser-2) * 360) / players) + 90))
        }

        useEffect(()=>{
            const checkMessage = async () => {
                if (message === "callCambio"){
                    currentTurn + 1 < players+2 ? setCurrentTurn(currentTurn+1): setCurrentTurn(2);
                }
                else if (message === "endGame"){
                    endGame()
                }
                else if (webSocketData && webSocketData.type === "changeState"){
                    console.log("websocketData: ", webSocketData)
                    const card1Data = webSocketData.card1Data;
                    if (message === "draw"){
                        await animateDrawCard(cardRefs.current, card1Data.player)
                    }
                    else if (message === "discard"){
                        const card2Data = webSocketData.card2Data
                        const pileCard = cards[card1Data.player][0]
                        const discardedCard = cards[card2Data.player].find((card) => card.row === card2Data.row && card.col === card2Data.column)

                        await animateDiscardCard(cardRefs.current, pileCard, discardedCard, getAngle(card2Data), radius, trigger, triggerVar)
                    }
                    else if (message === "look"){
                        let isMyTurn;
                        if (thisUser === currentTurn){
                            isMyTurn = true;
                        }
                        else{
                            isMyTurn = false;
                        }
                        const cardToAnimate = cards[card1Data.player].find((card) => card.row === card1Data.row && card.col === card1Data.column)
                        await animateLookCard(cardRefs.current, cardToAnimate, trigger, triggerVar, isMyTurn)
                    }
                    else if (message === "swap"){
                        console.log("WEBSOCKET contents on swap: ", webSocketData)
                        const card2Data = webSocketData.card2Data
                        const card1 = cards[card1Data.player].find((card) => card.row === card1Data.row && card.col === card1Data.column)
                        const card2 = cards[card2Data.player].find((card) => card.row === card2Data.row && card.col === card2Data.column)

                        console.log("card1: ", card1)
                        console.log("card2: ", card2)


                        await animateSwapCard(cardRefs.current, card1, card2, getAngle(card1Data), getAngle(card2Data), radius)
                    }
                    webSocketData.cards !== null ? setCards(webSocketData.cards) : null;
                    setState(webSocketData.state)
                }
            }
            checkMessage();
        }, [message])


        useEffect(()=>{
            if (gameStarted){
                cards[thisUser][0].card.visible = false
                cards[thisUser][1].card.visible = false
            }
        }, [gameStarted])


        // updates necessary vars on game state change after websocket broadcast
        useEffect(()=>{
            // also deals with any messages set in after websocket broadcast as message and state are updated at the same time
            message === "discard" ? setLastToDiscard(currentTurn) : null;
            // if the state resets to draw, update the current player
            if (message !== "returnedState"){
                if (state == 0 && gameStarted){
                    currentTurn + 1 < players+2 ? setCurrentTurn(currentTurn+1): setCurrentTurn(2);
                }
            // if the player needs to swap cards, update the buttons for the active user to represent s wapping
                else if (state === 4 || state == 5){
                    thisUser === currentTurn ? setButtonMessage("Swap") : setButtonMessage("Cambio");
                }
            }   
        }, [state])

        useEffect(()=>{
            if (thisUser === currentTurn && cambio){
                const sendEndgameRequest = async () => {
                    try{
                        await axios.post(backendSite + `endGame/${lobbyID}`)
                    }
                    catch(e){
                        console.error("ERROR: ", e)
                    }
                }
                sendEndgameRequest()
            }
        }, [currentTurn])


    // updates bool deciding whether this user is currently able to flip cards
    useEffect(()=> {
        // cannot flip if the discard pile is empty
        const cardLength = Array.isArray(cards[1]) ? cards[1].length : 0;
        // cannot flip if this user was the last to discard a card
        cardLength === 0 || lastToDiscard === thisUser ? setCanFlip(false) : setCanFlip(true);
    }, [cards, lastToDiscard])


    /**
     * alerts the backend to this user's ready status, and updates the button visually to represent ready / not ready
     */
    const gameReadyUp = async() =>{
        try{
            readyButtonStyle === "button-unready" ? setReadyButtonStyle("button-ready") : setReadyButtonStyle("button-unready")
            await axios.post(backendSite + "gameReadyUp", {lobbyID: lobbyID, player: {nickname: nickname}})
        }
        catch(e){
            console.error("ERROR: ", e)
        }
    }

    // swaps the two cads in the selectedSwapCards array 
    const swapCards = async (swap) => {
        try{
            // correctly formats the data required by the swapcards backend function
            console.log("selectswapcard: ", selectedSwapCards)
            const swapRequest = {
                swap: swap,
                card1: {player : selectedSwapCards[0].player, row: selectedSwapCards[0].row, column: selectedSwapCards[0].col},
                card2: {player : selectedSwapCards[1].player, row: selectedSwapCards[1].row, column: selectedSwapCards[1].col},
            };
            // ensures any cards looked at by a look swap are reset
            if (state === 5){
                for (let x = 0; x < selectedSwapCards.length; x++){
                    selectedSwapCards[x].card.visible = false
                }
            }
            // resets used variables
            setSelectedSwapCards([])
            setButtonMessage("Cambio")
            // posts swapCards request to backend
            await axios.post(backendSite + `swapCards/${lobbyID}`, swapRequest, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
        }
        catch(e){
            console.error("ERROR: ", e)
        }
    }

    const cambioClick = async () => {
        if (thisUser === currentTurn && state === 0){
            try{
                setCambio(true);
                console.log("state", state)
                await axios.post(backendSite + `cambio/${lobbyID}`)
            }
            catch(e){
                console.error("ERROR: ", e)
            }
        }
    }
    // when the game ends, sets all cards to visible for 5 seconds before entering engGame page
    const endGame = async () => {
        setState(-1)
        for (let x = 2; x < cards.length; x++){
            for (let y = 0; y < cards[x].length; y++){
                if (cards[x][y] !== null){
                    cards[x][y].card.visible = true;
                }
            }
        }
        await trigger(triggerVar+1)
        await sleep(5000)
        for (let x = 2; x < cards.length; x++){
            for (let y = 0; y < cards[x].length; y++){
                if (cards[x][y] !== null){
                    cards[x][y].card.visible = false;
                }
            }
        }
        trigger(triggerVar+1)
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
                <div ref={tableRef} className="game-table" style = {{transform: `rotate(${tableRotation}deg)`}}>
                    <div className="card-row-container" style = {{transform: `rotate(${centerCardRotation}deg) scale(${centerScaleFactor})`}}>
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
                                    { buttonMessage === "Ready" ? () => gameReadyUp() 
                                    : buttonMessage === "Swap" ? () => swapCards(true) 
                                    : buttonMessage === "Cambio" ? () => cambioClick() 
                                    : null}
                            >
                                {buttonMessage}
                            </button>
                            {(state === 5 || state === 4) && thisUser == currentTurn && (
                                <button className= {`game-button ${readyButtonStyle}`} onClick= {() => swapCards(false)}>
                                    keep
                                </button>
                            )}
                        </div>
                    </div>
                    {// iterates through every player, ensuring each player has a hand, and updating the position of the cards according to the player index
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
        return(
            <EndGamePage setGameScreen={setGameScreen}/>
        );
    }
};

export default GameContent;