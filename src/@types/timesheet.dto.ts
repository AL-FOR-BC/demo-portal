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