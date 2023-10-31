import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./InfoPage.scss";

import profileImg from "../../assets/profile-image-128.png";
import handshakeImg from "../../assets/handshake-image-128.png";
import infoImg from "../../assets/info-image-128.png";
import letterImg from "../../assets/letter-image-128.png";

const InfoPage = () => {
  const navigate = useNavigate();
  const redirect = () => {
    navigate("/registerLaw");
  };

  return (
    <div className="wrapper">
      <section className="cta-lawyer">
        <div className="text">
          <h4>Станете част от нас</h4>
          <p>Ще можете чрез нас да намирате нови клиенти</p>
          <Button
            onClick={redirect}
            className="register-btn primary-btn"
            variant="primary"
          >
            Регистрирай се като адвокат
          </Button>
        </div>
      </section>
      <section className="info">
        <div className="container-fluid">
          <h1 className="title">Какво предоставя Superlaw?</h1>
          <div className="row justify-content-around">
            <div className="col-md-4 col-xl-3">
              <div className="img-wrapper">
                <img src={profileImg} />
              </div>
              <h3>Профил с онлайн календар</h3>
              <p>
                Срещу заплащане на месечна такса получавате ваш профил, който
                след като попълните, става видим за потребители. Записаните от
                Вас часове на място или по телефона автоматично стават „заети“
                за онлайн клиентите.
              </p>
            </div>
            <div className="col-md-4 col-xl-3">
              <div className="img-wrapper">
                <img src={handshakeImg} />
              </div>
              <h3>Потвърдени клиенти</h3>
              <p>
                Всеки потребител е регистриран с име, е-мейл и телефон и може да
                има до 3 предстоящи резервации.
              </p>
            </div>
          </div>
          <div className="row justify-content-around">
            <div className="col-md-4 col-xl-3">
              <div className="img-wrapper">
                <img src={infoImg} />
              </div>
              <h3>Предварителна информация от клиентите</h3>
              <p>
                При записване на час, потребителите на Superlaw Ви дават
                предварителна информация за казуса и дали са Ви посещавали
                преди.
              </p>
            </div>
            <div className="col-md-4 col-xl-3">
              <div className="img-wrapper">
                <img src={letterImg} />
              </div>
              <h3>Е-мейл известяване</h3>
              <p>
                Ден преди прегледа при Вас, пациентите получават напомняне за
                наближаващия час по е-мейл, което намалява броя неявили се
                клиенти. С е-мейл уведомяваме Вас и пациентите, ако една от
                двете страни откаже час за преглед в следващите 24 часа.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InfoPage;
