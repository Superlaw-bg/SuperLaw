import apiRoutes from "./apiRoutes";
import axios from "./Api";
import LoginUserInput from "../models/inputs/LoginInput";

const login = (input: LoginUserInput) => {
    return axios.post(apiRoutes.login, input);
}

const authApi = {
    login
};

export default authApi;