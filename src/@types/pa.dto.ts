export interface PALine {
  "@odata.etag": string;
  systemId: string;
  lineNo?: number;
  documentNo?: string;
  jobObjective?: string;
  keyPerformanceIndicator?: string;
  initiative?: string;
  measuresDeliverables?: string;
  byWhichTargetDate?: string;
  targetValue?: string;
  actualValue?: string;
  rating?: number;
  comments?: string;
  limitingFactor?: string;
  enhancedPerformance?: string;
  appraiseeRating?: number;
  appraiseeScore?: number;
  appraiserRating?: number;
  agreedScore?: number;
  agreedActionsInterventions?: string;
}

export interface PA {
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
  appraisalType: string;
  stage: "Performance Planning" | "Appraisee Rating" | "Appraiser Rating" | "Closed" | "Cancelled";
  performanceAppraisalState: string;
  paLines: PALine[];
}

export interface PAFormData {
  no?: string;
  employeeNo: string;
  appraiser: string;
  departmentCode: string;
  postingDate: string;
  status: string;
  appraisalPeriod: string;
  appraisalType: string;
  stage: "Performance Planning" | "Appraisee Rating" | "Appraiser Rating" | "Closed" | "Cancelled";
  performanceAppraisalState: string;
}

export type PartialPAFormData = Partial<PAFormData>;

export type PartialPALineFormData = Partial<PALineFormData>;

// export
export interface PAResponse {
  "@odata.context": string;
  value: PA[];
}

export interface PALineResponse {
  "@odata.context": string;
  value: PALine[];
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

export enum AppraisalType {
  PA = "Performance Appraisal",
}

export enum Stage {
  APPRAISEE_RATING = "Appraisee Rating",
  SUPERVISOR_RATING = "Supervisor Rating",
  COMPLETED = "Completed",
}

// Form data interface for the PA document
export interface PAFormData {
  no?: string;
  employeeNo: string;
  appraiser: string;
  departmentCode: string;
  postingDate: string;
  status: string;
  appraisalPeriod: string;
  appraisalCycle: string;
  performanceYear: string;
  appraisalType: string;
  stage:
    | "Performance Planning"
    | "Appraisee Rating"
    | "Appraiser Rating"
    | "Closed"
    | "Cancelled";
  performanceAppraisalState: string;
  systemId?: string;
}

// Form data interface for PA lines
export interface PALineFormData {
  jobObjective?: string;
  keyPerformanceIndicator?: string;
  initiative?: string;
  measuresDeliverables?: string;
  byWhichTargetDate?: string;
  targetValue?: string;
  actualValue?: string;
  comments?: string;
  systemId?: string;
  lineNo?: number;
  documentNo?: string;
  limitingFactor?: string;
  enhancedPerformance?: string;
  appraiseeRating?: number;
  appraiseeScore?: number;
  appraiserRating?: number;
  agreedScore?: number;
  agreedActionsInterventions?: string;
}

// State interface for managing PA document state
export interface PADocumentState {
  isLoading: boolean;
  error: string | null;
  paList: PA[];
  currentPA: PA | null;
  paLines: PALine[];
}

// Initial state for PA document
export const initialPADocumentState: PADocumentState = {
  isLoading: false,
  error: null,
  paList: [],
  currentPA: null,
  paLines: [],
};

// Initial line form data
export const initialPALineFormData: PALineFormData = {
  lineNo: 0,
  documentNo: "",
  jobObjective: "",
  keyPerformanceIndicator: "",
  initiative: "",
  measuresDeliverables: "",
  byWhichTargetDate: "",
  targetValue: "",
  actualValue: "",
  comments: "",
  systemId: "",
  limitingFactor: "",
  enhancedPerformance: "",
  appraiseeRating: 0,
  appraiseeScore: 0,
  appraiserRating: 0,
  agreedScore: 0,
  agreedActionsInterventions: "",
};
