import { ReactNode, CSSProperties } from "react";

export interface CommonProps {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

export interface breadCrumbProps extends CommonProps {
  title: string;
  breadcrumbItem: string;
  subTitle: string;
}

export type options = {
  label: string;
  value: string;
};

// New types based on the provided structure
export interface FixedAssetValue {
  "@odata.etag": string;
  id: string;
  no: string;
  serialNo: string;
  name: string;
  description2: string;
  faPostingGroup: string;
  faLocationCode: string;
  responsibleEmployee: string;
}

export interface FixedAssetsResponse {
  "@odata.context": string;
  value: FixedAssetValue[];
}



export interface Attachment {
  id: number;
  fileName: string;
  fileExtension: string;
  fileContentsBase64: string;
  fileContentType: string;
  no: string;
  systemId: string;
  tableId: number;
  documentType: string;
  "@odata.etag": string;
}

export interface AttachmentResponse {
  "@odata.context": string;
  value: Attachment[];
}


export interface Base64File {
  base64String: string;
  fileName: string;
  fileExtension: string;
  contentType: string;
}