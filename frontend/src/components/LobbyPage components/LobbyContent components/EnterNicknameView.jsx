import axios from "axios";
import TextInput from "../../TextInput";
import"../../../pages/Body.css";
import { useContext, useEffect, useState } from "react";
import LobbyContext from "../../../pages/LobbyContext";


function EnterNicknameView({setHasNickname}){
    
    
    let {nicknameRef, lobbyID, backendSite} = useContext(LobbyContext);

    const [nickname, setNickname] = useState("")
    const [errMessage, setErrMessage] = useState("")
    const [displayErrMessage, setDisplayErrMessage] = useState(false)

    const handleNicknameButton = async (newNickname) => {
        try{
            let result = await axios.post(backendSite + "addPlayer", {lobbyID: lobbyID, player: {nickname: newNickname}});
            console.log(result.data)
            if (result.data.type === "enterNicknameResponse"){
                console.log("ehafbes")
                nicknameRef.current = result.data.playerName;
                setHasNickname(true);
            }
            else{
                setErrMessage("ERROR: Please enter a nickname")
                console.log("bad name")
            }
        }
        catch(e){console.error("ERROR adding user: ", e)}
    }

    useEffect(() => {
        if (errMessage === ""){
            setDisplayErrMessage(false)
        }
        else{
            setDisplayErrMessage(true)
        }
    }, [errMessage])


    return(
        <>
        <p className="title">Enter a Nickname</p>
        <div>
            <TextInput 
                setValue={setNickname} 
                value={nickname} 
                placeholder={"Enter Nickname"} 
                cssClass={"lobby-textbox"} 
                />
            <button className='button submit-button' onClick={(e) => {handleNicknameButton(nickname)}}>Submit</button>
            {displayErrMessage && (
                <p className="error-message">{errMessage}</p>
            )}
        </div>
        </>
    )
}

export default EnterNicknameView;