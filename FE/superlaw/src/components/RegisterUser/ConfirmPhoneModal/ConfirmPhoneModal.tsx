import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "./ConfirmPhoneModal.scss";
import authApi from "../../../api/authApi";

interface ConfirmPhoneDialogProps {
  phoneNumber: string;
  onPhoneConfirmation: () => void;
  onClose: () => void;
}

const ConfirmPhoneModal: React.FC<ConfirmPhoneDialogProps> = ({
  phoneNumber,
  onPhoneConfirmation,
  onClose,
}) => {
  const [open, setOpen] = useState(true);

  const [isSendCodeBtnPressed, setIsSendCodeBtnPressed] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState('');

  const handleSendCodeBtnClick = async () => {
    try {
      const env = process.env.REACT_APP_ENV;
        if (env === 'prod') {
          await authApi.phoneVerification(phoneNumber);
        }
        setIsSendCodeBtnPressed(true);
    } catch (error: any) {
    }
  }

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationCode(e.target.value);
  };

  const handleConfirm = async () => {
    const env = process.env.REACT_APP_ENV;
    let isConfirmed = true;
    if (env === 'prod') {
      const result = await authApi.confirmPhone(phoneNumber, verificationCode);
      isConfirmed = result.data;
    }

    if (isConfirmed) {
        handleClose();
        await onPhoneConfirmation();
    } else {
        setError("Грешен код, моля опитайте отново");
        setVerificationCode('');
    }
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  }

  return (
    <Modal
    className="confirm-phone-modal"
    show={open}
    onHide={handleClose}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    >
    <Modal.Header closeButton>
      <Modal.Title className="modal-title">Потвърждаване на телефон</Modal.Title>
    </Modal.Header>

    {isSendCodeBtnPressed && (
          <Modal.Body className="modal-body">
          <p>Моля въведете СМС кода, пратен на посочения от Вас телефонен номер</p>
          <div className="enter-code">
            <div className="code-input-wrapper">
                <input
                    type="text"
                    value={verificationCode}
                    onChange={handleVerificationCodeChange}
                />
            </div>
           
           <div className="btn-wrapper">
                <Button variant="primary" onClick={handleConfirm} className="verify-btn">Потвърди</Button>
           </div>
           {error && <div className="error">
            <p>{error}</p>
            </div>}
          </div>
        </Modal.Body>
    )}

    {!isSendCodeBtnPressed && (
          <Modal.Body>
          <p>За да запазвате консултации, е необходимо да потвърдите Вашия телефонен номер. При кликане на бутона за пращане на код, ще Ви изпратим СМС с Вашия код, който трябва да въведете.</p>
          <Button variant="primary" onClick={async () => await handleSendCodeBtnClick()} className="send-btn">Изпрати код</Button>
        </Modal.Body>
    )}
  </Modal>
  );
};

export default ConfirmPhoneModal;
