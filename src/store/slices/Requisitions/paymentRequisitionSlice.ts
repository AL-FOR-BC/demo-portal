import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface paymentRequisitionState {
  isModalOpen: boolean;
  isModalLoading: boolean;
  isEdit: boolean;
}

const initialState: paymentRequisitionState = {
  isModalOpen: false,
  isModalLoading: false,
  isEdit: false,
};

const paymentRequisitionSlice = createSlice({
  name: "paymentRequisition",
  initialState,
  reducers: {
    openModalpaymentReq: (state) => {
      state.isModalOpen = true;
    },
    closeModalpaymentReq: (state) => {
      state.isModalOpen = false;
    },
    modelLoadingpaymentReq: (state, action: PayloadAction<boolean>) => {
      state.isModalLoading = action.payload;
    },
    editpaymentReqLine: (state, action: PayloadAction<boolean>) => {
      state.isEdit = action.payload;
    },
  },
});

export const {
  openModalpaymentReq,
  closeModalpaymentReq,
  modelLoadingpaymentReq,
  editpaymentReqLine,
} = paymentRequisitionSlice.actions;
export default paymentRequisitionSlice.reducer;
