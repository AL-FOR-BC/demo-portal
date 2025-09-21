import { ReactElement } from "react";

export interface DocumentCountSummaryTypes {
  title: string;
  value: number;
  icon: ReactElement;
  url: string;
}

export interface PostedPayrollHeader {
  systemId: string;
  payrollId: string;
  payrollMonth: string;
  payrollYear: string;
  employeeNo: string;
  firstName: string;
  lastName: string;
  calculated: boolean;
  basicPay: number;
}

export interface PostedPayrollHeadersResponse {
  "@odata.context": string;
  value: PostedPayrollHeader[];
}
