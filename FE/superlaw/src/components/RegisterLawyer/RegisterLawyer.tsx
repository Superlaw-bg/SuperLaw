import { FormEvent, useEffect, useState } from "react";
import City from "../../models/SimpleData";
import "./RegisterLawyer.scss";
import { Button } from "react-bootstrap";
import RegisterLawyerInput from "../../models/inputs/RegisterLawyerInput";
import cityApi from "../../api/cityApi";
import authApi from "../../api/authApi";
import toastService from "../../services/toastService";
import { Link } from "react-router-dom";
import LoaderSpinner from "../LoaderSpinner";

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

  const [loading, setLoading] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successRegister, setSuccessRegister] = useState(false);
  
  useEffect(() => {
    const fetchCities = async () => {
        const res = await cityApi.getCities();
        setCities(res.data);
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

    if (registerForm.surname === ''){
      setErrorMessage("Презимето е задължително");
      return false;
    }

    if (registerForm.lastName === ''){
      setErrorMessage("Фамилията е задължителна");
      return false;
    }

    const phoneAndLawyerIdRegex = /[a-zA-Zа-яА-Я]/g;

    if (registerForm.lawyerIdNumber === '' || phoneAndLawyerIdRegex.test(registerForm.lawyerIdNumber)){
      setErrorMessage("Личният адвокатски номер е невалиден");
      return false;
    }

    if (registerForm.cityId === 0){
      setErrorMessage("Моля изберете град");
      return false;
    }

    if (registerForm.phone === '' || phoneAndLawyerIdRegex.test(registerForm.phone) || registerForm.phone.length !== 9){
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

    try {
      setLoading(true);
      await authApi.registerLawyer(registerForm);
      toastService.showSuccess('Регистрирахте се успешно! Моля, кликнете на линка, който изпратихме на имейл адреса Ви.');
      setSuccessRegister(true);
    } catch (error: any) {
      toastService.showError(error.response.data.message);
    } finally {
      setLoading(false);
    }

  };
  
    return (
      <div className="reg-lawyer-row">
      <div className="form-wrapper-reg">
        <form className="register-law-form" onSubmit={(e) => onRegister(e)}>
          <h1 className="register-heading">Регистрирай се като адвокат</h1>
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
            <label htmlFor="id-number">Личен адвокатски номер</label>
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
    </div>
    );
  };
  
  export default RegisterLawyer;
  