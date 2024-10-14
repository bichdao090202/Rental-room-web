export interface UserInformation {
    id: number;
    full_name: string;
    img_url: string
}

export interface UserState {
    userInformation?: UserInformation;
}

export interface UserSelectors {
    useState(): UserState,
    useUserInformation(): UserInformation | undefined;
}