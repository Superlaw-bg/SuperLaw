import { createStore, persist } from 'easy-peasy';
import { storeData } from './auth/StoreData';
import StoreModel from "./StoreModel";

const storeModel: StoreModel = {
    store: storeData,
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