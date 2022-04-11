import { Orders } from 'ordercloud-javascript-sdk';
import { v4 } from 'uuid';

const ocCreateNewOrder = async (direction) => {
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

export default ocCreateNewOrder;