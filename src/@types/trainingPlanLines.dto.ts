export interface TrainingPlanLine {
  systemId?: string;
  lineNo?: number;
  planNo?: string; // Link to training plan
  performanceGap: string;
  category:
    | "Certificate"
    | "Coaching"
    | "Conference"
    | "Seminars"
    | "Workshops"
    | "Course";
  programCode: string;
  programDescription?: string;
  trainingGroup?: string; // Organization Unit code
  deliveryMethod?: "On the job" | "Internal" | "External";
  coach?: string; // Employee code for internal delivery
  trainingProvider?: string; // Vendor code for external delivery
  trainingLocation?: string; // Venue code
  plannedStartDate?: string;
  plannedEndDate?: string;
  expectedParticipants?: number;
  estimatedUnitCost?: number;
  estimatedTotalCost?: number;
  "@odata.etag"?: string;
}

export interface ProfessionalCertificate {
  systemId: string;
  code: string;
  description: string;
  unitCost: number;
  score: number;
}

export interface Coaching {
  systemId: string;
  code: string;
  description: string;
  unitCost: number;
}

export interface Conference {
  systemId: string;
  code: string;
  description: string;
  unitCost: number;
  trainingType: string;
}

export interface Course {
  systemId: string;
  code: string;
  title: string;
  description: string;
  type: string;
  attachmentNo?: string;
  status: string;
  unitCost: number;
  exam?: string;
  archived: boolean;
}

export interface OrganisationUnit {
  systemId: string;
  code: string;
  orgUnitName: string;
}

export interface Venue {
  systemId: string;
  code: string;
  name: string;
  location: string;
  vendor?: string;
}

export interface Employee {
  systemId: string;
  employeeId: string;
  fullName: string;
  email?: string;
  department?: string;
}

export interface Vendor {
  systemId: string;
  vendorCode: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
}
