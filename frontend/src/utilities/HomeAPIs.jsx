import axios from "axios";


//const backendSite = "http://localhost:8080/";
const backendSite = "https://cambio-backend-2smc.onrender.com/"

  /**
   * Handles the response to users clicking on the button to enter a lobby after inputting a lobby ID
   * 
   * updates errMessage var to display an error message if the backend rejects the lobby ID
   * 
   * if the lobby ID is valid, navigates to the lobby page
   */
    const joinLobbyAttempt = async (lobbyID, setErrMessage, navigate) => {
        try{
            const result = await axios.post(backendSite + "verifyHomePageData", {id: lobbyID});
            if (result.data === 0){
                setErrMessage("ERROR: No lobby Found");
            }
            else if (result.data === 2){
                setErrMessage("ERROR: Incorrect Format");
            }
            else{
                navigate(`/lobby/${lobbyID}`);
            }
        }
        catch(e){
            console.log("error fetching from backend: ", e);
        }
    }

    /**
     * when a user clicks on the create lobby button, sends a backend request to create the lobby
     * then retrieves the lobbyID from the backend and navigates to the new lobby page
     */
    const createLobby = async (navigate) => {
        try{
            const result= await axios.post(backendSite + "createLobby");
            const lobbyID = result.data;
            navigate(`/lobby/${lobbyID}`);
        }   
        catch(e){
            console.error("error fetching from backend", e);
        }
    }


export {joinLobbyAttempt, createLobby}