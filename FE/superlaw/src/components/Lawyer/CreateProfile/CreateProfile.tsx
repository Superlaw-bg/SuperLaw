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
import ProfileInputNew from '../../../models/inputs/ProfileInputNew';
import Calendar, { TileDisabledFunc } from 'react-calendar';
import moment from 'moment';
import CalendarDateValue from '../../../models/CalendarDateValue';
import { TileArgs } from 'react-calendar/dist/cjs/shared/types';
import CreateScheduleInput from '../../../models/inputs/CreateScheduleInput';

const CreateProfile = () => {
  const navigate = useNavigate();

  const todayDate = moment().toDate();
  const maxDate = moment().add(2, 'M').toDate();

  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [profile, setProfile] = useState<ProfileInputNew>({
    image: '',
    description: "",
    hourlyRate: 0,
    address: "",
    categories: [],
    regions: [],
    schedule: [],
    isJunior: false,
    isCompleted: false,
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
  
  /*const onTimeSlotDelete = (dayOfWeek: string, index: number) => {

    let schedule = profileService.getScheduleForDayStr(dayOfWeek, profile.schedule);

    schedule.splice(index, 1);

    setProfile({
      ...profile,
      schedule: {
        ...profile.schedule,
        [dayOfWeek]: schedule
      }
    });
  }*/

  const onTimeSlotAdd = (event: any) => {
    const from = event.target.parentElement.getElementsByClassName('from')[0].value;
    const to = event.target.parentElement.getElementsByClassName('to')[0].value;

    if (from === '' || to === ''){
      return;
    }

    const err = profileService.validateTimeSlot(from, to);

    if (err) {
      setSelectedDayScheduleErrorMessages(err);
      return;
    }

    const errMsg = profileService.validateTimeSlotsInDay(from, to, selectedDaySlots.timeslots);

    if (errMsg) {
      setSelectedDayScheduleErrorMessages(errMsg);
      return;
    }

    setSelectedDaySlots({
      date: selectedDaySlots.date,
      timeslots: [
        ...selectedDaySlots.timeslots,
        {
          from: from,
          to: to
        }
      ]
    });

    console.log(selectedDaySlots);

    setSelectedDayScheduleErrorMessages('');
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

    if (Number.isNaN(profile.hourlyRate) || profile.hourlyRate < 100 || profile.hourlyRate > 500){
      setErrorMessage("Часовата ставка трябва да е число между 100 и 500");
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

  const [selectedDaySlots, setSelectedDaySlots] = useState<CreateScheduleInput>({
    date: new Date(),
    timeslots: [],
  });

  useEffect(() => {
    console.log(profile);
  }, [profile]);
  const [selectedDayScheduleErrorMessages, setSelectedDayScheduleErrorMessages] = useState('');

  const onDateSelect = (dateValue:  CalendarDateValue) => {

    let profileScheduleWithoutSelected = [...profile.schedule].filter(x => x.date.setHours(0, 0, 0, 0) !== selectedDaySlots.date.setHours(0, 0, 0, 0));
    
    //Set in the profile the defined slots for the previous selected day
    setProfile({
      image: profile.image,
      description: profile.description,
      hourlyRate: profile.hourlyRate,
      address: profile.address,
      categories: profile.categories,
      regions: profile.regions,
      schedule: [
        ...profileScheduleWithoutSelected,
        selectedDaySlots
      ],
      isJunior: profile.isJunior,
      isCompleted: profile.isCompleted,
    });

    const date = dateValue as Date;

    let scheduleDay = profile.schedule.filter(x => x.date.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0))[0];

    const defaultDay = {
      date: date,
      timeslots: []
    };

    if (!scheduleDay) {
      scheduleDay = defaultDay;
    }

    console.log('schedule for the day');
    console.log(scheduleDay)
    setSelectedDaySlots(scheduleDay);
  }

  const isDayDisabled: TileDisabledFunc = ({ activeStartDate, date, view }: TileArgs) => {
   
    return false;
  }

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
            <Calendar 
              onChange={onDateSelect}
              value={selectedDaySlots?.date}
              defaultView="month"
              minDetail="month"
              maxDetail="month"
              next2Label={null}
              prev2Label={null}
              minDate={todayDate}
              maxDate={maxDate}
              tileDisabled={isDayDisabled}
            />
             {selectedDaySlots &&
              <div className="time-slots">
                {selectedDaySlots.timeslots.map((timeSlot, ind) => 
                  <div className={`time-slot`} key={ind}>
                    <p>{timeSlot.from} - {timeSlot.to}</p>
                  </div>
                )}

                <div className='select-range'>
                  <span>От: </span>
                  <input type="time" className='from'/>
                  <span>До: </span>
                  <input type="time" className='to' />
                  <span className='add' onClick={onTimeSlotAdd}>✓</span>
                </div>
                {selectedDayScheduleErrorMessages !== '' && 
                  <p className='error'>{selectedDayScheduleErrorMessages}</p>
                }
              </div>
             }
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