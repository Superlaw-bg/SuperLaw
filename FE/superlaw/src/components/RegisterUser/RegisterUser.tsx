import "./RegisterUser.scss";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import City from "../../models/SimpleData";
import authApi from "../../api/authApi";
import RegisterUserInput from "../../models/inputs/RegisterUserInput";
import toastService from '../../services/toastService';
import cityApi from "../../api/cityApi";
import LoaderSpinner from "../LoaderSpinner";
import ReactGA from "react-ga4";

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

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successRegister, setSuccessRegister] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  useEffect(() => {
    const fetchCities = () => {
        cityApi
        .getCities()
        .then(res => setCities(res.data))
        .catch(err => console.log(err));
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

  const onClickTerms = (e: any) => {
    const value = e.target.checked;
    setHasAcceptedTerms(value);
  };

  const isDataValid = () => {

    if (!hasAcceptedTerms) {
      setErrorMessage("Трябва да приемете общите условия и политиката за личните данни");
      return false;
    }

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

    const phoneRegex = /[1-9]/g;
          
    if (registerForm.phone === '' || !phoneRegex.test(registerForm.phone) || registerForm.phone.length !== 9){
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
    
    //Google Analytics event for clicking on reg btn
    ReactGA.event({
      category: "User",
      action: "registerUserClicked"
    });

    if(successRegister){
      setSuccessRegister(false);
    }

    if (!isDataValid()){
      return;
    }

    try {
      setLoading(true);
      await authApi.registerUser(registerForm);
      toastService.showSuccess('Регистрирахте се успешно! Моля, кликнете на линка, който изпратихме на имейл адреса Ви.');
      setSuccessRegister(true);
    } catch (error: any) {
      toastService.showError(error.response.data.message);
    } finally {
      setLoading(false);
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

            <div className="form-group terms-and-conditions-check">
              <label>
              <input type="checkbox" onChange={onClickTerms}/>
                 Запознах се с <Link target={"_blank"} to="/terms-and-conditions">oбщите условия</Link> и <Link target={"_blank"} to="/personal-data">политиката за личните данни</Link>
              </label>
            </div>

             <p className='error'>
              {errorMessage}
             </p>

            {
              loading ?
              <LoaderSpinner/> :
              <Button className="primary-btn" type="submit" variant="primary">
                Регистрация
              </Button>
            }
          
            {successRegister &&
               <p className='success'>Регистрирахте се успешно! Моля, кликнете на линка, който изпратихме на имейл адреса Ви.</p>}
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
