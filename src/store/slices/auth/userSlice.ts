import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants.ts";

export type UserState = {
  email: string;
  employeeName?: string;
  employeeDepartment?: string;
  employeeGender?: string;
  jobTitle?: string;
  verified?: boolean;
  employeeNo?: string;
  nameAbbrev?: string;
  isAdmin?: boolean;
  isBcAdmin?: boolean;
};
export type userData = {
  employeeName: string;
  employeeDepartment: string;
  employeeGender: string;
  jobTitle: string;
  nameAbbrev: string;
};
const initialState: UserState = {
  email: "",
  verified: false,
  employeeNo: "",
  employeeName: "",
  employeeDepartment: "",
  employeeGender: "",
  jobTitle: "",
  isAdmin: false,
  isBcAdmin: false,
};

const userSlice = createSlice({
  name: `${SLICE_BASE_NAME}/user`,
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.email = action.payload?.email;
      state.verified = action.payload.verified;
    },
    setEmployeeNo: (state, action: PayloadAction<string>) => {
      state.employeeNo = action.payload;
    },

    setEmployeeData: (state, action: PayloadAction<userData>) => {
      state.employeeName = action.payload.employeeName;
      state.employeeDepartment = action.payload.employeeDepartment;
      state.employeeGender = action.payload.employeeGender;
      state.jobTitle = action.payload.jobTitle;
      state.nameAbbrev = action.payload.nameAbbrev;
    },
    setAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
    },
    setBcAdmin: (state, action: PayloadAction<boolean>) => {
      state.isBcAdmin = action.payload;
    },
  },
});

export const { setUser, setEmployeeNo, setEmployeeData, setAdmin, setBcAdmin } = userSlice.actions;

export default userSlice.reducer;
