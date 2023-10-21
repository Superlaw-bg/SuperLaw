import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import './RateModal.scss';
import StarRating from "../StarRating";

const RateModal = (props: any) => {  

    const [rating, setRating] = useState(0);
    console.log(props);

    const getRating = (rating: number) => {
        setRating(rating);
    }

    const rate = () => {
        console.log('rate is pressed');
        console.log(props.meetingId);
        props.onRateConfirmCallback(rating);
    }

    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="rate-modal"
        >
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <div className="wrapper">
                <StarRating getValue={getRating}/>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={rate} className="primary-btn">Дай оценка</Button>
          </Modal.Footer>
        </Modal>
      );
};

export default RateModal;