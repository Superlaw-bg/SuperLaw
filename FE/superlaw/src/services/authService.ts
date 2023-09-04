import requester from './requester';
import apiRoutes from './apiRoutes';
import RegisterUserInput from '../models/inputs/RegisterUserInput';

const registerUser: (input: RegisterUserInput) => Promise<string> = async (input) => {
    const res: Promise<string> = await requester.post(apiRoutes.registerUser, input);

    return res;
}

const authService = {
    registerUser
};

export default authService;