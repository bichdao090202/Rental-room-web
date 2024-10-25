import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export interface TransactionState {
  data: any;  
  type: string;
  updateData: (newData: any, newType: string) => void;
}

const transactionStateInit: TransactionState = {
  data: null,  
  type: '',
  updateData: () => {},  
};

export const useTransactionStore = create<TransactionState>()(
  devtools(
    persist(
      (set) => ({
        ...transactionStateInit,
        updateData: (newData: any, newType: string) =>
          set({ data: newData, type: newType }),
      }),
      {
        name: 'TransactionStore',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

if (process.env.NODE_ENV === 'development') {
  import('simple-zustand-devtools').then(({ mountStoreDevtool }) => {
    mountStoreDevtool('TransactionStore', useTransactionStore);
  });
}
