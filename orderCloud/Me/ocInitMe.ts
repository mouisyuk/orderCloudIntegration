import { Tokens } from 'ordercloud-javascript-sdk';
import jwt_decode from "jwt-decode";
import authenticated from '~/middleware/authenticated';

const ocInitMe = async () => {
    await authenticated();
    const initialAccessToken = Tokens.GetAccessToken();
    let isAnonymous = true;
    let decodedToken;

    if(initialAccessToken) {
        decodedToken = jwt_decode(initialAccessToken);
        isAnonymous = !!decodedToken.orderid;
    }

    return {
        decodedToken,
        isAnonymous
    };
};

export default ocInitMe;