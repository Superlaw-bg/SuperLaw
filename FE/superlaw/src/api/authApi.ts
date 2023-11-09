import apiRoutes from "./apiRoutes";
import axios from "./Api";
import LoginUserInput from "../models/inputs/LoginInput";
import RegisterUserInput from "../models/inputs/RegisterUserInput";

const registerUser = (input: RegisterUserInput) => {
    return axios.post(apiRoutes.registerUser, input);
}

const login = (input: LoginUserInput) => {
    return axios.post(apiRoutes.login, input);
}

const forgotPassword = (email: string) => {
    return axios.post(apiRoutes.forgotPassword, { email });
}

const resetPassword = (email: string, token: string, password: string, confirmPassword: string) => {
    return axios.post(apiRoutes.resetPassword, {email, token, password, confirmPassword});
}

const confirmEmail = (email: string, token: string) => {
    return axios.post(apiRoutes.confirmEmail, {email, token});
}

const authApi = {
    registerUser,
    login,
    forgotPassword,
    resetPassword,
    confirmEmail
};

export default authApi;