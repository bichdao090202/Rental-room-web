import { UserInformation, UserState } from "./users.defs";

export const userStateInit: UserState = {
    userInformation: undefined,
};
export const userStates = {
    logIn: (userInformation: UserInformation): UserState => {
        return {
            userInformation,
        };
    },
    logOut: (): UserState => {
        return {
            ...userStateInit,
        };
    },
};