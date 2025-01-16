export interface ODataResponse<T> {
  "@odata.context": string;
  value: T[];
}

export interface ODataEntity {
  "@odata.etag": string;
  systemId: string;
}

export type DocumentTypeMode = "detail" | "approve" | "add" | "list";
export type DocumentType =
  | "purchase"
  | "payment"
  | "travel"
  | "store"
  | "leave";

export interface BaseDocumentLine extends ODataEntity {
  lineNo: string;
  lineType: string;
  lineDescription: string;
  lineAmount: number;
  lineStatus: string;
}

export interface BaseDocumentConfig {
  type: DocumentType;
  apiEndpoints: {
    detail: string;
    lines: string;
    approve: string;
    list: string;
  };
  tableId: number;
  navigationPaths: {
    list: string;
    approvals: string;
  };
}

//? base state that all document will have
export type BaseDocumentState = ODataEntity &
  // export type BaseDocumentState =
  (| {
        no: string;
        documentNo?: string;
      }
    | ({
        no?: string;
        documentNo: string;
      } & {
        status: string;
        isLoading: boolean;
        documentDate: Date;
        requestorNo?: string;
        requestorName?: string;
        remarks?: string;
      })
  );

export interface BaseField {
  label: string;
  type: string;
  value: string;
  id: string;
  required?: boolean;
  onChange?: (value: any) => void;
  options?: Array<{ label: string; value: string | number }>;
  validation?: ValidationRule[];
}

export type FieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "textarea"
  | "checkbox"
  | "rado"
  | "file"
  | "group";

export interface ValidationRule {
  type: "required" | "min" | "max" | "pattern" | "custom";
  message: string;
  value?: any;
  validator?: (value: any) => boolean;
}
