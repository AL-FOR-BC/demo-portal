import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface purchaseRequisitionState {
  isModalOpen: boolean;
  isModalLoading: boolean;
  isEdit: boolean;
}

const initialState: purchaseRequisitionState = {
  isModalOpen: false,
  isModalLoading: false,
  isEdit: false,
};

const purchaseRequisitionSlice = createSlice({
  name: "purchaseRequisition",
  initialState,
  reducers: {
    openModalPurchaseReq: (state) => {
      state.isModalOpen = true;
    },
    closeModalPurchaseReq: (state) => {
      state.isModalOpen = false;
    },
    modelLoadingPurchaseReq: (state, action: PayloadAction<boolean>) => {
      state.isModalLoading = action.payload;
    },
    editPurchaseReqLine: (state, action: PayloadAction<boolean>) => {
      state.isEdit = action.payload;
    },
  },
});

export const {
  openModalPurchaseReq,
  closeModalPurchaseReq,
  modelLoadingPurchaseReq,
  editPurchaseReqLine,
} = purchaseRequisitionSlice.actions;
export default purchaseRequisitionSlice.reducer;
