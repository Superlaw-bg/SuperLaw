import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from '../../store/hooks';
import { Lawyer } from '../../constants/roles';

const isNotLawyer = (Component: React.FC) => {
    const Wrapper = () => {
        const navigate = useNavigate();
        const { role } = useStoreState(state => state.auth.user);

        useEffect(() => {
            if (role === Lawyer) {
                navigate('/profile');
                return;
            }
        });

        return role !== Lawyer ? <Component/> : null;
    }

    return Wrapper;
}

export default isNotLawyer;