import ocCreateNewOrder from './ocCreateNewOrder';
import ocDeleteOrder from './ocDeleteOrder';
import ocGetWorksheet from './ocGetWorksheet';

const useOcOrders = () => ({
    ocCreateNewOrder,
    ocDeleteOrder,
    ocGetWorksheet
});

export default useOcOrders;