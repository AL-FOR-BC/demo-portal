export interface GrievanceLine {
  systemId: string;
  lineNo: number;
  issueNo: string;
  entryType: string;
  description: string;
}

export interface GrievanceLineFormData {
  lineNo: number;
  issueNo: string;
  entryType: string;
  description: string;
}

export interface GrievanceLineFormUpdate extends GrievanceLineFormData {
  systemId: string;
}
