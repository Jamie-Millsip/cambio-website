import axios from "axios";
import "../../../pages/Body.css"
import DisplayLobbyNames from "./DisplayLobbyNames";
import LobbyContext from "../../../pages/LobbyContext";
import { useContext } from "react";

function LobbyReadyUpView(){

    const {lobbyID, nickname, backendSite} = useContext(LobbyContext);



    const readyUp = async () => {
        try{
            await axios.post(backendSite + "lobbyReadyUp", {lobbyID: lobbyID, player: {nickname: nickname}});
        }
        catch (e){console.error("ERROR readying up: ", e)}
    }


    return(
        <>
        <p className="title">Ready Up to Play</p>
        <DisplayLobbyNames/>
        <button className="button ready-up-button" onClick={readyUp}>Ready Up</button>
        </>
    )
}

export default LobbyReadyUpView;