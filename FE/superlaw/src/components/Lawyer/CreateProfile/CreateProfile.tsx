import { FormEvent, useEffect, useState } from 'react';
import './CreateProfile.scss';
import { Button, Form } from "react-bootstrap";
import FileUpload from '../../FileUpload';
import toastService from '../../../services/toastService';
import Select from 'react-select';
import { ActionMeta } from 'react-select';
import profileService from '../../../services/profileService';
import legalCategoriesService from '../../../services/legalCategoriesService';
import judicialRegionsService from '../../../services/judicialRegionsService';
import { useNavigate } from 'react-router-dom';
import ProfileInput from '../../../models/inputs/ProfileInput';
import Days from '../../../constants/daysOfWeek';

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
    isCompleted: false,
  });

  const [errorMessage, setErrorMessage] = useState("");

  const [scheduleErrorMessages, setScheduleErrorMessages] = useState({
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: ''
  });

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

  const onTimeSlotDelete = (dayOfWeek: string, index: number) => {

    let schedule = profileService.getScheduleForDayStr(dayOfWeek, profile.schedule);

    schedule.splice(index, 1);

    setProfile({
      ...profile,
      schedule: {
        ...profile.schedule,
        [dayOfWeek]: schedule
      }
    });
  }

  const onTimeSlotAdd = (event: any, dayOfWeek: string) => {
    const from = event.target.parentElement.getElementsByClassName('from')[0].value;
    const to = event.target.parentElement.getElementsByClassName('to')[0].value;

    if (from === '' || to === ''){
      return;
    }

    const err = profileService.validateTimeSlot(from, to);

    if (err) {
      setScheduleErrorMessages({
        ...scheduleErrorMessages,
        [dayOfWeek]: err
      });
      return;
    }
    
    let scheduleForDay = profileService.getScheduleForDayStr(dayOfWeek, profile.schedule);

    const errMsg = profileService.validateTimeSlotsInDay(from, to, scheduleForDay);

    if (errMsg) {
      setScheduleErrorMessages({
        ...scheduleErrorMessages,
        [dayOfWeek]: errMsg
      });
      return;
    }

    scheduleForDay.push({from: from, to: to});

    setProfile({
      ...profile,
      schedule: {
        ...profile.schedule,
        [dayOfWeek]: scheduleForDay
      }
    });

    setScheduleErrorMessages({
      ...scheduleErrorMessages,
      [dayOfWeek]: ''
    });
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
    formData.append('schedule', JSON.stringify(profile.schedule));
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
                    {profile.schedule.monday && profile.schedule.monday.map((timeSlot, ind) => 
                      <div className='time-slot' key={ind}>
                        <p>{timeSlot.from} - {timeSlot.to} <span className='delete' onClick={() => onTimeSlotDelete(Days.Monday, ind)}>X</span></p>
                      </div>
                    )}
                    <div className='select-range'>
                      <span>От: </span>
                      <input type="time" className='from' />
                      <span>До: </span>
                      <input type="time" className='to' />
                      <span className='add' onClick={(e) => onTimeSlotAdd(e, Days.Monday)}>✓</span>
                    </div>
                    {scheduleErrorMessages.monday && 
                      <p className='error'>{scheduleErrorMessages.monday}</p>
                    }
                  </div>
                </div>
                <hr />
                <div className='day tuesday'>
                  <div className='day-name'>
                    <p className='bold'>Вторник</p>
                  </div>
                  <div className='time-slots'>
                  {profile.schedule.tuesday && profile.schedule.tuesday.map((timeSlot, ind) => 
                      <div className='time-slot' key={ind}>
                        <p>{timeSlot.from} - {timeSlot.to} <span className='delete' onClick={() => onTimeSlotDelete(Days.Tuesday, ind)}>X</span></p>
                      </div>
                    )}
                    <div className='select-range'>
                      <span>От: </span>
                      <input type="time" className='from' />
                      <span>До: </span>
                      <input type="time" className='to'/>
                      <span className='add' onClick={(e) => onTimeSlotAdd(e, Days.Tuesday)}>✓</span>
                    </div>
                    {scheduleErrorMessages.tuesday && 
                      <p className='error'>{scheduleErrorMessages.tuesday}</p>
                    }
                  </div>
                </div>
                <hr />
                <div className='day wednesday'>
                  <div className='day-name'>
                    <p className='bold'>Сряда</p>
                  </div>
                  <div className='time-slots'>
                  {profile.schedule.wednesday && profile.schedule.wednesday.map((timeSlot, ind) => 
                      <div className='time-slot' key={ind}>
                        <p>{timeSlot.from} - {timeSlot.to} <span className='delete' onClick={() => onTimeSlotDelete(Days.Wednesday, ind)}>X</span></p>
                      </div>
                    )}
                    <div className='select-range'>
                      <span>От: </span>
                      <input type="time" className='from'/>
                      <span>До: </span>
                      <input type="time" className='to' />
                      <span className='add' onClick={(e) => onTimeSlotAdd(e, Days.Wednesday)}>✓</span>
                    </div>
                    {scheduleErrorMessages.wednesday && 
                      <p className='error'>{scheduleErrorMessages.wednesday}</p>
                    }
                  </div>
                </div>
                <hr />
                <div className='day thursday'>
                  <div className='day-name'>
                    <p className='bold'>Четвъртък</p>
                  </div>
                  <div className='time-slots'>
                  {profile.schedule.thursday && profile.schedule.thursday.map((timeSlot, ind) => 
                      <div className='time-slot' key={ind}>
                        <p>{timeSlot.from} - {timeSlot.to} <span className='delete' onClick={() => onTimeSlotDelete(Days.Thursday, ind)}>X</span></p>
                      </div>
                    )}
                    <div className='select-range'>
                      <span>От: </span>
                      <input type="time" className='from'/>
                      <span>До: </span>
                      <input type="time" className='to'/>
                      <span className='add' onClick={(e) => onTimeSlotAdd(e, Days.Thursday)}>✓</span>
                    </div>
                    {scheduleErrorMessages.thursday && 
                      <p className='error'>{scheduleErrorMessages.thursday}</p>
                    }
                  </div>
                </div>
                <hr />
                <div className='day friday'>
                  <div className='day-name'>
                    <p className='bold'>Петък</p>
                  </div>
                  <div className='time-slots'>
                  {profile.schedule.friday && profile.schedule.friday.map((timeSlot, ind) => 
                      <div className='time-slot' key={ind}>
                        <p>{timeSlot.from} - {timeSlot.to} <span className='delete' onClick={() => onTimeSlotDelete(Days.Friday, ind)}>X</span></p>
                      </div>
                    )}
                    <div className='select-range'>
                      <span>От: </span>
                      <input type="time" className='from'/>
                      <span>До: </span>
                      <input type="time" className='to'/>
                      <span className='add' onClick={(e) => onTimeSlotAdd(e, Days.Friday)}>✓</span>
                    </div>
                    {scheduleErrorMessages.friday && 
                      <p className='error'>{scheduleErrorMessages.friday}</p>
                    }
                  </div>
                </div>
                <hr />
                <div className='day saturday'>
                  <div className='day-name'>
                    <p className='bold'>Събота</p>
                  </div>
                  <div className='time-slots'>
                  {profile.schedule.saturday && profile.schedule.saturday.map((timeSlot, ind) => 
                      <div className='time-slot' key={ind}>
                        <p>{timeSlot.from} - {timeSlot.to} <span className='delete' onClick={() => onTimeSlotDelete(Days.Saturday, ind)}>X</span></p>
                      </div>
                    )}
                    <div className='select-range'>
                      <span>От: </span>
                      <input type="time" className='from' />
                      <span>До: </span>
                      <input type="time" className='to'/>
                      <span className='add' onClick={(e) => onTimeSlotAdd(e, Days.Saturday)}>✓</span>
                    </div>
                    {scheduleErrorMessages.saturday && 
                      <p className='error'>{scheduleErrorMessages.saturday}</p>
                    }
                  </div>
                </div>
                <hr />
                <div className='day sunday'>
                  <div className='day-name'>
                    <p className='bold'>Неделя</p>
                  </div>
                  <div className='time-slots'>
                  {profile.schedule.sunday && profile.schedule.sunday.map((timeSlot, ind) => 
                      <div className='time-slot' key={ind}>
                        <p>{timeSlot.from} - {timeSlot.to} <span className='delete' onClick={() => onTimeSlotDelete(Days.Sunday, ind)}>X</span></p>
                      </div>
                    )}
                    <div className='select-range'>
                      <span>От: </span>
                      <input type="time" className='from'/>
                      <span>До: </span>
                      <input type="time" className='to'/>
                      <span className='add' onClick={(e) => onTimeSlotAdd(e, Days.Sunday)}>✓</span>
                    </div>
                    {scheduleErrorMessages.sunday && 
                      <p className='error'>{scheduleErrorMessages.sunday}</p>
                    }
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