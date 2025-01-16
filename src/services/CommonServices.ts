import BcApiService from "./BcApiServices.ts";
import {
  bankAccountTypes,
  currencyTypes,
  customerTypes,
  dimensionValuesTypes,
  glAccountTypes,
  locationCodesTypes,
  paymentCategoryTypes,
  paymentSubCategoryTypes,
  vendorTypes,
  workPlanLinesTypes,
  workPlanTypes,
} from "../@types/requisition.dto.ts";
import { ItemsResponse } from "../@types/items.dto.ts";
import { FixedAssetsResponse } from "../@types/common.dto.ts";
import {
  EmployeeResponse,
  UnitOfMeasureResponse,
} from "../@types/employee.dto.ts";
import { CompanyResponse } from "../@types/company.dto.ts";
import { BaseApiService } from "./base/BaseApiService.ts";
import { EmployeeRequestValue } from "../@types/documents/employee.types.ts";

interface currencyResponse {
  "@odata.context": string;
  value: currencyTypes[];
}
interface workPlanResponse {
  "@odata.context": string;
  value: workPlanTypes[];
}
interface locationCodesResponse {
  "@odata.context": string;
  value: locationCodesTypes[];
}

interface dimensionValuesResponse {
  "@odata.context": string;
  value: dimensionValuesTypes[];
}

interface paymentCategoryResponse {
  "@odata.context": string;
  value: paymentCategoryTypes[];
}

interface paymentSubCategoryResponse {
  "@odata.context": string;
  value: paymentSubCategoryTypes[];
}

interface customerResponse {
  "@odata.etag": string;
  value: customerTypes[];
}

interface bankAccountResponse {
  "@odata.etag": string;
  value: bankAccountTypes[];
}

interface gLAccountsResponse {
  "@odata.etag": string;
  value: glAccountTypes[];
}

interface workPlanLinesResponse {
  "@odata.etag": string;
  value: workPlanLinesTypes[];
}

interface vendorResponse {
  "@odata.etag": string;
  value: vendorTypes[];
}

class CommonServices extends BaseApiService {
  protected module = "hrpsolutions/hrmis";
  protected version = "v2.0";
  protected endpoint = "";

  async getEmployeeList(companyId: string, filterQuery?: string) {
    return this.get<EmployeeRequestValue>({
      companyId,
      filterQuery,
      customEndpoint: "employees",
    });
  }
}
export const commonService = new CommonServices();

export async function apiCurrencyCodes(
  companyId: string,
  filterQuery?: string
) {
  return BcApiService.fetchData<currencyResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/currencyCodes?Company=${companyId}&${filterQuery}`,
  });
}

export async function apiWorkPlans(companyId: string, filterQuery?: string) {
  return BcApiService.fetchData<workPlanResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/approvedWorkplans?Company=${companyId}&${filterQuery}`,
  });
}

export async function apiLocation(companyId: string, filterQuery?: string) {
  return BcApiService.fetchData<locationCodesResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/locationCodes?Company=${companyId}&${filterQuery}`,
  });
}

export async function apiDimensionValue(
  companyId: string,
  filterQuery?: string
) {
  return BcApiService.fetchData<dimensionValuesResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/dimensionValue?Company=${companyId}&${filterQuery}`,
  });
}

export async function apiPaymentCategory(
  companyId: string,
  filterQuery?: string
) {
  return BcApiService.fetchData<paymentCategoryResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/PaymentCategoryApi?Company=${companyId}&${filterQuery}`,
  });
}

export async function apiPaymentSubCategoryApi(
  companyId: string,
  filterQuery?: string
) {
  return BcApiService.fetchData<paymentSubCategoryResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/PaymentSubCategoryApi?Company=${companyId}&${filterQuery}`,
  });
}

export async function apiCustomersApi(companyId: string, filterQuery?: string) {
  return BcApiService.fetchData<customerResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/customers?Company=${companyId}&${filterQuery}`,
  });
}

export async function apiBankAccountsApi(
  companyId: string,
  filterQuery?: string
) {
  return BcApiService.fetchData<bankAccountResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/bankaccounts?Company=${companyId}&${filterQuery}`,
  });
}

export async function apiGLAccountsApi(
  companyId: string,
  filterQuery?: string
) {
  return BcApiService.fetchData<gLAccountsResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/gLAccounts?Company=${companyId}&${filterQuery}`,
  });
}

export async function apiWorkPlanLines(
  companyId: string,
  filterQuery?: string
) {
  return BcApiService.fetchData<workPlanLinesResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/approvedWorkplanlines?Company=${companyId}&${filterQuery}`,
  });
}

export async function apiVendors(companyId: string, filterQuery?: string) {
  return BcApiService.fetchData<vendorResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/vendors?Company=${companyId}&${filterQuery}`,
  });
}

export async function apiApprovalEntries(
  companyId: string,
  filterQuery?: string
) {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/approvalEntries?Company=${companyId}&${filterQuery}`,
  });
}

export async function apiApprovalToRequest(
  companyId: string,
  filterQuery?: string
) {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/hrmis/v1.0/requestsToApprove?Company=${companyId}&${filterQuery}`,
  });
}

// api/hrpsolutions/hrmis/v1.0/employees

export async function apiEmployees(companyId: string, filterQuery?: string) {
  return BcApiService.fetchData<EmployeeResponse>({
    url: `/api/hrpsolutions/hrmis/v2.0/employees?Company=${companyId}&${filterQuery}`,
  });
}

export async function apiItem(companyId: string, filterQuery?: string) {
  return BcApiService.fetchData<ItemsResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/items?Company=${companyId}&${filterQuery}`,
  });
}

export async function apiFixedAssets(companyId: string, filterQuery?: string) {
  return BcApiService.fetchData<FixedAssetsResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/fixedAssets?Company=${companyId}&${filterQuery}`,
  });
}

//  --------------------------------------- Attachments ---------------------------------------

export async function apiAttachments(
  companyId: string,
  filterQuery?: string,
  method: "GET" | "POST" = "GET",
  data?: any
) {
  if (method == "GET") {
    return BcApiService.fetchData<any>({
      url: `/api/hrpsolutions/hrmis/v2.0/documentAttachments?Company=${companyId}&${filterQuery}`,
      method: method,
    });
  } else {
    return BcApiService.fetchData({
      url: `/api/hrpsolutions/hrmis/v2.0/documentAttachments?Company=${companyId}&${filterQuery}`,
      method: method,
      data: data,
    });
  }
}

//delete attachment
export async function apiDeleteAttachment(companyId: string, systemId: string) {
  return BcApiService.fetchData({
    url: `api/hrpsolutions/hrmis/v2.0/documentAttachments(${systemId})?company=${companyId}`,
    method: "delete",
  });
}

// -------------------------------------- End of Attachments --------------------------------------

export async function apiUnitOfMeasure(
  companyId: string,
  filterQuery?: string
) {
  return BcApiService.fetchData<UnitOfMeasureResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/unitOfMeasure?Company=${companyId}&${filterQuery}`,
  });
}

// -------------------------------------- Companies --------------------------------------

export async function apiCompanies() {
  return BcApiService.fetchData<CompanyResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/companies`,
  });
}

// -------------------------------------- End of Companies --------------------------------------

// -------------------------------------- Comments --------------------------------------

export const apiApprovalComments = async (company: string, filter: string) => {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/approvalComments?Company=${company}&${filter}`,
  });
};
