import { ODataEntity } from "./documents/base.types";

export interface LeavePlanLine {
  "@odata.etag": string;
  SystemId: string;
  documentType: string;
  documentNo: string;
  hRYear: string;
  lineNo: number;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  quantity: number;
  unitofMeasure: string;
  description: string;
}

export interface LeavePlan {
  "@odata.context": string;
  value: Array<{
    "@odata.etag": string;
    systemId: string;
    documentNo: string;
    documentType: string;
    employeeNo: string;
    employeeName: string;
    shortcutDimension1Code: string;
    postingDate: string;
    status: string;
    delegate: string;
    leavePlanLines: LeavePlanLine[];
  }>;
}

export interface LeavePlanResponse {
  "@odata.context": string;
  value: Array<{
    "@odata.etag": string;
    systemId: string;
    documentNo: string;
    documentType: string;
    employeeNo: string;
    employeeName: string;
    shortcutDimension1Code: string;
    postingDate: string;
    status: string;
    delegate: string;
    leavePlanLines: LeavePlanLine[];
  }>;
}
export interface LeavePlanResponseSingle {
  "@odata.context": string;
  "@odata.etag": string;
  systemId: string;
  documentNo: string;
  documentType: string;
  employeeNo: string;
  employeeName: string;
  shortcutDimension1Code: string;
  postingDate: string;
  status: string;
  delegate: string;
  leavePlanLines: LeavePlanLine[];
}

// --------------------------------- leave request ---------------------------------

export interface LeaveRequest {
  "@odata.etag": string;
  systemId: string;
  documentNo: string;
  employeeNo: string;
  employeeName: string;
  employeeTitle: string;
  telephoneNumber: string;
  status: string;
  leaveAddress: string;
  organisationUnit: string;
  leaveCategoryType: string;
  postingDate: string;
  fromDate: string;
  toDate: string;
  noofDays: number;
  postingDescription: string;
  shortcutDimension1Code: string;
  annualLeaveWS: "Yes" | "No";
  sickLeaveWS: "Yes" | "No";
  maternityLeaveWS: "Yes" | "No";
  paternityLeaveWS: "Yes" | "No";
  compassionateLeaveWS: "Yes" | "No";
  studyLeaveWS: "Yes" | "No";
  othersWS: "Yes" | "No";
  specifyOtherLeave: string;
  unpaidLeaveWS: "Yes" | "No";
  leaveDuePreviousYear: number;
  leaveDueCurrentYear: number;
  totalDue: number;
  totalDays: number;
  noOfDaysAppliedfo: number;
  balance: number;
  returnDate: string;
  leaveinLinewithRoster: boolean;
  documentDate: string;
  delegate: string;
}
