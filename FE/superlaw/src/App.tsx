import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Login from './components/Login';
import RegisterUser from './components/RegisterUser';
import InfoPage from './components/InfoPage';
import RegisterLawyer from './components/RegisterLawyer';
import Profile from './components/Lawyer/Profile/Profile';
import isGuest from './hooks/isGuest';
import isAuth from './hooks/isAuth';
import ConfirmEmail from './components/ConfirmEmail/ConfirmEmail';

const App: React.FC = () => (
  <>
    <Toaster/>
      <Router>
          <Header/>
          <Routes>
              <Route path='/' Component={HomePage}/>
              <Route path='/login' Component={isGuest(Login)}/>
              <Route path='/register' Component={isGuest(RegisterUser)}/>
              <Route path='/registerLaw' Component={isGuest(RegisterLawyer)}/>
              <Route path='/emailConfirm' Component={isGuest(ConfirmEmail)}/>
              <Route path='/info' Component={InfoPage}/>
              <Route path='/profile' Component={isAuth(Profile)}/>
          </Routes>
          <Footer/>
      </Router>
  </>
);

export default App;
