import createLineItem from './createLineItem';
import getListOfLineItems from './getListOfLineItems';
import deleteLineItem from './deleteLineItem';
import updateLineItem from './updateLineItem';

const useLineItems = () => ({
    createLineItem,
    getListOfLineItems,
    deleteLineItem,
    updateLineItem
});

export default useLineItems;