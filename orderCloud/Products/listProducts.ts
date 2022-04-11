import { Products, Me } from 'ordercloud-javascript-sdk';

const listProducts = async (listOptions?) => {
    try {
        return await Me.ListProducts({catalogID: '0001', ...listOptions});
    } catch(err) {
        console.error(err);
    }
};

export default listProducts;