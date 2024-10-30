export interface Item {
    "@odata.etag": string;
    id: string;
    no: string;
    blocked: boolean;
    name: string;
    description2: string;
    baseUnitOfMeasure: string;
    purchUnitOfMeasure: string;
    salesUnitOfMeasure: string;
  }
  
 export  interface ItemsResponse {
    "@odata.context": string;
    value: Item[];
  }