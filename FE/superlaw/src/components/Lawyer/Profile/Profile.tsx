import { FormEvent, useEffect, useState } from "react";
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
import BookMeetingInput from "../../../models/inputs/BookMeetingInput";
import meetingService from "../../../services/meetingService";
import toastService from "../../../services/toastService";
import TimeSlotSelect from "../../../models/TimeSlotSelect";

const Profile = () => {
    const params = useParams();

    type ValuePiece = Date | null;

    type Value = ValuePiece | [ValuePiece, ValuePiece];

    const todayDate = moment().toDate();
    const maxDate = moment().add(1, 'M').toDate();

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
        meetings: {},
        isJunior: false,
        isCompleted: false
      });

    const [timeSlotOptions, setTimeSlotOptions] = useState<TimeSlotSelect[]>([]);
    
    const [bookMeetingForm, setBookMeetingForm] = useState<BookMeetingInput>({
      date: null,
      timeslot: {
        from: '',
        to: '',
      },
      categoryId: 0,
      regionId: 0,
      info: ''
    });

    const [errorMessage, setErrorMessage] = useState("");
      
    useEffect(() => {
        const fetchProfile = async (id: number) => {
            const res = await profileService.getProfile(id);
            if (res !== null){
              setProfile(res);
              console.log(res);
            }
        };
        
        const profileId = Number(params.id);

        fetchProfile(profileId);
        console.log(profile);
      }, []);

    const onDateSelect = (dateValue:  Value) => {
      const date = dateValue as Date;
      const timeSlots = profileService.getScheduleForDay(date.getDay(), profile.schedule);

      const meetingsForDate = meetingService.getMeetingsForDate(date, profile);

      const todayDate = new Date();
    
      let timeSlotsForSelections: TimeSlotSelect[] = [];

      for(let i = 0; i < timeSlots.length;i++){
        timeSlotsForSelections.push({from: timeSlots[i].from, to: timeSlots[i].to, isOccupied: false});
      }

      for(let i = 0; i < timeSlotsForSelections.length;i++){

        //getDay returns day of the week, getDate returns the number of the day
        if (date.getMonth() === todayDate.getMonth() && date.getDate() === todayDate.getDate()){
          let fromHours = Number(timeSlotsForSelections[i].from.split(':')[0]);
          let fromMinutes = Number(timeSlotsForSelections[i].from.split(':')[1]);

          let todayHours = todayDate.getHours();
          let todayMinutes = todayDate.getMinutes();

          if ((todayMinutes + ((todayHours + 1) * 60)) >= (fromMinutes + (fromHours * 60))) {
            timeSlotsForSelections[i].isOccupied = true;
          }
        }

        if (meetingsForDate) {
    
          let meeting = meetingsForDate.filter(x => x.from === timeSlotsForSelections[i].from && x.to === timeSlotsForSelections[i].to);
          
          if (meeting.length !== 0) {
            timeSlotsForSelections[i].isOccupied = true;
          }
        }

      }

      let timeSlotsSelectedElem =  document.getElementsByClassName('selected')[0];

      if (timeSlotsSelectedElem) {
        timeSlotsSelectedElem.classList.remove("selected");
      }

      setBookMeetingForm({
        date: date,
        timeslot: {from: '', to: ''},
        categoryId: 0,
        regionId: 0,
        info: ''
      });

      setTimeSlotOptions(timeSlotsForSelections);
    }

    const onSlotSelect = (event: any, slot: any) => {
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
      const timeSlots = profileService.getScheduleForDay(date.getDay(), profile.schedule);

      if (timeSlots.length === 0){
        return true;
      }

      const todayDate = new Date();

      let todayHours = todayDate.getHours();
      let todayMinutes = todayDate.getMinutes();

      const meetingsForDatetest = meetingService.getMeetingsForDate(date, profile);

      if (date.getMonth() === todayDate.getMonth() && date.getDate() === todayDate.getDate()){
        let occupiedCount = 0;

        for(let i = 0; i < timeSlots.length;i++){
          let fromHours = Number(timeSlots[i].from.split(':')[0]);
          let fromMinutes = Number(timeSlots[i].from.split(':')[1]);

          if ((todayMinutes + ((todayHours + 1) * 60)) >= (fromMinutes + (fromHours * 60))) {
            occupiedCount++;
          }
        }

        if (occupiedCount === timeSlots.length){
          return true;
        }
        
        if (meetingsForDatetest && meetingsForDatetest.length + occupiedCount >= timeSlots.length){
          return true;
        }
      }
      const meetingsForDate = meetingService.getMeetingsForDate(date, profile);

      if (meetingsForDate && meetingsForDate.length === timeSlots.length) {
        return true;
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

      const res = await meetingService.createMeeting(
        {
          ...bookMeetingForm,
          profileId: Number(params.id)
        }
      );

      if(!res.isError){
        toastService.showSuccess("Успешно запазихте час за консултация.");

        setBookMeetingForm({
          date: null,
          timeslot: {from: '', to: ''},
          categoryId: 0,
          regionId: 0,
          info: ''
        });
  
        window.scrollTo(0, 0);
      }
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
                {timeSlotOptions.map((timeSlot, ind) => 
                  <div className={`time-slot ${timeSlot.isOccupied ? 'occupied' : ''}`} key={ind} onClick={(e) => onSlotSelect(e, timeSlot)}>
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
                <div className="form-group selection">
                  <label htmlFor="region">Град</label>
                  <select className="form-select" id="region" name="regionId" onChange={(e) => onInput(e)}>
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
                    <textarea id="info" className="form-control" name="info" placeholder='Информация относно казуса' rows={4} onChange={(e) => onInput(e)}/>
                  </div>

                  <p className='error'>
                    {errorMessage}
                  </p>

                  <div className="btn-wrapper">
                    <Button className="book-btn" variant='primary' type="submit">Запази час</Button>
                  </div>
              </form>
             }
          </div>

          
        </div>
      </div>
    );
  };
  
  export default Profile;