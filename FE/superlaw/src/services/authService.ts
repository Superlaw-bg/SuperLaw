import requester from './requester';
import apiRoutes from './apiRoutes';
import RegisterUserInput from '../models/inputs/RegisterUserInput';
import LoginUserInput from '../models/inputs/LoginInput';
import Result from '../models/Result';

const registerUser: (input: RegisterUserInput) => Promise<Result> = async (input) => {
    const res = await requester.post(apiRoutes.registerUser, input);

    if(res.isError){
        return {
            isError: true,
            data: res.msg
        }
    }

    return {
        isError: false,
        data: res
    };
}

const login: (input: LoginUserInput) => Promise<Result> = async (input) => {
    const res = await requester.post(apiRoutes.login, input);

    if(res.isError){
        return {
            isError: true,
            data: res.msg
        }
    }

    return {
        isError: false,
        data: res
    };
}

const authService = {
    registerUser,
    login
};

export default authService;