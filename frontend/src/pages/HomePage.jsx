import HomeContent from '../components/HomePage components/HomeContent'; 
import {useState} from 'react';
import axios from 'axios';

import "./Body.css"
import { useNavigate } from 'react-router-dom';


function HomePage(){
  
  const [lobbyID, setLobbyID] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const navigate = useNavigate();


  const handleClick = async () => {
    try{
      const result = await axios.post(`http://localhost:8080/verifyHomePageData`, {id : lobbyID});
      if (result.data === 0){
        setErrMessage("ERROR: No lobby Found");
      }
      else if (result.data === 1){
        setErrMessage("ERROR: Name Invalid or Unavailable")
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
                setErrMessage={setErrMessage}/>
                {errMessage}
              </div>
            </div>
        )
}

export default HomePage;