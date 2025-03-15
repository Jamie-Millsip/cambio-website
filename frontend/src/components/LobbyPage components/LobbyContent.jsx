import LobbyReadyUpView from './LobbyContent components/LobbyReadyUpView.jsx';
import EnterNicknameView from './LobbyContent components/EnterNicknameView.jsx';
import ErrorView from './LobbyContent components/ErrorView.jsx';
import { useEffect, useContext, useState, useRef } from "react";
import Stomp from 'stompjs';
import axios from 'axios';
import TestPage from '../../pages/GamePage.jsx';
import LobbyContext from '../../pages/LobbyContext.jsx';
import "../../pages/Body.css";

function LobbyContent({lobbyID}){

    const {
        cards, 
        setCards,
        setLobbyID,
        backendSite,
        messageArray, 
        setMessageArray,
    } = useContext(LobbyContext);

        const [exists, setExists] = useState(false)
        const [gameScreen, setGameScreen] = useState(false)
        const [hasNickname, setHasNickname] = useState(false)
        const [loading, setLoading] = useState(true);
        const [playerCount, setPlayerCount] = useState("");
        let nicknameRef = useRef("")

        const [thisUser, setThisUser] = useState(-1); 
        const [playerLeaveFlag, setPlayerLeaveFlag] = useState(false)
        let cardRef = useRef([])
        let thisUserRef = useRef(0);
        
        const webSocket = 'ws://localhost:8080/ws/lobby'

    // as lobbyID is taken from the URL and passed into lobbyContent,
    // it needs to be saved to the useContext for use in other files
    useEffect(()=>(
        setLobbyID(lobbyID)
    ), []);

    // manages a websocket connection to the backend and handles any broadcasts sent from the backend
    useEffect(() => {
        const socket = new WebSocket(webSocket);
        const client = Stomp.over(socket);

        client.debug = () => {};

        client.connect({}, () => {
            client.subscribe(`/topic/${lobbyID}`, (message) => {
                const recievedMessage = JSON.parse(message.body);
                if (recievedMessage.type == "playerNames"){
                    setMessageArray(recievedMessage.playerReadyArray)
                }
                else if (recievedMessage.type == "enterGameView"){
                    setGameScreen(true);
                }
                else if (recievedMessage.type == "removedPlayer"){
                    setMessageArray(recievedMessage.playerReadyArray)
                    setPlayerLeaveFlag(true)
                }
            },
            (error) => {console.error("error subscribing: ", error)}
        )},
        (error) => {console.error("websocket connection failed: ", error)})

        window.addEventListener("beforeunload", handleUnload)
        return() => {window.removeEventListener("beforeunload", handleUnload)}   
    }, [lobbyID]);

    /**
     * posts to the backend on tab exit
     * 
     * .sendBeacon() is used to ensure the post sends even in event of forced tab closure
     */
    const handleUnload = () => {
        navigator.sendBeacon(
            backendSite + `/removePlayer/${lobbyID}`,
            (nicknameRef.current)
        );
    };
    
    // once all player's have readied up, fetches the cards from the backend to correctly display the game board
    useEffect( ()=>{
        const gameStartFunc = async () => {
            if (gameScreen){
                setPlayerCount(messageArray.length)
                try{
                    const result = await axios.post(backendSite + `/getCards/${lobbyID}`)
                    if (result.data != null){
                        setCards(result.data.cards)
                        result.data.cards[thisUser+2][0].card.visible = true;
                        result.data.cards[thisUser+2][1].card.visible = true;
                    }
                }
                catch(e){
                    console.error("ERROR: ", e)
                }
            }
        }
        gameStartFunc() 
    }, [gameScreen, playerLeaveFlag])

    // updates the pointer to the cards array (cardsRef) whenever the cards array is updated
    useEffect(()=>{
        cardRef.current = cards
    }, [cards])


    // fetches the index of the current player from the playerList stored in the backend,
    // sets their bottom two cards to visible, preparing for the start of the game
    useEffect( () => {
        const getUserIndex = async () => {
            console.log("cards are now: ", cards)
            if (hasNickname){
                try{
                    const result = await axios.post(backendSite + `/getThisUserIndex/${lobbyID}`, {nickname: nicknameRef.current})
                    if (result.data !== -1){
                        setThisUser(result.data)
                        thisUserRef.current = result.data;
                    }
                }
                catch(e){
                    console.error("ERROR: ", e)
                }
            }
        }
        getUserIndex()
    }, [hasNickname, cards])

    useEffect( () => {
        const updateUserIndex = async () => {
            console.log("userIndex to be updated")
            if (hasNickname){
                try{
                    const result = await axios.post(backendSite + `/getThisUserIndex/${lobbyID}`, {nickname: nicknameRef.current})
                    if (result.data !== -1){
                        setThisUser(result.data)
                        thisUserRef.current = result.data;
                    }
                }
                catch(e){
                    console.error("ERROR: ", e)
                }
                setPlayerLeaveFlag(false)
            }
        }
        updateUserIndex()

    }, [playerLeaveFlag])

    /**
     * checks if the lobby the user has entered exists or not
     * 
     * ** homepage deals with any attempts to join non existent lobbies via the webpage, but
     * this prevents users from typing incorrect lobby codes in the URL and being able to join
     * non existent lobbies
     */
    const checkLobby = async () => {
        try{
            const result = await axios.post(backendSite + `/verifyHomePageData`, {id : lobbyID});
            if (result.data === 3) setExists(true);
            else setExists(false);

            setLoading(false);
        }
        catch(e) {console.error(e)}
    }

    // runs the checkLobby function once only when the user first loads the lobbyPage
    useEffect(() => { checkLobby() }, []);

    if (!gameScreen){
        return(
            <div className="body-container">
            <div className="contents-container">
                {!exists && !loading && (<ErrorView/>)}

                {!hasNickname && exists && (
                    <EnterNicknameView
                        nicknameRef={nicknameRef}
                        setHasNickname={setHasNickname}
                    />)}

                {exists && !loading && hasNickname && (<LobbyReadyUpView/>)}
            </div>
        </div>
        )
    }
    else{
        return(
            <TestPage 
                players={playerCount} 
                thisUser = {thisUser}/>
        )
    }
}

export default LobbyContent;