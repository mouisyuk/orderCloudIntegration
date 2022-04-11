import { defineStore } from 'pinia'
import useOcOrders from '~/orderCloud/Orders';
import useMeStore from '../Me';
import useLineItemsStore from '../LineItems';
import _ from 'lodash';

const { 
    ocCreateNewOrder,
    ocGetWorksheet,
    ocDeleteOrder
} = useOcOrders();

const useOrderStore = defineStore('order', {
    actions: {
        async createOrder(direction) {
            return await ocCreateNewOrder(direction);
        },
        async addProductToOrder({direction, Quantity, ProductID}) {
            const { orders } = useMeStore();
            const { updateLineItem, createLineItem, lineItems } = useLineItemsStore();
            let order = _.get(orders, 'Items[0]');
            const lineItemInCart = lineItems.Items.find( item => item.ProductID === ProductID);

            if(!order) order = await this.createOrder(direction);

            if(lineItemInCart) await updateLineItem({
                direction,
                orderID: order.ID,
                lineItemID: lineItemInCart.ID,
                ProductID,
                Quantity: Quantity + lineItemInCart.Quantity
            });
            else await createLineItem({direction, orderID: order.ID, ProductID, Quantity});

            await this.getWorksheet({
                direction,
                orderID: order.ID
            });
        },
        async deleteOrder(orderData) {
            const { getMyOrders } = useMeStore();
            const { lineItems } = useLineItemsStore();

            await ocDeleteOrder(orderData);
            await getMyOrders({
                filters: {
                  Status: 'Unsubmitted'
                }
            });
            
            lineItems.Items = [];
        },
        async getWorksheet(worksheetData) {
            const worksheet = await ocGetWorksheet(worksheetData);
            
            if(worksheet) {
                const { lineItems } = useLineItemsStore();
                const { orders } = useMeStore();

                lineItems.Items = worksheet.LineItems;
                if(orders.Items.length) orders.Items[0] = _.merge(orders.Items[0], worksheet.Order);
                else orders.Items.push(worksheet.Order);
            }
        }
    }
});

export default useOrderStore;