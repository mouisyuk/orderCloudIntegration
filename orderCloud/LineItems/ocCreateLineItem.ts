import { LineItems } from 'ordercloud-javascript-sdk';

const ocCreateLineItem = async ({direction, orderID, ProductID, Quantity}) => {
    try {
        return await LineItems.Create(direction, orderID, {Quantity, ProductID})
    } catch (err) {
        console.error(err);
    }
};

export default ocCreateLineItem;