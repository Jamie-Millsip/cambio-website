import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../../pages/Body.css"


function CreateLobbyButton({}){

    const navigate = useNavigate();

    const handleClick = async () => {
        try{
            const result= await axios.post("http://localhost:8080/createLobby");
            console.log("lobbyID: ",result.data);
            const lobbyID = result.data;
            navigate(`/lobby/${lobbyID}`);
        }
        catch{
            console.log("error fetching from backend");
        }
    }

    return(
        <>
            <button className="button create-lobby-button" onClick={handleClick}>Create Lobby</button>
        </>
    );
}

export default CreateLobbyButton;