import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants.ts";

export interface SessionState {
  signedIn: boolean;
  token: string | null;
  bcToken: string | null;
  companyId: string;
}

const initialState: SessionState = {
  signedIn: false,
  bcToken: null,
  token: null,
  // companyId:'0a8f9887-59e6-ee11-a200-6045bdac9e2f'
  //! development companyId
  // companyId: "ea47417e-805f-ef11-bfe4-6045bd43ea3c",
  //! test companyId
  companyId: "ce611980-8097-ef11-8a6d-6045bd42628a",
  //! production companyId
  // companyId: "5219704f-f889-ef11-ac23-002248136f86",
};
const sessionSlice = createSlice({
  name: `${SLICE_BASE_NAME}/session`,
  initialState,
  reducers: {
    signInSuccess(state, action: PayloadAction<string>) {
      state.signedIn = true;
      state.token = action.payload;
      // state.bcToken = action.payload.bcToken;
    },
    bcTokenSuccess(state, action: PayloadAction<string>) {
      state.bcToken = action.payload;
    },
    signOutSuccess(state) {
      state.signedIn = false;
      state.token = null;
      state.bcToken = null;
      state.companyId = initialState.companyId;

      //clear local storage
    },
  },
});

export const { signInSuccess, signOutSuccess, bcTokenSuccess } =
  sessionSlice.actions;
export default sessionSlice.reducer;
