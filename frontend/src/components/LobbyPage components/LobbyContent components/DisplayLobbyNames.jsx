import "../../../pages/Body.css"
import { useContext } from "react"
import LobbyContext from "../../../pages/LobbyContext"

function DisplayLobbyNames(){

    const {messageArray} = useContext(LobbyContext);


    return(
        <>
        {Array.isArray(messageArray) && messageArray.map((name)=>{
            if (name.ready){
                return (
                    <p className = {"player ready-player"}key = {name.nickname}> {name.nickname}</p>
                )
            }
            else{
                return (
                    <p className = {"player unready-player"}key = {name.nickname}> {name.nickname}</p>
                )
            }
        })}
        </>
    )
}

export default DisplayLobbyNames;