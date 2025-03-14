import HomePage from './pages/HomePage';
import LobbyPage from './pages/Lobbypage';
import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import TestPage from './pages/testPage';
import { LobbyProvider } from './pages/LobbyContext.jsx';


function App(){
  return(
    <>
      <Header/>
        <Router>
          <Routes>
            <Route path = "/" element = {<HomePage/>}/>
            <Route path = "/lobby/:lobbyID" element = {<LobbyPage/>}/>
            <Route path ="/test" element={<TestPage players={7}/>}/>
          </Routes>
        </Router>
    <Footer/>
    </>
  );
    
}

export default App;