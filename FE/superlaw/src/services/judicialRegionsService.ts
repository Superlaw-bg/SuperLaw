import requester from './requester';
import apiRoutes from './apiRoutes';
import SimpleData from '../models/SimpleData';

const getRegions: () => Promise<SimpleData[]> = async () => {
    let res: SimpleData[] = await requester.get(apiRoutes.judicialRegions);
    
    return res;
}

const judicialRegionsService = {
    getRegions
};

export default judicialRegionsService;