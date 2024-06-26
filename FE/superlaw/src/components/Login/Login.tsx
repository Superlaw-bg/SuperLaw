import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import './Login.scss';
import { NavLink, useLocation } from 'react-router-dom';
import LoginUserInput from '../../models/inputs/LoginInput';
import authApi from '../../api/authApi';
import { useStoreActions } from '../../store/hooks';
import User from '../../store/auth/models/User';
import toastService from '../../services/toastService';
import LoaderSpinner from '../LoaderSpinner';
import ReactGA from 'react-ga4';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  const location = useLocation();
  const dispatchLogin = useStoreActions((actions) => actions.store.login);
  const dispatchSetRedirect = useStoreActions((actions) => actions.store.setRedirect);
  
  const [loginForm, setLoginForm] = useState<LoginUserInput>({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [forgotPassClicked, setForgotPassClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  //If it needs to redirect to a page it sets the redirect path and also if you click on register it will redirect you to the right page
  useEffect(() => {
    if (location.state && location.state.from) {
      dispatchSetRedirect(location.state.from);
    }
  }, []);

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

    //Google Analytics event for clicking on login btn
    ReactGA.event({
      category: "User",
      action: "loginClicked"
    });

    if (!isDataValid()){
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login(loginForm);
      
      let user: User = {
        id: res.data.id,
        email: res.data.email,
        token: res.data.idToken,
        role: res.data.role,
        isLoggedIn: true
      }

      dispatchLogin(user);

    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async () => {
    if (loginForm.email === '') {
      setErrorMessage('Моля първо въведете имейла си');
      return;
    }

    try {
      setLoading(true);
      await authApi.forgotPassword(loginForm.email);
      setForgotPassClicked(true);
      toastService.showSuccess('Изпратен Ви е имейл за смяна на паролата');
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };
  
    return (
      <>
       <Helmet>
        <title>Вход - SuperLaw</title>
        <meta name='description' content='Влезте в системата' />
        <link rel="canonical" href='/login' />
      </Helmet>
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

              <a className='forgot-password' onClick={async () => await forgotPassword()}>Забравена парола?</a>

            <p className='error'>{errorMessage}</p>
            {loading ? 
              <LoaderSpinner/>
              :
              <Button className='login-btn' type='submit' variant='primary'>Влез</Button>
            }
          
          <h5 className='link'>Нямаш акаунт?</h5>
          <NavLink className='link' to="/register" >Регистрирай се</NavLink>

         
          {forgotPassClicked &&
               <p className='success'>Изпратихме Ви имейл с линка за смяна на паролата Ви.</p>}
            </form>
          </div>
        </div>
      </div>
      </>
    );
  };
  
  export default Login;