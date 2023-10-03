import { useEffect, useState } from "react";
import './Profile.scss';
import { useParams } from "react-router-dom";
import profileService from "../../../services/profileService";
import LawyerProfile from "../../../models/LawyerProfile";
import { Button } from "react-bootstrap";
import noProfilePic from "../../../assets/no-profile-picture-256.png";
import Calendar, { TileDisabledFunc } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from"moment";
import { TileArgs } from "react-calendar/dist/cjs/shared/types";
import TimeSlotInput from "../../../models/inputs/TimeSlotInput";

const Profile = () => {
    const params = useParams();

    type ValuePiece = Date | null;

    type Value = ValuePiece | [ValuePiece, ValuePiece];

    const todayDate = moment().toDate();
    const maxDate = moment().add(1, 'M').toDate();

    const [selectedDate, setSelectedDate] = useState<Value>(null);
    const [timeSlotOptions, setTimeSlotOptions] = useState<TimeSlotInput[]>([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlotInput>();

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
        schedule: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        },
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
        console.log(profile);
      }, []);

    const onDateSelect = (date: any) => {
      const timeSlots = profileService.getScheduleForDay(date.getDay(), profile.schedule);

      let timeSlotsSelectedElem =  document.getElementsByClassName('selected')[0];

      if (timeSlotsSelectedElem) {
        timeSlotsSelectedElem.classList.remove("selected");
      }
      
      setSelectedDate(date);
      setTimeSlotOptions(timeSlots);
    }

    const onSlotSelect = (event: any, slot: any) => {
      let timeSlotsSelectedElem =  document.getElementsByClassName('selected')[0];

      if (timeSlotsSelectedElem) {
        timeSlotsSelectedElem.classList.remove("selected");
      }

      const slotDiv = event.target.parentElement;
      slotDiv.classList.add("selected");
      setSelectedTimeSlot(slot);
    }  

    const isDayDisabled: TileDisabledFunc = ({ activeStartDate, date, view }: TileArgs) => {
      const timeSlots = profileService.getScheduleForDay(date.getDay(), profile.schedule);

      if (timeSlots.length !== 0){
        return false;
      }

      return true;
    }

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

          <div className="book-calendar">
            <Calendar 
              onChange={onDateSelect}
              value={selectedDate}
              defaultView="month"
              minDetail="month"
              maxDetail="month"
              next2Label={null}
              prev2Label={null}
              minDate={todayDate}
              maxDate={maxDate}
              tileDisabled={isDayDisabled}
            />
             {selectedDate &&
              <div className="time-slots">
                {timeSlotOptions.map((timeSlot, ind) => 
                  <div className='time-slot' key={ind} onClick={(e) => onSlotSelect(e, timeSlot)}>
                    <p>{timeSlot.from} - {timeSlot.to}</p>
                  </div>
                )}
              </div>
                
             }
             {selectedTimeSlot && 
              <form className="book-form">
                <div className="form-group selection">
                  <label htmlFor="category">Категория</label>
                  <select className="form-select" name="category">
                    <option selected disabled defaultValue="none">
                      Моля, изберете категория
                    </option>
                    {profile.categories.map((cat) => 
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                    )}
                  </select>
                </div>
                <div className="form-group selection">
                  <label htmlFor="region">Град</label>
                  <select className="form-select" name="category">
                    <option selected disabled defaultValue="none">
                      Моля, изберете град
                    </option>
                    {profile.regions.map((r) => 
                    <option key={r.id} value={r.id}>{r.name}</option>
                    )}
                  </select>
                </div>
                  <div className="form-group">
                    <label htmlFor="info">Повече информация</label>
                    <textarea id="info" className="form-control" name="info" placeholder='Информация относно казуса' rows={4}/>
                  </div>
                  <div className="btn-wrapper">
                    <Button className="book-btn" variant='primary'>Запази час</Button>
                  </div>
              </form>
             }
          </div>

          
        </div>
      </div>
    );
  };
  
  export default Profile;