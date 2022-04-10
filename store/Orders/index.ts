import { defineStore } from 'pinia'
import useOrders from '~/orderCloud/Orders';
import useLineItems from '~/orderCloud/LineItems';
import useMeStore from '../Me';
import _ from 'lodash';

const { createNewOrder, getWorksheet, deleteOrder } = useOrders();
const { createLineItem, getListOfLineItems, deleteLineItem, updateLineItem } = useLineItems();

const useOrderStore = defineStore('order', {
    state: () => ({
        lineItems: {
            Items: [],
            Meta : []
        }
    }),
    actions: {
        async createOrder(direction) {
            return await await createNewOrder(direction);
        },
        async addProductToOrder({direction, Quantity, ProductID}) {
            const meStore = useMeStore();
            let order = _.get(meStore, 'orders.Items[0]');
            const lineItemInCart = this.lineItems.Items.find( item => item.ProductID === ProductID);

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
        async updateQuantity({
            direction,
            lineItemID,
            ProductID,
            Quantity
        }) {
            const meStore = useMeStore();
            let orderID = _.get(meStore, 'orders.Items[0].ID');

            await updateLineItem({
                direction,
                orderID,
                lineItemID,
                ProductID,
                Quantity
            });

            await this.getWorksheet({
                direction,
                orderID
            });
        },
        async deleteOrder(orderData) {
            const meStore = useMeStore();

            await deleteOrder(orderData);
            await meStore.getMyOrders({
                filters: {
                  Status: 'Unsubmitted'
                }
            });
        },
        async getLineItems(lineItemsData) {
            const lineItems = await getListOfLineItems(lineItemsData);

            if(lineItems) this.lineItems = lineItems;
        },
        async deleteLineItem(lineItemID) {
            const meStore = useMeStore();
            let orderID = _.get(meStore, 'orders.Items[0].ID');

            const response = await deleteLineItem({
                direction: "outgoing",
                orderID,
                lineItemID
            });

            if(response) await this.getWorksheet({
                direction: "outgoing",
                orderID
            });
        },
        async getWorksheet(worksheetData) {
            const worksheet = await getWorksheet(worksheetData);

            if(worksheet) {
                const meStore = useMeStore();

                this.lineItems.Items = worksheet.LineItems;
                if(meStore.orders.Items.length) meStore.orders.Items[0] = _.merge(meStore.orders.Items[0], worksheet.Order);
                else meStore.orders.Items.push(worksheet.Order);
            }
        }
    }
});

export default useOrderStore;