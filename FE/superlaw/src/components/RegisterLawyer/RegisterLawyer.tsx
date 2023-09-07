import { FormEvent, useEffect, useState } from "react";
import City from "../../models/City";
import "./RegisterLawyer.scss";
import { Button } from "react-bootstrap";
import RegisterLawyerInput from "../../models/inputs/RegisterLawyerInput";
import cityService from "../../services/cityService";
import authService from "../../services/authService";
import toastService from "../../services/toastService";

const RegisterLawyer = () => {
  const [cities, setCities] = useState<City[]>([]);

  const [registerForm, setRegisterForm] = useState<RegisterLawyerInput>({
    firstName: "",
    surname: "",
    lastName: "",
    lawyerIdNumber: "",
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

    if (registerForm.surname === ''){
      setErrorMessage("Презимето е задължително");
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

    const phoneAndLawyerIdRegex = /[a-zA-Zа-яА-Я]/g;

    if (registerForm.lawyerIdNumber === '' || phoneAndLawyerIdRegex.test(registerForm.lawyerIdNumber)){
      setErrorMessage("Личният номер е невалиден");
      return false;
    }
  
    if (registerForm.phone === '' || phoneAndLawyerIdRegex.test(registerForm.phone)){
      setErrorMessage("Телефонът е невалиден");
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

    let res = await authService.registerLawyer(registerForm);

    if (!res.isError){
      toastService.showSuccess('Регистрацията е успешна. Моля потвърдете имейла си за да се логнете');
      setSuccessRegister(true);
    }
  };
  
    return (
      <div className="reg-lawyer-row">
      <div className="form-wrapper-reg">
        <form className="register-law-form" onSubmit={(e) => onRegister(e)}>
          <h1 className="register-heading">Регистрирай се</h1>
          <div className="form-group">
            <label htmlFor="name">Име</label>
            <input id="name" type="text" className="form-control" name="firstName" onChange={(e) => onInput(e)}/>
          </div>

          <div className="form-group">
            <label htmlFor="middle-name">Презиме</label>
            <input id="middle-name" type="text" className="form-control" name="surname" onChange={(e) => onInput(e)}/>
          </div>

          <div className="form-group">
            <label htmlFor="surname">Фамилия</label>
            <input id="surname" type="text" className="form-control" name="lastName" onChange={(e) => onInput(e)}/>
          </div>

          <div className="form-group selection">
            <label htmlFor="id-number">Личен номер</label>
            <input id="id-number" type="text" className="form-control" name="lawyerIdNumber" onChange={(e) => onInput(e)}/>
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
              <input type="text" id="phone" className="form-control" name="phone" onChange={(e) => onInput(e)}/>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Имейл</label>
            <input id="email" type="text" className="form-control" name="email" onChange={(e) => onInput(e)}/>
          </div>

          <div className="form-group">
            <label htmlFor="password">Парола</label>
            <input id="password" type="password" className="form-control" name="password" onChange={(e) => onInput(e)}/>
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
    </div>
    );
  };
  
  export default RegisterLawyer;
  