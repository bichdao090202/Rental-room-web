import {create} from 'zustand';
import { devtools, persist  } from 'zustand/middleware';
import { UserState} from './users.defs';
import { userStateInit } from './users.states';
import { mountStoreDevtool } from 'simple-zustand-devtools';

export const useUserStore = create<UserState>()(
    devtools(
        persist(
            () => ({
                ...userStateInit,
            }),
            { name: "UserStore" }
        )
    )
);

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('UsersStore', useUserStore);
}
