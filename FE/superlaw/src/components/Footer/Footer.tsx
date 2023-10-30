import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
    return (
      <footer className="site-footer">
        <p>SuperLaw &copy; Всички права запазени 2023 - 2024</p>
        <p>
        <Link target={"_blank"} to="/terms-and-conditions">Общи условия</Link>
        </p>
        <p>
        <Link target={"_blank"} to="/personal-data">Политика за личните данни</Link>
        </p>
        
        <a href="https://www.flaticon.com/free-icons/info" title="info icons" target="_blank">Info icons created by Freepik - Flaticon</a>
      </footer>
    );
  };
  
  export default Footer;