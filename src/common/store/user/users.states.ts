import {UserState, UserInformation, User, Table} from '.'


export const userStateInit: UserState = {
    userInformation: undefined,
};
export const userStates = {
    logIn: (userInformation: UserInformation): UserState => {
        return {
            userInformation,
            status: 'auth',
            updateUser: undefined,
            table: tableInit
        };
    },
    logOut: (): UserState => {
        return {
            ...userStateInit,
        };
    },
};