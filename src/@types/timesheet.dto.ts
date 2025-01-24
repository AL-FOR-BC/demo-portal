export interface TimeSheetType {
  no: string;
  startingDate: string;
  endingDate: string;
  description: string;
  resourceNo: string;
  total: number;
  open: number;
  submitted: number;
  approved: number;
  rejected: number;
  comment?: string;
}

export interface TimeSheetLine {
  systemId: string;
  timeSheetNo: string;
  lineNo: number;
  type: string;
  jobNo: string;
  jobTaskNo: string;
  description: string;
  totalQuantity: number;
  posted: boolean;
  Status: string;
  timeSheetStartingDate: string;
  approvalDate: string;
  approvedBy: string;
}

export interface TimeSheetLinesProps {
  startingDate: Date;
  endingDate: Date;
  lines: any[];
  timeSheetNo: string;
  resourceNo: string;
  projects: { value: string; label: string }[];
  onLineUpdate: (updatedLine: any) => Promise<void>;
  onLineDelete: (lineId: string) => Promise<void>;
  onLineAdd: (newLine: any) => Promise<any>;
  onLineHoursUpdate: (
    lineId: string,
    date: Date,
    value: number,
    systemId: string
  ) => Promise<any>;
  onLineHoursSubmit: (data: any) => Promise<any>;
  publicHolidays: { date: string; description: string }[];
  isApprovalMode?: boolean;
  viewStats: {
    quantityOpen: number;
    quantityApproved: number;
    quantitySubmitted: number;
    quantityRejected: number;
    quantity: number;
  };
}
