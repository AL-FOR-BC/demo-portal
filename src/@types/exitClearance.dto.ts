import { ODataEntity, ODataResponse } from "./documents/base.types";
import { ExitClearanceOrgProperty } from "./exitClearanceOrgProperty.dto";

/**
 * @interface StaffHandover
 * Exit Clearance Type
 */
export interface ExitClearance {
  systemId: string;
  no: string;
  employeeNo: string;
  employeeName: string;
  date: string;
  employmentDate?: string; // 1st Appointment in ROM field
  status: string;
  approvalDocumentType: string;
  orgarnizationUnit: string;
  organizationUnitName: string;
  positionCode: string;
  positionName: string;
  endDateOfServices: string;
  exitType: string;
  handoverDate: string;
  operationalSite: string;
  shortcutDimension1Code: string;
  shortcutDimension2Code: string;
  departmentCode: string;
  officialDocumentsHandedIn: boolean;
  handoverReportSubmitted: boolean;
  supervisorNo: string;
  supervisorName: string;
  housingLoan: string;
  personalLoan: string;
  hasLoan: boolean;
  loanAmount: string;
  hasSalaryAdvance: boolean;
  salaryAdvanceAmount: string;
  outstandingAccountabilities: string;
  interestAdjusted: boolean;
  takoverCommitmentEmployer: boolean;
  commitmentFrmAnother: boolean;
  payOutright: boolean;
  creditRiskManager: string;
  financeManager: string;
  financeManagerName: string;
  ictEquipReturned: boolean;
  deletionEmail: boolean;
  allSystemLoginDeleted: boolean;
  biometricAccessDeactivated: boolean;
  anyOtherSpecify: string;
  ictManagerNo: string;
  timeSheetForTheLastPeriod: boolean;
  informationRequiringPasswords: string;
  pendingActivitiesAndFuturePlan: string;
  identityCard: boolean;
  medicalCard: boolean;
  resignationAcceptance: boolean;
  computationSheet: string;
  otherStrategy: string;
  supervisorStage: string;
  financeStage: string;
  ictStage: string;
  creditStage: string;
  hrOfficerStage: string;
  adminStage: string;
  hrOfficerNo: string;
  hrOfficerName: string;
  ictManagerName: string;
  // Additional fields from the API
  admin?: string;
  adminName?: string;
  supervisorVerification?: boolean;
  // Head of Department fields
  headOfDepartmentNo?: string;
  headOfDepartmentName?: string;
  headOfDepartmentStage?: string;
  headOfDepartmentComments?: string;
  // HR Manager fields
  hrManagerNo?: string;
  hrManagerName?: string;
  hrManagerStage?: string;
  hrManagerFinalComments?: string;
  // Expanded organizational properties from the API
  exitClearanceOrgProperties?: ExitClearanceOrgProperty[];
}

export interface ExitClearanceValue extends ODataEntity, ExitClearance {}

export type ExitClearanceResponse = ODataResponse<ExitClearanceValue>;

/**
 * @interface StaffHandoverFormData
 * Form data for creating/updating Exit Clearance
 */
export interface ExitClearanceFormData {
  no?: string;
  employeeNo: string;
  employeeName?: string;
  date: string;
  employmentDate?: string; // 1st Appointment in ROM field
  status?: string;
  approvalDocumentType?: string;
  orgarnizationUnit?: string;
  organizationUnitName?: string;
  positionCode?: string;
  positionName?: string;
  endDateOfServices: string;
  exitType?: string;
  handoverDate?: string;
  operationalSite?: string;
  shortcutDimension1Code?: string;
  shortcutDimension2Code?: string;
  departmentCode?: string;
  officialDocumentsHandedIn: string;
  handoverReportSubmitted: string;
  supervisorNo?: string;
  supervisorName?: string;
  housingLoan: string;
  personalLoan: string;
  hasLoan: boolean;
  loanAmount: string;
  hasSalaryAdvance: boolean;
  salaryAdvanceAmount: string;
  outstandingAccountabilities: string;
  interestAdjusted: string;
  takoverCommitmentEmployer: string;
  commitmentFrmAnother: string;
  payOutright: string;
  creditRiskManager?: string;
  financeManager?: string;
  financeManagerName?: string;
  ictEquipReturned: string;
  deletionEmail: string;
  allSystemLoginDeleted: string;
  biometricAccessDeactivated: string;
  anyOtherSpecify: string;
  ictManagerNo?: string;
  ictManagerName?: string;
  timeSheetForTheLastPeriod?: string;
  informationRequiringPasswords?: string;
  pendingActivitiesAndFuturePlan?: string;
  identityCard: string;
  medicalCard: string;
  resignationAcceptance: string;
  computationSheet?: string;
  otherStrategy: string;
  supervisorStage?: string;
  financeStage?: string;
  ictStage?: string;
  creditStage?: string;
  hrOfficerStage?: string;
  adminStage?: string;
  hrOfficerNo?: string;
  hrOfficerName?: string;
  // Additional fields from the API
  admin?: string;
  adminName?: string;
  supervisorVerification?: string;
  // Head of Department fields
  headOfDepartmentNo?: string;
  headOfDepartmentName?: string;
  headOfDepartmentStage?: string;
  hodComments?: string;
  // HR Manager fields
  hrManagerNo?: string;
  hrManagerName?: string;
  hrManagerStage?: string;
  hrManagerFinalComments?: string;
  // Expanded organizational properties from the API
  staffHandoverOrgProperties?: ExitClearanceOrgProperty[];
  headOfDepartmentComments?: string;
}

/**
 * @interface StaffHandoverFormUpdate
 * Form data for updating Exit Clearance
 */
export interface ExitClearanceFormUpdate extends ExitClearanceFormData {
  systemId: string;
}
