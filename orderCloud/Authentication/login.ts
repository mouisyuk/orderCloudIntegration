import { Tokens, Auth, ApiRole } from 'ordercloud-javascript-sdk';
import jwt_decode from "jwt-decode";


const logIn = (data): any => {
    return Auth.Login(
        data.Username,
        data.Password,
        process.env.PUBLIC_OC_CLIENT_ID,
        process.env.PUBLIC_OC_SCOPE.split(',') as ApiRole[]
    ).then(({access_token, refresh_token}) => {
        Tokens.SetAccessToken(access_token);
        Tokens.SetRefreshToken(refresh_token);

        return {
            decodedToken: jwt_decode(access_token)
        }
    }).catch(err => {
        console.error(err);
    });
};


export default logIn;