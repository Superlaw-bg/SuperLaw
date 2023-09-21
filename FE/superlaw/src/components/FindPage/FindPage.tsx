import "./FindPage.scss";
import Select, { ActionMeta } from "react-select";
import { FormEvent, useEffect, useState } from "react";
import legalCategoriesService from "../../services/legalCategoriesService";
import judicialRegionsService from "../../services/judicialRegionsService";
import { Button } from "react-bootstrap";
import noProfilePic from "../../assets/no-profile-picture-256.png";

const FindPage = () => {
  const [allCategories, setCategories] = useState([]);
  const [allRegions, setRegions] = useState([]);

  const [searchForm, setSearchForm] = useState({
    name: "",
    categories: [],
    regions: [],
  });

  const [profiles, setProfiles] = useState<any>([]);

  const onCategorySelect = (
    newValue: any,
    actionMeta: ActionMeta<never>
  ): void => {
    setSearchForm({ ...searchForm, categories: newValue });
  };

  const onRegionSelect = (
    newValue: any,
    actionMeta: ActionMeta<never>
  ): void => {
    setSearchForm({ ...searchForm, regions: newValue });
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

    const fetchRegions = async () => {
      const res = await judicialRegionsService.getRegions();

      let regionsRes: any = [];

      res.forEach((x) => {
        regionsRes.push({
          value: x.id,
          label: x.name,
        });
      });

      setRegions(regionsRes);
    };

    fetchCategories();
    fetchRegions();
    setProfiles(profilesTest);
  }, []);

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

  const orderByHourlyRateAsc = () => {
    setProfiles(profiles.slice().sort((a: any, b: any) => {
        if (a.hourlyRate < b.hourlyRate)
            return -1;
        if (a.hourlyRate > b.hourlyRate)
            return 1;
        return 0;
    }));
  };

  const orderByHourlyRateDesc = () => {
    setProfiles(profiles.slice().sort((a: any, b: any) => {
        if (a.hourlyRate < b.hourlyRate)
            return 1; 
        if (a.hourlyRate > b.hourlyRate)
            return -1;
        return 0;
    }));
  };

  let profilesTest = [
    {
      id: 1,
      imgPath: "",
      fullName: "Костадин Христов Костадинов",
      isJunior: true,
      categories: [
        { id: 1, name: "Категория 1" },
        { id: 2, name: "Категория 2" },
        { id: 3, name: "Категория 3" },
      ],
      regions: [
        { id: 1, name: "София" },
        { id: 2, name: "София-област" },
        { id: 3, name: "Перник" },
        { id: 4, name: "Дупница" },
      ],
      hourlyRate: 100,
    },
    {
      id: 2,
      imgPath:
        "https://res.cloudinary.com/dh0ue97bs/image/upload/v1695208002/profilePics_test/gmifitwl1f8zhayji5fm.jpg",
      fullName: "Симеон Симеонов Драганов",
      isJunior: false,
      categories: [
        { id: 1, name: "Категория 1" },
        { id: 2, name: "Категория 2" },
        { id: 3, name: "Категория 3" },
        { id: 5, name: "Категория 4" },
        { id: 6, name: "Категория 5" },
        { id: 7, name: "Категория 6" },
      ],
      regions: [{ id: 1, name: "София" }],
      hourlyRate: 200,
    },
    {
      id: 3,
      imgPath:
        "https://ontolerance.eu/wp-content/uploads/2021/09/Elon-Musk.jpg",
      fullName: "Асен Петров Петров",
      isJunior: false,
      categories: [{ id: 1, name: "Категория 1" }],
      regions: [
        { id: 1, name: "София" },
        { id: 2, name: "Регион 2" },
        { id: 3, name: "Регион 3" },
        { id: 4, name: "Регион 4" },
        { id: 5, name: "Регион 5" },
        { id: 6, name: "Регион 6" },
        { id: 7, name: "Регион 7" },
        { id: 8, name: "Регион 8" },
      ],
      hourlyRate: 50,
    },
  ];

  return (
    <div className="find-page-wrapper">
      <form className="search">
        <h3>Намерете адвокат и резервирайте консултация онлайн</h3>
        <div className="form-group search-bar">
          <input type="text" placeholder="Търси по име..." />
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
          <label htmlFor="legalCategory">Градове</label>
          <Select
            isMulti
            name="regions"
            options={allRegions}
            className="basic-multi-select"
            classNamePrefix="select"
            value={searchForm.regions}
            onChange={onRegionSelect}
          />
        </div>

        <Button className="search-btn" type="submit" variant="primary">
          Търси
        </Button>
      </form>
      <div className="profiles-section">
        <h2>Профили</h2>
        <div className="sort">
          <span>Подреди по: </span>
          <span className="sorter" onClick={orderByNameAsc}>Име ↑</span>
          <span className="sorter" onClick={orderByNameDesc}>Име ↓</span>
          <span className="sorter" onClick={orderByHourlyRateAsc}>Ставка ↑</span>
          <span className="sorter" onClick={orderByHourlyRateDesc}>Ставка ↓</span>
        </div>
        <div className="profiles">
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
                  <p className="bold">Часова ставка: {profile.hourlyRate}лв</p>
                </div>
                <Button className="primary-btn">Запази час</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindPage;
