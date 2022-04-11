import { Me } from 'ordercloud-javascript-sdk';

const ocGetListCategories = async () => {
    try {
        return await Me.ListCategories();
    } catch (err) {
        console.error(err);
    }
};

export default ocGetListCategories;