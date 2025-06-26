import { useContext, useEffect, useState } from "react";
import "../pages/Body.css"
import axios from "axios";
import LobbyContext from "./LobbyContext";

function EndGamePage ({setGameScreen}) {
    
    const {lobbyID, backendSite} = useContext(LobbyContext)
    const [playerNames, setPlayerNames] = useState([])
    const [playerScores, setPlayerScores] = useState([])
    const [listCountStyle, setListCountStyle] = useState("")
    let listCount = 0;
    
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
                setPlayerNames(results.data.playerNames)
                setPlayerNames(prev => ["Name", ...prev])
                setPlayerScores(results.data.playerScores)
                setPlayerScores(prev => ["Score", ...prev])
            }
            catch(e){
                console.error("ERROR: ", e)
            }
        }
        getGameResults()
    }, [])
    
    useEffect(() => {
        if (listCount === 1){
            setListCountStyle("first-place")
        }
        else if (listCount === 2){
            setListCountStyle("second-place")
        }
        else if (listCount === 3){
            setListCountStyle("thirdPlace")
        }
        else{
            setListCountStyle("")
        }
    }, listCount)

    return(
        <div className="body-container">
            <div className="contents-container">
                    <div className="endgame-col-container">
                        {playerNames.map((_, index) => {
                            console.log("INDEX: ", index)
                            listCount = index;
                            return(
                                <div className=
                                {`endgame-row-container 
                                ${index === 0 ? "endgame-title" 
                                : index === 1 ? "first-place" 
                                : index === 2 ? "second-place" : "" }`} key={index}>
                                    <p className="endgame-text">{playerNames[index]}</p>
                                    <p className="endgame-text">{playerScores[index]}</p>
                                </div>
                            )
                        })}
                    </div>
                <button className="button" onClick={handleReturn}>Return to Lobby</button>
            </div>
        </div>
    )

    /*

    return(
        <div className="body-container">
            <div className="contents-container">
                <div className={`endgame-row-container`}>
                    <div className="endgame-col-container">
                        <p style={{fontWeight: "bold"}}>Name</p>
                        {playerNames.map((playerName)=>{
                            return(
                                <p className={`${listCountStyle}`}>{playerName}</p>
                            )
                        })}
                    </div>
                    <div className="endgame-col-container">
                        <p style={{fontWeight: "bold"}}>Score</p>
                        {playerScores.map((playerScore)=>{
                            listCount++;
                            return(
                                <p className={`${listCountStyle}`}>{playerScore}</p>
                            )
                        })}
                    </div>
                </div>
                <button className="button" onClick={handleReturn}>Return to Lobby</button>
            </div>
        </div>
    )
        */
}

export default EndGamePage;