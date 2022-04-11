import { LineItems } from 'ordercloud-javascript-sdk';

const ocGetListOfLineItems = async ({direction, orderID}) => {
    try {
        return await LineItems.List(direction, orderID);
    } catch (err) {
        console.error(err);
    }
};

export default ocGetListOfLineItems;