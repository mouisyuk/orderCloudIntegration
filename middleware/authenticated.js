import { Tokens, Auth } from 'ordercloud-javascript-sdk';
import { useAuthenticationStore } from '~/store';
import jwt_decode from "jwt-decode";

export default async () => {
    try {
        if(!Tokens.GetAccessToken()) {
            const authenticationStore = useAuthenticationStore();
            const response = await Auth.Anonymous(process.env.PUBLIC_OC_CLIENT_ID, process.env.PUBLIC_OC_SCOPE.split(','));
            authenticationStore.isAnonymous = true;
            authenticationStore.decodedToken = jwt_decode(response.access_token);
            
            Tokens.SetAccessToken(response.access_token);
            Tokens.SetRefreshToken(response.refresh_token);
        }
    } catch(e) {
        console.error(e);
    }
};