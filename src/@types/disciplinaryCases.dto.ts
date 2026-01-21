import { ODataEntity, ODataResponse } from "./documents/base.types";
import { DisciplinaryLine } from "./disciplinaryLines.dto";

/**
 * @interface DisciplinaryCase
 * Disciplinary Case interface based on API Disciplinary structure (page 50865)
 */
export interface DisciplinaryCase {
  systemId: string;
  no: string;
  caseCategory: string;
  gdCode: string;
  disciplinaryCaseDescription: string;
  caseRegisteredByNo: string;
  caseRegisteredByName: string;
  employeeNo: string;
  indictedEmployeeNo: string;
  indictedEmployeeName: string;
  incidentDate: string;
  dateRaised: string;
  raisedByEmpNo: string;
  sendGrievanceTo: string;
  copyGrievancyTo: string;
  status: string;
  submitTo: string;
  dateSubmitted: string;
  investigationStartDate: string;
  withdrawalDate: string;
  resolutionDate: string;
  escalationDate: string;
  posted: boolean;
  type: string;
  disciplinaryLines?: DisciplinaryLine[];
}

export interface DisciplinaryCaseValue extends ODataEntity, DisciplinaryCase {}

export type DisciplinaryCaseResponse = ODataResponse<DisciplinaryCaseValue>;

/**
 * @interface DisciplinaryCaseFormData
 * Form data for creating/updating Disciplinary Case
 */
export interface DisciplinaryCaseFormData {
  no?: string;
  caseCategory: string;
  gdCode: string;
  disciplinaryCaseDescription: string;
  caseRegisteredByNo?: string;
  caseRegisteredByName?: string;
  employeeNo: string;
  indictedEmployeeNo?: string;
  indictedEmployeeName?: string;
  incidentDate: string;
  dateRaised: string;
  raisedByEmpNo?: string;
  sendGrievanceTo?: string;
  copyGrievancyTo?: string;
  status?: string;
  submitTo?: string;
  dateSubmitted?: string;
  investigationStartDate?: string;
  withdrawalDate?: string;
  resolutionDate?: string;
  escalationDate?: string;
  posted?: boolean;
  type?: string;
}

/**
 * @interface DisciplinaryCaseFormUpdate
 * Form data for updating Disciplinary Case
 */
export interface DisciplinaryCaseFormUpdate extends DisciplinaryCaseFormData {
  systemId: string;
}

/**
 * @interface DisciplinaryCaseSubmissionData
 * Data for submitting Disciplinary Case (excludes read-only fields)
 */
export interface DisciplinaryCaseSubmissionData {
  no?: string;
  caseCategory: string;
  gdCode: string;
  caseRegisteredByNo?: string;
  employeeNo: string;
  incidentDate: string;
  dateRaised: string;
  raisedByEmpNo?: string;
  sendGrievanceTo?: string;
  status?: string;
  submitTo?: string;
  type?: string;
}
