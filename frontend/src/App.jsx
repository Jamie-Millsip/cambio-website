import HomePage from './pages/HomePage';
import LobbyPage from './pages/Lobbypage';
import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App(){

  // route the different pages of the website
  // each lobby has unique lobbyID at end of URL

  // test test
  console.log(1)

  return(
    <>
      <Header/>
        <Router>
          <Routes>
            <Route path = "/" element = {<HomePage/>}/>
            <Route path = "/lobby/:lobbyID" element = {<LobbyPage/>}/>
          </Routes>
        </Router>
    <Footer/>
    </>
  );
    
}

export default App;