import { LineItems } from 'ordercloud-javascript-sdk';

const getListOfLineItems = async ({direction, orderID}) => {
    try {
        return await LineItems.List(direction, orderID);
    } catch (err) {
        console.error(err);
    }
};

export default getListOfLineItems;