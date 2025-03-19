import HomeContent from '../components/HomePage components/HomeContent'; 
import {useState} from 'react';
import axios from 'axios';

import "./Body.css"
import { useNavigate } from 'react-router-dom';

/**
 * page to display main menu contents
 * 
 * @returns HomeContent component, providing the user the means to input a lobby ID to join an existing lobby,
 * or create a new lobby
 */
function HomePage(){
  
  const [lobbyID, setLobbyID] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const navigate = useNavigate();

  const backendSite = "https://cambio-backend-2smc.onrender.com/api/"

  /**
   * Handles the response to users clicking on the button to enter a lobby after inputting a lobby ID
   * 
   * updates errMessage var to display an error message if the backend rejects the lobby ID
   * 
   * if the lobby ID is valid, navigates to the lobby page
   */
  const handleClick = async () => {
    try{
      const result = await axios.post(backendSite + "verifyHomePageData", {id: lobbyID});
      console.log("RESULTS OF VERIFY: ", result.data)
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

  
  return(
    <div className='body-container'>
      <div className='contents-container'>
        <HomeContent 
          lobbyID={lobbyID} 
          setLobbyID={setLobbyID} 
          buttonResponse = {handleClick} 
        />
          {errMessage}
      </div>
    </div>
  )
}

export default HomePage;