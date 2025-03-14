import axios from "axios";
import TextInput from "../../TextInput";
import"../../../pages/Body.css";
import { useContext } from "react";
import LobbyContext from "../../../pages/LobbyContext";


function EnterNicknameView({nicknameRef, setHasNickname}){
    
    let {setNickname, nickname, lobbyID, backendSite} = useContext(LobbyContext);

    const handleNicknameButton = async (newNickname) => {
        try{
            let result = await axios.post(backendSite + "/addPlayer", {lobbyID: lobbyID, player: {nickname: newNickname}});
            if (result.data == 1){
                nicknameRef.current = newNickname;
                nickname = newNickname;
                setHasNickname(true);
            }
            else{
                console.log("bad name")
            }
        }
        catch(e){console.error("ERROR adding user: ", e)}
    }


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
        </div>
        </>
    )
}

export default EnterNicknameView;