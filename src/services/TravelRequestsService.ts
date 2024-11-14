import {
  TravelRequest,
  TravelRequestLineType,
  TravelRequestSingleResponse,
  TravelRequestsResponse,
} from "../@types/travelReq.dto.ts.ts";
import BcApiService from "./BcApiServices.ts";

export async function apiTravelRequests(
  companyId: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  filterQuery?: string,
  data?: any,
  systemId?: string,
  etag?: string
) {
  if (method === "PATCH" || method === "DELETE") {
    return BcApiService.fetchData<TravelRequestsResponse>({
      url: `/api/hrpsolutions/procuretopay/v2.0/travelRequisitionHeaderApi(${systemId})?Company=${companyId}&${filterQuery}`,
      method,
      data,
      headers: {
        "If-Match": etag,
      },
    });
  } else {
    return BcApiService.fetchData<TravelRequestsResponse>({
      url: `/api/hrpsolutions/procuretopay/v2.0/travelRequisitionHeaderApi?Company=${companyId}&${filterQuery}`,
      method,
      data,
    });
  }
}

export async function apiCreateTravelRequests(
  companyId: string,
  data: TravelRequest
) {
  return BcApiService.fetchData<TravelRequestsResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/travelRequisitionHeaderApi?Company=${companyId}`,
    method: "POST",
    data: data as Record<string, unknown>,
  });
}

export async function apiTravelRequestDetail(
  companyId: string,
  systemId: string,
  filterQuery?: string
) {
  return BcApiService.fetchData<TravelRequestSingleResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/travelRequisitionHeaderApi(${systemId})?Company=${companyId}&${filterQuery}`,
    method: "GET",
  });
}

export async function apiCreateTravelRequestsLines(
  companyId: string,
  data: Record<string, any>
) {
  return BcApiService.fetchData<TravelRequestLineType>({
    url: `/api/hrpsolutions/procuretopay/v2.0/travelRequisitionLines?Company=${companyId}`,
    method: "POST",
    data,
  });
}

export async function apiTravelRequestsLines(
  companyId: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  data?: any,
  systemId?: string,
  etag?: string,
  filterQuery?: string
) {
  if (method === "PATCH" || "DELETE") {
    return BcApiService.fetchData<TravelRequestLineType>({
      url: `/api/hrpsolutions/procuretopay/v2.0/travelRequisitionLines(${systemId})?Company=${companyId}&${filterQuery}`,
      method,
      data,
      headers: {
        "If-Match": etag,
      },
    });
  }
  return BcApiService.fetchData<TravelRequestLineType>({
    url: `/api/hrpsolutions/procuretopay/v2.0/travelRequisitionLines?Company=${companyId}&${filterQuery}`,
    method,
    data,
  });
}

export async function apiUpdateTravelRequests(
  companyId: string,
  id: string,
  data: any,
  etag: string
) {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/travelRequisitionHeaderApi(${id})?Company=${companyId}`,
    method: "PATCH",
    data,
    headers: {
      "If-Match": etag,
    },
  });
}
