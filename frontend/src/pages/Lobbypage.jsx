import { LobbyProvider } from './LobbyContext.jsx';
import LobbyContent from '../components/LobbyPage components/LobbyContent.jsx';
import { useParams } from 'react-router-dom';

    function LobbyPage(){
        const {lobbyID} = useParams();
        

        return(
            <LobbyProvider key = {lobbyID}>
                <LobbyContent lobbyID = {lobbyID}/>
            </LobbyProvider>
        )
    }

    export default LobbyPage;