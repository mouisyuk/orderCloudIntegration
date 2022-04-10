import { IntegrationEvents } from 'ordercloud-javascript-sdk';

const getWorksheet = async ({direction, orderID}) => {
    try {
        return await IntegrationEvents.GetWorksheet(direction, orderID);
    } catch (err) {
        console.error(err);
    }
};

export default getWorksheet;