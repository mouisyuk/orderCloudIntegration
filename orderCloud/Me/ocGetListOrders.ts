import { Me } from 'ordercloud-javascript-sdk';

const ocGetListOrders = async (listOptions?) => {
    return await Me.ListOrders(listOptions);
};

export default ocGetListOrders;