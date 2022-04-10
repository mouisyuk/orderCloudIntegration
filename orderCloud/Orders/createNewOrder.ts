import { Orders } from 'ordercloud-javascript-sdk';
import { v4 } from 'uuid';

const createNewOrder = async (direction) => {
    try {
        return await Orders.Create(direction, {
            ID: `Order_${v4()}`,
            xp: {
                OrderType: "Standard",
                QuoteOrderInfo: null
                
            }
        });
    } catch (err) {
        console.error(err);
    }
};

export default createNewOrder;