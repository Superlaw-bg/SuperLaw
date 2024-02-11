import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import toastService from "../../services/toastService";
import User from "../../store/auth/models/User";
import { Lawyer } from "../../constants/roles";
import { useStoreActions } from "../../store/hooks";
import LoaderSpinner from "../LoaderSpinner";

const ConfirmEmail = () => {
    const navigate = useNavigate();
    
    const dispatchRegister = useStoreActions(actions => actions.store.register);

    const location = useLocation();

    const paramsStr = location.search?.split('token=')[1];
    const token = paramsStr?.split('&email=')[0];
    const email = paramsStr?.split('&email=')[1];

    useEffect(() => {
        const confirmEmail = async () => {

            try {
              const res = await authApi.confirmEmail(email, token);
              toastService.showSuccess('Имейлът Ви е потвърден, пренасочваме ви към приложението');
              let user: User = {
                id: res.data.id,
                email: res.data.email,
                token: res.data.idToken,
                role: res.data.role,
                isLoggedIn: true
              };
              
              dispatchRegister(user);
              
              if (user.role === Lawyer) {
                navigate('/profile');
              } else {
                navigate('/');
              }
            } catch (error: any) {
            }
        };
        
        confirmEmail();
      }, []);

    return (
      <div className='email-confirmation'>
        <p>Имейлът Ви се потвърждава вмомента</p>
        <LoaderSpinner/>
      </div>
    );
  };
  
  export default ConfirmEmail;