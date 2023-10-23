import { useEffect, useState } from 'react';
import './OwnProfile.scss';
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import profileService from '../../../services/profileService';
import LawyerProfile from '../../../models/LawyerProfile';
import noProfilePic from "../../../assets/no-profile-picture-256.png";

const OwnProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<LawyerProfile>({
    id: -1,
    imgPath: '',
    fullName: '',
    description: '',
    hourlyRate: 0,
    phone: '',
    address: '',
    categories: [],
    regions: [],
    rating: 0,
    schedule: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    },
    meetings: {},
    isJunior: false,
    isCompleted: false
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
        const res = await profileService.getOwnProfile();
        if (res !== null){
          setProfile(res);
        }
    };
    
    fetchProfile();
  }, []);
  
  const onCreateClick = () => {
    navigate('/profile/create');
  }

  const onEditClick = () => {
    navigate('/profile/edit');
  }

  return (
    <div>
       { profile && (!profile.id || profile.id === -1) && 
        <div className='create-profile-info'>
        <div className='wrapper'>
          <div className='text'>
            <h2>Все още нямате профил</h2>
            <p>Чрез вашият профил в системата на Superlaw потребителите могат да се запознаят с вас и да си запишат час и ден за консултация.</p>
            <p>В профилът Ви може да качите ваша снимка, да попълните текст с информация за вас, часовата Ви ставка, адрес на кантората, правните категории, съдебните райони
            и телефон за връзка с вас. Като най-важното е, че можете там да задавате дни и часове, които клиентите ще могат да избират за да си уговорят консултация с вас.
            Можете да обновявате информацията в профила си по всяко време, имайте предвид, че ако промените вашия график, той ще се обнови след 2 седмици,
             ако имате вече насрочени срещи, в противен случай, в реално време.
            </p>
          </div>
          <div className='create-profile'>
            <Button className='create-btn' variant='primary' onClick={onCreateClick}>Създай профил</Button>
          </div>
        </div>
      </div>
       }

       { profile && profile.id && profile.id !== -1 &&
          <div className='own-profile-info'>
          <div className='header'>
            <div className='profile-image'>
                <img src={profile.imgPath !== '' ? profile.imgPath : noProfilePic} alt="profile picture" />
            </div>
            <div className='important-info'>
               <div className='sect'>
                  <h3>{profile.fullName}</h3>
                  <p>{profile.isJunior ? 'Младши адвокат' : 'Адвокат'}</p>
               </div>

                <div className='sect rating'>
                  {profile.rating === 0 && <p className='bold'>Нямаш оценка</p>}
                  {profile.rating !== 0 && <p className="bold"><i className="fa-solid fa-star"></i> {profile.rating} / 5</p> }
                </div>

                <div className='sect categories'>
                  <p className='bold'>Категории: </p>
                  {profile.categories.map((cat, ind) => 
                    <span key={cat.id}> {ind !== profile.categories.length - 1 ? cat.name + ', ' : cat.name}</span>
                  )}
                </div>
              
                <div className='sect regions'>
                  <p className='bold'>Райони: </p>
                  {profile.regions.map((reg, ind) => 
                    <span key={reg.id}> {ind !== profile.regions.length - 1 ? reg.name + ', ' : reg.name}</span>
                  )}
                </div>
                <div className='sect'>
                <p className='bold'>Часова ставка: {profile.hourlyRate}лв</p>
                </div>
                
            </div>
          </div>
          <div className='additional-info'>
            <div className='sect phone'>
              <p className='bold'>Телефон:</p>
              <p>{profile.phone}</p>    
            </div>

            <div className='sect address'>
              <p className='bold'>Адрес:</p>
              <p>{profile.address}</p>    
            </div>

            <div className='sect description'>
              <p className='bold'>Информация:</p>
              <p>{profile.description}</p>    
            </div>

            <div className='schedule'>
                <p className='bold header'>График:</p>
                <div className='day monday'>
                  <div className='day-name'>
                    <p className='bold'>Понеделник</p>
                  </div>
                  <div className='time-slots'>
                  {profile.schedule.monday && profile.schedule.monday.map((timeSlot, ind) => 
                      <p key={ind}>{timeSlot.from} - {timeSlot.to}</p>
                    )}
                  </div>
                </div>
                <hr />
                <div className='day tuesday'>
                  <div className='day-name'>
                    <p className='bold'>Вторник</p>
                  </div>
                  <div className='time-slots'>
                  {profile.schedule.tuesday && profile.schedule.tuesday.map((timeSlot, ind) => 
                      <p key={ind}>{timeSlot.from} - {timeSlot.to}</p>
                    )}
                  </div>
                </div>
                <hr />
                <div className='day wednesday'>
                  <div className='day-name'>
                    <p className='bold'>Сряда</p>
                  </div>
                  <div className='time-slots'>
                  {profile.schedule.wednesday && profile.schedule.wednesday.map((timeSlot, ind) => 
                      <p key={ind}>{timeSlot.from} - {timeSlot.to}</p>
                    )}
                  </div>
                </div>
                <hr />
                <div className='day thursday'>
                  <div className='day-name'>
                    <p className='bold'>Четвъртък</p>
                  </div>
                  <div className='time-slots'>
                  {profile.schedule.thursday && profile.schedule.thursday.map((timeSlot, ind) => 
                      <p key={ind}>{timeSlot.from} - {timeSlot.to}</p>
                    )}
                  </div>
                </div>
                <hr />
                <div className='day friday'>
                  <div className='day-name'>
                    <p className='bold'>Петък</p>
                  </div>
                  <div className='time-slots'>
                  {profile.schedule.friday && profile.schedule.friday.map((timeSlot, ind) => 
                      <p key={ind}>{timeSlot.from} - {timeSlot.to}</p>
                    )}
                  </div>
                </div>
                <hr />
                <div className='day saturday'>
                  <div className='day-name'>
                    <p className='bold'>Събота</p>
                  </div>
                  <div className='time-slots'>
                  {profile.schedule.saturday && profile.schedule.saturday.map((timeSlot, ind) => 
                      <p key={ind}>{timeSlot.from} - {timeSlot.to}</p>
                    )}
                  </div>
                </div>
                <hr />
                <div className='day sunday'>
                  <div className='day-name'>
                    <p className='bold'>Неделя</p>
                  </div>
                  <div className='time-slots'>
                  {profile.schedule.sunday && profile.schedule.sunday.map((timeSlot, ind) => 
                      <p key={ind}>{timeSlot.from} - {timeSlot.to}</p>
                    )}
                  </div>
                </div>
                <hr />
            </div>

            <div className='edit-profile'>
              <Button className='edit-btn' variant='primary' onClick={onEditClick}>Редактирай</Button>
            </div>
          </div>
        </div>
       }
    </div>
   
    
  );
};

export default OwnProfile;