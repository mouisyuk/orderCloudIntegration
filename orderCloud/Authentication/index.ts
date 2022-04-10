import logIn  from "./login";
import register from './register';
import initMe from './initMe';

const useAuthentication = () => {
    return {
        logIn,
        register,
        initMe
    }
};

export default useAuthentication;