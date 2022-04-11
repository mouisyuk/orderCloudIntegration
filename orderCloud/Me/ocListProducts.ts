import { Me } from 'ordercloud-javascript-sdk';

const ocListProducts = async (listOptions?) => {
    try {
        return await Me.ListProducts({catalogID: '0001', ...listOptions});
    } catch(err) {
        console.error(err);
    }
};

export default ocListProducts;