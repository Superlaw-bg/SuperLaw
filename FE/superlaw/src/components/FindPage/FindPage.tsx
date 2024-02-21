import "./FindPage.scss";
import Select, { ActionMeta } from "react-select";
import { FormEvent, useEffect, useRef, useState } from "react";
import categoryApi from "../../api/categoryApi";
import { Button } from "react-bootstrap";
import noProfilePic from "../../assets/no-profile-picture-256.png";
import profileApi from "../../api/profileApi";
import LawyerProfile from "../../models/LawyerProfile";
import { useNavigate } from "react-router-dom";
import cityApi from "../../api/cityApi";
import SimpleData from "../../models/SimpleData";
import LoaderSpinner from "../LoaderSpinner";
import { Helmet } from "react-helmet-async";
import { useStoreActions, useStoreState } from "../../store/hooks";
import SearchForm from "../../models/SearchForm";
import Paginate from "./Paginate/Paginate";

const FindPage = () => {
  const navigate = useNavigate();

  const searchFormState  = useStoreState(store => store.store.findPageSearch);
  const dispatchSetSearch = useStoreActions(actions => actions.store.setFindPageSearch);

  const [allCategories, setCategories] = useState([]);
  const [allCities, setCities] = useState<SimpleData[]>([]);

  const [searchForm, setSearchForm] = useState<SearchForm>(searchFormState);

  const [profiles, setProfiles] = useState<LawyerProfile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [profilesPerPage] = useState(9);

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = profiles.slice(indexOfFirstProfile, indexOfLastProfile);

  const scrollRef = useRef<null | HTMLDivElement>(null); 
  
  const [loading, setLoading] = useState(false);

  const onCategorySelect = (
    newValue: any,
    actionMeta: ActionMeta<never>
  ): void => {
    setSearchForm({ ...searchForm, categories: newValue });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await categoryApi.getCategories();

      let categoriesRes: any = [];

      res.data.forEach((x: SimpleData) => {
        categoriesRes.push({
          value: x.id,
          label: x.name,
        });
      });

      setCategories(categoriesRes);
    };

    const fetchCities = async () => {
      const res = await cityApi.getCities();

      setCities(res.data);
    };

    const fetchProfiles = async () => {
      try {
        setLoading(true);

        let res;

        if (searchForm) {
          const categories = searchForm.categories.map((c: any) => c.value);

          res = await profileApi.getAll(searchForm.name, categories, searchForm.cityId);
        } else {
          res = await profileApi.getAll(null, [], 0);
        }
        
        setProfiles(res.data);
      } catch (error: any) {
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchCities();
    fetchProfiles();
  }, []);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


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
    
    dispatchSetSearch(searchForm);

    const categories = searchForm.categories.map((c: any) => c.value);
   
    const res = await profileApi.getAll(searchForm.name, categories, searchForm.cityId);

    setProfiles(res.data);
    setCurrentPage(1);
  }

  const orderByRatingAsc = () => {
    setProfiles(profiles.slice().sort((a: any, b: any) => {
        if (a.rating < b.rating)
            return -1;
        if (a.rating > b.rating)
            return 1;
        return 0;
    }));
    setCurrentPage(1);
  };

  const orderByRatingDesc = () => {
    setProfiles(profiles.slice().sort((a: any, b: any) => {
        if (a.rating < b.rating)
            return 1; 
        if (a.rating > b.rating)
            return -1;
        return 0;
    }));
    setCurrentPage(1);
  };

  const orderByNameAsc = () => {
    setProfiles(profiles.slice().sort((a: any, b: any) => {
        if (a.fullName < b.fullName)
            return -1;
        if (a.fullName > b.fullName)
            return 1;
        return 0;
    }));
    setCurrentPage(1);
  };

  const orderByNameDesc = () => {
    setProfiles(profiles.slice().sort((a: any, b: any) => {
        if (a.fullName < b.fullName)
            return 1; 
        if (a.fullName > b.fullName)
            return -1;
        return 0;
    }));
    setCurrentPage(1);
  };

  const orderByRateAsc = () => {
    setProfiles(profiles.slice().sort((a: any, b: any) => {
        if (a.rate < b.rate)
            return -1;
        if (a.rate > b.rate)
            return 1;
        return 0;
    }));
    setCurrentPage(1);
  };

  const orderByRateDesc = () => {
    setProfiles(profiles.slice().sort((a: any, b: any) => {
        if (a.rate < b.rate)
            return 1; 
        if (a.rate > b.rate)
            return -1;
        return 0;
    }));
    setCurrentPage(1);
  };

  const redirectToProfile = (profileId: string) => {
    navigate(`/profile/${profileId}`);
  };

  const clearSearchForm = () => {
    setSearchForm({
      name: "",
      categories: [],
      cityId: 0
    });
  };

  return (
    <>
    <Helmet>
      <title>Намери адвокат - SuperLaw</title>
      <meta name='description' content='Тук са всички адвокатски профили. Търсете адвокато по име, град или специалност.' />
      <link rel="canonical" href="/find" />
    </Helmet>
    <div className="find-page-wrapper">
      <form className="search" onSubmit={onSearchSubmit}>
        <h1>Намерете адвокат и резервирайте консултация онлайн</h1>
        <div className="form-group search-bar">
          <input type="text" placeholder="Търси по име..." name='name' onChange={(e) => onInput(e)} value={searchForm.name}/>
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
          <label htmlFor="cityId">Областен Град</label>
          <select className="form-select" name="cityId" id="cityId" value={searchForm.cityId} onChange={(e) => onInput(e)}>
                <option selected value={0}>
                  Изберете областен град
                </option>
                {allCities.map((city) => 
                  <option key={city.id} value={city.id}>{city.name}</option>
                )}
          </select>
        </div>

        <div className="btns">
          <Button className="search-btn" type="submit" variant="primary">
            Търси
          </Button>
          <a className="clear-btn" onClick={clearSearchForm}>
            Изчисти
          </a>
        </div>
      </form>
      <div className="profiles-section" ref={scrollRef}>
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
        {
          loading ?
            <div className="profiles-spinner">
              <LoaderSpinner/>
            </div>
          :
          <div className="profiles">
          {profiles.length === 0 && <p className="no-profiles-msg">Съжаляваме, но не намираме адвокати</p>}
          {currentProfiles.map((profile: any) => (
            <div key={profile.id} className="profile">
              <div className="profile-image">
                <img
                  src={profile.imgPath !== "" ? profile.imgPath : noProfilePic}
                  alt="profile picture"
                />
              </div>
              <div className="important-info">
                <div className="sect">
                  <h3 className="name"  onClick={() => redirectToProfile(profile.id)}>{profile.fullName}</h3>
                  <p>{profile.isJunior ? "Младши адвокат" : "Адвокат"}</p>
                </div>

                <div className='sect city'>
                  <p className='bold'>{profile.city}</p>    
                </div>

                <div className='sect rating'>
                  {profile.rating === 0 && <p className='bold'>Няма оценка</p>}
                  {profile.rating !== 0 && <p className="bold"><i className="fa-solid fa-star"></i> {profile.rating} / 5</p> }
                </div>

                <div className="sect regions">
                  <p className="bold">Райони </p>
                  {profile.regions.map((reg: any) => (
                    <span key={reg.id}>
                      {reg.name}
                    </span>
                  ))}
                </div>
                <div className="sect">
                  <p className="bold">Консултация: {profile.rate}лв</p>
                </div>
                <Button onClick={() => redirectToProfile(profile.id)} className="primary-btn">Запази консултация</Button>
              </div>
            </div>
          ))}
        </div>
        }
        <Paginate
          profilesPerPage={profilesPerPage}
          totalProfiles={profiles.length}
          paginate={paginate}
          currentPage={currentPage} />
      </div>
    </div>
    </> 
  );
};

export default FindPage;
