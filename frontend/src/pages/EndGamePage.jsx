import { useContext, useEffect, useState } from "react";
import "../pages/Body.css"
import axios from "axios";
import GameContext from "./GameContext";
import LobbyContext from "./LobbyContext";

function EndGamePage ({setGameScreen, players}) {
    
    const {lobbyID, backendSite} = useContext(LobbyContext)
    const [playerNames, setPlayerNames] = useState([])
    const [playerScores, setPlayerScores] = useState([])
    
    const handleReturn = () => {
        setGameScreen(false);
    }

    useEffect(()=>{
        const getGameResults = async () =>{
            try{
                const results = await axios.get(backendSite + `getGameResults/${lobbyID}`, {
                    headers: {
                        "Accept": "application/json"
                    }
                })
                console.log(results.data)
                console.log(results.data.playerNames)
                console.log(results.data.playerScores)
                setPlayerNames(results.data.playerNames)
                setPlayerScores(results.data.playerScores)
            }
            catch(e){
                console.error("ERROR: ", e)
            }
        }
        getGameResults()
    }, [])
    
    return(
        <div className="body-container">
            <div className="contents-container">
                <div className="endgame-row-container">
                    <div className="endgame-col-container">
                        <p style={{fontWeight: "bold"}}>Name</p>
                        {playerNames.map((playerName)=>{
                            return(
                                <p>{playerName}</p>
                            )
                        })}
                    </div>
                    <div className="endgame-col-container">
                        <p style={{fontWeight: "bold"}}>Score</p>
                        {playerScores.map((playerScore)=>{
                            return(
                                <p>{playerScore}</p>
                            )
                        })}
                    </div>
                </div>
                <button className="button" onClick={handleReturn}>Return to Lobby</button>
            </div>
        </div>
    )
}

export default EndGamePage;