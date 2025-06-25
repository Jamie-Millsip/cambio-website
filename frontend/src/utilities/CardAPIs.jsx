import axios from "axios"

// should figure out a way to save permanent vars here (like lobbyID and backendSite)

const backendSite = "http://localhost:8080/";
//const backendSite = "https://cambio-backend-2smc.onrender.com/"


const flipCard = async (state, thisUser, cardIndex, row, col, currentTurn, thisCard, lobbyID, cards) => {
    if (cardIndex > 1){
        try{
            const flipData = {
                state: state,
                thisPlayer: thisUser,
                positionData: {player: cardIndex, row: row, column: col},
                currentTurn: currentTurn
            }
            if (thisCard.card.face === cards[1][0].card.face){
                await axios.post(backendSite + `flipCardSuccess/${lobbyID}`, flipData, {
                    "Content-Type" : "application/json"
                })
            }
            else{
                await axios.post(backendSite + `flipCardFail/${lobbyID}`, flipData, {
                    "Content-Type" : "application/json"
                })
            }
        }
        catch(e){
            console.error("ERROR: ", e)
        }
    }
}


const giveCard = async (cardIndex, row, col, lobbyID) => {
    try{
        const giveData = {
            player: cardIndex, 
            row: row, 
            column: col
        }
        await axios.post(backendSite + `giveCard/${lobbyID}`, giveData, {
            "Content-Type" : "application/json"
        })
    }
    catch(e){
        console.error("ERROR: ", e)
    }
}


const drawCard = async (cards, cardIndex, trigger, triggerVar, lobbyID, setSelectedPile, setHasActed) => {
    // let the user draw a card if it is their turn and they are selecting a pile to draw from
    try{
        setHasActed(true)
        cards[cardIndex][0].card.visible = true
        trigger(triggerVar+1)
        setSelectedPile(cardIndex)
        await axios.post(backendSite + `drawCard/${lobbyID}`, cardIndex, {headers: {"Content-Type":"application/json"}})
    }
    catch(e){
        console.error("ERROR: ", e)
    }
}


/**
 * checks if discarding the selected card is a valid move, if so, sends a request to the backend to discard the selected card
 */
const discardCard = async (thisUser, selectedPile, cardIndex, row, col, lobbyID, setHasActed) => {
    // let a user discard a card if it is their turn and they select either the newly drawn card or one of their own cards 
    try{
        setHasActed(true)
        const requestData = {
            pile: selectedPile,
            cardIndex: cardIndex,
            player: thisUser,
            row: row,
            col: col
        };
        await axios.post(backendSite + `discardCard/${lobbyID}`, requestData, {
            "Content-Type" : "application/json"
        })
    }
    catch(e){
        console.error("ERROR: ", e)
    }
}

const lookCard = async (cardIndex, row, col, lobbyID, setHasActed) => {
    const posData = {
        player: cardIndex,
        row: row,
        column: col
    }
    try{
        setHasActed(true)
        await axios.post(backendSite + `look/${lobbyID}`, posData, {
            "Content-Type" : "application/json"
        })
    }
    catch(e){
        console.error("ERROR: ", e)
    }
}

// swaps the two cads in the selectedSwapCards array 
const swapCards = async (swap, selectedSwapCards, setSelectedSwapCards, setButtonMessage, state, lobbyID, setHasActed) => {
    try{
        if (selectedSwapCards.length !== 2){
            return
        }
        else{
            setHasActed(true)
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
    }
    catch(e){
        console.error("ERROR: ", e)
    }
}

export {flipCard, giveCard, drawCard, discardCard, lookCard, swapCards}