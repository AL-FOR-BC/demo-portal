export interface TravelRequest {
  "@odata.etag"?: string;
  id?: string;
  requisitionedBy?: string;
  paymentCategory?: string;
  paySubcategory?: string;
  payeeNo?: string;
  projectCode?: string;
  workPlanNo?: string;
  currencyCode?: string;
  payeeName?: string;
  documentType?: string;
  no?: string;
  travelStartDate?: string; // Consider using Date if applicable
  travelEndDate?: string; // Consider using Date if applicable
  staff?: boolean;
  postingDate?: string; // Consider using Date if applicable
  purpose?: string;
  destination?: string;
  budgetCode?: string;
  status?: string;
  delegatee?: string;
  totalAmount?: number;
}

export interface TravelRequestsResponse extends TravelRequest {
  "@odata.context": string;
  value: TravelRequest[];
}

export interface TravelRequestSingleResponse {
  "@odata.context": string;
  "@odata.etag": string;
  id: string;
  requisitionedBy: string;
  paymentCategory: string;
  paySubcategory: string;
  payeeNo: string;
  projectCode: string;
  workPlanNo: string;
  currencyCode: string;
  payeeName: string;
  documentType: string;
  no: string;
  travelStartDate: string;
  travelEndDate: string;
  staff: boolean;
  postingDate: string;
  purpose: string;
  destination: string;
  budgetCode: string;
  status: string;
  delegatee: string;
  totalAmount: number;
  travelRequisitionLines: any[];
}

export interface TravelRequestLineType {
  "@odata.etag"?: string;
  accountName?: string;
  accountNo?: string;
  accountType?: string;
  amount?: number;
  amountLCY?: number;
  amountToPay?: number;
  amountToPayLCY?: number;
  budgetCode?: string;
  description?: string;
  documentNo?: string;
  documentTy?: string; // Optional field
  frequency?: number;
  lineNo?: number;
  noOfNights?: number;
  projectCode?: string;
  rate?: number;
  systemId?: string;
}
