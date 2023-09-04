import requester from './requester';
import apiRoutes from './apiRoutes';
import City from '../models/City';

const getCities: () => Promise<City[]> = async () => await requester.get(apiRoutes.cities);

const cityService = {
    getCities
};

export default cityService;