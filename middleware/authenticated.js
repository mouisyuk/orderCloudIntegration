import { Tokens, Auth } from 'ordercloud-javascript-sdk';
import { useMeStore } from '~/store';
import jwt_decode from "jwt-decode";

export default async () => {
    try {
        if(!Tokens.GetAccessToken()) {
            const meStore = useMeStore();
            const response = await Auth.Anonymous(process.env.PUBLIC_OC_CLIENT_ID, process.env.PUBLIC_OC_SCOPE.split(','));
            meStore.isAnonymous = true;
            meStore.decodedToken = jwt_decode(response.access_token);
            
            Tokens.SetAccessToken(response.access_token);
            Tokens.SetRefreshToken(response.refresh_token);
        }
    } catch(e) {
        console.error(e);
    }
};