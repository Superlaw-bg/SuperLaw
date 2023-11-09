import requester from './requester';
import apiRoutes from '../api/apiRoutes';
import RegisterUserInput from '../models/inputs/RegisterUserInput';
import LoginUserInput from '../models/inputs/LoginInput';
import Result from '../models/Result';
import RegisteLawyerInput from '../models/inputs/RegisterLawyerInput';

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

const registerLawyer: (input: RegisteLawyerInput) => Promise<Result> = async (input) => {
    const res = await requester.post(apiRoutes.registerLawyer, input);

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

const forgotPassword: (email: string) => Promise<Result> = async (email) => {
    const res = await requester.post(apiRoutes.forgotPassword, email);

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

const confirmEmail: (email: string, token: string) => Promise<Result> = async (email, token) => {
    const res = await requester.post(apiRoutes.confirmEmail, {email, token});

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

const resetPassword: (email: string, token: string, password: string, confirmPassword: string) => Promise<Result> = async (email, token, password, confirmPassword) => {
    const res = await requester.post(apiRoutes.resetPassword, {email, token, password, confirmPassword});

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
    registerLawyer,
    login,
    confirmEmail,
    forgotPassword,
    resetPassword,
};

export default authService;