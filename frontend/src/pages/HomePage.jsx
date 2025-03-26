import { useState } from 'react';
import { joinLobbyAttempt, createLobby } from "../utilities/HomeAPIs"

import "./HomePage.css"
import { useNavigate } from 'react-router-dom';
import TextInput from '../components/TextInput';

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


  
  return(
    <div className='body-container'>
      <div className='contents-container'>
        <>
            <p className="title">Join a Lobby</p>
            <div>
                <TextInput
                    setValue={setLobbyID}
                    value={lobbyID}
                    placeholder={"Enter 5-Digit Lobby ID"}
                    cssClass={"lobby-textbox"}
                />
                <button className="button submit-button" onClick={() => joinLobbyAttempt(lobbyID, setErrMessage, navigate)}>Submit</button>
            </div>
            <p className="body-text">or</p>
            <button className="button create-lobby-button" onClick={()=> createLobby(navigate)}>Create Lobby</button>
        </>
          <p className='body-text error-text'>
            {errMessage}
          </p>
      </div>
    </div>
  )
}

export default HomePage;