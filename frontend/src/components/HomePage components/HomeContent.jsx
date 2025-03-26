import TextInput from "../TextInput.jsx"
import CreateLobbyButton from "./CreateLobbyButton.jsx"

/**
 * 
 * @param  setLobbyID - used to update the lobbyID value
 * @param  lobbyID - stores the lobbyID value
 * @param  buttonResponse - function that runs in response to user clicks the join lobby button
 * @returns a text input component and matching button to input a lobbyID and submit it, a CreateLobbyButton component,
 * and an error message if needed
 */
function HomeContent ({setLobbyID, lobbyID, buttonResponse}) {
    

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
            <p className="body-text">or</p>
            <CreateLobbyButton/>
      </>
    )
}

export default HomeContent