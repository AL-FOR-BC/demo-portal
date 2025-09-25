import { ODataEntity, ODataResponse } from "./documents/base.types";

/**
 * @interface DisciplinaryType
 * Disciplinary Type interface based on API Grievances Types structure (page 50843)
 */
export interface DisciplinaryType {
  systemId: string;
  type: string;
  disciplinaryCategory: string;
  code: string;
  description: string;
  firstOffence: string;
  secondOffence: string;
  thirdOffence: string;
  fourthOffence: string;
}

export interface DisciplinaryTypeValue extends ODataEntity, DisciplinaryType {}

export type DisciplinaryTypeResponse = ODataResponse<DisciplinaryTypeValue>;

/**
 * @interface DisciplinaryTypeFormData
 * Form data for creating/updating Disciplinary Type
 */
export interface DisciplinaryTypeFormData {
  type: string;
  disciplinaryCategory: string;
  code: string;
  description: string;
  firstOffence?: string;
  secondOffence?: string;
  thirdOffence?: string;
  fourthOffence?: string;
}

/**
 * @interface DisciplinaryTypeFormUpdate
 * Form data for updating Disciplinary Type
 */
export interface DisciplinaryTypeFormUpdate extends DisciplinaryTypeFormData {
  systemId: string;
}
