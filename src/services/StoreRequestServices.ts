// import { StoreRequisitionSubmitData } from "../@types/storeReq.dto";
import { StoreRequestResponse } from "../@types/storeReq.dto";
import BcApiService from "./BcApiServices";

export async function apiCreateStoreRequest(companyId: string, data: any) {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/StoreRequests?Company=${companyId}`,
    method: "post",
    data: data as Record<string, unknown>,
  });
}

export async function apiGetStoreRequest(
  companyId: string,
  filterQuery: string
) {
  return BcApiService.fetchData<StoreRequestResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/StoreRequests?Company=${companyId}&${filterQuery}`,
    method: "get",
  });
}

export async function apiStoreRequestDetail(
  companyId: string,
  id: string,
  filterQuery: string
) {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/StoreRequests(${id})?Company=${companyId}&${filterQuery}`,
    method: "get",
  });
}

export async function apiUpdateStoreRequest(
  companyId: string,
  id: string,
  data: any
) {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/StoreRequests(${id})?Company=${companyId}`,
    method: "patch",
    data: data as Record<string, unknown>,
    headers: {
      "If-Match": "*",
    },
  });
}

export async function apiDeleteStoreRequest(companyId: string, id: string) {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/StoreRequests/${id}?Company=${companyId}`,
    method: "delete",
  });
}

export async function apiCreateStoreRequestLine(companyId: string, data: any) {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/storeRequestLine?Company=${companyId}`,
    method: "post",
    data,
  });
}
export async function apiUpdateStoreRequestLine(
  companyId: string,
  id: string,
  data: any,
  etag: string
) {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/storeRequestline(${id})?Company=${companyId}`,
    method: "patch",
    data,
    headers: {
      "If-Match": etag,
    },
  });
}
export async function apiDeleteStoreRequestLine(companyId: string, id: string) {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/storeRequestline(${id})?Company=${companyId}`,
    method: "delete",
  });
}

export async function apiStoreRequestLines(
  companyId: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  data?: any,
  systemId?: string,
  etag?: string,
  filterQuery?: string
) {
  if (method === "PATCH" || "DELETE") {
    return BcApiService.fetchData<any>({
      url: `/api/hrpsolutions/procuretopay/v2.0/storeRequestline(${systemId})?Company=${companyId}&${filterQuery}`,
      method,
      data,
      headers: {
        "If-Match": etag,
      },
    });
  }
}
