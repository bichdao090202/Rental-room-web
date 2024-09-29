import { Account } from './users.defs';
import { useUserStore } from "./users.store";
import { userService } from './users.service';
import {userStates} from "@/common/store/users/users.states";

const { setState } = useUserStore;

export const userAction = {
    async logIn(formAccount: Account) {
        try {
            const userInformation = await userService.logIn(formAccount);
            if (!userInformation) return false;
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