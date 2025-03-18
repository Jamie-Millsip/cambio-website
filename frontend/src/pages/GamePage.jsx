import { GameProvider } from './GameContext.jsx';
import GameContent from '../components/GamePage components/GameContent.jsx';
import { useParams } from 'react-router-dom';

    function GamePage({lobbyID, players, thisUser, setGameScreen, cards, setCards}){        

        return(
            <GameProvider key = {lobbyID}>
                <GameContent
                    players={players}   
                    thisUser={thisUser} 
                    setGameScreen={setGameScreen}
                    cards={cards}
                    setCards={setCards}/>
            </GameProvider>
        )
    }


    export default GamePage;