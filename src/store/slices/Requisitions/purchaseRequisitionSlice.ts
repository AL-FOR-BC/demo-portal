import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface purchaseRequisitionState {
  isModalOpen: boolean;
  isModalLoading: boolean;
  isEdit: boolean;
  isModalRequisition: boolean;
  isModalRequisitionLoading: boolean;
}

const initialState: purchaseRequisitionState = {
  isModalOpen: false,
  isModalLoading: false,
  isEdit: false,
  isModalRequisition: false,
  isModalRequisitionLoading: false,
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
    editRequisitionLine: (state, action: PayloadAction<boolean>) => {
      state.isEdit = action.payload;
    },
    openModalRequisition: (state) => {
      state.isModalRequisition = true;
    },
    closeModalRequisition: (state) => {
      state.isModalRequisition = false;
    },
    modelLoadingRequisition: (state, action: PayloadAction<boolean>) => {
      state.isModalRequisitionLoading = action.payload;
    },
  },
});

export const {
  openModalPurchaseReq,
  closeModalPurchaseReq,
  modelLoadingPurchaseReq,
  editRequisitionLine,
  openModalRequisition,
  closeModalRequisition,
  modelLoadingRequisition,
} = purchaseRequisitionSlice.actions;
export default purchaseRequisitionSlice.reducer;
