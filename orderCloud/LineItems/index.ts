import ocCreateLineItem from './ocCreateLineItem';
import ocGetListOfLineItems from './ocGetListOfLineItems';
import ocDeleteLineItem from './ocDeleteLineItem';
import ocUpdateLineItem from './ocUpdateLineItem';

const useOcLineItems = () => ({
    ocCreateLineItem,
    ocGetListOfLineItems,
    ocDeleteLineItem,
    ocUpdateLineItem
});

export default useOcLineItems;