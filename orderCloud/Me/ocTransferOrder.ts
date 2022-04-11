import { Me } from 'ordercloud-javascript-sdk';

const ocTransferOrder = async (anonUserToken) => {
    try {
        return await Me.TransferAnonUserOrder({anonUserToken});
    } catch(err) {
        console.error(err);
    }
};

export default ocTransferOrder;