import { useNavigate } from "react-router-dom";
import "./QrCodeRedirectPage.scss";
import { useEffect } from "react";
import LoaderSpinner from "../LoaderSpinner";

const QrCodeRedirectPage = () => {
  const navigate = useNavigate();
  const redirect = () => {
    const millisecondsToWait = 2000;
    setTimeout(function() {
        navigate("/registerLaw");
    }, millisecondsToWait);
  };

  useEffect(() => {
    redirect();
  }, []);

  return (
    <div className="qr-page-wrapper">
        <h4>Препращаме Ви към страницата за регистрация. Моля изчакайте.</h4>
        <LoaderSpinner/>
    </div>
  );
};

export default QrCodeRedirectPage;
