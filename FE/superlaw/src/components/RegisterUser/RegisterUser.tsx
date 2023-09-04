import "./RegisterUser.scss";
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import City from "../../models/City";
import cityService from "../../services/cityService";
import authService from "../../services/authService";
import RegisterUserInput from "../../models/inputs/RegisterUserInput";

const Register = () => {
  const navigate = useNavigate();
  const redirect = () => {
    navigate('/info');
  };

  const [cities, setCities] = useState<City[]>([]);

  const [registerForm, setRegisterForm] = useState<RegisterUserInput>({
    firstName: "",
    surname: "",
    lastName: "",
    cityId: 0,
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCities = async () => {
        const cities: City[] = await cityService.getCities();
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

  const onRegister = async (event: FormEvent) => {
    event.preventDefault();
    const res = authService.registerUser(registerForm);
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
              <label htmlFor="second-name">Презиме</label>
              <input id="second-name" type="text" className="form-control" name="surname" onChange={(e) => onInput(e)} />
            </div>

            <div className="form-group">
              <label htmlFor="surname">Фамилия</label>
              <input id="surname" type="text" className="form-control" name="lastName" onChange={(e) => onInput(e)}/>
            </div>

            <div className="form-group selection">
              <label htmlFor="city">Град</label>
              <select className="form-select" name="cityId" id="city" onChange={(e) => onInput(e)}>
                <option selected disabled defaultValue="none">
                  Изберете област
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

            <Button className="primary-btn" type="submit" variant="primary">
              Регистрация
            </Button>
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
