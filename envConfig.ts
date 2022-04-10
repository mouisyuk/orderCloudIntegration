const env = {
    development: {
        PUBLIC_OC_CLIENT_ID: '7C303B77-633E-49F8-90B7-39322B14DDB5',
        PUBLIC_OC_SCOPE: 'Shopper,MeAdmin,MeAddressAdmin,MeXpAdmin,OverrideUnitPrice,SupplierReader,SupplierAdmin',
        PUBLIC_OC_BASE_API_URL: 'https://sandboxapi.ordercloud.io',
        PUBLIC_OC_ALLOW_ANONYMOUS: false       
    },
    production: {}
};

export default env[process.env.NODE_ENV];