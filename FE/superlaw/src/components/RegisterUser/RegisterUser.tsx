import { Button } from 'react-bootstrap';

const Register = () => {
    return (
      <div className='wrap'>
        <div className='row'>
          <div className='form-wrapper col-md-4'>
            <form className='login-form'>
              <h1 className='login-heading'>Registraciq</h1>
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
          <a className='link'>Регистрирай се</a>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default Register;