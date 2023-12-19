import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './HomePage.scss';

const HomePage = () => {
  const navigate = useNavigate();

  const redirect = () => navigate('/find');
  
  return (
    <>
    <Helmet>
      <meta name='description' content='Намерете адвокат и запазете час за консултация онлайн. През нашата платформа можете да се свържете с адвокати от цялата страна. Търсете по специалност, име или град.' />
      <link rel="canonical" href="/" />
    </Helmet>
    <section className='cta'>
      <div className='text'>
        <h1>Намерете адвокат и запазете час за консултация онлайн</h1>
        <p>През нашата платформа можете да се свържете с адвокати от цялата страна. Търсете по специалност, име или град!</p>
        <Button className="find-lawyer-btn" variant="primary" onClick={redirect}>
          Намерете адвокат
        </Button> 
      </div>
    </section>
    </>
  );
};

export default HomePage;