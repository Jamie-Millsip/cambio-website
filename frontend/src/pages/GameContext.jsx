import { createContext, useState } from "react";


const GameContext = createContext();


/*
  contains variables shared between gameContent and its children

  used to avoid passing too many vars to its children - to help readability
  
  context is wrapped around gameContent to ensure vars reset when the gamePage is unmounted
  allowing the game state to easily reset when a new game starts 
*/
export function GameProvider({children}){

    const [currentTurn, setCurrentTurn] = useState(-1);
    const [state, setState] = useState(0);
    const [lastToDiscard, setLastToDiscard] = useState(0);
    const [canFlip, setCanFlip] = useState(false);
    const [triggerVar, trigger] = useState(0)
    const [selectedPile, setSelectedPile] = useState();

    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

    

    return(
        <GameContext.Provider value = {{
            selectedPile, setSelectedPile,
            currentTurn, setCurrentTurn, state, setState,
            lastToDiscard, setLastToDiscard, canFlip, setCanFlip,
            triggerVar, trigger, sleep
        }}>
            {children}
        </GameContext.Provider>
    )
}


export default GameContext;