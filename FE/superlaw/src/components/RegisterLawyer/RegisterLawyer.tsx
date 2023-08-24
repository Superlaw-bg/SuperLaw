import "./RegisterLawyer.scss";
import { Button } from "react-bootstrap";

const RegisterLawyer = () => {
    return (
      <div className="reg-lawyer-row">
      <div className="form-wrapper-reg">
        <form className="register-law-form">
          <h1 className="register-heading">Регистрирай се</h1>
          <div className="form-group">
            <label htmlFor="name">Име</label>
            <input id="name" type="text" className="form-control" />
          </div>

          <div className="form-group">
            <label htmlFor="middle-name">Презиме</label>
            <input id="middle-name" type="text" className="form-control" />
          </div>

          <div className="form-group">
            <label htmlFor="surname">Фамилия</label>
            <input id="surname" type="text" className="form-control" />
          </div>

          <div className="form-group selection">
            <label htmlFor="id-number">Личен номер</label>
            <input id="id-number" type="text" className="form-control" />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Телефон</label>
            <div className="phone">
              <p className="code form-control">+359</p>
              <input type="text" id="phone" className="form-control" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Имейл</label>
            <input id="email" type="text" className="form-control" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Парола</label>
            <input id="password" type="password" className="form-control" />
          </div>

          <div className="form-group">
            <label htmlFor="repeat-password">Повтори Парола</label>
            <input
              id="repeat-password"
              type="password"
              className="form-control"
            />
          </div>

          <Button className="primary-btn" type="submit" variant="primary">
            Регистрация
          </Button>
        </form>
      </div>
    </div>
    );
  };
  
  export default RegisterLawyer;
  