import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface modalsState {
  isModalOpen: boolean;
  isModalLoading: boolean;
  isEdit: boolean;
}

const initialState: modalsState = {
  isModalOpen: false,
  isModalLoading: false,
  isEdit: false,
};

const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    modelLoading: (state, action: PayloadAction<boolean>) => {
      state.isModalLoading = action.payload;
    },
    editLine: (state, action: PayloadAction<boolean>) => {
      state.isEdit = action.payload;
    },
  },
});

export const { openModal, closeModal, modelLoading, editLine } =
  modalsSlice.actions;
export default modalsSlice.reducer;
