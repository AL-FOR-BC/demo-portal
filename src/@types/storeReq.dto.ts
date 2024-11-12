// Store Request Line Type
export interface StoreRequestLineType {
    "@odata.etag"?: string;
    systemId?: string;
    lineNo?: number;
    description2: string;
    quantity: number;
    unitOfMeasure: string;
    status?: string;
    requestNo?: string;
}

// Store Request Submit Data Type
export interface StoreRequestSubmitData {
    requestorNo: string;
    purpose: string;
    storeReqType: 'Issue' | 'TransferOrder'; // Using union type for specific values
    locationCode: string;
    transferTo?: string;      // Optional for TransferOrder
    transitCode?: string;     // Optional for TransferOrder
    projectCode?: string;     // Optional project code
    storeRequestline?: StoreRequestLineType[];
}

// Store Request Response Type
export interface StoreRequestResponse {
    "@odata.context"?: string;
    "@odata.etag"?: string;
    systemId: string;
    requestNo: string;
    requestorNo: string;
    requestorName?: string;
    purpose: string;
    storeReqType: 'Issue' | 'TransferOrder';
    locationCode: string;
    transferTo?: string;
    transitCode?: string;
    projectCode?: string;
    status: string;
    dateCreated?: string;
    timeCreated?: string;
    lastDateModified?: string;
    lastTimeModified?: string;
    storeRequestline?: StoreRequestLineType[];
}

// Store Request Line Submit Data
export interface StoreRequestLineSubmitData {
    description2: string;
    quantity: number;
    unitOfMeasure: string;
}

// Store Request Line Update Data
export interface StoreRequestLineUpdateData extends StoreRequestLineSubmitData {
    systemId: string;
    "@odata.etag": string;
}

// Store Request Filter Type
export interface StoreRequestFilterType {
    requestNo?: string;
    requestorNo?: string;
    status?: string;
    storeReqType?: 'Issue' | 'TransferOrder';
    dateCreated?: string;
}