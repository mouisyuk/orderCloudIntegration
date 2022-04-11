import { Me } from 'ordercloud-javascript-sdk';

const ocGetProduct = async (id) => {
    try {
        const response = await Me.GetProduct(id);

        return response;
    } catch(err) {
        console.error(err);
    }
};

export default ocGetProduct;