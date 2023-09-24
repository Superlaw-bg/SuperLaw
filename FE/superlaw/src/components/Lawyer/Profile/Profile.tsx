import { useEffect, useState } from "react";
import './Profile.scss';
import { useParams } from "react-router-dom";
import profileService from "../../../services/profileService";
import LawyerProfile from "../../../models/LawyerProfile";
import { Button } from "react-bootstrap";
import noProfilePic from "../../../assets/no-profile-picture-256.png";

const Profile = () => {
    const params = useParams();

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
        isJunior: false,
        isCompleted: false
      });
      
    useEffect(() => {
        const fetchProfile = async (id: number) => {
            const res = await profileService.getProfile(id);
            if (res !== null){
              setProfile(res);
            }
        };
        
        const profileId = Number(params.id);

        fetchProfile(profileId);
      }, []);

    return (
        <div className='profile-info'>
        <div className='header'>
          <div className='profile-image'>
              <img src={profile.imgPath !== '' ? profile.imgPath : noProfilePic} alt="profile picture" />
          </div>
          <div className='important-info'>
             <div className='sect'>
                <h3>{profile.fullName}</h3>
                <p>{profile.isJunior ? 'Младши адвокат' : 'Адвокат'}</p>
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

          <div className="book">
            <Button className="book-btn" variant='primary'>Запази час</Button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Profile;