import { Tab, Tabs, Button } from "react-bootstrap";
import "./MeetingsPage.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MeetingsPageData from "../../models/MeetingsPageData";
import meetingService from "../../services/meetingService";

const MeetingsPage = () => {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState<MeetingsPageData>();

  useEffect(() => {
    const fetchMeetings = async () => {
      const res = await meetingService.getAllForCurrentUser();

      setMeetings(res);
    };

    fetchMeetings();
  }, []);

  const navigateToProfile = (profileId: number) => {
    navigate(`/profile/${profileId}`);
  };

  return (
    <div className="meetings-page">
        <h2>Моите консултации</h2>
      <Tabs defaultActiveKey='upcoming-meetings' className='tabs' fill>
        <Tab
          eventKey="past-meetings"
          title="Изминали"
          tabClassName='tab past'
        > 
            <div className="meetings">
                {meetings && meetings.past.map(meeting => (
                  <div key={meeting.id} className="meeting">
                    {meeting.profileId !== 0 
                    ? <p>Адвокат: <a onClick={() => navigateToProfile(meeting.profileId)}>{meeting.name}</a></p>
                    : <p>Клиент: <span>{meeting.name}</span></p>
                     }
                    <p>Дата: <span>{meeting.date}</span></p>
                    <p>От: <span>{meeting.from}</span> До: <span>{meeting.to}</span></p>
                    {meeting.categoryName && <p>Категория: <span>{meeting.categoryName}</span></p>}
                    {meeting.regionName && <p>Район: <span>{meeting.regionName}</span></p>}
                    {meeting.info && <p>Повече инфо: </p>}
                    {meeting.info && <p>{meeting.info}</p>}
                    {!meeting.isUserTheLawyer && <Button className="primary-btn">Оцени</Button> }
                  </div>
                ))}
            </div>
        </Tab>
        <Tab
          eventKey="upcoming-meetings"
          title="Предстоящи"
          tabClassName='tab upcoming'
        >
          <div className="meetings">
          {meetings && meetings.upcoming.map(meeting => (
                  <div key={meeting.id} className="meeting">
                    {meeting.profileId !== 0 
                    ? <p>Адвокат: <a onClick={() => navigateToProfile(meeting.profileId)}>{meeting.name}</a></p>
                    : <p>Клиент: <span>{meeting.name}</span></p>
                     }
                    <p>Дата: <span>{meeting.date}</span></p>
                    <p>От: <span>{meeting.from}</span> До: <span>{meeting.to}</span></p>
                    {meeting.categoryName  && <p>Категория: <span>{meeting.categoryName}</span></p>}
                    {meeting.regionName && <p>Район: <span>{meeting.regionName}</span></p>}
                    {meeting.info && <p>Повече инфо: </p>}
                    {meeting.info && <p>{meeting.info}</p>}
                  </div>
                ))}           
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default MeetingsPage;
