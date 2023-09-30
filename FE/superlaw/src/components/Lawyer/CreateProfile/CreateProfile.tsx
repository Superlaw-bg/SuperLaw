import { FormEvent, useEffect, useState } from 'react';
import './CreateProfile.scss';
import { Button, Form } from "react-bootstrap";
import FileUpload from '../../FileUpload';
import toastService from '../../../services/toastService';
import Select from 'react-select';
import { MultiValue, ActionMeta, InputActionMeta } from 'react-select';
import profileService from '../../../services/profileService';
import legalCategoriesService from '../../../services/legalCategoriesService';
import judicialRegionsService from '../../../services/judicialRegionsService';
import { useNavigate } from 'react-router-dom';
import ProfileInput from '../../../models/inputs/ProfileInput';
import TimeSlotInput from '../../../models/inputs/TimeSlotInput';
import ScheduleInput from '../../../models/inputs/ScheduleInput';

const CreateProfile = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [profile, setProfile] = useState<ProfileInput>({
    image: '',
    description: "",
    hourlyRate: 0,
    address: "",
    categories: [],
    regions: [],
    isJunior: false,
    isCompleted: false,
  });

  const [schedule, setSchedule] = useState<ScheduleInput>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
        const res = await legalCategoriesService.getCategories();

        let categoriesRes: any = [];

        res.forEach(x => {
          categoriesRes.push({
            value: x.id,
            label: x.name
          });
        });

        setCategories(categoriesRes);
    };

    const fetchRegions = async () => {
      const res = await judicialRegionsService.getRegions();

      let regionsRes: any = [];

      res.forEach(x => {
        regionsRes.push({
          value: x.id,
          label: x.name
        });
      });

      setRegions(regionsRes);
  };
  
    fetchCategories();
    fetchRegions();
  }, []);

  const onProfilePicUploadSuccess = (file: File) => {
    setProfile({...profile, image: file});
  };

  const onProfilePicUploadError = (error: string) => {
    toastService.showError(error);
  };

  const onInput = (e: any) => {
    const inputName = e.target.name;
    let value = e.target.value;

    if(inputName === 'hourlyRate'){
      value = Number(value);
    }

    setProfile({
      ...profile,
      [inputName]: value,
    });
  };

  const onCategorySelect = (newValue: any, actionMeta: ActionMeta<never>): void  => {
    setProfile({...profile, categories: newValue});
  };

  const onRegionSelect = (newValue: any, actionMeta: ActionMeta<never>): void  => {
    setProfile({...profile, regions: newValue});
  }; 

  const onTimeSlotDelete = (event: any, dayOfWeek: number) => {
    let slot = event.target.parentElement.innerText;
    const from = slot.split(' - ')[0];
    const to = slot.split(' - ')[1];

    let scheduleForDay = schedule.monday;
    switch(dayOfWeek){
      case 1:
        scheduleForDay = schedule.monday;
        break;
      case 2:
        scheduleForDay = schedule.tuesday;
        break;
      case 3:
        scheduleForDay = schedule.wednesday;
        break;
      case 4:
        scheduleForDay = schedule.thursday;
        break;
      case 5:
        scheduleForDay = schedule.friday;
        break;
      case 6:
        scheduleForDay = schedule.saturday;
        break;
      case 7:
        scheduleForDay = schedule.sunday;
        break;
    }

    console.log(scheduleForDay);

    let filteredSlots = scheduleForDay.filter(x => x.from !== from && x.to !== to);

    let dayOfWeekStr = "monday";

    switch(dayOfWeek){
      case 1:
        dayOfWeekStr = "monday";
        break;
      case 2:
        dayOfWeekStr = "tuesday";
        break;
      case 3:
        dayOfWeekStr = "wednesday";
        break;
      case 4:
        dayOfWeekStr = "thursday";
        break;
      case 5:
        dayOfWeekStr = "friday";
        break;
      case 6:
        dayOfWeekStr = "saturday";
        break;
      case 7:
        dayOfWeekStr = "sunday";
        break;
    }

    setSchedule({
      ...schedule,
      [dayOfWeekStr]: filteredSlots
    });
  }

  const onTimeSlotAdd = (event: any, dayOfWeek: number) => {
    console.log(event.target.parentElement.getElementsByClassName('from')[0].value);
    console.log(event.target.parentElement.getElementsByClassName('to')[0].value);

    const from = event.target.parentElement.getElementsByClassName('from')[0].value;
    const to = event.target.parentElement.getElementsByClassName('to')[0].value;

    if (from === '' || to === ''){
      return;
    }

    let scheduleForDay = schedule.monday;
    switch(dayOfWeek){
      case 1:
        scheduleForDay = schedule.monday;
        break;
      case 2:
        scheduleForDay = schedule.tuesday;
        break;
      case 3:
        scheduleForDay = schedule.wednesday;
        break;
      case 4:
        scheduleForDay = schedule.thursday;
        break;
      case 5:
        scheduleForDay = schedule.friday;
        break;
      case 6:
        scheduleForDay = schedule.saturday;
        break;
      case 7:
        scheduleForDay = schedule.sunday;
        break;
    }

    scheduleForDay.push({from, to});

    let dayOfWeekStr = "monday";

    switch(dayOfWeek){
      case 1:
        dayOfWeekStr = "monday";
        break;
      case 2:
        dayOfWeekStr = "tuesday";
        break;
      case 3:
        dayOfWeekStr = "wednesday";
        break;
      case 4:
        dayOfWeekStr = "thursday";
        break;
      case 5:
        dayOfWeekStr = "friday";
        break;
      case 6:
        dayOfWeekStr = "saturday";
        break;
      case 7:
        dayOfWeekStr = "sunday";
        break;
    }

    setSchedule({
      ...schedule,
      [dayOfWeekStr]: scheduleForDay
    });

    console.log(schedule);
  }

  const onCheckbox = (e: any) => {
    const inputName = e.target.name;
    const value = e.target.checked;
    setProfile({
      ...profile,
      [inputName]: value,
    });
  }

  const isDataValid = () => {
    if (profile.description === ''){
      setErrorMessage("Моля въведете описание");
      return false;
    }

    if (Number.isNaN(profile.hourlyRate) || profile.hourlyRate < 10 || profile.hourlyRate > 500){
      setErrorMessage("Часовата ставка трябва да е число между 10 и 500");
      return false;
    }

    if (profile.address === ''){
      setErrorMessage("Моля въведете адрес");
      return false;
    }

    if (profile.categories.length === 0){
      setErrorMessage("Моля изберете поне една категория");
      return false;
    }

    if (profile.regions.length === 0){
      setErrorMessage("Моля изберете поне един район");
      return false;
    }

    setErrorMessage('');
    return true;
  }

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();

    if (!isDataValid()){
      return;
    }

    let categories = profile.categories.map((c: any) => c.value);
    let regions = profile.regions.map((r: any) => r.value);

    const formData = new FormData();
    formData.append('image', profile.image);
    formData.append('description', profile.description);
    formData.append('hourlyRate', profile.hourlyRate.toString());
    formData.append('address', profile.address);
    formData.append('categories', categories.join());
    formData.append('regions', regions.join());
    formData.append('isJunior', profile.isJunior.toString());
    formData.append('isCompleted', profile.isCompleted.toString());

    const res = await profileService.createProfile(formData);

    if(!res.isError){
      toastService.showSuccess("Успешно създадохте вашия адвокатски профил");
      navigate('/profile');
    }

  };

  return (
    <div className="form-wrapper-create-profile">
        <form className="create-profile-form" onSubmit={onCreate}>
          <h1 className="register-heading">Създаване на профил</h1>
          <div className="form-group picture">
            <label>Снимка</label>
              <FileUpload onFileSelectSuccess={onProfilePicUploadSuccess} onFileSelectError={onProfilePicUploadError}/>
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea id="description" className="form-control" name="description" placeholder='Основна информация за Вас като адвокат' rows={4} onChange={(e) => onInput(e)}/>
          </div>

          <div className="form-group">
            <label htmlFor="hourly-rate">Часова ставка</label>
            <input id="hourly-rate" type="text" className="form-control" name="hourlyRate" onChange={(e) => onInput(e)}/>
          </div>

          <div className="form-group">
            <label htmlFor="address">Работен адрес</label>
            <input id="address" type="text" className="form-control" name="address" onChange={(e) => onInput(e)}/>
          </div>

          <div className="form-group selection">
            <label htmlFor="legalCategory">Категории</label>
            <Select
              isMulti
              name="legalCategories"
              options={categories}
              className="basic-multi-select"
              classNamePrefix="select"
              value={profile.categories}
              onChange={onCategorySelect} 
            />
          </div>

          <div className="form-group selection">
            <label htmlFor="regions">Съдебни райони</label>
            <Select
              isMulti
              name="regions"
              options={regions}
              className="basic-multi-select"
              classNamePrefix="select"
              value={profile.regions}
              onChange={onRegionSelect} 
            />
          </div>

          <div className='form-group schedule'>
            <label htmlFor="schedule">График</label>
            <div className='day monday'>
                  <div className='day-name'>
                    <p className='bold'>Понеделник</p>
                  </div>
                  <div className='time-slots'>
                    <div className='time-slot'>
                      <p>9:00 - 10:00 <span className='delete' onClick={(e) => onTimeSlotDelete(e, 1)}>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>10:00 - 11:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>11:00 - 12:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>13:00 - 14:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>14:00 - 15:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>15:00 - 16:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>16:00 - 17:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='select-range'>
                      <span>От: </span>
                      <input type="time" className='from' name="appt" min="09:00" max="18:00" required />
                      <span>До: </span>
                      <input type="time" className='to' name="appt" min="09:00" max="18:00" required />
                      <span className='add' onClick={(e) => onTimeSlotAdd(e, 1)}>✓</span>
                    </div>
                    
                  </div>
                </div>
                <hr />
                <div className='day tuesday'>
                  <div className='day-name'>
                    <p className='bold'>Вторник</p>
                  </div>
                  <div className='time-slots'>
                    <div className='time-slot'>
                      <p>9:00 - 10:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>10:00 - 11:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>11:00 - 12:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='select-range'>
                      <span>От: </span>
                      <input type="time" className='from' id="appt" name="appt" min="09:00" max="18:00" required />
                      <span>До: </span>
                      <input type="time" id="appt" name="appt" min="09:00" max="18:00" required />
                      <span className='add'>✓</span>
                    </div>
                    
                  </div>
                </div>
                <hr />
                <div className='day wednesday'>
                  <div className='day-name'>
                    <p className='bold'>Сряда</p>
                  </div>
                  <div className='time-slots'>
                    <div className='time-slot'>
                      <p>9:00 - 10:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>10:00 - 11:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>11:00 - 12:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>13:00 - 14:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='select-range'>
                      <span>От: </span>
                      <input type="time" className='from' id="appt" name="appt" min="09:00" max="18:00" required />
                      <span>До: </span>
                      <input type="time" id="appt" name="appt" min="09:00" max="18:00" required />
                      <span className='add'>✓</span>
                    </div>
                  </div>
                </div>
                <hr />
                <div className='day thursday'>
                  <div className='day-name'>
                    <p className='bold'>Четвъртък</p>
                  </div>
                  <div className='time-slots'>
                    <div className='time-slot'>
                      <p>9:00 - 10:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>10:00 - 11:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>11:00 - 12:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>13:00 - 14:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>14:00 - 15:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>15:00 - 16:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>16:00 - 17:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='select-range'>
                      <span>От: </span>
                      <input type="time" className='from' id="appt" name="appt" min="09:00" max="18:00" required />
                      <span>До: </span>
                      <input type="time" id="appt" name="appt" min="09:00" max="18:00" required />
                      <span className='add'>✓</span>
                    </div>
                  </div>
                </div>
                <hr />
                <div className='day friday'>
                  <div className='day-name'>
                    <p className='bold'>Петък</p>
                  </div>
                  <div className='time-slots'>
                    <div className='select-range'>
                      <span>От: </span>
                      <input type="time" className='from' id="appt" name="appt" min="09:00" max="18:00" required />
                      <span>До: </span>
                      <input type="time" id="appt" name="appt" min="09:00" max="18:00" required />
                      <span className='add'>✓</span>
                    </div>
                    
                  </div>
                </div>
                <hr />
                <div className='day saturday'>
                  <div className='day-name'>
                    <p className='bold'>Събота</p>
                  </div>
                  <div className='time-slots'>
                    <div className='time-slot'>
                      <p>9:00 - 10:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>10:00 - 11:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>11:00 - 12:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>13:00 - 14:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>14:00 - 15:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>15:00 - 16:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='time-slot'>
                      <p>16:00 - 17:00 <span className='delete'>X</span></p>
                    </div>
                    <div className='select-range'>
                      <span>От: </span>
                      <input type="time" className='from' id="appt" name="appt" min="09:00" max="18:00" required />
                      <span>До: </span>
                      <input type="time" id="appt" name="appt" min="09:00" max="18:00" required />
                      <span className='add'>✓</span>
                    </div>
                    
                  </div>
                </div>
                <hr />
                <div className='day sunday'>
                  <div className='day-name'>
                    <p className='bold'>Неделя</p>
                  </div>
                  <div className='time-slots'>
                    <div className='select-range'>
                      <span>От: </span>
                      <input type="time" className='from' id="appt" name="appt" min="09:00" max="18:00" required />
                      <span>До: </span>
                      <input type="time" id="appt" name="appt" min="09:00" max="18:00" required />
                      <span className='add'>✓</span>
                    </div>
                    
                  </div>
                </div>
                <hr />
          </div>

          <div className="form-group checkboxes">
            <Form.Check
              className='checkbox'
              type="switch"
              id="isJunior"
              label="Младши адвокат ли сте?"
              name='isJunior'
              onChange={onCheckbox}
            />
            <p className='info-isCompleted'>Със завършването на профила Ви той ще бъде видим за потребителите</p>
            <Form.Check
              className='checkbox'
              type="switch"
              label="Профилът Ви завършен ли е?"
              id="isCompleted"
              name='isCompleted'
              onChange={onCheckbox}
            />
          </div>

          <p className='error'>
              {errorMessage}
          </p>

          <Button className="primary-btn" type="submit" variant="primary">
            Създай
          </Button>
        </form>
      </div>
  );
};

export default CreateProfile;