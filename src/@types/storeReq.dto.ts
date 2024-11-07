export interface StoreRequisitionType {
    no?: string;
    documentDate?: string;
    requestorNo: string;
    requestorName?: string;
    requisitionType: 'Issue' | 'TransferOrder';
    locationCode: string;
    transferTo?: string;
    transitCode?: string;
    project: string;
    purpose: string;
    status?: string;
  }
  export interface StoreRequisitionSubmitData {
    [key: string]: any;
    storeReqType?: any;
    requestorNo: string;
    projectCode?: string;
    purpose?: string;
    locationCode: string;
    transferTo?: string;
    transitCode?: string;
    project?: string;
    
  }
  
  export interface StoreRequisitionHeader extends StoreRequisitionType {
    systemId: string;
    etag: string;
  }
  
  export interface StoreRequisitionResponse {
    data: {
      value: StoreRequisitionType[];
    };
  }
  
  export interface StoreRequisitionLinesSingleResponse {
    data: StoreRequisitionType;
  }
  
  export interface StoreRequisitionLine {
    lineNo: number;
    itemNo: string;
    description: string;
    quantity: number;
    unitOfMeasure: string;
    locationCode: string;
    transferToLocation?: string;
  }
  
  export interface StoreRequisitionLinesSubmitData {
    requisitionNo: string;
    lines: StoreRequisitionLine[];
  }
  
  export interface StoreRequisitionLinesResponse {
    data: {
      value: StoreRequisitionLine[];
    };
  }
  
  export interface StoreRequisitionUpdateData {
    requisitionType: 'Issue' | 'TransferOrder';
    locationCode: string;
    transferTo?: string;
    transitCode?: string;
    project: string;
    purpose?: string;
    status?: string;
  }

