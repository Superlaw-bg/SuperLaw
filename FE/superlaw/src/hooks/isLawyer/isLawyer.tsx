import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from '../../store/hooks';
import { Lawyer } from '../../constants/roles';

const isLawyer = (Component: React.FC) => {
    const Wrapper = () => {
        const navigate = useNavigate();
        const { isLoggedIn, role } = useStoreState(state => state.store.user);

        useEffect(() => {
           
            if (!isLoggedIn) {
                navigate('/login');
                return;
            }

            if (role !== Lawyer) {
                navigate('/');
                return;
            }
        });

        return isLoggedIn && role === Lawyer ? <Component/> : null;
    }

    return Wrapper;
}

export default isLawyer;