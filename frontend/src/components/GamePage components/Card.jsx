import { useContext, useEffect, useState } from "react";
import LobbyContext from "../../pages/LobbyContext";
import axios from "axios";
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
function Card ({thisUser, cardIndex, playerIndex, row, col, scaleFactor, state}){


    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
    
    const {currentTurn, cards, lobbyID, selectedSwapCards, setSelectedSwapCards} = useContext(LobbyContext)

    const [triggerVar, trigger] = useState(0)
    const [selectedPile, setSelectedPile] = useState();
    const [currentTurnStyle, setCurrentTurnStyle]=useState("")
    const [thisCard, setThisCard] = useState(null);
    const [suit, setSuit] = useState("")
    const cardStyle = {"--scale-factor": scaleFactor}



    useEffect(() => {
        if (cards && cards[cardIndex]) {
            const foundCard = cards[cardIndex].find(
                (card) => card && card.player === playerIndex && card.row === row && card.col === col
            );
            setThisCard(foundCard || null);
        }
    }, [cards, cardIndex, playerIndex, row, col]);

    const drawCard = async () => {
        // let the user draw a card if it is their turn and they are selecting a pile to draw from
        if (thisUser === currentTurn && cardIndex < 2){
            try{
                console.log("cards: ", cards)
                cards[cardIndex][0].card.visible = true
                trigger(1)
                setSelectedPile(cardIndex)
                await axios.post(`http://localhost:8080/drawCard/${lobbyID}`, cardIndex, {headers: {"Content-Type":"application/json"}}) // figure out what inputs are needed
            }
            catch(e){
                console.error("ERROR: ", e)
            }
        }
    }


    /**
     * checks if discarding the selected card is a valid move, if so, sends a request to the backend to discard the selected card
     */
    const discardCard = async () => {
        // let a user discard a card if it is their turn and they select either the newly drawn card or one of their own cards 
        if (thisUser === currentTurn && (cardIndex === selectedPile || playerIndex === thisUser)){
            try{
                cards[cardIndex][0].card.visible = false;
                trigger(1)
                const requestData = {
                    pile: selectedPile,
                    player: cardIndex,
                    row: row,
                    col: col
                }
                await axios.post(`http://localhost:8080/discardCard/${lobbyID}`, requestData, {
                    "Content-Type" : "application/json"
                })
            }
            catch(e){
                console.error("ERROR: ", e)
            }
        }
    }

    const lookCard = async () => {
        if ((state == 2 && thisUser == playerIndex || state == 3 && thisUser != playerIndex)){
            thisCard.card.visible = true
            await sleep(10)
            trigger(1)
            await sleep(1500)
            thisCard.card.visible = false
            try{
                await axios.post(`http://localhost:8080/look/${lobbyID}`)
            }
            catch(e){
                console.error("ERROR: ", e)
            }
        }
    }

    const swapCard = async () => {
        if (state == 4 || state == 5)
        if (selectedSwapCards.length < 2){
            setSelectedSwapCards((selectedSwapCards) => [...selectedSwapCards, thisCard])
            console.log("selectedSwapCards: ", selectedSwapCards)
            if (state == 5){
                const isVisible = thisCard.card.visible
                thisCard.card.visible = !isVisible
                trigger(1)
            }
            
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


    const card = returnCardContents()
    card.card.suit === "Diamonds" || card.card.suit === "Hearts" ? setSuit("red-card") : setSuit("black-card");

    if (card === null){
        return(
            <div key={`card-${row}${col}${playerIndex}`} className={`game-card game-card-space`}>
                <span className="card-text" style={{cardStyle}}></span>
                </div>
        )
    }
    else if (card.card.visible == false){
        return(
            <button 
                className={`game-card face-down ${currentTurnStyle}`} 
                onClick=
                    {state === 0 ? drawCard
                    : state === 1 ? discardCard
                    : state === 2 || state === 3 ? lookCard
                    : state === 4 || state === 5 ? swapCard
                    : null
                    }>
                <span className="card-text" style={{cardStyle}}></span>
            </button>
        )
    }
    

    return(
        <button
        className={`game-card face-up ${suit} ${currentTurnStyle}`} 
        onClick=
            {state === 0 ? drawCard
            : state === 1 ? discardCard
            : state === 2 || state === 3 ? lookCard
            : state === 4 || state === 5 ? swapCard
            : null
            }>
            <span className="card-text" style={{cardStyle}}>
            {card.card.face}
            </span>            
        </button> 
    )
}


export default Card