import React from 'react';
import "./RegisterUser.scss";
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import City from "../../models/SimpleData";
import cityService from "../../services/cityService";
import authService from "../../services/authService";
import RegisterUserInput from "../../models/inputs/RegisterUserInput";
import toastService from '../../services/toastService';

const Register = () => {  
  const navigate = useNavigate();
  const redirect = () => {
    navigate('/info');
  };

  const [cities, setCities] = useState<City[]>([]);

  const [registerForm, setRegisterForm] = useState<RegisterUserInput>({
    firstName: "",
    lastName: "",
    cityId: 0,
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successRegister, setSuccessRegister] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
        const cities = await cityService.getCities();
        setCities(cities);
    };
    
    fetchCities();
  }, []);

  const onInput = (e: any) => {
    const inputName = e.target.name;
    const value = e.target.value;

    setRegisterForm({
      ...registerForm,
      [inputName]: value,
    });
  };

  const isDataValid = () => {
    if (registerForm.firstName === ''){
      setErrorMessage("Името е задължително");
      return false;
    }

    if (registerForm.lastName === ''){
      setErrorMessage("Фамилията е задължителна");
      return false;
    }

    if (registerForm.cityId === 0){
      setErrorMessage("Моля изберете град");
      return false;
    }

    const phoneRegex = /[a-zA-Zа-яА-Я]/g;
          
    if (registerForm.phone === '' || phoneRegex.test(registerForm.phone) || registerForm.phone.length !== 9){
      setErrorMessage("Телефонът трябва да е 9 цифри");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (registerForm.email === '' || !emailRegex.test(registerForm.email)){
      setErrorMessage("Имейлът е невалиден");
      return false;
    }

    if (registerForm.password === ''){
      setErrorMessage("Моля въведете парола");
      return false;
    }

    if (registerForm.password.length <= 4){
      setErrorMessage("Паролата трябва да бъде поне 5 символа");
      return false;
    }

    if (registerForm.confirmPassword === ''){
      setErrorMessage("Моля потвърдете паролата");
      return false;
    }

    if (registerForm.confirmPassword !== registerForm.password){
      setErrorMessage("Паролите не съвпадат");
      return false;
    }

    setErrorMessage('');
    return true;
  }

  const onRegister = async (event: FormEvent) => {
    event.preventDefault();
    
    if(successRegister){
      setSuccessRegister(false);
    }

    if (!isDataValid()){
      return;
    }

    let res = await authService.registerUser(registerForm);

    if (!res.isError){
      toastService.showSuccess('Регистрацията е успешна. Моля потвърдете имейла си за да се логнете');
      setSuccessRegister(true);
    }
  };


  return (
    <div className="wrap">
      <div className="row d-flex">
        <div className="form-wrapper-reg col-md-4">
          <form className="register-form" onSubmit={(e) => onRegister(e)}>
            <h1 className="register-heading">Регистрирай се</h1>
            <div className="form-group">
              <label htmlFor="firstName">Име</label>
              <input id="firstName" type="text" className="form-control"  name="firstName" onChange={(e) => onInput(e)} />
            </div>

            <div className="form-group">
              <label htmlFor="surname">Фамилия</label>
              <input id="surname" type="text" className="form-control" name="lastName" onChange={(e) => onInput(e)}/>
            </div>

            <div className="form-group selection">
              <label htmlFor="city">Град</label>
              <select className="form-select" name="cityId" id="city" onChange={(e) => onInput(e)}>
                <option selected disabled defaultValue="none">
                  Изберете град
                </option>
                {cities.map((city) => 
                  <option key={city.id} value={city.id}>{city.name}</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Телефон</label>
              <div className="phone">
                <p className="code form-control">+359</p>
                <input type="text" id="phone" className="form-control" name="phone" onChange={(e) => onInput(e)} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Имейл</label>
              <input id="email" type="text" className="form-control" name="email" onChange={(e) => onInput(e)} />
            </div>

            <div className="form-group">
              <label htmlFor="password">Парола</label>
              <input id="password" type="password" name="password" className="form-control" onChange={(e) => onInput(e)} />
            </div>

            <div className="form-group">
              <label htmlFor="repeat-password">Повтори Парола</label>
              <input
                id="repeat-password"
                type="password"
                className="form-control"
                name="confirmPassword"
                onChange={(e) => onInput(e)}
              />
            </div>

             <p className='error'>
              {errorMessage}
             </p>

            <Button className="primary-btn" type="submit" variant="primary">
              Регистрация
            </Button>

            {successRegister &&
               <p className='success'>Регистрирахте се успешно. Остана само да потвърдите имейла си като цъкнете на линка, който ви изпратихме.</p>}
          </form>
        </div>
        <div className="lawyer-info">
          <h4>Адвокат ли сте?</h4>
          <p>
            Разберете как платформата ще Ви спести време, оптимизира графика и
            увеличи броя на клиентите Ви
          </p>
          <Button
            onClick={redirect}
            className="primary-btn"
            variant="primary"
          >
            Научете повече
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
