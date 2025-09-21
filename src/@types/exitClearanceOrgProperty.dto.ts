import { ODataEntity, ODataResponse } from "./documents/base.types";

/**
 * @interface ExitClearanceOrgProperty
 * Exit Clearance Organizational Property Type
 */
export interface ExitClearanceOrgProperty {
  systemId: string;
  ExitClearanceNo: string;
  propertyCode: string;
  handover: boolean | string;
  propertyDescription: string;
  propertyCategory: string;
}

export interface ExitClearanceOrgPropertyValue
  extends ODataEntity,
    ExitClearanceOrgProperty {}

export type ExitClearanceOrgPropertyResponse =
  ODataResponse<ExitClearanceOrgPropertyValue>;

/**
 * @interface ExitClearanceOrgPropertyFormData
 * Form data for creating/updating Exit Clearance organizational property
 */
export interface ExitClearanceOrgPropertyFormData {
  ExitClearanceNo: string;  
  propertyCode: string;
  handover: boolean;
  propertyDescription?: string;
  propertyCategory?: string;
}

/**
 * @interface ExitClearanceOrgPropertyFormUpdate
 * Form data for updating Exit Clearance organizational property
 */
export interface ExitClearanceOrgPropertyFormUpdate
  extends ExitClearanceOrgPropertyFormData {
  systemId: string;
}
