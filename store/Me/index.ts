import { defineStore } from 'pinia'
import useProducts from '~/orderCloud/Products';
import useCategories from '~/orderCloud/Categories';
import useAuthentication from '~/orderCloud/Authentication';
import useMe from '~/orderCloud/Me';
import _ from 'lodash';
const { register, logIn, initMe } = useAuthentication();
const { listProducts, getProduct } = useProducts();
const { getListCategories, getSingleCategory } = useCategories();
const { getListOrders } = useMe();

const useMeStore = defineStore('me', {
    state: () => ({
        ListProducts: {
            Items: [],
            Meta: {}
        },
        Categories: {
            Items: [],
            Meta: {}
        },
        isAnonymous: true,
        decodedToken: null,
        orders: {
            Items: [],
            Meta: []
        }
    }),
    actions: {
        async initializeAuth() {
            const {isAnonymous, decodedToken} = await initMe();
            this.isAnonymous = isAnonymous;
            this.decodedToken = decodedToken
        },
        async createAccount(userData) {
            await register(userData);
        },
        async login(userData) {
            const { decodedToken } = await logIn(userData);

            if(decodedToken) {
                this.decodedToken = decodedToken;
                this.isAnonymous = false;
            }
        },
        async getListProducts(listOptions?) {
            this.ListProducts = await listProducts(listOptions);
            return this.ListProducts;
        },
        async getProductById(id) {
            return await getProduct(id);
        },
        async getCategories() {
            this.Categories = await getListCategories();
        },
        async getCategoryById(id) {
            return await getSingleCategory(id);
        },
        async getMyOrders(listOptions?) {
            const orders = await getListOrders(listOptions);
            this.orders = orders;
        }
    }
});

export default useMeStore;