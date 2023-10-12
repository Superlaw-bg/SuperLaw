import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from '../../store/hooks';
import { User } from '../../constants/roles';

const isNormalUser = (Component: React.FC) => {
    const Wrapper = () => {
        const navigate = useNavigate();
        const { isLoggedIn, role } = useStoreState(state => state.auth.user);

        useEffect(() => {
            
            if (!isLoggedIn) {
                navigate('/login');
                return;
            }

            if (role !== User) {
                navigate('/');
                return;
            }
        });

        return isLoggedIn && role === User ? <Component/> : null;
    }

    return Wrapper;
}

export default isNormalUser;