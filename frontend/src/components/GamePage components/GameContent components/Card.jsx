import { forwardRef, useContext, useEffect, useState } from "react";
import { drawCard, discardCard, lookCard, flipCard, giveCard} from "../../../utilities/CardAPIs"
import LobbyContext from "../../../pages/LobbyContext";
import GameContext from "../../../pages/GameContext";
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

const  Card = forwardRef(({thisUser, cardIndex, row, col, cards}, ref) => {
    
    const {lobbyID, selectedSwapCards, setSelectedSwapCards, backendSite} = useContext(LobbyContext)
    const {currentTurn, state, canFlip, trigger, triggerVar, selectedPile,
        isAnimating, setSelectedPile, setHasActed, hasActed} = useContext(GameContext);

    const [currentTurnStyle, setCurrentTurnStyle]=useState("")
    const [thisCard, setThisCard] = useState(null);
    const [canDraw, setCanDraw] = useState(false);
    const [canDiscard, setCanDiscard] = useState(false);
    const [canLook, setCanLook] = useState(false)
    const [canGiveCard, setCanGiveCard] = useState(false)
    const [canSwap, setCanSwap] = useState(false)
    let card = null;



    useEffect(() => {
        if (cards && cards[cardIndex]) {
            const foundCard = cards[cardIndex].find(
                (card) => card && card.player === cardIndex && card.row === row && card.col === col
            );
            setThisCard(foundCard || null);
        }
    }, [cards]);

    useEffect(()=>{
        if (hasActed || isAnimating || thisUser !== currentTurn){
            setCanDraw(false)
            setCanDiscard(false)
            setCanLook(false)
            setCanSwap(false)
        }
        else{
            state === 0 && cardIndex < 2 ? setCanDraw(true): setCanDraw(false);
            
            state === 1 && (cardIndex === selectedPile || cardIndex === thisUser)
            ? setCanDiscard(true) : setCanDiscard(false);
            
            ((state === 2 && thisUser === cardIndex) || (state === 3 && thisUser !== cardIndex && cardIndex > 1))
            ? setCanLook(true) : setCanLook(false);
            
            cardIndex > 1 && ((state === 4 || state === 5) && selectedSwapCards.length < 2)
            ? setCanSwap(true) : setCanSwap(false)
        }
        state === 6 && thisUser === cardIndex
        ? setCanGiveCard(true) : setCanGiveCard(false)
    }, [state, thisUser, currentTurn, cardIndex, selectedPile, cardIndex, selectedSwapCards, hasActed, isAnimating])



    const handleClick = () => {
        canDraw ? drawCard(cards, cardIndex, trigger, triggerVar, lobbyID, setSelectedPile, setHasActed) : 
        canDiscard ? discardCard(thisUser, selectedPile, cardIndex, row, col, lobbyID, setHasActed) : 
        canLook ? lookCard(cardIndex, row, col, lobbyID, setHasActed) : 
        canSwap ? swapCard() : 
        canGiveCard ? giveCard(cardIndex, row, col, lobbyID) :
        canFlip ? flipCard(state, thisUser, cardIndex, row, col, currentTurn, thisCard, lobbyID, cards) : 
        null;
    }

    

    const swapCard = async () => {
        let card = selectedSwapCards.find((card) => row === card.row && cardIndex === card.player && card.col === col)
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
        else if (cardResponse.player == cardIndex && cardResponse.row == row && cardResponse.col == col){
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
        if (!cards || !cards[cardIndex] || cardIndex < 0){
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
        || (state === 1 && (cardIndex === currentTurn || cardIndex === selectedPile))
        // or the player needs to look at one of thier cards, and this is one of their cards
        || (state === 2 && cardIndex === thisUser)
        // or the player needs to look at someone else's card, and this is someone else's card
        || (state === 3 && (cardIndex !== thisUser && cardIndex > 1))
        // or the player needs to swap 2 cards, and this card belongs to a player and isnt already selected
        || ((state === 4 || state === 5) && cardIndex > 1 &&
        !selectedSwapCards.some(card => card !== null && card.player === cardIndex && card.row === row && card.col === col)
        && selectedSwapCards.length < 2)
        || (state === 6 && cardIndex === thisUser)
        && (!isAnimating)
        )){
            setCurrentTurnStyle("current-player")
        }
        // if clicking this card is not valid in the current game state
        else{
            setCurrentTurnStyle("")
        } 
    }, [currentTurn, state, thisUser, selectedSwapCards, isAnimating])


    card = returnCardContents()
    
    if (card === null || card.card === null){
        return(
            <div 
                key={`card-${row}${col}${cardIndex}`} 
                className={`game-card game-card-space`} 
                ref={ref}>
                <span className="card-text"></span>
                </div>
        )
    }
    else if (card.card.visible == false){
        return(
            <button
            ref={ref}
            className={`game-card face-down ${currentTurnStyle}`} 
            onClick={handleClick}>
                <span className="card-text"></span>
            </button>
        )
    }
    return(
        <button
            ref={ref}
            className={`game-card face-up ${currentTurnStyle}`}
            style={{color: (card.card.suit === "Diamonds" || card.card.suit === "Hearts") ? "red" : "black"}} 
            onClick={handleClick}>
            <span className="card-text"> {card.card.face} </span>            
        </button> 
    )
})


export default Card