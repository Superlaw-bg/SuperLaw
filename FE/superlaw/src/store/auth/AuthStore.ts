import { action } from 'easy-peasy';
import User from './models/User';
import AuthStoreModel from './models/AuthStoreModel';

const initialState: User = {
    id: '',
    token: '',
    email: '',
    isLoggedIn: false,
    role: ''
}

export const authStore: AuthStoreModel = {
    user: initialState,
    redirect: null,
    login: action((state, payload) => {
        payload = { ...payload, isLoggedIn: true };
        state.user = payload;
    }),
    register: action((state, payload) => {
        payload = { ...payload, isLoggedIn: true };
        state.user = payload;
    }),
    logout: action((state) => {
        state.user = initialState;
        state.redirect = null;
    }),
    setRedirect: action((state, payload) => {
        state.redirect = payload;
    })
};