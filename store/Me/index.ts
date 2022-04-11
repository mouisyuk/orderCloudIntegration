import { defineStore } from 'pinia'
import useOcMe from '~/orderCloud/Me';
import useAuthenticationStore from '../Authentication';
import _ from 'lodash';
const { 
    ocGetListOrders,
    ocInitMe,
    ocGetListCategories,
    ocGetSingleCategory,
    ocListProducts,
    ocGetProduct,
    ocTransferOrder
} = useOcMe();

const useMeStore = defineStore('me', {
    state: () => ({
        listProducts: {
            Items: [],
            Meta: {}
        },
        categories: {
            Items: [],
            Meta: {}
        },
        orders: {
            Items: [],
            Meta: {}
        }
    }),
    actions: {
        async initializeMe() {
            const {isAnonymous, decodedToken} = await ocInitMe();
            const authenticationStore = useAuthenticationStore();
            
            authenticationStore.isAnonymous = isAnonymous;
            authenticationStore.decodedToken = decodedToken
        },
        async transferOrder(anonUserToken) {
            await ocTransferOrder(anonUserToken);
        },
        async getListProducts(listOptions?) {
            this.listProducts = await ocListProducts(listOptions);
            return this.listProducts;
        },
        async getProductById(id) {
            return await ocGetProduct(id);
        },
        async getCategories() {
            this.categories = await ocGetListCategories();
        },
        async getCategoryById(id) {
            return await ocGetSingleCategory(id);
        },
        async getMyOrders(listOptions?) {
            const orders = await ocGetListOrders(listOptions);
            this.orders = orders;
        }
    }
});

export default useMeStore;