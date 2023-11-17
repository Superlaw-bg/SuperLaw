import { Tab, Tabs, Button } from "react-bootstrap";
import "./MeetingsPage.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MeetingsPageData from "../../models/MeetingsPageData";
import meetingApi from "../../api/meetingApi";
import RateModal from "./RateModal";
import toastService from "../../services/toastService";
import LoaderSpinner from "../LoaderSpinner";

const MeetingsPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [meetings, setMeetings] = useState<MeetingsPageData>({
    past: [],
    upcoming: [],
  });
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(0);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        const res = await meetingApi.getAllForCurrentUser();
        setMeetings(res.data);
      } catch (error: any) {
        toastService.showError(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const navigateToProfile = (profileId: number) => {
    navigate(`/profile/${profileId}`);
  };

  const openRateModal = (meetingId: number) => {
    setSelectedMeeting(meetingId);
    setShowRateModal(true);
  };

  const closeRateModal = () => {
    setSelectedMeeting(0);
    setShowRateModal(false);
  };

  const onRateConfirmCallbackAsync = async (rating: number) => {
    try {
      await meetingApi.rateMeeting({
        rating,
        meetingId: selectedMeeting,
      });
      toastService.showSuccess("Успешно оценихте консултацията");

      let selMeeting = meetings.past.filter((x) => x.id === selectedMeeting)[0];
      selMeeting.rating = rating;

      setMeetings(meetings);

      closeRateModal();
    } catch (error: any) {
      toastService.showError(error.response.data.message);
    }
  };

  return (
    <div className="meetings-page">
      <h2>Моите консултации</h2>
      <Tabs defaultActiveKey="upcoming-meetings" className="tabs" fill>
        <Tab eventKey="past-meetings" title="Изминали" tabClassName="tab past">
          <div className="meetings">
            {loading ? (
              <div className="spinner">
                <LoaderSpinner />
              </div>
            ) : (
              <div>
                {meetings &&
                  meetings.past.map((meeting) => (
                    <div key={meeting.id} className="meeting">
                      {meeting.profileId !== 0 ? (
                        <p>
                          Адвокат:
                          <a
                            onClick={() => navigateToProfile(meeting.profileId)}
                          >
                            {meeting.name}
                          </a>
                        </p>
                      ) : (
                        <p>
                          Клиент: <span>{meeting.name}</span>
                        </p>
                      )}
                      <p>
                        Дата: <span>{meeting.date}</span>
                      </p>
                      <p>
                        От: <span>{meeting.from}</span> До:
                        <span>{meeting.to}</span>
                      </p>
                      {meeting.categoryName && (
                        <p>
                          Категория: <span>{meeting.categoryName}</span>
                        </p>
                      )}
                      {meeting.info && <p>Повече инфо: </p>}
                      {meeting.info && <p>{meeting.info}</p>}
                      {!meeting.isUserTheLawyer && meeting.rating === 0 && (
                        <Button
                          className="primary-btn"
                          onClick={() => openRateModal(meeting.id)}
                        >
                          Оцени
                        </Button>
                      )}
                      {!meeting.isUserTheLawyer && meeting.rating !== 0 && (
                        <p className="rating">
                          <i className="fa-solid fa-star"></i> {meeting.rating}{" "}
                          / 5
                        </p>
                      )}
                    </div>
                  ))}
                  {meetings.past.length === 0 &&
                    <p className="no-meetings">Все още нямате изминали консултации</p>
                  }
              </div>
            )}
          </div>
        </Tab>
        <Tab
          eventKey="upcoming-meetings"
          title="Предстоящи"
          tabClassName="tab upcoming"
        >
          <div className="meetings">
            {loading ? (
              <div className="spinner">
                <LoaderSpinner />
              </div>
            ) : (
              <div>
                {meetings &&
                  meetings.upcoming.map((meeting) => (
                    <div key={meeting.id} className="meeting">
                      {meeting.profileId !== 0 ? (
                        <p>
                          Адвокат:
                          <a
                            onClick={() => navigateToProfile(meeting.profileId)}
                          >
                            {meeting.name}
                          </a>
                        </p>
                      ) : (
                        <p>
                          Клиент: <span>{meeting.name}</span>
                        </p>
                      )}
                      <p>
                        Дата: <span>{meeting.date}</span>
                      </p>
                      <p>
                        От: <span>{meeting.from}</span> До:
                        <span>{meeting.to}</span>
                      </p>
                      {meeting.categoryName && (
                        <p>
                          Категория: <span>{meeting.categoryName}</span>
                        </p>
                      )}
                      {meeting.info && <p>Повече инфо: </p>}
                      {meeting.info && <p>{meeting.info}</p>}
                    </div>
                  ))}
                  {meetings.upcoming.length === 0 &&
                    <p className="no-meetings">Все още нямате предстоящи консултации</p>
                  }
              </div>
            )}
          </div>
        </Tab>
      </Tabs>

      <RateModal
        meetingId={selectedMeeting}
        onRateConfirmCallbackAsync={onRateConfirmCallbackAsync}
        show={showRateModal}
        onHide={closeRateModal}
      />
    </div>
  );
};

export default MeetingsPage;
