import { createStore, persist } from 'easy-peasy';
import { authStore } from './auth/AuthStore';
import StoreModel from "./StoreModel";

const storeModel: StoreModel = {
    auth: authStore,
};

const store = createStore<StoreModel>(
    persist(storeModel, {
        storage: 'localStorage',
    }),
    {
        version: 1,
        devTools: true,
    }
);

export default store;