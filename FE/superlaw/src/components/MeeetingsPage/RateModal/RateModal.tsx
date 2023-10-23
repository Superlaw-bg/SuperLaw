import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import './RateModal.scss';
import StarRating from "../StarRating";

const RateModal = (props: any) => {  

    const [rating, setRating] = useState(0);

    const getRating = (rating: number) => {
        setRating(rating);
    }

    const rate = async () => {
        await props.onRateConfirmCallbackAsync(rating);
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
            <Button onClick={async ()=> await rate()} className="primary-btn">Дай оценка</Button>
          </Modal.Footer>
        </Modal>
      );
};

export default RateModal;