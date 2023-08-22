import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Login from './components/Login';
import RegisterUser from './components/RegisterUser';
import InfoPage from './components/InfoPage';
import RegisterLawyer from './components/RegisterLawyer';

const App: React.FC = () => (
  <>
      <Router>
          <Header/>
          <Routes>
              <Route path='/' Component={HomePage}/>
              <Route path='/login' Component={Login}/>
              <Route path='/register' Component={RegisterUser}/>
              <Route path='/registerLaw' Component={RegisterLawyer}/>
              <Route path='/info' Component={InfoPage}/>
          </Routes>
          <Footer/>
      </Router>
  </>
);

export default App;
