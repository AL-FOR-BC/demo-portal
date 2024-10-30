import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {SLICE_BASE_NAME} from "./constants.ts";

export interface LayoutState {
    layoutName: string
    topBar: string
}

const initialState:LayoutState = {
    layoutName:'horizontal',
    topBar:'light'
}

export const layoutSlice = createSlice({
    name: `${SLICE_BASE_NAME}/layout`,
    initialState,
    reducers: {
        setLayout: (state: LayoutState, action: PayloadAction<LayoutState>) => {
            state.layoutName = action.payload.layoutName;
        },
    },
});

export const { setLayout } = layoutSlice.actions;
export default layoutSlice.reducer;