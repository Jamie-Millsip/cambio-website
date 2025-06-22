import axios from "axios";
import "../../../pages/Body.css"
import DisplayLobbyNames from "./DisplayLobbyNames";
import LobbyContext from "../../../pages/LobbyContext";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function LobbyReadyUpView({playerCount, messageArray}){

    const {lobbyID, backendSite, nicknameRef} = useContext(LobbyContext);

    const playerCountWarning = "WARNING: this game is designed for 2-8 players. To continue anyway, press 'Ready Up' again ";
    const [showWarning, setShowWarning] = useState(false)




    const readyUp = async () => {
        const PlayerCountInBounds = checkPlayerCount()
        if ((!PlayerCountInBounds && showWarning) || PlayerCountInBounds){
            try{
                await axios.post(backendSite + "lobbyReadyUp", {lobbyID: lobbyID, player: {nickname: nicknameRef.current}});
            }
            catch (e){console.error("ERROR readying up: ", e)}
        }
        else{
            setShowWarning(true)
        }
    }

    const checkPlayerCount = () => {
        if ((playerCount < 2 || playerCount > 10) ){
            return false;
        }
        return true;
    }


    return(
        <>
        <p className="title">Ready Up to Play</p>
        <DisplayLobbyNames messageArray={messageArray}/>
        {showWarning && (
            <p className="warning-message">{playerCountWarning}</p>
        )}
        <button className="button ready-up-button" onClick={readyUp}>Ready Up</button>
        </>
    )
}

export default LobbyReadyUpView;