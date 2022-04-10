import { Configuration } from 'ordercloud-javascript-sdk';

Configuration.Set({
    baseApiUrl: process.env.PUBLIC_OC_BASE_API_URL,
    clientID: process.env.PUBLIC_OC_CLIENT_ID
});