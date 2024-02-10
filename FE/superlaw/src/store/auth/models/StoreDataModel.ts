import FindPageSearch from './FindPageSearch';
import User from './User';
import { Action } from 'easy-peasy';

interface StoreDataModel {
    user: User,
    login: Action<StoreDataModel, User>,
    register: Action<StoreDataModel, User>,
    logout: Action<StoreDataModel>,
    redirect: string | null,
    setRedirect: Action<StoreDataModel, string | null>,
    findPageSearch: FindPageSearch,
    setFindPageSearch: Action<StoreDataModel, FindPageSearch>,
}

export default StoreDataModel;