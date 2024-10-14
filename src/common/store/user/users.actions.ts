import { UserInformation } from './users.defs';
import { userStates } from './users.states';
import { useUserStore } from "./users.store";
const { setState } = useUserStore;

export const userAction = {
    async logIn(userInformation: UserInformation) {
        try {
            setState(userStates.logIn(userInformation));
            return userInformation;
        } catch (error) {
            return null;
        }
    },
    signOut() {
        setState(userStates.logOut());
    },
};