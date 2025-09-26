import { ODataEntity, ODataResponse } from "./documents/base.types";

/**
 * @interface TrainingPlanLine
 * Training Plan Line Type
 */
export interface TrainingPlanLine {
  systemId: string;
  lineNo: number;
  planNo: string;
  performanceGap: string;
  developmentArea: string;
  trainingNeed: string;
  trainingObjective: string;
  deliveryMethod: string;
  trainingProvider: string;
  coach: string;
  trainingGroup: string;
  groupDescription: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  trainingHours: number;
  actualTrainingCost?: number;
  expectedParticipants: number;
  suggestedParticipants: number;
  train: string;
  schedule: string;
  estimatedUnitCost: number;
  estimatedTotalCost: number;
  status: string;
  proposedTraining: string;
}

/**
 * @interface TrainingPlan
 * Training Plan Type
 */
export interface TrainingPlan {
  systemId: string;
  no: string;
  empId: string;
  directorate: string;
  businessUnit: string;
  totalCost: number;
  status: string;
  department: string;
  completed: boolean;
  trainingDescription: string;
  shortcutDimension1Code: string;
  shortcutDimension2Code: string;
  employeeId?: string;
  employeeName?: string; // Read-only field for display
  organizationUnit?: string;
  projectCode?: string;
  donorCode?: string;
  // Expanded training plan lines from the API
  trainingPlanLines?: TrainingPlanLine[];
}

export interface TrainingPlanValue extends ODataEntity, TrainingPlan {}

export type TrainingPlanResponse = ODataResponse<TrainingPlanValue>;

/**
 * @interface TrainingPlanFormData
 * Form data for creating/updating training plan
 */
export interface TrainingPlanFormData {
  no?: string;
  empId: string;
  directorate?: string;
  businessUnit?: string;
  totalCost?: number;
  status?: string;
  department?: string;
  completed?: boolean;
  trainingDescription: string;
  shortcutDimension1Code?: string;
  shortcutDimension2Code?: string;
  employeeId?: string;
  organizationUnit?: string;
  projectCode?: string;
  donorCode?: string;
}

/**
 * @interface TrainingPlanFormUpdate
 * Form data for updating training plan
 */
export interface TrainingPlanFormUpdate extends TrainingPlanFormData {
  systemId: string;
}

/**
 * @interface TrainingPlanLineFormData
 * Form data for creating/updating training plan line
 */
export interface TrainingPlanLineFormData {
  lineNo?: number;
  planNo: string;
  performanceGap: string;
  developmentArea: string;
  trainingNeed: string;
  trainingObjective: string;
  deliveryMethod: string;
  trainingProvider?: string;
  coach?: string;
  trainingGroup?: string;
  groupDescription?: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  trainingHours?: number;
  actualTrainingCost?: number;
  expectedParticipants: number;
  suggestedParticipants?: number;
  train?: string;
  schedule?: string;
  estimatedUnitCost?: number;
  estimatedTotalCost?: number;
  status?: string;
  proposedTraining: string;
}

/**
 * @interface TrainingPlanLineFormUpdate
 * Form data for updating training plan line
 */
export interface TrainingPlanLineFormUpdate extends TrainingPlanLineFormData {
  systemId: string;
}
