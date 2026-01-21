import { ODataEntity, ODataResponse } from "./documents/base.types";

/**
 * @interface ExitInterview
 * Exit Interview Type
 */
export interface ExitInterview {
  systemId: string;
  no: string;
  date: string;
  employeeNo: string;
  employeeName: string;
  status: string;
  organizationUnitName: string;
  organizationUnit?: string; // Organization unit code field
  jobTitle: string;
  supervisorNo: string;
  supervisorName: string;
  durationOfService: string;
  anotherPosition: boolean;
  personalReasons: boolean;
  relocation: boolean;
  returnToSchool: boolean;
  others: boolean;
  attendance: boolean;
  violationOfCompanyPolicy: boolean;
  layOff: boolean;
  reorganization: boolean;
  positionEliminated: boolean;
  otherInvoultary: boolean;
  primaryReasonForLeaving: string;
  mostSatisfyingAboutJob: string;
  mostFrustratingAboutJob: string;
  romCouldPreventLeaving: string;
  positionCompatibleWithSkills: string;
  possibilityForAdvancement: string;
  trainingDevelopmentOffered: string;
  greatestChallengeInPosition: string;
  suggestionsForImprovement: string;
  motivatedToReachPeakPerformance: string;
  relationshipWithTeamAndSupervisor: string;
  improveStaffMoraleRetention: string;
  workingConditionsSuitable: string;
  payComparedToWorkload: string;
  additionalComments: string;
  generalEmployeeComments: string;
  generalInterviewerComments: string;
  documentType: string;
}

export interface ExitInterviewValue extends ODataEntity, ExitInterview {}

export type ExitInterviewResponse = ODataResponse<ExitInterviewValue>;

/**
 * @interface ExitInterviewFormData
 * Form data for creating/updating exit interview
 */
export interface ExitInterviewFormData {
  no?: string;
  date: string;
  employeeNo: string;
  employeeName?: string;
  status?: string;
  organizationUnitName?: string;
  organizationUnit?: string; // Organization unit code field
  jobTitle?: string;
  supervisorNo?: string;
  supervisorName?: string;
  durationOfService: string;
  anotherPosition: boolean;
  personalReasons: boolean;
  relocation: boolean;
  returnToSchool: boolean;
  others: boolean;
  attendance: boolean;
  violationOfCompanyPolicy: boolean;
  layOff: boolean;
  reorganization: boolean;
  positionEliminated: boolean;
  otherInvoultary: boolean;
  primaryReasonForLeaving: string;
  mostSatisfyingAboutJob: string;
  mostFrustratingAboutJob: string;
  romCouldPreventLeaving: string;
  positionCompatibleWithSkills: string;
  possibilityForAdvancement: string;
  trainingDevelopmentOffered: string;
  greatestChallengeInPosition: string;
  suggestionsForImprovement: string;
  motivatedToReachPeakPerformance: string;
  relationshipWithTeamAndSupervisor: string;
  improveStaffMoraleRetention: string;
  workingConditionsSuitable: string;
  payComparedToWorkload: string;
  additionalComments: string;
  generalEmployeeComments: string;
  generalInterviewerComments: string;
}

/**
 * @interface ExitInterviewFormUpdate
 * Form data for updating exit interview
 */
export interface ExitInterviewFormUpdate
  extends Partial<ExitInterviewFormData> {
  systemId: string;
  etag?: string;
}
