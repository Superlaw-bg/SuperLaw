import apiRoutes from "./apiRoutes";
import axios from "./Api";
import LoginUserInput from "../models/inputs/LoginInput";
import RegisterUserInput from "../models/inputs/RegisterUserInput";
import RegisteLawyerInput from "../models/inputs/RegisterLawyerInput";

const registerUser = (input: RegisterUserInput) => {
    return axios.post(apiRoutes.registerUser, input);
}

const registerLawyer = (input: RegisteLawyerInput) => {
    return axios.post(apiRoutes.registerLawyer, input);
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

const phoneVerification = (phoneNumber: string) => {
    return axios.post(apiRoutes.phoneVerification, { phoneNumber });
}

const confirmPhone = (phoneNumber: string, code: string) => {
    return axios.post(apiRoutes.confirmPhone, {phoneNumber, code});
}

const authApi = {
    registerUser,
    registerLawyer,
    login,
    forgotPassword,
    resetPassword,
    confirmEmail,
    phoneVerification,
    confirmPhone,
};

export default authApi;