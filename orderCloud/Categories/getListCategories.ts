import { Me } from 'ordercloud-javascript-sdk';

const getListCategories = async () => {
    try {
        const response = await Me.ListCategories();

        return response;
    } catch (err) {
        console.error(err);
    }
};

export default getListCategories;