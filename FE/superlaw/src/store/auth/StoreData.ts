import { action } from 'easy-peasy';
import User from './models/User';
import StoreDataModel from './models/StoreDataModel';
import FindPageSearch from './models/FindPageSearch';

const initialUserState: User = {
    id: '',
    token: '',
    email: '',
    isLoggedIn: false,
    role: ''
}

const initialFindPageSearchState: FindPageSearch = {
    name: "",
    categories: [],
    cityId: 0,
};

export const storeData: StoreDataModel = {
    user: initialUserState,
    login: action((state, payload) => {
        payload = { ...payload, isLoggedIn: true };
        state.user = payload;
    }),
    register: action((state, payload) => {
        payload = { ...payload, isLoggedIn: true };
        state.user = payload;
    }),
    logout: action((state) => {
        state.user = initialUserState;
        state.redirect = null;
    }),
    redirect: null,
    setRedirect: action((state, payload) => {
        state.redirect = payload;
    }),
    findPageSearch: initialFindPageSearchState,
    setFindPageSearch: action((state, payload) => {
        state.findPageSearch = payload;
    }),
};