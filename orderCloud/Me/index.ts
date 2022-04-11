import ocGetListOrders from './ocGetListOrders';
import ocGetListCategories from './ocGetListCategories';
import ocGetSingleCategory from './ocGetSingleCategory';
import ocInitMe from './ocInitMe';
import ocGetProduct from './ocGetProduct';
import ocListProducts from './ocListProducts';
import ocTransferOrder from './ocTransferOrder';

const useOcMe = () => ({
    ocGetListOrders,
    ocGetListCategories,
    ocGetSingleCategory,
    ocGetProduct,
    ocListProducts,
    ocInitMe,
    ocTransferOrder
});

export default useOcMe;