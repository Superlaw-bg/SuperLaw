import User from './User';
import { Action } from 'easy-peasy';

interface AuthStoreModel {
    user: User,
    redirect: string | null,
    login: Action<AuthStoreModel, User>,
    register: Action<AuthStoreModel, User>,
    logout: Action<AuthStoreModel>,
    setRedirect: Action<AuthStoreModel, string | null>,
}

export default AuthStoreModel;