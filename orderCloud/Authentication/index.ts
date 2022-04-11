import ocLogIn  from "./ocLogin";
import ocRegister from './ocRegister';

const useOcAuthentication = () => ({
    ocLogIn,
    ocRegister
});

export default useOcAuthentication;