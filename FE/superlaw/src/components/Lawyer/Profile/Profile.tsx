import { FormEvent, useEffect, useState } from "react";
import './Profile.scss';
import { useNavigate, useParams } from "react-router-dom";
import profileApi from "../../../api/profileApi";
import LawyerProfile from "../../../models/LawyerProfile";
import { Button } from "react-bootstrap";
import noProfilePic from "../../../assets/no-profile-picture-256.png";
import Calendar, { TileDisabledFunc } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from"moment";
import { TileArgs } from "react-calendar/dist/cjs/shared/types";
import BookMeetingInput from "../../../models/inputs/BookMeetingInput";
import meetingApi from "../../../api/meetingApi";
import toastService from "../../../services/toastService";
import CalendarDateValue from "../../../models/CalendarDateValue";
import TimeSlot from "../../../models/TimeSlot";
import LoaderSpinner from "../../LoaderSpinner";
import { Helmet } from "react-helmet-async";
import { useStoreState } from "../../../store/hooks";

const Profile = () => {
    const params = useParams();
    const navigate = useNavigate();
    
    const isLoggedIn = useStoreState((state) => state.store.user.isLoggedIn);

    const todayDate = moment().toDate();
    const maxDate = moment().add(1, 'M').toDate();

    const [profileLoading, setProfileLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [profile, setProfile] = useState<LawyerProfile>({
        id: -1,
        imgPath: '',
        fullName: '',
        description: '',
        lawyerFirm: '',
        rate: 0,
        phone: '',
        address: '',
        categories: [],
        regions: [],
        rating: 0,
        city: '',
        schedule: [],
        isJunior: false,
        isCompleted: false
      });

    const [timeSlotOptions, setTimeSlotOptions] = useState<TimeSlot[]>([]);
    
    const [bookMeetingForm, setBookMeetingForm] = useState<BookMeetingInput>({
      date: null,
      timeslot: {
        id: -1,
        from: '',
        to: '',
        hasMeeting: false,
        clientName: null
      },
      categoryId: 0,
      info: ''
    });

    const [errorMessage, setErrorMessage] = useState("");
      
    useEffect(() => {
        const fetchProfile = async (id: number) => {
            try {
              setProfileLoading(true);
              const res = await profileApi.getProfile(id);
              if (res.data){
                setProfile(res.data);
              }
            } catch (error: any) {
            } finally {
              setProfileLoading(false);
            }
            
        };

        const profileId = Number(params.id);

        fetchProfile(profileId);
      }, []);

    const onDateSelect = (dateValue:  CalendarDateValue) => {
      const date = dateValue as Date;

      let scheduleDay = profile.schedule.filter(
        (x) => new Date(x.date).setHours(0,0,0,0) === date.setHours(0,0,0,0)
      )[0];

      const defaultDay = {
        date: date,
        timeSlots: [],
      };

      if (!scheduleDay) {
        scheduleDay = defaultDay;
      }

      //Make all slots from today unavailable
      if (date.getMonth() === todayDate.getMonth() && date.getDate() === todayDate.getDate()) {
       
        for (let i = 0; i < scheduleDay.timeSlots.length; i++) {
          //getDay returns day of the week, getDate returns the number of the day
          let fromHours = Number(scheduleDay.timeSlots[i].from.split(':')[0]);
          let fromMinutes = Number(scheduleDay.timeSlots[i].from.split(':')[1]);
  
          const dateToday = new Date();
          let todayHours = dateToday.getHours();
          let todayMinutes = dateToday.getMinutes();
        
          if ((todayMinutes + ((todayHours + 1) * 60)) >= (fromMinutes + (fromHours * 60))) {
            scheduleDay.timeSlots[i].hasMeeting = true;
          }
        }
       
      }
      
      let timeSlotsSelectedElem =  document.getElementsByClassName('selected')[0];

      if (timeSlotsSelectedElem) {
        timeSlotsSelectedElem.classList.remove("selected");
      }

      setBookMeetingForm({
        date: date,
        timeslot: {id: -1, from: '', to: '', hasMeeting: false, clientName: null},
        categoryId: 0,
        info: ''
      });

      setTimeSlotOptions(scheduleDay.timeSlots);
    }

    const onSlotSelect = (event: any, slot: any) => {

      if (!isLoggedIn) {
        toastService.showError('За да запазвате консултрации трябва да сте влезли в профила Ви.');
        navigate('/login', { state: { from: `/profile/${Number(params.id)}`} });
        return;
      }

      const slotDiv = event.target.parentElement;

      if (slotDiv.classList.contains('occupied')) {
        return;
      }

      let timeSlotsSelectedElem =  document.getElementsByClassName('selected')[0];

      if (timeSlotsSelectedElem) {
        timeSlotsSelectedElem.classList.remove("selected");
      }

      slotDiv.classList.add("selected");
     
      setBookMeetingForm({
        ...bookMeetingForm,
        timeslot: slot
      });
    }  

    const isDayDisabled: TileDisabledFunc = ({ activeStartDate, date, view }: TileArgs) => {
      let scheduleDay = profile.schedule.filter(
        (x) => new Date(x.date).setHours(0,0,0,0) === date.setHours(0,0,0,0)
      )[0];

      if(!scheduleDay || scheduleDay.timeSlots.filter(x => !x.hasMeeting).length === 0){
        return true;
      }

      let todayHours = todayDate.getHours();
      let todayMinutes = todayDate.getMinutes();

      if (date.getMonth() === todayDate.getMonth() && date.getDate() === todayDate.getDate()) {
        let occupiedCount = 0;

        for (let i = 0; i < scheduleDay.timeSlots.length; i++) {
            let fromHours = Number(scheduleDay.timeSlots[i].from.split(':')[0]);
            let fromMinutes = Number(scheduleDay.timeSlots[i].from.split(':')[1]);

            if ((todayMinutes + ((todayHours + 1) * 60)) >= (fromMinutes + (fromHours * 60))) {
                occupiedCount++;
            }
        }

        if (occupiedCount === scheduleDay.timeSlots.length) {
            return true;
        }
      }
  
      return false;
    }

    const onInput = (e: any) => {
      const inputName = e.target.name;
      const value = e.target.value;
  
      setBookMeetingForm({
        ...bookMeetingForm,
        [inputName]: value,
      });
    };

    const onSubmit = async (event: FormEvent) => {
      event.preventDefault();

      if (bookMeetingForm.date === null) {
        setErrorMessage('Моля, изберете дата');
        return;
      }

      if (bookMeetingForm.timeslot.from === '' || bookMeetingForm.timeslot.to === '') {
        setErrorMessage('Моля, изберете часови диапазон');
        return;
      }

      setErrorMessage('');

      try {
        setLoading(true);
        await meetingApi.createMeeting(
          {
            ...bookMeetingForm,
            profileId: Number(params.id)
          }
        );
        toastService.showSuccess("Успешно запазихте час за консултация.");

        setBookMeetingForm({
          date: null,
          timeslot: {id: -1, from: '', to: '', hasMeeting: false, clientName: null},
          categoryId: 0,
          info: ''
        });
  
        window.scrollTo(0, 0);
      } catch (error: any) {
      } finally {
        setLoading(false);
      }
    }

    if (profileLoading) {
      return (
        <div className="profile-spinner">
          <LoaderSpinner/>
        </div>
      )
    }

    return (
      <>
       <Helmet>
        <title>Профил - SuperLaw</title>
        <meta name='description' content='Профилът на адвоката съдържа информация за него, снимка и виртуален календар в който е възможно да запазите час за консултация в удобно за Вас и за него време.' />
        <link rel="canonical" href={`/profile/${Number(params.id)}`} />
      </Helmet>
      <div className='profile-info'>
        <div className='header'>
          <div className='profile-image'>
              <img src={profile.imgPath !== '' ? profile.imgPath : noProfilePic} alt="profile picture" />
          </div>
          <div className='important-info'>
             <div className='sect'>
                <h1>{profile.fullName}</h1>
                <p>{profile.isJunior ? 'Младши адвокат' : 'Адвокат'}</p>
             </div>

             <div className='sect rating'>
                {profile.rating === 0 && <p className='bold'>Няма оценка</p>}
                {profile.rating !== 0 && <p className="bold"><i className="fa-solid fa-star"></i> {profile.rating} / 5</p> }
              </div>

              <div className='sect categories'>
                {profile.categories.map((cat) => 
                  <span key={cat.id}> {cat.name}</span>
                )}
              </div>
            
              <div className='sect regions'>
                <p className="bold">Райони </p>
                {profile.regions.map((reg) => 
                  <span key={reg.id}> { reg.name }</span>
                )}
              </div>
              { profile.lawyerFirm !== '' && 
                <div className="sect">
                  <p className='bold'>Дружество</p>
                  <p>{profile.lawyerFirm}</p>
                </div>
              }
              <div className='sect'>
              <p className='bold'>Консултация: {profile.rate}лв</p>
              </div>
              
          </div>
        </div>
        <div className='additional-info'>
          <div className="left">
            <div className='sect phone'>
              <p className='bold'>Телефон</p>
              <p>{profile.phone}</p>    
            </div>

            <div className='sect city'>
              <p className='bold'>Град</p>
              <p>{profile.city}</p>    
            </div>

            <div className='sect address'>
              <p className='bold'>Адрес</p>
              <p>{profile.address}</p>    
            </div>

            <div className='sect description'>
              <p className='bold'>Информация</p>
              <p>{profile.description}</p>    
            </div>
          </div>
         
          <div className="book-calendar">
            <Calendar
              onChange={onDateSelect}
              value={bookMeetingForm.date}
              defaultView="month"
              minDetail="month"
              maxDetail="month"
              next2Label={null}
              prev2Label={null}
              minDate={todayDate}
              maxDate={maxDate}
              tileDisabled={isDayDisabled}
            />
             {bookMeetingForm.date &&
              <div className="time-slots">
                {timeSlotOptions.map((timeSlot) => 
                  <div className={`time-slot ${timeSlot.hasMeeting ? 'occupied' : ''}`} key={timeSlot.id} onClick={(e) => onSlotSelect(e, timeSlot)}>
                    <p>{timeSlot.from} - {timeSlot.to}</p>
                  </div>
                )}
              </div>
                
             }
             {bookMeetingForm.timeslot.from !== '' && 
              <form className="book-form" onSubmit={onSubmit}>
                <div className="form-group selection">
                  <label htmlFor="category">Категория</label>
                  <select className="form-select" id="category" name="categoryId" onChange={(e) => onInput(e)}>
                    <option selected disabled defaultValue="none">
                      Моля, изберете категория
                    </option>
                    {profile.categories.map((cat) => 
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                    )}
                  </select>
                </div>
                  <div className="form-group">
                    <label htmlFor="info">Повече информация</label>
                    <textarea id="info" className="form-control" name="info" placeholder='Информация относно казуса' rows={4} onChange={(e) => onInput(e)}/>
                  </div>

                  <p className='error'>
                    {errorMessage}
                  </p>

                  <div className="btn-wrapper">
                      {loading ?
                       <LoaderSpinner/> :
                       <Button className="book-btn" variant='primary' type="submit">Запази консултация</Button>
                      }
                    </div>
                  
              </form>
             }
          </div>

          
        </div>
      </div>
      </>
        
    );
  };
  
  export default Profile;