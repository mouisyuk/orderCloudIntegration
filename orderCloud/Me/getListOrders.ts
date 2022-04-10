import { Me } from 'ordercloud-javascript-sdk';

const getListOrders = async (listOptions?) => {
    return await Me.ListOrders(listOptions);
};

export default getListOrders;