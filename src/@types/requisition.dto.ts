

export interface currencyTypes {
  id: string;
  code: string;
  description: string;
}

export type workPlanTypes = {
  "@odata.etag": string;
  id: string;
  shortcutDimension1Code: string;
  shortcutDimension2Code: string;
  no: string;
  budgetCode: string;
  status: string;
  description: string;
};
export type locationCodesTypes = {
  "@odata.etag": string;
  Id: string;
  code: string;
  name: string;
  useInTransit: boolean;
};

export type dimensionValuesTypes = {
  "@odata.etag": string;
  id: string;
  globalDimensionNo: number;
  dimensionCode: string;
  code: string;
  name: string;
};

export type paymentCategoryTypes = {
  "@odata.etag": string;
  id: string;
  code: string;
  description: string;
};

export type paymentSubCategoryTypes = {
  "@odata.etag": string;
  id: string;
  code: string;
  name: string;
  paymentType: string;
};

export type customerTypes = {
  "@odata.etag": string;
  id: string;
  name: string;
  no: string;
  staff: boolean;
};

export type bankAccountTypes = {
  "@odata.etag": string;
  id: string;
  bankAccountNo: string;
  name: string;
  no: string;
};

export type glAccountTypes = {
  "@odata.etag": string;
  id: string;
  no: string;
  name: string;
};

export type workPlanLinesTypes = {
  "@odata.etag": string;
  id: string;
  workPlanNo: string;
  accountName: string;
  accountNo: string;
  entryNo: number;
  annualAmount: number;
  activityDescription: string;
  budgetVsActual: number;
  variance: number;
};

export type vendorTypes = {
  "@odata.etag": string;
  id: string;
  name: string;
  no: string;
};
