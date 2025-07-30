export interface IPALine {
  "@odata.etag": string;
  systemId: string;
  lineNo?: number;
  documentNo?: string;
  jobObjective?: string;
  keyPerformanceIndicators?: string;
  deliverables?: string;
  byWhichTargetDate?: string;
}
export interface IPA {
  "@odata.etag": string;
  systemId: string;
  no: string;
  documentType: string;
  employeeNo: string;
  employeeName: string;
  appraiser: string;
  departmentCode: string;
  postingDate: string;
  status: string;
  appraisalPeriod: string;
  appraisalCycle: string;
  performanceYear: number;
  convertToAppraisal: string;
  performanceType: string;
  stage: string;
  performanceAppraisalState: string;
  ipaLines: IPALine[];
}

// export interface IPAFormData {
//   No: string;
//   EmployeeNo: string;
//   Appraiser: string;
//   DepartmentCode: string;
//   PostingDate: string;
//   Status: string;
//   AppraisalPeriod: string;
//   ConvertToAppraisal: string;
//   PerformanceType: string;
//   Stage: string;
//   PerformanceAppraisalState: string;
// }
export type PartialIPAFormData = Partial<IPAFormData>;

export type PartialIPALineFormData = Partial<IPALineFormData>;

// export
export interface IPAResponse {
  "@odata.context": string;
  value: IPA[];
}

export interface IPALineResponse {
  "@odata.context": string;
  value: IPALine[];
}

// Enums for fixed values
export enum AppraisalPeriod {
  MID_YEAR = "Mid-Year Appraisal",
  FULL_YEAR = "Full-Year Appraisal",
  PROBATION = "Probation Appraisal",
}

export enum AppraisalCycle {
  FIRST = "1st Cycle",
  SECOND = "2nd Cycle",
  THIRD = "3rd Cycle",
  FOURTH = "4th Cycle",
}

export enum PerformanceType {
  IPA = "Individual Performance Agreement",
}

export enum Stage {
  APPRAISEE_RATING = "Appraisee Rating",
  SUPERVISOR_RATING = "Supervisor Rating",
  COMPLETED = "Completed",
}

// Form data interface for the IPA document
export interface IPAFormData {
  no?: string;
  employeeNo: string;
  appraiser: string;
  departmentCode: string;
  postingDate: string;
  status: string;
  appraisalPeriod: string;
  appraisalCycle: string;
  performanceYear: string;
  convertToAppraisal: string;
  performanceType: string;
  stage: string;
  performanceAppraisalState: string;
  systemId?: string;
}

// Form data interface for IPA lines
export interface IPALineFormData {
  jobObjective?: string;
  keyPerformanceIndicators?: string;
  deliverables?: string;
  byWhichTargetDate?: string;
  systemId?: string;
  lineNo?: number;
  documentNo?: string;
}

// State interface for managing IPA document state
export interface IPADocumentState {
  isLoading: boolean;
  error: string | null;
  ipaList: IPA[];
  currentIPA: IPA | null;
  ipaLines: IPALine[];
}

// Initial state for IPA document
export const initialIPADocumentState: IPADocumentState = {
  isLoading: false,
  error: null,
  ipaList: [],
  currentIPA: null,
  ipaLines: [],
};

// Initial line form data
export const initialIPALineFormData: IPALineFormData = {
  lineNo: 0,
  documentNo: "",
  jobObjective: "",
  deliverables: "",
  byWhichTargetDate: "",
  systemId: "",
};
