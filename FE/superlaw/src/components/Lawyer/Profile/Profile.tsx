import './Profile.scss';
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  
  const onClick = () => {
    navigate('/profile/create');
  }

  return (
    <div className='profile-info'>
      <div className='wrapper'>
        <div className='text'>
          <h2>Все още нямате профил</h2>
          <p>Чрез вашият профил в системата на Superlaw потребителите могат да се запознаят с вас и да си запишат час и ден за консултация.</p>
          <p>В профилът Ви може да качите ваша снимка, да попълните текст с информация за вас, часовата Ви ставка, адрес на кантората, правните категории, юридическите райони
          и телефон за връзка с вас. Като най-важното е, че можете там да задавате дни и часове, които клиентите ще могат да избират за да си уговорят консултация с вас.
          Можете да обновявате информацията в профила си по всяко време, имайте предвид, че ако промените вашия график, той ще се обнови след 2 седмици,
           ако имате вече насрочени срещи, в противен случай, в реално време.
          </p>
        </div>
        <div className='create-profile'>
          <Button className='create-btn' variant='primary' onClick={onClick}>Създай профил</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;