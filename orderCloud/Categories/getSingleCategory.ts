import { Me } from 'ordercloud-javascript-sdk';

const getSingleCategory = async (id) => {
    try {
        const response = await Me.GetCategory(id);

        return response;
    } catch (err) {
        console.error(err);
    }
};

export default getSingleCategory;