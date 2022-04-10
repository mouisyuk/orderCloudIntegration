import { Me } from 'ordercloud-javascript-sdk';

const getProduct = async (id) => {
    try {
        const response = await Me.GetProduct(id);

        return response;
    } catch(err) {
        console.error(err);
    }
};

export default getProduct;