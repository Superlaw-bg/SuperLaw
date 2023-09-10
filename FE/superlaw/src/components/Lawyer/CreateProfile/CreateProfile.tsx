import { FormEvent, useState } from 'react';
import './CreateProfile.scss';
import { Button, Form } from "react-bootstrap";
import FileUpload from '../../FileUpload';
import toastService from '../../../services/toastService';
import Select from 'react-select';
import { MultiValue, ActionMeta, InputActionMeta } from 'react-select';
import ProfileInput from '../../../models/ProfileInput';

const CreateProfile = () => {
  const [profile, setProfile] = useState<ProfileInput>({
    profilePic: null,
    description: "",
    hourlyRate: 0,
    address: "",
    categories: [],
    regions: [],
    isJunior: false,
    isCompleted: false,
  });

  const [errorMessage, setErrorMessage] = useState("");

  const categories: any[]= [
    { value: '1', label: 'Категория 1' },
    { value: '2', label: 'Категория 2' },
    { value: '3', label: 'Категория 3' },
    { value: '4', label: 'Категория 4' },
    { value: '5', label: 'Категория 5' },
    { value: '6', label: 'Категория 6' }
  ];

  const regions: any[]= [
    { value: '1', label: 'Район 1' },
    { value: '2', label: 'Район 2' },
    { value: '3', label: 'Район 3' },
    { value: '4', label: 'Район 4' },
    { value: '5', label: 'Район 5' },
    { value: '6', label: 'Район 6' }
  ];

  const onProfilePicUploadSuccess = (file: File) => {
    setProfile({...profile, profilePic: file});
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

    console.log(profile);

    if (!isDataValid()){
      return;
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
            <label htmlFor="legalCategory">Юридически райони</label>
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

          <div className="form-group checkboxes">
            <Form.Check
              className='checkbox'
              type="switch"
              id="isJunior"
              label="Младши адвокат ли сте?"
              name='isJunior'
              onChange={onCheckbox}
            />
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