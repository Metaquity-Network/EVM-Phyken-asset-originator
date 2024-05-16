import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  value: WalletState;
};

type WalletState = {
  isWalletConnect: boolean;
  walletAddress: string;
};

const initialState: InitialState = {
  value: {
    isWalletConnect: false,
    walletAddress: '',
  },
};

export const WalletReducers = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    walletLogout: () => {
      return initialState;
    },
    walletLogin: (state, action: PayloadAction<string>) => {
      return {
        value: {
          isWalletConnect: true,
          walletAddress: action.payload,
        },
      };
    },
  },
});

export const { walletLogin, walletLogout } = WalletReducers.actions;
export default WalletReducers.reducer;
