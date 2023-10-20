import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import './Login.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import LoginUserInput from '../../models/inputs/LoginInput';
import authService from '../../services/authService';
import { useStoreActions } from '../../store/hooks';
import User from '../../store/auth/models/User';
import { Lawyer } from '../../constants/roles';

const Login = () => {
  const navigate = useNavigate();
  const dispatchLogin = useStoreActions((actions) => actions.auth.login);
  
  const [loginForm, setLoginForm] = useState<LoginUserInput>({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const onInput = (e: any) => {
    const inputName = e.target.name;
    const value = e.target.value;

    setLoginForm({
      ...loginForm,
      [inputName]: value,
    });
  };

  const isDataValid = () => {
    if(loginForm.email === ''){
      setErrorMessage('Имейлът е задължителен');
      return false;
    }

    if(loginForm.password === ''){
      setErrorMessage('Паролата е задължителна');
      return false;
    }

    setErrorMessage('');
    return true
  }

  const onLogin = async (event: any) => {
    event.preventDefault();

    if (!isDataValid()){
      return;
    }

    let res = await authService.login(loginForm);
    
    if(!res.isError){
      let user: User = {
        id: res.data.id,
        email: res.data.email,
        token: res.data.idToken,
        role: res.data.role,
        isLoggedIn: true
      }
    
      dispatchLogin(user);
      debugger;
      if (user.role === Lawyer) {
        navigate('/profile');
      } else {
        navigate('/');
      }
    }
  };
  
    return (
      <div className='wrap'>
        <div className='row'>
          <div className='form-wrapper col-md-4'>
            <form className='login-form' onSubmit={(e) => onLogin(e)}>
              <h1 className='login-heading'>Вход</h1>
              <div className='form-group'>
                <label>Имейл</label>
                <input type='text' className='form-control' name='email' onChange={(e) => onInput(e)}/>
              </div>

              <div className='form-group'>
                <label>Парола</label>
                <input type='password' className='form-control' name='password' onChange={(e) => onInput(e)}/>
              </div>

            <p className='error'>{errorMessage}</p>
          <Button className='login-btn' type='submit' variant='primary'>Влез</Button>
          <h5 className='link'>Нямаш акаунт?</h5>
          <NavLink className='link' to="/register" >Регистрирай се</NavLink>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default Login;