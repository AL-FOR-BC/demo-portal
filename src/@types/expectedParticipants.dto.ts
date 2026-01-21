export interface ExpectedParticipant {
  systemId?: string;
  trainingNo?: string; // Training plan number
  trainingNeed?: string; // Performance gap/description
  no?: string; // Employee number
  lineNo?: number; // Training plan line number
  programCode?: string; // Program code (ETH, etc.)
  name?: string; // Employee name (read-only)
  email?: string; // Employee email (read-only)
  attended?: boolean; // Whether employee attended
  dateOfImpact?: string; // Date of impact (read-only)
  systemCreatedAt?: string;
  systemCreatedBy?: string;
  systemModifiedAt?: string;
  systemModifiedBy?: string;
  "@odata.etag"?: string;
}

export interface ExpectedParticipantFormData {
  trainingNo: string;
  trainingNeed: string;
  no: string;
  lineNo: number;
  attended: boolean;
}
