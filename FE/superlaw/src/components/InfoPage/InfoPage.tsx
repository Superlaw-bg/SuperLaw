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
          <p>Чрез нас ще откриете много нови клиенти!</p>
          <Button
            onClick={redirect}
            className="register-btn primary-btn"
            variant="primary"
          >
            Регистрайте се като адвокат
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
              Нашата платформа Ви предоставя възможност да създадете Ваш адвокатски профил с виртуален календар, чрез който Вашите клиенти могат автоматично да запазят час за консултация в удобните за Вас часове. Бързо, лесно, гъвкаво и удобно.
              </p>
            </div>
            <div className="col-md-4 col-xl-3">
              <div className="img-wrapper">
                <img src={handshakeImg} />
              </div>
              <h3>Потвърдени клиенти</h3>
              <p>
              Всяка потребителска регистрация е потвърдена чрез имейл и телефон. Потребителят не може да създава повече от 3 предстоящи консултации.
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
              Вашите клиенти описват своя случай накратко когато запазват своя час - за да сте винаги подготвени за казусите им. Информацията се пази в сигурен, криптиран вид на сървърите ни.
              </p>
            </div>
            <div className="col-md-4 col-xl-3">
              <div className="img-wrapper">
                <img src={letterImg} />
              </div>
              <h3>Е-мейл известяване</h3>
              <p>
              Ден преди консултацията и Вие, и клиентите Ви ще бъдете елегантно подсетени за наближаващата среща.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InfoPage;
