import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import './HomePage.scss';

const HomePage = () => {
  const navigate = useNavigate();

  const redirect = () => navigate('/find');
  
  return (
    <section className='cta'>
      <div className='text'>
        <h4>Намерете адвокат и запазете час за консултация онлайн</h4>
        <p>През нашата платформа можете да се свържете с адвокати от цялата страна. Търсете по специалност, име или град!</p>
        <Button className="find-lawyer-btn" variant="primary" onClick={redirect}>
          Намерете адвокат
        </Button> 
      </div>
    </section>
  );
};

export default HomePage;