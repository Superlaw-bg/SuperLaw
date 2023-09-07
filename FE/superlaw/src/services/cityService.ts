import requester from './requester';
import apiRoutes from './apiRoutes';
import City from '../models/City';

const getCities: () => Promise<City[]> = async () => {
    let res: City[] = await requester.get(apiRoutes.cities);
    
    return res;
}

const cityService = {
    getCities
};

export default cityService;