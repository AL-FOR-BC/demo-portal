// Type for a Purchase Requisition Line
export type PurchaseRequisitionLineType = {
  "@odata.etag": string;
  systemId: string;
  lineNo: number;
  documentType: string;
  documentNo: string;
  accountType: string;
  no: string;
  faPostingGroup: string;
  workPlanNo: string;
  budgetCode: string;
  workPlanEntryNo: number;
  description: string;
  description2: string;
  quantity: number;
  unitOfMeasure: string;
  directUnitCost: number;
  lineAmount: number;
  quantityConverted: number;
  quantityToConvert: number;
  buyFromVendorNo: string;
  amount: number;
  lineAmountLCY: number;
};

// Type for a Purchase Requisition
export type PurchaseRequisitionType = {
  "@odata.etag"?: string;
  systemId?: string;
  documentType?: string;
  purchaserCode?: string;
  procurementType?: string;
  procurementMethod?: string;
  no?: string;
  requestorNo: string;
  requestorName?: string;
  documentDate?: string; // ISO date format (YYYY-MM-DD)
  expectedReceiptDate: string; // ISO date format (YYYY-MM-DD)
  project: string;
  donor?: string;
  workPlanNo: string;
  locationCode: string;
  budgetCode?: string;
  procurementCategory?: string;
  procurementDescription: string;
  status?: string;
  priceIncludingVAT?: boolean;
  amount?: number;
  currencyCode: string;
  purchaseRequisitionLines?: PurchaseRequisitionLineType[];
};

export interface PurchaseRequisitionLinesSubmitData
  extends Record<string, unknown> {
  documentType?: string;
  documentNo?: string;
  accountType?: string;
  no?: string;
  faPostingGroup?: string;
  workPlanNo?: string;
  workPlanEntryNo?: number;
  description2?: string;
  quantity?: number;
  directUnitCost?: number;
}

export interface PurchaseRequisitionHeader {
  "@odata.etag": string;
  amount: number;
  budgetCode: string;
  currencyCode: string;
  documentDate: string;
  documentType: string;
  donor: string;
  expectedReceiptDate: string;
  locationCode: string;
  no: string;
  postingDate: string;
  priceIncludingVAT: boolean;
  procurementCategory: string;
  procurementDescription: string;
  procurementMethod: string;
  procurementType: string;
  project: string;
  purchaserCode: string;
  requestorName: string;
  requestorNo: string;
  status: string;
  systemId: string;
  workPlanNo: string;
}

export interface PurchaseRequisitionResponse {
  "@odata.context": string;
  value: PurchaseRequisitionType[];
}

export interface PurchaseRequisitionLinesResponse
  extends PurchaseRequisitionLineType {}

export interface PurchaseRequisitionLinesSingleResponse
  extends PurchaseRequisitionType {
  no: string;
  budgetCode: string;
  status: string;
  purchaseRequisitionLines: PurchaseRequisitionLineType[];
}

export interface PurchaseRequisitionUpdateData {
  procurementDescription?: string;
  expectedReceiptDate?: string; // Use ISO date string format
  locationCode?: string;
  currencyCode?: string;
  workPlanNo?: string;
  project?: string;
  // Add any other fields that can be updated
}

