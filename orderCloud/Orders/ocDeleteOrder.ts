import { Orders } from 'ordercloud-javascript-sdk';

const ocDeleteOrder = async ({direction, orderID}) => {
    try{
        return await Orders.Delete(direction, orderID);
    } catch (err) {
        console.error(err);
    }
};

export default ocDeleteOrder;