export interface SubordinateStrengthsWeaknesses {
  "@odata.etag": string;
  systemId: string;
  documentNo?: string;
  lineNo?: number;
  evaluationType?: string;
  category?: string;
  description?: string;
}

export interface SubordinateStrengthsWeaknessesFormData {
  documentNo?: string;
  lineNo?: number;
  evaluationType?: string;
  category?: string;
  description?: string;
  systemId?: string;
}

export type PartialSubordinateStrengthsWeaknessesFormData =
  Partial<SubordinateStrengthsWeaknessesFormData>;

// API Response
export interface SubordinateStrengthsWeaknessesResponse {
  "@odata.context": string;
  value: SubordinateStrengthsWeaknesses[];
}
