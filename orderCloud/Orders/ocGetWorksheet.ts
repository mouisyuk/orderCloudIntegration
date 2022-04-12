import { IntegrationEvents } from 'ordercloud-javascript-sdk';

const ocGetWorksheet = async ({direction, orderID}) => {
    try {
        return await IntegrationEvents.GetWorksheet(direction, orderID);
    } catch (err) {
        console.error(err);
    }
};

export default ocGetWorksheet;