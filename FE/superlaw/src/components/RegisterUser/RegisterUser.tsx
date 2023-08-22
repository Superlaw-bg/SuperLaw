import './RegisterUser.scss';
import { Button } from 'react-bootstrap';

const Register = () => {
    return (
      <div className='wrap'>
        <div className='row'>
          <div className='form-wrapper col-md-4'>
            <form className='register-form'>
              <h1 className='register-heading'>Регистрирай се</h1>
              <div className='form-group'>
                <label htmlFor='name'>Име</label>
                <input id='name' type='text' className='form-control'/>
              </div>

              <div className='form-group'>
                <label htmlFor='surname'>Фамилия</label>
                <input id='surname' type='text' className='form-control'/>
              </div>

              <div className='form-group selection'>
                <label htmlFor='region'>Област</label>
                <select className='form-select' name='region' id='region'>
                  <option selected disabled value='none'>Изберете област</option>
                  <option value='sofia'>София град</option>
                  <option value='sofia-region'>София област</option>
                  <option value='plovdiv'>Пловдив</option>
                  <option value='varna'>Варна</option>
                  <option value='other'>Друга</option>
                </select>
              </div>

              <div className='form-group'>
                <label htmlFor='phone'>Телефон</label>
                <div className='phone'>
                  <p className='code form-control'>+359</p>
                  <input type='text' id='phone' className='form-control'/>
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='email'>Имейл</label>
                <input id='email' type='text' className='form-control'/>
              </div>

              <div className='form-group'>
                <label htmlFor='password'>Парола</label>
                <input id='password' type='password' className='form-control'/>
              </div>

              <div className='form-group'>
                <label htmlFor='repeat-password'>Повтори Парола</label>
                <input id='repeat-password' type='password' className='form-control'/>
              </div>

              <Button className='register-btn' type='submit' variant='primary'>Регистрация</Button>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default Register;