import { Products, Me } from 'ordercloud-javascript-sdk';

const listProducts = async (categoryID?: string) => {
    try {
        const response = await Me.ListProducts({catalogID: '0001',categoryID});

        return response;
    } catch(err) {
        console.error(err);
    }
};

export default listProducts;