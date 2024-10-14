import { UserSelectors } from './users.defs';
import { useUserStore } from './users.store';

export const usersSelectors: UserSelectors = {
    useState: () => useUserStore((state) => state),
    useUserInformation: () => useUserStore((state)=> state.userInformation),
};