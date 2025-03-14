import { createContext, useState, useRef } from "react";


const LobbyContext = createContext();



export function LobbyProvider({children}){
    // to be used
    const [hasActed, setHasActed] = useState(false)

    const [currentTurn, setCurrentTurn] = useState(-1);
    const [cards, setCards] = useState([]);
    const [lobbyID, setLobbyID] = useState("");
    const [messageArray, setMessageArray] = useState([]);
    const [nickname, setNickname] = useState("");

    const [selectedSwapCards, setSelectedSwapCards] = useState([])
    const backendSite = "http://localhost:8080";

    return(
        <LobbyContext.Provider value = {{
            hasActed, setHasActed, selectedSwapCards, setSelectedSwapCards,
            currentTurn, setCurrentTurn, cards, setCards, backendSite,
            lobbyID, setLobbyID, messageArray, setMessageArray,
            nickname, setNickname,
        }}>
            {children}
        </LobbyContext.Provider>
    )
}


export default LobbyContext;