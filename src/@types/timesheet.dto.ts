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
