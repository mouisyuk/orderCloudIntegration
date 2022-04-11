import { LineItems } from 'ordercloud-javascript-sdk';

const ocUpdateLineItem = async ({direction, orderID, lineItemID, ProductID, Quantity}) => {
    try {
        return await LineItems.Patch(direction, orderID, lineItemID, {
            ProductID,
            Quantity
        });
    } catch (err) {
        console.error(err);
    }
};

export default ocUpdateLineItem;