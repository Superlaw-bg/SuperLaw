import User from './User';
import { Action } from 'easy-peasy';

interface AuthStoreModel {
    user: User
    login: Action<AuthStoreModel, User>,
    register: Action<AuthStoreModel, User>,
    logout: Action<AuthStoreModel, User>,
}

export default AuthStoreModel;