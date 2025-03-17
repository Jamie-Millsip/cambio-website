import { createContext, useState, useRef } from "react";


const LobbyContext = createContext();



export function LobbyProvider({children}){

    const [lobbyID, setLobbyID] = useState("");
    const [nickname, setNickname] = useState("");
    const [selectedSwapCards, setSelectedSwapCards] = useState([])
    const backendSite = "http://localhost:8080/";

    return(
        <LobbyContext.Provider value = {{
            selectedSwapCards, setSelectedSwapCards,
            backendSite, lobbyID, setLobbyID, nickname, setNickname,
        }}>
            {children}
        </LobbyContext.Provider>
    )
}


export default LobbyContext;