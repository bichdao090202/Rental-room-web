import { Account } from '.';

export const userService = {
    logIn: async (formAccount: Account) => {
        console.log(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/sign-in`);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`, {
            method: "POST",
            body: JSON.stringify(formAccount),
            headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();
        if (!res.ok)
            return false;
        else
            return user.data.userInformation;

    },
};