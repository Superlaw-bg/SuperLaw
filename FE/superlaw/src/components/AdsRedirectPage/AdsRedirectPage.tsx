import { useNavigate } from "react-router-dom";
import "./AdsRedirectPage.scss";
import { useEffect } from "react";
import LoaderSpinner from "../LoaderSpinner";

const AdsRedirectPage = () => {
  const navigate = useNavigate();
  const redirect = () => {
    const millisecondsToWait = 2000;
    setTimeout(function() {
        navigate("/find");
    }, millisecondsToWait);
  };

  useEffect(() => {
    redirect();
  }, []);

  return (
    <div className="ads-page-wrapper">
        <h1>Препращаме Ви към платформата. Моля изчакайте.</h1>
        <LoaderSpinner/>
    </div>
  );
};

export default AdsRedirectPage;
