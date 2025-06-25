import HomePage from './pages/HomePage';
import LobbyPage from './pages/Lobbypage';
import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";
import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import "./App.css"

function App(){

  // route the different pages of the website
  // each lobby has unique lobbyID at end of URL

  return(
    <div className='app-container'>
      <Header/>
      <div className='main-content'>
        <Router>
          <Routes>
            <Route path = "/" element = {<HomePage/>}/>
            <Route path = "/lobby/:lobbyID" element = {<LobbyPage/>}/>
          </Routes>
        </Router>
        </div>
    <Footer/>
    </div>
  );
}

export default App;