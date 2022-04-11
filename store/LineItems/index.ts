import { defineStore } from 'pinia'
import useOcLineItems from '~/orderCloud/LineItems';
import _ from 'lodash';
import useMeStore from '../Me';
import useOrderStore from '../Orders';

const {
    ocCreateLineItem,
    ocGetListOfLineItems,
    ocDeleteLineItem,
    ocUpdateLineItem
} = useOcLineItems();

const useLineItemsStore = defineStore('lineItems', {
    state: () => ({
        lineItems: {
            Items: [],
            Meta : {}
        }
    }),
    actions: {
        async updateLineItem(lineItemData) {
            const { getWorksheet } = useOrderStore();

            await ocUpdateLineItem(lineItemData);
            await getWorksheet({
                direction: "outgoing",
                orderID: lineItemData.orderID
            });
        },
        async createLineItem(lineItemData) {
            await ocCreateLineItem(lineItemData);
        },
        async getLineItems(lineItemsData) {
            const lineItems = await ocGetListOfLineItems(lineItemsData);

            if(lineItems) this.lineItems = lineItems;
        },
        async deleteLineItem(lineItemID) {
            const { orders } = useMeStore();
            let orderID = _.get(orders, 'Items[0].ID');
            const { getWorksheet } = useOrderStore();

            const response = await ocDeleteLineItem({
                direction: "outgoing",
                orderID,
                lineItemID
            });

            if(response) await getWorksheet({
                direction: "outgoing",
                orderID
            });
        },
    }
});

export default useLineItemsStore;