import { Button } from 'react-bootstrap';
import './ResetPasswordPage.scss';
import { useLocation } from "react-router-dom";
import { useState } from 'react';
import authService from '../../services/authService';

const ResetPasswordPage = () => {
    const location = useLocation();

    const paramsStr = location.search?.split('token=')[1];
    const token = paramsStr?.split('&email=')[0];
    const email = paramsStr?.split('&email=')[1];

    const [resetPasswordForm, setResetPasswordForm] = useState({
      password: '',
      confirmPassword: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const onInput = (e: any) => {
      const inputName = e.target.name;
      const value = e.target.value;
  
      setResetPasswordForm({
        ...resetPasswordForm,
        [inputName]: value,
      });
    };

    const onResetPass = async (event: any) => {
      event.preventDefault();
  
      if (resetPasswordForm.password === ''){
        setErrorMessage("Моля въведете парола");
        return;
      }
  
      if (resetPasswordForm.password.length <= 4){
        setErrorMessage("Паролата трябва да бъде поне 5 символа");
        return;
      }
  
      if (resetPasswordForm.confirmPassword === ''){
        setErrorMessage("Моля потвърдете паролата");
        return;
      }
  
      if (resetPasswordForm.confirmPassword !== resetPasswordForm.password){
        setErrorMessage("Паролите не съвпадат");
        return;
      }
  
      const res = await authService.resetPassword(email, token, resetPasswordForm.password, resetPasswordForm.confirmPassword);
      
      if(!res.isError){
        setSuccessMessage('Успешно сменихте паролата си. Можете да влезете в акаунта си с новата парола.');
      }
    };

    return (
      <div className='reset-password'>
        <div className='row'>
          <div className='form-wrapper col-md-4'>
            <form className='reset-password-form' onSubmit={(e) => onResetPass(e)}>
              <h1 className='heading'>Смяна на парола</h1>
              <div className='form-group'>
                <label>Нова Парола</label>
                <input type='password' className='form-control' name='password' onChange={(e) => onInput(e)}/>
              </div>

              <div className='form-group'>
                <label>Повтори Парола</label>
                <input type='password' className='form-control' name='confirmPassword' onChange={(e) => onInput(e)}/>
              </div>

              <p className='error'>{errorMessage}</p>
          <Button className='reset-pass-btn' type='submit' variant='primary'>Смени парола</Button>

          {successMessage !== '' &&
               <p className='success'>{successMessage}</p>}
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default ResetPasswordPage;