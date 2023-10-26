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
import isGuest from './hooks/isGuest';
import ConfirmEmail from './components/ConfirmEmail/ConfirmEmail';
import isLawyer from './hooks/isLawyer';
import CreateProfile from './components/Lawyer/CreateProfile/CreateProfile';
import EditProfile from './components/Lawyer/EditProfile';
import FindPage from './components/FindPage';
import OwnProfile from './components/Lawyer/OwnProfile/OwnProfile';
import isAuth from './hooks/isAuth';
import Profile from './components/Lawyer/Profile/Profile';
import MeeetingsPage from './components/MeeetingsPage';
import isNotLawyer from './hooks/isNotLawyer';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => (
  <>
    <Toaster/>
      <Router>
          <ScrollToTop/>
          <Header/>
          <Routes>
              <Route path='/' Component={isNotLawyer(HomePage)}/>
              <Route path='/login' Component={isGuest(Login)}/>
              <Route path='/register' Component={isGuest(RegisterUser)}/>
              <Route path='/registerLaw' Component={isGuest(RegisterLawyer)}/>
              <Route path='/emailConfirm' Component={isGuest(ConfirmEmail)}/>
              <Route path='/info' Component={InfoPage}/>
              <Route path='/profile' Component={isLawyer(OwnProfile)}/>
              <Route path='/profile/:id' Component={isAuth(Profile)}/>
              <Route path='/profile/create' Component={isLawyer(CreateProfile)}/>
              <Route path='/profile/edit' Component={isLawyer(EditProfile)}/>
              <Route path='/find' Component={isNotLawyer(FindPage)}/>
              <Route path='/meetings' Component={isAuth(MeeetingsPage)}/>
          </Routes>
          <Footer/>
      </Router>
  </>
);

export default App;
