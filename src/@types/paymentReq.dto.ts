export type PaymentRequisitionLineType = {
  "@odata.etag": string;
  systemId: string;
  documentType: string;
  documentNo: string;
  lineNo: number;
  accountType: string;
  accountNo: string;
  workPlanNo: string;
  workPlanEntryNo: number;
  description: string;
  quantity: number;
  rate: number;
  ProjectCode: string;
  ActivitiesCode: string;
  whtCode: string;
  accountName: string;
  activityDescription: string;
  amount: number;
  amountLCY: number;
  amountToPay: number;
  amountToPayLCY: number;
  budgetCode: string;
  currencyCode: string;
  dueDate: string;
  noOfInstallments: number;
  originalAmount: number;
  outstandingAmountLCY: number;
  periodID: string;
};

export type PaymentRequisition = {
  "@odata.etag": string;
  systemId: string;
  documentType: string;
  no: string;
  requisitionedBy: string;
  requestorName: string;
  payeeNo: string;
  payeeName: string;
  paymentCategory: string;
  paySubcategory: string;
  project: string;
  workPlanNo: string;
  donor: string;
  purpose: string;
  currencyCode: string;
  status: string;
  totalAmount: number;
  budgetCode: string;
  documentDate: string;
  paymentRequestLines: PaymentRequisitionLineType[];
};

export type PaymentRequisitionHeader = {
  "@odata.etag": string;
  systemId: string;
  documentType: string;
  no: string;
  requisitionedBy: string;
  requestorName: string;
  payeeNo: string;
  payeeName: string;
  paymentCategory: string;
  paySubcategory: string;
  project: string;
  workPlanNo: string;
  donor: string;
  purpose: string;
  currencyCode: string;
  status: string;
  totalAmount: number;
  budgetCode: string;
  documentDate: string;
};

export interface PaymentRequistionLinesSubmitData
  extends Record<string, unknown> {
  documentType?: string;
  documentNo?: string;
  accountType?: string;
  accountNo?: string;
  workPlanNo?: string;
  workPlanEntryNo?: number;
  description?: string;
  quantity?: number;
  rate?: number;
}

export interface PaymentRequisitionResponse {
  "@odata.context": string;
  value: PaymentRequisition[];
}

export interface PaymentRequisitionLinesResponse
  extends PaymentRequisitionLineType {}

export interface PaymentRequisitionLineSingleResponse
  extends PaymentRequisitionHeader {
  paymentRequestLines: PaymentRequisitionLineType[];
}
