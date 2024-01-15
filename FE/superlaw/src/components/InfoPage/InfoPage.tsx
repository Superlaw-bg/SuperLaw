import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./InfoPage.scss";

import profileImg from "../../assets/profile-image-128.png";
import handshakeImg from "../../assets/handshake-image-128.png";
import infoImg from "../../assets/info-image-128.png";
import letterImg from "../../assets/letter-image-128.png";
import { Helmet } from "react-helmet-async";

const InfoPage = () => {
  const navigate = useNavigate();
  const redirect = () => {
    navigate("/registerLaw");
  };

  return (
    <>
    <Helmet>
      <title>Инфо - SuperLaw</title>
      <meta name='description' content='Нашата платформа Ви предоставя възможност да създадете Ваш адвокатски профил с виртуален календар, чрез който Вашите клиенти могат автоматично да запазят час за консултация в удобните за Вас часове. Бързо, лесно, гъвкаво и удобно.' />
      <link rel="canonical" href="/info" />
    </Helmet>
    <div className="wrapper">
      <section className="cta-lawyer">
        <div className="text">
          <h4>Станете част от нас</h4>
          <p>Чрез нас ще откриете много нови клиенти!</p>
          <p className="info-email">За повече информация и за създаване на акаунт се свържете с нас на <span>info@superlaw.bg</span></p>
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
              <h2>Профил с онлайн календар</h2>
              <p>
              Нашата платформа Ви предоставя възможност да създадете Ваш адвокатски профил с виртуален календар, чрез който Вашите клиенти могат автоматично да запазят час за консултация в удобните за Вас часове. Бързо, лесно, гъвкаво и удобно.
              </p>
            </div>
            <div className="col-md-4 col-xl-3">
              <div className="img-wrapper">
                <img src={handshakeImg} />
              </div>
              <h2>Потвърдени клиенти</h2>
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
              <h2>Предварителна информация от клиентите</h2>
              <p>
              Вашите клиенти описват своя случай накратко когато запазват своя час - за да сте винаги подготвени за казусите им. Информацията се пази в сигурен, криптиран вид на сървърите ни.
              </p>
            </div>
            <div className="col-md-4 col-xl-3">
              <div className="img-wrapper">
                <img src={letterImg} />
              </div>
              <h2>Е-мейл известяване</h2>
              <p>
              Ден преди консултацията и Вие, и клиентите Ви ще бъдете елегантно подсетени за наближаващата среща.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default InfoPage;
