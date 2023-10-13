import { Tab, Tabs } from "react-bootstrap";
import "./MeetingsPage.scss";

const MeetingsPage = () => {
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
                <div className="meeting">
                    <p>Адвокат: <a href="https://www.google.com">Пешо Иванов Симов</a></p>
                    <p>Дата: <span>08.10.2023</span></p>
                    <p>От: <span>10:00</span> До: <span>12:00</span></p>
                    <p>Категория: <span>Митническо право</span></p>
                    <p>Район: <span>София</span></p>
                    <p>Повече инфо: </p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel risus consequat, vulputate ante et, malesuada lacus. Morbi mattis sit amet mi ac auctor. Ut orci sapien, facilisis et elit et, faucibus tincidunt tortor. Cras scelerisque eleifend ligula, faucibus dapibus ex ultricies quis. Nullam eget consequat sem. Phasellus diam dui, luctus non porttitor at, ornare a elit. Sed interdum leo et sollicitudin viverra. Nam ac mi eu ex feugiat dictum. Nunc eu sodales lacus, vitae sagittis leo. Sed sed mauris pulvinar ligula consequat lobortis. Proin a pharetra nunc. In viverra aliquet euismod. Integer tincidunt imperdiet ipsum, laoreet dapibus mauris sagittis id. Cras quis consequat lorem, at bibendum ligula.</p>
                </div>
                <div className="meeting">
                    <p>Адвокат: <a href="https://www.google.com">Пешо Иванов Симов</a></p>
                    <p>Дата: <span>08.10.2023</span></p>
                    <p>От: <span>10:00</span> До: <span>12:00</span></p>
                    <p>Категория: <span>Митническо право</span></p>
                    <p>Район: <span>София</span></p>
                    <p>Повече инфо: </p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel risus consequat, vulputate ante et, malesuada lacus. Morbi mattis sit amet mi ac auctor. Ut orci sapien, facilisis et elit et, faucibus tincidunt tortor. Cras scelerisque eleifend ligula, faucibus dapibus ex ultricies quis. Nullam eget consequat sem. Phasellus diam dui, luctus non porttitor at, ornare a elit. Sed interdum leo et sollicitudin viverra. Nam ac mi eu ex feugiat dictum. Nunc eu sodales lacus, vitae sagittis leo. Sed sed mauris pulvinar ligula consequat lobortis. Proin a pharetra nunc. In viverra aliquet euismod. Integer tincidunt imperdiet ipsum, laoreet dapibus mauris sagittis id. Cras quis consequat lorem, at bibendum ligula.</p>
                </div>
                <div className="meeting">
                    <p>Адвокат: <a href="https://www.google.com">Пешо Иванов Симов</a></p>
                    <p>Дата: <span>08.10.2023</span></p>
                    <p>От: <span>10:00</span> До: <span>12:00</span></p>
                    <p>Категория: <span>Митническо право</span></p>
                    <p>Район: <span>София</span></p>
                    <p>Повече инфо: </p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel risus consequat, vulputate ante et, malesuada lacus. Morbi mattis sit amet mi ac auctor. Ut orci sapien, facilisis et elit et, faucibus tincidunt tortor. Cras scelerisque eleifend ligula, faucibus dapibus ex ultricies quis. Nullam eget consequat sem. Phasellus diam dui, luctus non porttitor at, ornare a elit. Sed interdum leo et sollicitudin viverra. Nam ac mi eu ex feugiat dictum. Nunc eu sodales lacus, vitae sagittis leo. Sed sed mauris pulvinar ligula consequat lobortis. Proin a pharetra nunc. In viverra aliquet euismod. Integer tincidunt imperdiet ipsum, laoreet dapibus mauris sagittis id. Cras quis consequat lorem, at bibendum ligula.</p>
                </div>
                <div className="meeting">
                    <p>Адвокат: <a href="https://www.google.com">Пешо Иванов Симов</a></p>
                    <p>Дата: <span>08.10.2023</span></p>
                    <p>От: <span>10:00</span> До: <span>12:00</span></p>
                    <p>Категория: <span>Митническо право</span></p>
                    <p>Район: <span>София</span></p>
                    <p>Повече инфо: </p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel risus consequat, vulputate ante et, malesuada lacus. Morbi mattis sit amet mi ac auctor. Ut orci sapien, facilisis et elit et, faucibus tincidunt tortor. Cras scelerisque eleifend ligula, faucibus dapibus ex ultricies quis. Nullam eget consequat sem. Phasellus diam dui, luctus non porttitor at, ornare a elit. Sed interdum leo et sollicitudin viverra. Nam ac mi eu ex feugiat dictum. Nunc eu sodales lacus, vitae sagittis leo. Sed sed mauris pulvinar ligula consequat lobortis. Proin a pharetra nunc. In viverra aliquet euismod. Integer tincidunt imperdiet ipsum, laoreet dapibus mauris sagittis id. Cras quis consequat lorem, at bibendum ligula.</p>
                </div>
            </div>
        </Tab>
        <Tab
          eventKey="upcoming-meetings"
          title="Предстоящи"
          tabClassName='tab upcoming'
        >
             
        </Tab>
      </Tabs>
    </div>
  );
};

export default MeetingsPage;
