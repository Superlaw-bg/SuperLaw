import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import toastService from "../../services/toastService";
import User from "../../store/auth/models/User";
import { Lawyer } from "../../constants/roles";
import { useStoreActions } from "../../store/hooks";

const ConfirmEmail = () => {
    const navigate = useNavigate();
    
    const dispatchRegister = useStoreActions(actions => actions.auth.register);

    const location = useLocation();

    const paramsStr = location.search?.split('token=')[1];
    const token = paramsStr?.split('&email=')[0];
    const email = paramsStr?.split('&email=')[1];

    useEffect(() => {
        const confirmEmail = async () => {
            const res = await authService.confirmEmail(email, token);
            
            if (!res.isError) {
              toastService.showSuccess('Имейлът Ви е потвърден, пренасочваме ви към приложението');
              let user: User = {
                id: res.data.id,
                email: res.data.email,
                token: res.data.idToken,
                role: res.data.role,
                isLoggedIn: true
              };
            
              dispatchRegister(user);
            
              navigate('../profile');
            }
        };
        
        confirmEmail();
      }, []);

    return (
      <div className='email-confirmation'>
        <p>Имейлът Ви се потвърждава вмомента</p>
      </div>
    );
  };
  
  export default ConfirmEmail;