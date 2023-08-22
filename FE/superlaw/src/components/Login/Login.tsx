import { Button } from 'react-bootstrap';
import './Login.scss';
import { NavLink } from 'react-router-dom';

const Login = () => {
    return (
      <div className='wrap'>
        <div className='row'>
          <div className='form-wrapper col-md-4'>
            <form className='login-form'>
              <h1 className='login-heading'>Вход</h1>
              <div className='form-group'>
                <label>Имейл</label>
                <input type='text' className='form-control'/>
              </div>

              <div className='form-group'>
                <label>Парола</label>
                <input type='password' className='form-control'/>
              </div>

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