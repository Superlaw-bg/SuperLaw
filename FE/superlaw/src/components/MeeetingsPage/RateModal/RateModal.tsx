import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import './RateModal.scss';
import StarRating from "../StarRating";
import LoaderSpinner from "../../LoaderSpinner";

const RateModal = (props: any) => {  
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);

    const getRating = (rating: number) => {
        setRating(rating);
    }

    const rate = async () => {
        setLoading(true);
        await props.onRateConfirmCallbackAsync(rating);
        setLoading(false);
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
            {
              loading ?
              <div className="spinner">
                <LoaderSpinner/> 
              </div>
              :
              <Button onClick={async ()=> await rate()} className="primary-btn">Дай оценка</Button>
            }
            
          </Modal.Footer>
        </Modal>
      );
};

export default RateModal;