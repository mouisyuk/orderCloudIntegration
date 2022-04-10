import createNewOrder from './createNewOrder';
import getListOfOrders from './getListOfOrders';
import deleteOrder from './deleteOrder';
import getWorksheet from './getWorksheet';

const useOrders = () => ({
    createNewOrder,
    getListOfOrders,
    deleteOrder,
    getWorksheet
});

export default useOrders;