import { Me, Tokens } from 'ordercloud-javascript-sdk';

const ocRegister = (userData) => {
    const anonUserToken = Tokens.GetAccessToken();
    Me.Register({...userData, Active: true}, {anonUserToken })
    .then(({access_token}) => {
        Tokens.SetAccessToken(access_token);
    })
    .catch(err => console.error(err));
};

export default ocRegister;