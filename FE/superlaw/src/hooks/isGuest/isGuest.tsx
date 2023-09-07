import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from '../../store/hooks';

const isGuest = (Component: React.FC) => {
    const Wrapper = () => {
        const navigate = useNavigate();
        const { isLoggedIn } = useStoreState((store) => store.auth.user);

        useEffect(() => {
            if (isLoggedIn) {
                navigate('/');
                return;
            }
        });

        return isLoggedIn ? null : <Component/>;
    }

    return Wrapper;
}

export default isGuest;