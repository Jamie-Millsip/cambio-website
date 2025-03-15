import TextInput from "../TextInput.jsx"
import CreateLobbyButton from "./CreateLobbyButton.jsx"

function HomeContent ({setLobbyID, lobbyID, buttonResponse, setErrMessage}) {
    return(
        
        <>
            <p className="title">Join a Lobby</p>
        <div>
            <TextInput
            setValue={setLobbyID}
            value={lobbyID}
            placeholder={"Enter 5-Digit Lobby ID"}
            cssClass={"lobby-textbox"}
            />
            <button className="button submit-button" onClick={buttonResponse}>Submit</button>
        </div>

        <p> or</p>

        <CreateLobbyButton setErrMessage={setErrMessage}/>

      </>
    )
}

export default HomeContent