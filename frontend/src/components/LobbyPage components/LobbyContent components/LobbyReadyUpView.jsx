import axios from "axios";
import "../../../pages/Body.css"
import DisplayLobbyNames from "./DisplayLobbyNames";
import LobbyContext from "../../../pages/LobbyContext";
import { useContext } from "react";

function LobbyReadyUpView({messageArray}){

    const {lobbyID, backendSite, nicknameRef} = useContext(LobbyContext);



    const readyUp = async () => {
        try{
            await axios.post(backendSite + "lobbyReadyUp", {lobbyID: lobbyID, player: {nickname: nicknameRef.current}});
        }
        catch (e){console.error("ERROR readying up: ", e)}
    }


    return(
        <>
        <p className="title">Ready Up to Play</p>
        <DisplayLobbyNames messageArray={messageArray}/>
        <button className="button ready-up-button" onClick={readyUp}>Ready Up</button>
        </>
    )
}

export default LobbyReadyUpView;