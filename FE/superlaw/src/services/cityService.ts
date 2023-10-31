import requester from './requester';
import apiRoutes from './apiRoutes';
import SimpleData from '../models/SimpleData';

const getCities: () => Promise<SimpleData[]> = async () => {
    let res: SimpleData[] = await requester.get(apiRoutes.cities);
    
    return res;
}

const cityService = {
    getCities
};

export default cityService;