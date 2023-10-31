import requester from './requester';
import apiRoutes from './apiRoutes';
import SimpleData from '../models/SimpleData';

const getCategories: () => Promise<SimpleData[]> = async () => {
    let res: SimpleData[] = await requester.get(apiRoutes.legalCategories);
    
    return res;
}

const legalCategoriesService = {
    getCategories
};

export default legalCategoriesService;