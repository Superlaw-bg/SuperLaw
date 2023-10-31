import "./FindPage.scss";
import Select, { ActionMeta } from "react-select";
import { FormEvent, useEffect, useState } from "react";
import legalCategoriesService from "../../services/legalCategoriesService";
import { Button } from "react-bootstrap";
import noProfilePic from "../../assets/no-profile-picture-256.png";
import profileService from "../../services/profileService";
import LawyerProfile from "../../models/LawyerProfile";
import { useNavigate } from "react-router-dom";
import cityService from "../../services/cityService";
import SimpleData from "../../models/SimpleData";

const FindPage = () => {
  const navigate = useNavigate();
  const [allCategories, setCategories] = useState([]);
  const [allCities, setCities] = useState<SimpleData[]>([]);

  const [searchForm, setSearchForm] = useState({
    name: "",
    categories: [],
    cityId: 0,
  });

  const [profiles, setProfiles] = useState<LawyerProfile[]>([]);

  const onCategorySelect = (
    newValue: any,
    actionMeta: ActionMeta<never>
  ): void => {
    setSearchForm({ ...searchForm, categories: newValue });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await legalCategoriesService.getCategories();

      let categoriesRes: any = [];

      res.forEach((x) => {
        categoriesRes.push({
          value: x.id,
          label: x.name,
        });
      });

      setCategories(categoriesRes);
    };

    const fetchCities = async () => {
      const res = await cityService.getCities();

      setCities(res);
    };

    const fetchProfiles = async () => {
      const res = await profileService.getAll(null, [], 0);

      setProfiles(res);
    };

    fetchCategories();
    fetchCities();
    fetchProfiles();
  }, []);

  const onInput = (e: any) => {
    const inputName = e.target.name;
    const value = e.target.value;

    setSearchForm({
      ...searchForm,
      [inputName]: value,
    });
  };

  const onSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const categories = searchForm.categories.map((c: any) => c.value);
    console.log(searchForm);
    const res = await profileService.getAll(searchForm.name, categories, searchForm.cityId);

    setProfiles(res);
  }

  const orderByRatingAsc = () => {
    setProfiles(profiles.slice().sort((a: any, b: any) => {
        if (a.rating < b.rating)
            return -1;
        if (a.rating > b.rating)
            return 1;
        return 0;
    }));
  };

  const orderByRatingDesc = () => {
    setProfiles(profiles.slice().sort((a: any, b: any) => {
        if (a.rating < b.rating)
            return 1; 
        if (a.rating > b.rating)
            return -1;
        return 0;
    }));
  };

  const orderByNameAsc = () => {
    setProfiles(profiles.slice().sort((a: any, b: any) => {
        if (a.fullName < b.fullName)
            return -1;
        if (a.fullName > b.fullName)
            return 1;
        return 0;
    }));
  };

  const orderByNameDesc = () => {
    setProfiles(profiles.slice().sort((a: any, b: any) => {
        if (a.fullName < b.fullName)
            return 1; 
        if (a.fullName > b.fullName)
            return -1;
        return 0;
    }));
  };

  const orderByRateAsc = () => {
    setProfiles(profiles.slice().sort((a: any, b: any) => {
        if (a.rate < b.rate)
            return -1;
        if (a.rate > b.rate)
            return 1;
        return 0;
    }));
  };

  const orderByRateDesc = () => {
    setProfiles(profiles.slice().sort((a: any, b: any) => {
        if (a.rate < b.rate)
            return 1; 
        if (a.rate > b.rate)
            return -1;
        return 0;
    }));
  };

  const redirectToProfile = (profileId: string) => {
    navigate(`/profile/${profileId}`);
  };

  return (
    <div className="find-page-wrapper">
      <form className="search" onSubmit={onSearchSubmit}>
        <h3>Намерете адвокат и резервирайте консултация онлайн</h3>
        <div className="form-group search-bar">
          <input type="text" placeholder="Търси по име..." name='name' onChange={(e) => onInput(e)}/>
        </div>

        <div className="form-group selection">
          <label htmlFor="legalCategory">Категории</label>
          <Select
            isMulti
            name="legalCategories"
            options={allCategories}
            className="basic-multi-select"
            classNamePrefix="select"
            value={searchForm.categories}
            onChange={onCategorySelect}
          />
        </div>

        <div className="form-group selection">
          <label htmlFor="cityId">Град</label>
          <select className="form-select" name="cityId" id="cityId" onChange={(e) => onInput(e)}>
                <option selected value={0}>
                  Изберете град
                </option>
                {allCities.map((city) => 
                  <option key={city.id} value={city.id}>{city.name}</option>
                )}
          </select>
        </div>

        <Button className="search-btn" type="submit" variant="primary">
          Търси
        </Button>
      </form>
      <div className="profiles-section">
        <h2>Профили</h2>
        <div className="sort">
          <span>Подреди по: </span>
          <span className="sorter" onClick={orderByRatingAsc}>Оценка ↑</span>
          <span className="sorter" onClick={orderByRatingDesc}>Оценка ↓</span>
          <span className="sorter" onClick={orderByNameAsc}>Име ↑</span>
          <span className="sorter" onClick={orderByNameDesc}>Име ↓</span>
          <span className="sorter" onClick={orderByRateAsc}>Цена ↑</span>
          <span className="sorter" onClick={orderByRateDesc}>Цена ↓</span>
        </div>
        <div className="profiles">
          {profiles.length === 0 && <p className="no-profiles-msg">Съжаляваме, но не намираме адвокати</p>}
          {profiles.map((profile: any) => (
            <div key={profile.id} className="profile">
              <div className="profile-image">
                <img
                  src={profile.imgPath !== "" ? profile.imgPath : noProfilePic}
                  alt="profile picture"
                />
              </div>
              <div className="important-info">
                <div className="sect">
                  <h3>{profile.fullName}</h3>
                  <p>{profile.isJunior ? "Младши адвокат" : "Адвокат"}</p>
                </div>

                <div className='sect city'>
                  <p className='bold'>{profile.city}</p>    
                </div>

                <div className='sect rating'>
                  {profile.rating === 0 && <p className='bold'>Няма оценка</p>}
                  {profile.rating !== 0 && <p className="bold"><i className="fa-solid fa-star"></i> {profile.rating} / 5</p> }
                </div>

                <div className="sect categories">
                  <p className="bold">Категории: </p>
                  {profile.categories.map((cat: any, ind: any) => (
                    <span key={cat.id}>
                      {ind !== profile.categories.length - 1
                        ? cat.name + ", "
                        : cat.name}
                    </span>
                  ))}
                </div>

                <div className="sect regions">
                  <p className="bold">Райони: </p>
                  {profile.regions.map((reg: any, ind: any) => (
                    <span key={reg.id}>
                      {ind !== profile.regions.length - 1
                        ? reg.name + ", "
                        : reg.name}
                    </span>
                  ))}
                </div>
                <div className="sect">
                  <p className="bold">Консултация: {profile.rate}лв</p>
                </div>
                <Button onClick={() => redirectToProfile(profile.id)} className="primary-btn">Запази час</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindPage;
