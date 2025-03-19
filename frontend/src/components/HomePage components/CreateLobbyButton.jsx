import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../../pages/Body.css"


function CreateLobbyButton({}){

    const navigate = useNavigate();
    
    const backendSite =  "https://cambio-backend-2smc.onrender.com"
    /**
     * when a user clicks on the create lobby button, sends a backend request to create the lobby
     * then retrieves the lobbyID from the backend and navigates to the new lobby page
     */
    const handleClick = async () => {
        try{
            const result= await axios.post(backendSite + "/createLobby");
            const lobbyID = result.data;
            navigate(`/lobby/${lobbyID}`);
        }   
        catch{
            console.error("error fetching from backend");
        }
    }

    // returns a button to allow users to create a lobby
    return(
        <button className="button create-lobby-button" onClick={handleClick}>Create Lobby</button>
    );
}

export default CreateLobbyButton;