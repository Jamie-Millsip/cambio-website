import axios from "axios"

//const backendSite = "http://localhost:8080";
const backendSite = "https://cambio-backend-2smc.onrender.com/"


const gameReadyUp = async(readyButtonStyle, setReadyButtonStyle, backendSite, lobbyID, nickname) =>{
    try{
        readyButtonStyle === "button-unready" ? setReadyButtonStyle("button-ready") : setReadyButtonStyle("button-unready")
        await axios.post(backendSite + "gameReadyUp", {lobbyID: lobbyID, player: {nickname: nickname}})
    }
    catch(e){
        console.error("ERROR: ", e)
    }
}



// if this user calls cambio on their turn, alert the backend
const cambioClick = async (thisUser, currentTurn, state, backendSite, lobbyID, setCambio) => {
    if (thisUser === currentTurn && state === 0){
        try{
            setCambio(true);
            await axios.post(backendSite + `cambio/${lobbyID}`)
        }
        catch(e){
            console.error("ERROR: ", e)
        }
    }
}


const sendEndgameRequest = async (sleep, backendSite, lobbyID) => {
    try{
        // wait for end of turn broadcast to finish
        await sleep(30)
        await axios.post(backendSite + `endGame/${lobbyID}`)
    }
    catch(e){
        console.error("ERROR: ", e)
    }
}

export {sendEndgameRequest, gameReadyUp, cambioClick}