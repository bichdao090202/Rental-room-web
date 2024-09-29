export interface Account {
    username: string;
    password: string;
}

export interface UserInformation {
    userId: number;
    username: string;
}

export interface UserState {
    userInformation?: UserInformation;
}

export interface UserSelectors {
    useState(): UserState,
    useUserInformation(): UserInformation | undefined;
}