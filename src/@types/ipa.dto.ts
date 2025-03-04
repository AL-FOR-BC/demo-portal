export interface IPALine {
  "@odata.etag": string;
  SystemId: string;
  LineNo: number;
  DocumentNo: string;
  Perspective: string;
  StrategicObjectiveCode: string;
  strategicObjective: string;
  individualObjective: string;
  Initiatives: string;
  Measures: string;
  TargetDate: string;
  Weights: number;
}

export interface IPA {
  "@odata.etag": string;
  SystemId: string;
  No: string;
  DocumentType: string;
  EmployeeNo: string;
  Appraiser: string;
  DepartmentCode: string;
  PostingDate: string;
  Status: string;
  AppraisalPeriod: string;
  appraisalCycle: string;
  PerformanceYear: number;
  ConvertToAppraisal: string;
  PerformanceType: string;
  Stage: string;
  PerformanceAppraisalState: string;
  ipaLines: IPALine[];
}

export interface PIPAFormData {
  No: string;
  EmployeeNo: string;
  Appraiser: string;
  DepartmentCode: string;
  PostingDate: string;
  Status: string;
  AppraisalPeriod: number;
  ConvertToAppraisal: string;
  PerformanceType: string;
  Stage: string;
  PerformanceAppraisalState: string;
}
export type PartialPIPAFormData = Partial<PIPAFormData>;

export interface IPAResponse {
  "@odata.context": string;
  value: IPA[];
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
  documentNo?: string;
  employeeNo?: string;
  appraiser?: string;
  departmentCode?: string;
  postingDate?: string;
  status?: string;
  appraisalPeriod?: string;
  appraisalCycle?: string;
  performanceYear?: number;
  convertToAppraisal?: string;
  performanceType?: string;
  stage?: string;
  performanceAppraisalState?: string;
  systemId?: string;
}

// Form data interface for IPA lines
export interface IPALineFormData {
  lineNo?: number;
  documentNo?: string;
  perspective?: string;
  strategicObjectiveCode?: string;
  strategicObjective?: string;
  individualObjective?: string;
  initiatives?: string;
  measures?: string;
  targetDate?: string;
  weights?: number;
  systemId?: string;
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
  perspective: "",
  strategicObjectiveCode: "",
  strategicObjective: "",
  individualObjective: "",
  initiatives: "",
  measures: "",
  targetDate: "",
  weights: 0,
  systemId: "",
};
