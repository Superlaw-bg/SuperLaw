import axios from '../../api/Api';
import { useEffect, useState } from 'react';
import store from '../../store/store';
import User from '../../store/auth/models/User';
import toastService from '../../services/toastService';
import { useStoreActions } from "../../store/hooks";
import { useNavigate } from 'react-router-dom';

const AxiosInterceptor = ({ children }: any) => {
    const navigate = useNavigate();
    const dispatchLogout = useStoreActions(actions => actions.auth.logout);
    const [isSet, setIsSet] = useState(false);

    useEffect(() => {

        axios.interceptors.request.use(config => {
            const authToken = store.getState().auth.user.token;
            if (authToken) {
              config.headers.Authorization = `Bearer ${authToken}`;
            }
            return config;
        });

        axios.interceptors.response.use(
            response => response,
            error => {
              const status = error.response ? error.response.status : null;
              if (status === 401) {
                const user: User = {
                  isLoggedIn: false,
                  role: '',
                  token: '',
                  id: '',
                  email: ''
                };
          
                dispatchLogout(user);
                navigate('/login');
                toastService.showError('Сесията Ви е изтекла. Моля влезте отново.');
              } else if (status === 404) {
                // Handle not found errors
              } else {
                toastService.showError(error.response.data.message);
              }
              
              return Promise.reject(error);
            }
          );

        setIsSet(true);
    }, []);

   

    return isSet && children;
}

export { AxiosInterceptor };