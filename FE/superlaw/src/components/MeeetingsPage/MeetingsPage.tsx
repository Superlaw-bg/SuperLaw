import { Tab, Tabs, Button } from "react-bootstrap";
import "./MeetingsPage.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MeetingsPageData from "../../models/MeetingsPageData";

const MeetingsPage = () => {
  const navigate = useNavigate();
  
  const initialMeetings = {
    past: [
      {
        id: 1,
        profileId: 3,
        isUserTheLawyer: false,
        name: 'Пешо Иванов Симов',
        date: '08.10.2023',
        from: '10:00',
        to: '12:00',
        categoryName: 'Митническо право',
        regionName: 'София',
        info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel risus consequat, vulputate ante et, malesuada lacus. Morbi mattis sit amet mi ac auctor. Ut orci sapien, facilisis et elit et, faucibus tincidunt tortor. Cras scelerisque eleifend ligula, faucibus dapibus ex ultricies quis. Nullam eget consequat sem. Phasellus diam dui, luctus non porttitor at, ornare a elit. Sed interdum leo et sollicitudin viverra. Nam ac mi eu ex feugiat dictum. Nunc eu sodales lacus, vitae sagittis leo. Sed sed mauris pulvinar ligula consequat lobortis. Proin a pharetra nunc. In viverra aliquet euismod. Integer tincidunt imperdiet ipsum, laoreet dapibus mauris sagittis id. Cras quis consequat lorem, at bibendum ligula.'
      },
      {
        id: 3,
        profileId: 0,
        isUserTheLawyer: false,
        name: 'Пиянката',
        date: '09.10.2023',
        from: '10:00',
        to: '12:00',
        categoryName: 'Митническо право',
        regionName: 'София',
        info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel risus consequat, vulputate ante et, malesuada lacus. Morbi mattis sit amet mi ac auctor. Ut orci sapien, facilisis et elit et, faucibus tincidunt tortor. Cras scelerisque eleifend ligula, faucibus dapibus ex ultricies quis. Nullam eget consequat sem. Phasellus diam dui, luctus non porttitor at, ornare a elit. Sed interdum leo et sollicitudin viverra. Nam ac mi eu ex feugiat dictum. Nunc eu sodales lacus, vitae sagittis leo. Sed sed mauris pulvinar ligula consequat lobortis. Proin a pharetra nunc. In viverra aliquet euismod. Integer tincidunt imperdiet ipsum, laoreet dapibus mauris sagittis id. Cras quis consequat lorem, at bibendum ligula.'
      },
      {
        id: 2,
        profileId: 0,
        isUserTheLawyer: true,
        name: 'Гошо Глухия',
        date: '10.10.2023',
        from: '10:00',
        to: '12:00',
        categoryName: '',
        regionName: '',
        info: 'Нещо не чувам с едното ухо'
      }
    ],
    upcoming: [
      {
        id: 3,
        profileId: 0,
        isUserTheLawyer: true,
        name: 'Пешо Крика',
        date: '18.10.2023',
        from: '10:00',
        to: '12:00',
        categoryName: 'Митническо право',
        regionName: 'София',
        info: ''
      },
      {
        id: 4,
        profileId: 0,
        isUserTheLawyer: true,
        name: 'Гошо Глухия',
        date: '20.10.2023',
        from: '10:00',
        to: '12:00',
        categoryName: 'Категория 1',
        regionName: 'село Глухотрън',
        info: 'Нещо не чувам с едното ухо'
      }
    ]
  };

  const [meetings, setMeetings] = useState<MeetingsPageData>();

  useEffect(() => {
    setMeetings(initialMeetings);
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
                    {meeting.categoryName !== '' && <p>Категория: <span>{meeting.categoryName}</span></p>}
                    {meeting.regionName !== '' && <p>Район: <span>{meeting.regionName}</span></p>}
                    {meeting.info !== '' && <p>Повече инфо: </p>}
                    {meeting.info !== '' && <p>{meeting.info}</p>}
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
                    {meeting.categoryName !== '' && <p>Категория: <span>{meeting.categoryName}</span></p>}
                    {meeting.regionName !== '' && <p>Район: <span>{meeting.regionName}</span></p>}
                    {meeting.info !== '' && <p>Повече инфо: </p>}
                    {meeting.info !== '' && <p>{meeting.info}</p>}
                  </div>
                ))}           
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default MeetingsPage;
