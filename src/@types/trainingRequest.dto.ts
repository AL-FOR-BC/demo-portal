export interface TrainingRequest {
  systemId: string;
  no: string;
  employeeNo: string;
  employeeName?: string; // Display-only field, not in API
  internalExternal: string;
  type: string;
  code: string;
  postingDate: string;
  skillsToBeImparted: string;
  plannedStartDate: string;
  plannedEndDate: string;
  description: string;
  trainingRoom: string;
  trainingProvider: string;
  plannedStartTime: string;
  plannedEndTime: string;
  cost: number;
  skillGap: string;
  status: string;
  perDiemAmountIfNeeded: number;
  "@odata.etag": string;
}

export interface TrainingRequestFormData {
  no?: string;
  employeeNo: string;
  employeeName?: string; // Display-only field, not sent to API
  internalExternal: string;
  type: string;
  code: string;
  postingDate: string;
  skillsToBeImparted: string;
  plannedStartDate: string;
  plannedEndDate: string;
  description: string;
  trainingRoom: string;
  trainingProvider: string;
  plannedStartTime: string;
  plannedEndTime: string;
  cost: number;
  skillGap: string;
  status: string;
  perDiemAmountIfNeeded: number;
}

export interface TrainingRequestFormUpdate extends TrainingRequestFormData {
  systemId: string;
}
