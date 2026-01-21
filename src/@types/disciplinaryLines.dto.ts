export interface DisciplinaryLine {
  systemId: string;
  lineNo: number;
  issueNo: string;
  entryType: string;
  description: string;
}

export interface DisciplinaryLineFormData {
  lineNo: number;
  issueNo: string;
  entryType: string;
  description: string;
}

export interface DisciplinaryLineFormUpdate extends DisciplinaryLineFormData {
  systemId: string;
}
