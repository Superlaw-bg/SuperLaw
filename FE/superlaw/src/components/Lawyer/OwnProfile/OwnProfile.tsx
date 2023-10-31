import { useEffect, useState } from "react";
import "./OwnProfile.scss";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import profileService from "../../../services/profileService";
import noProfilePic from "../../../assets/no-profile-picture-256.png";
import Calendar, { TileDisabledFunc } from "react-calendar";
import moment from "moment";
import CalendarDateValue from "../../../models/CalendarDateValue";
import { TileArgs } from "react-calendar/dist/cjs/shared/types";
import LawyerProfile from "../../../models/LawyerProfile";
import TimeSlot from "../../../models/TimeSlot";

const OwnProfile = () => {
  const minDate = moment().startOf('year').toDate();
  const maxDate = moment().add(2, "M").toDate();
  
  const navigate = useNavigate();

  const [profile, setProfile] = useState<LawyerProfile>({
    id: -1,
    imgPath: "",
    fullName: "",
    description: "",
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
      const res = await profileService.getOwnProfile();
      
      if (res !== null) {
        setProfile(res);
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
  
  return (
    <div>
      {profile && (!profile.id || profile.id === -1) && (
        <div className="create-profile-info">
          <div className="wrapper">
            <div className="text">
              <h2>Все още нямате профил</h2>
              <p>
                Чрез вашият профил в системата на Superlaw потребителите могат
                да се запознаят с вас и да си запишат час и ден за консултация.
              </p>
              <p>
                В профилът Ви може да качите ваша снимка, да попълните текст с
                информация за вас, часовата Ви ставка, адрес на кантората,
                правните категории, съдебните райони и телефон за връзка с вас.
                Като най-важното е, че можете там да задавате и управлявате
                графика Ви до 2 месеца напред с помощта на нашия календар. Чрез
                него потребителите ще могат да избират час и ден за консултация
                с Вас. Можете да обновявате информацията в профила си по всяко
                време, с изключение на вече заети времеви диапазони запазени за
                консултация с клиент.
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
                <h3>{profile.fullName}</h3>
                <p>{profile.isJunior ? "Младши адвокат" : "Адвокат"}</p>
              </div>

              <div className="sect rating">
                {profile.rating === 0 && <p className="bold">Нямаш оценка</p>}
                {profile.rating !== 0 && (
                  <p className="bold">
                    <i className="fa-solid fa-star"></i> {profile.rating} / 5
                  </p>
                )}
              </div>

              <div className="sect categories">
                <p className="bold">Категории: </p>
                {profile.categories.map((cat, ind) => (
                  <span key={cat.id}>
                    {" "}
                    {ind !== profile.categories.length - 1
                      ? cat.name + ", "
                      : cat.name}
                  </span>
                ))}
              </div>

              <div className="sect regions">
                <p className="bold">Райони: </p>
                {profile.regions.map((reg, ind) => (
                  <span key={reg.id}>
                    {" "}
                    {ind !== profile.regions.length - 1
                      ? reg.name + ", "
                      : reg.name}
                  </span>
                ))}
              </div>
              <div className="sect">
                <p className="bold">Консултация: {profile.rate}лв</p>
              </div>
            </div>
          </div>
          <div className="additional-info">
            <div className="sect phone">
              <p className="bold">Телефон:</p>
              <p>{profile.phone}</p>
            </div>

            <div className="sect city">
              <p className="bold">Град:</p>
              <p>{profile.city}</p>
            </div>

            <div className="sect address">
              <p className="bold">Адрес:</p>
              <p>{profile.address}</p>
            </div>

            <div className="sect description">
              <p className="bold">Информация:</p>
              <p>{profile.description}</p>
            </div>

            <div className="schedule">
              <p className="bold header">График:</p>
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
        </div>
      )}
    </div>
  );
};

export default OwnProfile;
