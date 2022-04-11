import { Tokens, Auth, ApiRole } from 'ordercloud-javascript-sdk';
import jwt_decode from "jwt-decode";


const ocLogIn = (data): any => {
    return Auth.Login(
        data.Username,
        data.Password,
        process.env.PUBLIC_OC_CLIENT_ID,
        process.env.PUBLIC_OC_SCOPE.split(',') as ApiRole[]
    ).then(({access_token, refresh_token}) => {
        const anonToken = Tokens.GetAccessToken();

        Tokens.SetAccessToken(access_token);
        Tokens.SetRefreshToken(refresh_token);

        return {
            decodedToken: jwt_decode(access_token),
            anonToken
        }
    }).catch(err => {
        console.error(err);
    });
};


export default ocLogIn;