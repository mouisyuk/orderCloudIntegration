import { defineStore } from 'pinia'
import useOcAuthentication from '~/orderCloud/Authentication';
import useMeStore from '../Me';
const { ocRegister, ocLogIn } = useOcAuthentication();

const useAuthenticationStore = defineStore('authentication', {
    state: () => ({
        isAnonymous: true,
        decodedToken: null
    }),
    actions: {
        async createAccount(userData) {
            await ocRegister(userData);
        },
        async login(userData) {
            const { decodedToken, anonToken} = await ocLogIn(userData);
            const meStore = useMeStore();

            if(decodedToken) {
                await meStore.transferOrder(anonToken);
                this.decodedToken = decodedToken;
                this.isAnonymous = false;
            }
        }
    }
});

export default useAuthenticationStore;