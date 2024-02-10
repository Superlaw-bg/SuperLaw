import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './HomePage.scss';
import { useEffect } from "react";
import { useStoreActions, useStoreState } from "../../store/hooks";

const HomePage = () => {
  const navigate = useNavigate();

  //If a user has been redirect to login after browsing a profil, will be redirected back to the profile
  const redirect = useStoreState(store => store.store.redirect);
  const dispatchSetRedirect = useStoreActions(actions => actions.store.setRedirect);
  
  const redirectToFind = () => navigate('/find');

  useEffect(() => {

    if (redirect) {
      navigate(redirect);
      dispatchSetRedirect(null);
    }

  }, []);
  
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
        <Button className="find-lawyer-btn" variant="primary" onClick={redirectToFind}>
          Намерете адвокат
        </Button> 
      </div>
    </section>
    </>
  );
};

export default HomePage;