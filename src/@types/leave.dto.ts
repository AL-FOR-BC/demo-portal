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
}
