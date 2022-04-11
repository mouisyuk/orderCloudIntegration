import { LineItems } from 'ordercloud-javascript-sdk';

const ocDeleteLineItem = async({direction, orderID, lineItemID}) => {
    let isDeletedLineItem = false;

    try {
        await LineItems.Delete(direction, orderID, lineItemID);
        isDeletedLineItem = true;
    } catch (err) {
        console.error(err);
    }

    return isDeletedLineItem;
};

export default ocDeleteLineItem;