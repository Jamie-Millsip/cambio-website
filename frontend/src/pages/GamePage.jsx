import React, { useContext, useEffect, useRef, useState } from "react";
import "./Game.css"
import "./Body.css"
import LobbyContext from "./LobbyContext";
import axios from "axios";
import Stomp from 'stompjs';
import Card from "../components/GamePage components/Card";

/**
 * this page is used to display the game board and cards
 * 
 * @param {int} players - stores how many players are in the game currently
 * @param {int} playerIndex - stores the player index of the current player
 * @returns well it returns the game board and cards for the users to play the game, isnt that a bit obvious
 */
const TestPage = ({ players, thisUser}) => {

    const {lobbyID, nickname, setCurrentTurn, cards, setCards, currentTurn, selectedSwapCards, setSelectedSwapCards, backendSite} = useContext(LobbyContext);
    const [gameStarted, setGameStarted] = useState(false)
    const [readyButtonStyle, setReadyButtonStyle] = useState("button-unready")
    const [state, setState] = useState(0)
    const [buttonMessage, setButtonMessage] = useState("Ready")
    const [buttonClassVar, setButtonClassVar] = useState("")
    const [lastToDiscard, setLastToDiscard] = useState(0)
    const [canFlip, setCanFlip] = useState(false)
    const [ buttonXTranslate, setButtonXTranslate] = useState(0);
    const [ buttonYTranslate, setButtonYTranslate] = useState(0);


    const tableRef = useRef(null)

    // define vars used in correctly displaying the dynamic game board
    let radius = 270 + players*4;
    let scaleFactor = 1.4 - players/40;
    let centerScaleFactor = scaleFactor*1.4
    let tableRotation = -((thisUser * 360) / players);
    let centerCardRotation = -tableRotation
    let scale = `scale(${scaleFactor})`;
    
    const webSocket = 'ws://localhost:8080/ws/lobby'

        useEffect(() => {
            const socket = new WebSocket(webSocket);
            const client = Stomp.over(socket);
    
            client.debug = () => {};
    
            client.connect({}, () => {
                client.subscribe(`/topic/game/${lobbyID}`, (message) => {
                    const recievedMessage = JSON.parse(message.body);
                    if (recievedMessage.type == "gameStart"){
                        setGameStarted(true)
                        setCurrentTurn(0)
                    }
                    else if (recievedMessage.type == "changeState"){
                        if (recievedMessage.cards != null){
                            setCards(recievedMessage.cards)
                        }
                        setState(recievedMessage.state)

                    }
                },
                (error) => {console.error("error subscribing: ", error)}
            )},
            (error) => {console.error("websocket connection failed: ", error)})
    
            window.addEventListener("beforeunload", handleUnload)
            return() => {window.removeEventListener("beforeunload", handleUnload)}   
        }, [lobbyID]);

        const handleUnload = () =>{

        }
        useEffect(()=>{
            if (gameStarted){
                cards[thisUser+2][0].card.visible = false
                cards[thisUser+2][1].card.visible = false
            }
        }, [gameStarted])

        useEffect(()=>{
            if (state == 0 && gameStarted){
                curentTurn + 1 < players ? setCurrentTurn(currentTurn+1): setCurrentTurn(0);
            }
        }, [state])



    useEffect(()=>{
        if (state === 4 || state == 5){
            thisUser === currentTurn ? setButtonMessage("Swap") : setButtonMessage("Cambio");
        }
    }, [state])


    useEffect(()=> {
        cards[1].length === 0 || lastToDiscard === thisUser ? setCanFlip(false) : setCanFlip(true);
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

    const swapCards = async (swap) => {
        try{
            const swapRequest = {
                swap: swap,
                card1: {player : selectedSwapCards[0].player, row: selectedSwapCards[0].row, col: selectedSwapCards[0].col},
                card2: {player : selectedSwapCards[1].player, row: selectedSwapCards[1].row, col: selectedSwapCards[1].col},
            };

            for (let x = 0; x < selectedSwapCards.length; x++){
                selectedSwapCards[x].card.visible = false
            }
            setSelectedSwapCards([])
            setButtonMessage("Cambio")
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

    // when the game starts, update the button text and resets its visual indicator
    useEffect(()=>{
        if (gameStarted){
            setButtonMessage("Cambio")
            setReadyButtonStyle("button-unready"); 
        }
    }, [gameStarted])


    // dynamically updates the position of the game button
    useEffect(()=>{
        const updateWindow = () =>{
            if (tableRef.current){
                const tableDim = tableRef.current.getBoundingClientRect()
                setButtonXTranslate(tableDim.right*0.8)
                setButtonYTranslate(tableDim.bottom/4)
            }
        }
        updateWindow()
        window.addEventListener("resize", updateWindow)

        return() => window.removeEventListener("resize", updateWindow)
    }, [])




  return (
    <div className = "body-container" key = "body">
        <div ref={tableRef} className="game-table" style = {{transform: `rotate(${tableRotation}deg)`}}>
            <div className="card-row-container" style = {{transform: `rotate(${centerCardRotation}deg) scale(${centerScaleFactor})`}}>
                <div className="card-row">
                    {Array.from({length: 2}).map((_, index) =>{
                        return(
                            <Card 
                            key={`centerCard-${index}`}
                            thisUser={thisUser}
                            cardIndex={index}
                            playerIndex={-1}
                            row={-1} 
                            col={-1}
                            state={state}
                            setLastToDiscard={setLastToDiscard}
                            canFlip={canFlip}/>
                        )
                    })}
                </div>
                <div className="button-row">
                    <button className={`game-button ${readyButtonStyle} ${buttonClassVar}`} onClick={buttonMessage === "Ready" ? ()=>gameReadyUp() : buttonMessage === "Swap" ? ()=>swapCards(true) : null}>
                        {buttonMessage}
                    </button>
                    {(state === 5 || state === 4) && thisUser == currentTurn && (
                        <button className={`game-button ${readyButtonStyle} ${buttonClassVar}`} onClick={() => swapCards(false)}>
                        keep
                    </button>
                    )}
                </div>
            </div>
            {Array.from({ length: players }).map((_, index) => {
                const angle = (index * 360) / players + 90;
                return (
                    <div className = {`card-row-container`} key={`card-row-container-${index}`} style = {{transform: `rotate(${angle}deg) translate(${radius}%) rotate(-90deg) ${scale}`}}>
                        {Array.from({length: 3}).map((_, row) => (
                        <div className = {`card-row`} key={`card-row-${row}-${index}`}>
                            {Array.from({length: 2}).map((_, col) => {
                                return(
                                    <Card 
                                        key={`card-${col}-${row}-${index}`} 
                                        thisUser={thisUser} 
                                        cardIndex={index+2} 
                                        playerIndex={index}
                                        row={row}
                                        col={col}
                                        state={state}
                                        setLastToDiscard={setLastToDiscard}
                                        canFlip={canFlip}/>
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
};

export default TestPage;
