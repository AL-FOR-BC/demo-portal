import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiTravelRequests } from "../../../services/TravelRequestsService";
import {
  apiPaymentRequisition,
  apiPurchaseRequisition,
  apiStoreRequisition,
} from "../../../services/RequisitionServices";
import {
  apiApprovalToRequest,
  apiEmployees,
} from "../../../services/CommonServices";
import {
  formatDate,
  formatEmailDomain,
  formatEmailFirstPart,
} from "../../../utils/common";
import {
  Employee,
  // EmployeeData,
  PartialEmployee,
} from "../../../@types/employee.dto";
import { TimeSheetsService } from "../../../services/TimeSheetsService";
import { apiLeavePlans, leaveService } from "../../../services/LeaveServices";
import { ipaService } from "../../../services/IpaSerivces";
const SLICE_NAME = "userDashBoardData";
// const employeeGender= useAppSelector(state=> state.auth.user.employeeGender)
export type userDashBoardState = {
  pendingApprovals: number;
  leaveRequests: number;
  leavePlans: number;
  travelRequests: number;
  paymentRequests: number;
  pruchaseRequests: number;
  trainingRequests: number;
  appraisals: number;
  storeRequests: number;
};
export type LevaeDashBoarState = {
  leaveType: string;
  entitled: number;
  balance: number;
};
export type NotificationDate = {
  birthDate: string;
  birthdayIndividuals: string[];
  contractEndDate: string;
};

export type dashBoardState = {
  userDashBoardData: userDashBoardState;
  loading: boolean;
  leavalDashoardData: LevaeDashBoarState[];
  notificationDate: NotificationDate;
};

const initialState: dashBoardState = {
  userDashBoardData: {
    pendingApprovals: 0,
    leaveRequests: 0,
    leavePlans: 0,
    paymentRequests: 0,
    travelRequests: 0,
    pruchaseRequests: 0,
    trainingRequests: 0,
    appraisals: 0,
    storeRequests: 0,
  },
  leavalDashoardData: [
    {
      leaveType: "Annual",
      entitled: 0,
      balance: 0,
    },
    {
      leaveType: "Compassionate",
      entitled: 0,
      balance: 0,
    },
    {
      leaveType: "Sick",
      entitled: 0,
      balance: 0,
    },
    {
      leaveType: "Study",
      entitled: 0,
      balance: 0,
    },
    {
      leaveType: "Maternity",
      entitled: 0,
      balance: 0,
    },
    {
      leaveType: "Paternity",
      entitled: 0,
      balance: 0,
    },
  ],
  notificationDate: {
    birthDate: formatDate(new Date().toISOString()),
    birthdayIndividuals: [],
    contractEndDate: formatDate(new Date().toISOString()),
  },
  loading: false,
};

// const   getUserDashboardData = createAsyncThunk(
//     SLICE_NAME + '/getUserDashboardData',
//     async () => {
//         const response = await apiUserDashboardData<DashboardDataResponse>()
//         return response.data
//     }
// )
// export const fetchLeaveRequests = createAsyncThunk(
//     `${SLICE_NAME}/fetchLeaveRequests`,
//     async () => {
//         const

//         return response.data;
//     }
// );

export const fetchEmployeeData = createAsyncThunk(
  `${SLICE_NAME}/fetchEmployee`,
  async ({ companyId }: { companyId: string }) => {
    const response = await apiEmployees(companyId);
    const targetDate = new Date(); // This can be any date you want to check
    const targetDay = targetDate.getDate();
    const targetMonth = targetDate.getMonth() + 1; // Months are 0-indexed
    // const targetYear = targetDate.getFullYear();

    console.log(response);
    const employeesWithBirthdayToday = response.data.value.filter(
      (employee) => {
        const birthDate = new Date(employee.BirthDate);
        return (
          birthDate.getDate() === targetDay &&
          birthDate.getMonth() + 1 === targetMonth
        );
      }
    );

    return employeesWithBirthdayToday;
  }
);

export const fetchTravelRequests = createAsyncThunk(
  `${SLICE_NAME}/fetchTravelRequests`,
  async ({
    employeeNo,
    companyId,
  }: {
    employeeNo: string;
    companyId: string;
  }) => {
    const filterQuery = `$filter=requisitionedBy eq '${employeeNo}'`;
    const response = await apiTravelRequests(companyId, "GET", filterQuery);
    const travelRequestCount = response.data.value.length;
    return travelRequestCount;
  }
);

export const fetchPurchaseRequests = createAsyncThunk(
  `${SLICE_NAME}/fetchPurchaseRequests`,
  async ({
    employeeNo,
    companyId,
  }: {
    employeeNo: string;
    companyId: string;
  }) => {
    const filterQuery = `$filter=requestorNo eq '${employeeNo}'`;
    const response = await apiPurchaseRequisition(
      companyId,
      "GET",
      filterQuery
    );
    const purchaseRequisitionCount = response.data.value.length;
    return purchaseRequisitionCount;
  }
);

export const fetchPaymentRequests = createAsyncThunk(
  `${SLICE_NAME}/fetchPaymentRequest`,
  async ({
    employeeNo,
    companyId,
  }: {
    employeeNo: string;
    companyId: string;
  }) => {
    const filterQuery = `$filter=requisitionedBy eq '${employeeNo}'`;
    const response = await apiPaymentRequisition(companyId, "GET", filterQuery);
    const paymentRequisitionCount = response.data.value.length;
    return paymentRequisitionCount;
  }
);

export const fetchRequestToApprove = createAsyncThunk(
  `${SLICE_NAME}/fetchRequestToApprove`,
  async ({ companyId, email }: { companyId: string; email: string }) => {
    const filterQuery = `$filter=(UserEmail eq '${email}' or UserEmail eq '${email}' or UserEmail eq '${email.toUpperCase()}' or UserEmail eq '${formatEmailFirstPart(
      email
    )}' or UserEmail eq '${formatEmailDomain(email)}') and Status eq 'Open'`;
    const response = await apiApprovalToRequest(companyId, filterQuery);
    return response.data.value.length;
  }
);

export const fetchTimeSheetApproval = createAsyncThunk(
  `${SLICE_NAME}/fetchTimeSheetApproval`,
  async ({ companyId, email }: { companyId: string; email: string }) => {
    const filterQuery = `$filter=(approverEmailAddress eq '${email}' or approverEmailAddress eq '${email}' or approverEmailAddress eq '${email.toUpperCase()}' or approverEmailAddress eq '${formatEmailFirstPart(
      email
    )}' or approverEmailAddress eq '${formatEmailDomain(
      email
    )}')&$expand=timeSheetLines`;
    const response = await TimeSheetsService.getTimeSheetHeader(
      companyId,
      filterQuery
    );
    // if lines contain any line with status submitted if yes return the count
    const timeSheetWithSubmittedLines = response.data.value.filter(
      (timeSheet) =>
        timeSheet.timeSheetLines.some((line) => line.Status === "Submitted")
    );
    if (timeSheetWithSubmittedLines.length > 0) {
      return timeSheetWithSubmittedLines.length;
    }
    return 0;
  }
);

export const fetchStoreRequests = createAsyncThunk(
  `${SLICE_NAME}/fetchStoreRequests`,
  async ({
    companyId,
    employeeNo,
  }: {
    companyId: string;
    employeeNo: string;
  }) => {
    const filterQuery = `$filter=requestorNo eq '${employeeNo}'`;
    const response = await apiStoreRequisition(companyId, "GET", filterQuery);
    console.log(response);
    return response.data.value.length;
  }
);

export const fetchLeaveRequests = createAsyncThunk(
  `${SLICE_NAME}/fetchLeaveRequests`,
  async ({
    companyId,
    employeeNo,
  }: {
    companyId: string;
    employeeNo: string;
  }) => {
    const filterQuery = `$filter=employeeNo eq '${employeeNo}'`;
    const response = await leaveService.getLeaveRequests(
      companyId,
      filterQuery
    );
    return response.length;
  }
);

export const fetchLeavePlans = createAsyncThunk(
  `${SLICE_NAME}/fetchLeavePlans`,
  async ({
    companyId,
    employeeNo,
  }: {
    companyId: string;
    employeeNo: string;
  }) => {
    const filterQuery = `$filter=employeeNo eq '${employeeNo}'`;
    const response = await apiLeavePlans(companyId, "GET", filterQuery);
    return response.data.value.length;
  }
);
const dashBoardSlice = createSlice({
  name: `${SLICE_NAME}/dashboard`,
  initialState,
  reducers: {
    setLeaveBalance(state, action: PayloadAction<PartialEmployee>) {
      state.leavalDashoardData[0].entitled =
        action.payload.AnnualLeaveDaysEntitlement;
      state.leavalDashoardData[0].balance =
        action.payload.AnnualLeaveDaysEntitlement -
        action.payload.AnnualLeaveDaysUsed;

      state.leavalDashoardData[1].entitled =
        action.payload.CompationateLeaveEntitlement;
      state.leavalDashoardData[1].balance =
        action.payload.CompationateLeaveEntitlement -
        action.payload.CompassionateDaysUsed;

      state.leavalDashoardData[2].entitled =
        action.payload.SickLeaveEntitilement;
      state.leavalDashoardData[2].balance =
        action.payload.SickLeaveEntitilement - action.payload.SickLeaveDaysused;

      state.leavalDashoardData[3].entitled =
        action.payload.StudyLeaveEntitlement;
      state.leavalDashoardData[3].balance =
        action.payload.StudyLeaveEntitlement -
        action.payload.StudyLeaveDaysUsed;

      state.leavalDashoardData[4].entitled =
        action.payload.MaternityLeaveEntitilement;
      state.leavalDashoardData[4].balance =
        action.payload.MaternityLeaveEntitilement -
        action.payload.MaternityDaysUsed;

      state.leavalDashoardData[5].entitled =
        action.payload.PaternityLeaveEntitlement;
      state.leavalDashoardData[5].balance =
        action.payload.PaternityLeaveEntitlement -
        action.payload.PaternityDaysUsed;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTravelRequests.fulfilled, (state, action) => {
        state.userDashBoardData.travelRequests = action.payload;
        state.loading = false;
      })
      .addCase(fetchTravelRequests.pending, (state) => {
        state.loading = true;
      });

    builder
      .addCase(fetchPurchaseRequests.fulfilled, (state, action) => {
        state.userDashBoardData.pruchaseRequests = action.payload;
        state.loading = false;
      })
      .addCase(fetchPurchaseRequests.pending, (state) => {
        state.loading = true;
      });

    builder
      .addCase(fetchPaymentRequests.fulfilled, (state, action) => {
        state.userDashBoardData.paymentRequests = action.payload;
      })
      .addCase(fetchPaymentRequests.pending, (state) => {
        state.loading = true;
      });
    builder
      .addCase(
        fetchEmployeeData.fulfilled,
        (state, action: PayloadAction<Employee[]>) => {
          state.notificationDate.birthdayIndividuals = action.payload.map(
            (employee) => employee.FirstName + " " + employee.LastName
          );
          state.notificationDate.birthDate = formatDate(
            new Date().toISOString()
          );
        }
      )
      .addCase(fetchEmployeeData.pending, (state) => {
        state.loading = true;
      });

    builder
      .addCase(fetchRequestToApprove.fulfilled, (state, action) => {
        state.userDashBoardData.pendingApprovals = action.payload;
      })
      .addCase(fetchRequestToApprove.pending, (state) => {
        state.loading = true;
      });

    builder
      .addCase(fetchTimeSheetApproval.fulfilled, (state, action) => {
        // incrementt the pendingApprovals by the action payload
        state.userDashBoardData.pendingApprovals += action.payload;
      })
      .addCase(fetchTimeSheetApproval.pending, (state) => {
        state.loading = true;
      });
    builder
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.userDashBoardData.leaveRequests = action.payload;
      })
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.loading = true;
      });

    builder
      .addCase(fetchStoreRequests.fulfilled, (state, action) => {
        state.userDashBoardData.storeRequests = action.payload;
        state.loading = false;
      })
      .addCase(fetchStoreRequests.pending, (state) => {
        state.loading = true;
      });

    builder
      .addCase(fetchLeavePlans.fulfilled, (state, action) => {
        state.userDashBoardData.leavePlans = action.payload;
        state.loading = false;
      })
      .addCase(fetchLeavePlans.pending, (state) => {
        state.loading = true;
      });
  },
});

export const { setLeaveBalance } = dashBoardSlice.actions;

export default dashBoardSlice.reducer;
