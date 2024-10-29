


export const createTransaction = async (userId: number, type:string, data: any) => {
    if (!userId) {
        throw new Error("User ID is required");
    }


}