import { useEffect, useState } from "react";
import "./OwnProfile.scss";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import profileApi from "../../../api/profileApi";
import noProfilePic from "../../../assets/no-profile-picture-256.png";
import Calendar, { TileDisabledFunc } from "react-calendar";
import moment from "moment";
import CalendarDateValue from "../../../models/CalendarDateValue";
import { TileArgs } from "react-calendar/dist/cjs/shared/types";
import LawyerProfile from "../../../models/LawyerProfile";
import TimeSlot from "../../../models/TimeSlot";
import LoaderSpinner from "../../LoaderSpinner";
import { Helmet } from "react-helmet-async";

const OwnProfile = () => {
  const minDate = moment().startOf('year').toDate();
  const maxDate = moment().add(2, "M").toDate();
  
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<LawyerProfile>({
    id: -1,
    imgPath: "",
    fullName: "",
    description: "",
    lawyerFirm: "",
    rate: 0,
    phone: "",
    city: "",
    address: "",
    categories: [],
    regions: [],
    rating: 0,
    schedule: [],
    isJunior: false,
    isCompleted: false,
  });

  const [timeSlots, setTimeslots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await profileApi.getOwnProfile();
        
        if (res.data) {
          setProfile(res.data);
        }
      } catch (error: any) {
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const onCreateClick = () => {
    navigate("/profile/create");
  };

  const onEditClick = () => {
    navigate("/profile/edit");
  };

  const onDateSelect = (dateValue: CalendarDateValue) => {
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

    setTimeslots(scheduleDay.timeSlots);
  };

  const isDayDisabled: TileDisabledFunc = ({ activeStartDate, date, view }: TileArgs) => {

    let scheduleDay = profile.schedule.filter(
      (x) => new Date(x.date).setHours(0,0,0,0) === date.setHours(0,0,0,0)
    )[0];

    if (!scheduleDay) {
      return true;
    }

    if(scheduleDay.timeSlots.length === 0){
      return true;
    }

    return false;
  }
  
  if (loading) {
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
        <meta name='description' content='Профилът Ви съдържа информация за Вас, снимка и виртуален календар, чрез който може да задавате свободни за вас часове за консултация.' />
        <link rel="canonical" href='/profile' />
      </Helmet>
    <div>
      {profile && (!profile.id || profile.id === -1) && (
        <div className="create-profile-info">
          <div className="wrapper">
            <div className="text">
              <h2>Все още нямате профил</h2>
              <p>
                Чрез вашия профил в платформата на Superlaw потребителите могат да Ви открият и да си запазят консултация.
              </p>
              <p>
              В профила Ви може да качите Ваша снимка, кратко описание в свободен текст, цената за консултация, адрес на кантората, правните категории с които работите, съдебните райони, в които практикувате, и телефон за връзка с Вас. Също така там се намира и виртуалният календар, чрез който определяте свободните си часове за консултация. Можете да обновявате информацията в профила си по всяко време.
              </p>
            </div>
            <div className="create-profile">
              <Button
                className="create-btn"
                variant="primary"
                onClick={onCreateClick}
              >
                Създай профил
              </Button>
            </div>
          </div>
        </div>
      )}

      {profile && profile.id && profile.id !== -1 && (
        <div className="own-profile-info">
          <div className="header">
            <div className="profile-image">
              <img
                src={profile.imgPath !== "" ? profile.imgPath : noProfilePic}
                alt="profile picture"
              />
            </div>
            <div className="important-info">
              <div className="sect">
                <h1>{profile.fullName}</h1>
                <p>{profile.isJunior ? "Младши адвокат" : "Адвокат"}</p>
              </div>

              <div className="sect rating">
                {profile.rating === 0 && <p className="bold">Все още нямате оценка</p>}
                {profile.rating !== 0 && (
                  <p className="bold">
                    <i className="fa-solid fa-star"></i> {profile.rating} / 5
                  </p>
                )}
              </div>

              <div className="sect categories">
                {profile.categories.map((cat) => (
                  <span key={cat.id}>
                    { cat.name }
                  </span>
                ))}
              </div>

              <div className="sect regions">
                <p className="bold">Райони </p>
                {profile.regions.map((reg) => (
                  <span key={reg.id}>
                    {reg.name}
                  </span>
                ))}
              </div>
              <div className="sect">
                <p className='bold'>Дружество</p>
                <p>{profile.lawyerFirm}</p>
              </div>
              <div className="sect">
                <p className="bold">Консултация: {profile.rate}лв</p>
              </div>
            </div>
          </div>
          <div className="additional-info">
            <div className="left">
              <div className="sect phone">
                <p className='bold'>Телефон</p>
                <p>{profile.phone}</p>
              </div>

              <div className="sect city">
                <p className='bold'>Град</p>
                <p>{profile.city}</p>
              </div>

              <div className="sect address">
                <p className='bold'>Адрес</p>
                <p>{profile.address}</p>
              </div>

              <div className="sect description">
                <p className='bold'>Информация</p>
                <p>{profile.description}</p>
              </div>

              <div className="edit-profile">
              <Button
                className="edit-btn"
                variant="primary"
                onClick={onEditClick}
              >
                Редактирай
              </Button>
            </div>
            </div>
           
            <div className="schedule">
              <Calendar
                onChange={onDateSelect}
                defaultView="month"
                minDetail="month"
                maxDetail="month"
                next2Label={null}
                prev2Label={null}
                minDate={minDate}
                maxDate={maxDate}
                tileDisabled={isDayDisabled}
              />
              {timeSlots && (
                <div className="time-slots">
                  {timeSlots.map((timeSlot) => (
                    <div className={`time-slot ${timeSlot.hasMeeting ? 'occupied' : ''}`} key={timeSlot.id} >
                      <p>
                        {timeSlot.from} - {timeSlot.to}
                      </p>
                      {timeSlot.hasMeeting && timeSlot.clientName && 
                        <p>
                          {timeSlot.clientName}
                        </p>
                      }
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default OwnProfile;
