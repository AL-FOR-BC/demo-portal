import { ODataEntity, ODataResponse } from "./documents/base.types";

/**
 * @interface GrievanceCase
 * Grievance Case interface based on API Grievances structure (page 50842)
 */
export interface GrievanceCase {
  systemId: string;
  no: string;
  caseCategory: string;
  gdCode: string;
  disciplinaryCaseDescription: string;
  caseRegisteredByNo: string;
  caseRegisteredByName: string;
  employeeNo: string;
  nameOfIndicted: string;
  incidentDate: string;
  dateRaised: string;
  sendGrievanceTo: string;
  copyGrievancyTo: string;
  status: string;
  witnesses: string;
  investigators: string;
  submitTo: string;
  dateSubmitted: string;
  investigationStartDate: string;
  withdrawalDate: string;
  resolutionDate: string;
  escalationDate: string;
  posted: boolean;
  type: string;
  natureOfGrievance: string;
  processType: string;
  complainantFeedback: string;
  complainantSatisfaction: string;
  grievanceLines?: any[];
}

export interface GrievanceCaseValue extends ODataEntity, GrievanceCase {}

export type GrievanceCaseResponse = ODataResponse<GrievanceCaseValue>;

/**
 * @interface GrievanceCaseFormData
 * Form data for creating/updating Grievance Case
 */
export interface GrievanceCaseFormData {
  no?: string;
  caseCategory: string;
  gdCode: string;
  disciplinaryCaseDescription: string;
  caseRegisteredByNo?: string;
  caseRegisteredByName?: string;
  employeeNo: string;
  nameOfIndicted?: string;
  incidentDate: string;
  dateRaised: string;
  sendGrievanceTo?: string;
  copyGrievancyTo?: string;
  status?: string;
  witnesses?: string;
  investigators?: string;
  submitTo?: string;
  dateSubmitted?: string;
  investigationStartDate?: string;
  withdrawalDate?: string;
  resolutionDate?: string;
  escalationDate?: string;
  posted?: boolean;
  type?: string;
  natureOfGrievance?: string;
  processType?: string;
  complainantFeedback?: string;
  complainantSatisfaction?: string;
}

/**
 * @interface GrievanceCaseFormUpdate
 * Form data for updating Grievance Case
 */
export interface GrievanceCaseFormUpdate extends GrievanceCaseFormData {
  systemId: string;
}
