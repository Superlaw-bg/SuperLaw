import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from '../../store/hooks';

const isAuth = (Component: React.FC) => {
    const Wrapper = () => {
        const navigate = useNavigate();
        const { isLoggedIn } = useStoreState(state => state.store.user);

        useEffect(() => {
            if (!isLoggedIn) {
                navigate('/login');
                return;
            }
        });

        return isLoggedIn ? <Component/> : null;
    }

    return Wrapper;
}

export default isAuth;