import { Me } from 'ordercloud-javascript-sdk';

const ocGetSingleCategory = async (id) => {
    try {
        return await Me.GetCategory(id);
    } catch (err) {
        console.error(err);
    }
};

export default ocGetSingleCategory;