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
    login: action((state, payload) => {
        payload = { ...payload, isLoggedIn: true };
        state.user = payload;
    }),
    register: action((state, payload) => {
        payload = { ...payload, isLoggedIn: true };
        state.user = payload;
    }),
    logout: action((state, _) => {
        state.user = initialState;
    }),
};