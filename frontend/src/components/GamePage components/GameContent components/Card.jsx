import { useContext, useEffect, useState } from "react";
import LobbyContext from "../../../pages/LobbyContext";
import axios from "axios";
import GameContext from "../../../pages/GameContext";
import "../../../pages/Game.css";
/**
 * this component is responsible for each individual game card, identifying the correct way of displaying the card, and for correctly dealing
 * with user inputs relating to the cards (ie clicking them)
 * 
 * @param {int} thisUser - contains an index for the players array correlating to which users screen we are currently rendering
 * @param {int} cardIndex - contains an index for the cards array correlating to which hand / pile the card currently being rendered belongs to 
 * @param {int} playerIndex - contains an index for the cards players array correlating to which user the card currently being rendered belongs to
 * (typically cardIndex-2, or -1 for the draw / discard pile)
 * @param {int} row - contains an index for the player's hand identifying what row this card belongs to (-1 for piles)
 * @param {int} col - contains an index for the player's hand identifying what column this card belongs to (-1 for piles)
 * @param {int} scaleFactor - need to rework how everything is rendered, this will probs be removed when that occurs
 * 
 * @returns an interactive card object displayed onto the screen
 */
function Card ({thisUser, cardIndex, playerIndex, row, col, cards}){

    console.log("")

    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
    
    const {lobbyID, selectedSwapCards, setSelectedSwapCards, backendSite} = useContext(LobbyContext)
    const {currentTurn, state, setLastToDiscard, canFlip, trigger, triggerVar} = useContext(GameContext);

    const [selectedPile, setSelectedPile] = useState();
    const [currentTurnStyle, setCurrentTurnStyle]=useState("")
    const [thisCard, setThisCard] = useState(null);
    const [suit, setSuit] = useState("")
    let card = null;

    const [canDraw, setCanDraw] = useState(false);
    const [canDiscard, setCanDiscard] = useState(false);
    const [canLook, setCanLook] = useState(false)
    const [canSwap, setCanSwap] = useState(false)



    useEffect(() => {
        if (cards && cards[cardIndex]) {
            const foundCard = cards[cardIndex].find(
                (card) => card && card.player === playerIndex && card.row === row && card.col === col
            );
            setThisCard(foundCard || null);
        }
    }, [cards]);

    useEffect(()=>{
        // 

        state === 0 && thisUser === currentTurn && cardIndex < 2 ? setCanDraw(true): setCanDraw(false);

        state === 1 && thisUser === currentTurn && (cardIndex === selectedPile || playerIndex === thisUser) ? setCanDiscard(true) : setCanDiscard(false);

        thisUser === currentTurn && ((state === 2 && thisUser === playerIndex) || (state === 3 && thisUser !== playerIndex)) ? setCanLook(true) : setCanLook(false);

        thisUser === currentTurn && ((state === 4 || state === 5) && selectedSwapCards.length < 2) ? setCanSwap(true) : setCanSwap(false)

        !canDraw && !canDiscard && !canLook && !canSwap && canFlip
    }, [state, thisUser, currentTurn, cardIndex, selectedPile, playerIndex])



    const handleClick = () => {
        canDraw ? drawCard() : canDiscard ? discardCard() : canLook ? lookCard() : canSwap ? swapCard() : canFlip ? flipCard() : null;
    }

    const flipCard = async () => {
        if (canFlip){
            const flipData = {
                state: state,
                positionData: {player: playerIndex, row: row, column: col}
            }
            try{
                await axios.post(backendSite + `flipCard/${lobbyID}`, flipData, {
                    "Content-Type" : "application/json"
                })
            }
            catch(e){
                console.error("ERROR: ", e)
            }
        }
    }

    const drawCard = async () => {
        // let the user draw a card if it is their turn and they are selecting a pile to draw from
        console.log("draw")
        try{
            cards[cardIndex][0].card.visible = true
            trigger(triggerVar+1)
            setSelectedPile(cardIndex)
            await axios.post(backendSite + `drawCard/${lobbyID}`, cardIndex, {headers: {"Content-Type":"application/json"}}) // figure out what inputs are needed
        }
        catch(e){
            console.error("ERROR: ", e)
        }
    }


    /**
     * checks if discarding the selected card is a valid move, if so, sends a request to the backend to discard the selected card
     */
    const discardCard = async () => {
        // let a user discard a card if it is their turn and they select either the newly drawn card or one of their own cards 
        try{
            cards[cardIndex][0].card.visible = false;
            trigger(triggerVar+1)
            const requestData = {
                pile: selectedPile,
                player: cardIndex,
                row: row,
                col: col
            };
            setLastToDiscard(thisUser);
            await axios.post(backendSite + `discardCard/${lobbyID}`, requestData, {
                "Content-Type" : "application/json"
            })
        }
        catch(e){
            console.error("ERROR: ", e)
        }
    }

    const lookCard = async () => {
        thisCard.card.visible = true
        await sleep(30)
        trigger(triggerVar+1)
        await sleep(1500)
        thisCard.card.visible = false
        try{
            await axios.post(backendSite + `look/${lobbyID}`)
        }
        catch(e){
            console.error("ERROR: ", e)
        }
    }

    const swapCard = async () => {
        let card = selectedSwapCards.find((card) => row === card.row && playerIndex === card.player && card.col === col)
        if (card){
            return;
        }
        setSelectedSwapCards((selectedSwapCards) => [...selectedSwapCards, thisCard])
        if (state == 5){
            thisCard.card.visible = true;
            trigger(triggerVar+1)
        }
    }

    /**
     * Purpose of this function is to compare the current card's position (stored in the player, row, int vars) with another cards position (stored in cardResponse) to check if they are the same, 
     * if so, the parent function that calls this is able to retrieve the data stored in cardResponse and display it to the screen
     * @param {cardResponse Object} cardResponse - is the card we are comparing the current card to, contains the card itself, along with vars to store its current location
     *
     * @returns true if the two card objects have the same index (player, row, column), otherwise returns false
     */
    const findCard = (cardResponse) => {
        if (cardResponse == null){
            return false
        }
        else if (cardResponse.player == playerIndex && cardResponse.row == row && cardResponse.col == col){
            return true
        }
        return false
    }

    /**
     * The purpose of this function is to compare the current card index to every card in the player's hand in order to find a matching card index and retrieve all
     * information related to the current card index, this is so the card can be displayed correctly
     * (eg if the card exists, if it is face down or face up, and if it is face up, what value does the card hold)
     *
     * @returns a CardResponse object (card itself along with location information) if the player has a card in that position, otherwise returns null
     */
    const returnCardContents = () => {
        if (!cards || !cards[cardIndex] || cards.length < 4 || cardIndex < 0){
            return null;
        }   
        const visibleCard = cards[cardIndex].find((card) => findCard(card))
        return visibleCard ? visibleCard : null
    }

    // updates the card styles when gameState changes
    useEffect(()=>{
        // if it is this user's turn
        if (thisUser == currentTurn
        // and the player needs to draw and this card belongs to the draw or discard pile
        && ((state === 0 && cardIndex < 2) 
        // or the player needs to discard and this card is one of theirs / the one they just drew
        || (state === 1 && (playerIndex === currentTurn || cardIndex === selectedPile))
        // or the player needs to look at one of thier cards, and this is one of their cards
        || (state === 2 && playerIndex === thisUser)
        // or the player needs to look at someone else's card, and this is someone else's card
        || (state === 3 && (playerIndex !== thisUser && cardIndex > 1))
        // or the player needs to swap 2 cards, and this card belongs to a player and isnt already selected
        || ((state === 4 || state === 5) && cardIndex > 1 &&
        !selectedSwapCards.some(card => card !== null && card.player === playerIndex && card.row === row && card.col === col))
        )){
            setCurrentTurnStyle("current-player")
        }
        // if clicking this card is not valid in the current game state
        else{
            setCurrentTurnStyle("")
        } 
    }, [currentTurn, state, thisUser, selectedSwapCards])


    card = returnCardContents()
    
    if (card === null){
        return(
            <div key={`card-${row}${col}${playerIndex}`} className={`game-card game-card-space`}>
                <span className="card-text"></span>
                </div>
        )
    }
    
    else if (card.card.visible == false){
        return(
            <button 
            className={`game-card face-down ${currentTurnStyle}`} 
            onClick={handleClick}>
                <span className="card-text"></span>
            </button>
        )
    }
    
    (card.card.suit === "Diamonds" || card.card.suit === "Hearts") ? setSuit("red-card") : setSuit("black-card")
    
    return(
        <button
            className={`game-card face-up ${suit} ${currentTurnStyle}`} 
            onClick={handleClick}>
            <span className="card-text"> {card.card.face} </span>            
        </button> 
    )
}


export default Card