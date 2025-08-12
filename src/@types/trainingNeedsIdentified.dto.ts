export interface TrainingNeedsIdentified {
  "@odata.etag": string;
  systemId: string;
  documentNo?: string;
  lineNo?: number;
  skillGapNeed?: string;
  typeOfTraining?: string;
  linkageToPerformance?: string;
}

export interface TrainingNeedsIdentifiedFormData {
  documentNo?: string;
  lineNo?: number;
  skillGapNeed?: string;
  typeOfTraining?: string;
  linkageToPerformance?: string;
  systemId?: string;
}

export type PartialTrainingNeedsIdentifiedFormData =
  Partial<TrainingNeedsIdentifiedFormData>;

// API Response
export interface TrainingNeedsIdentifiedResponse {
  "@odata.context": string;
  value: TrainingNeedsIdentified[];
}
