import {
  LeavePlanResponse,
  LeavePlanResponseSingle,
  LeaveRequest,
} from "../@types/leave.dto";
import BcApiService from "./BcApiServices";

export async function apiLeavePlans(
  companyId: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  filterQuery?: string
  // data?: any,
  // systemId?: string,
  // etag?: string
) {
  // if (method === "POST") {
  //   return BcApiService.fetchData<LeavePlanResponseSingle>({
  //     url: `/api/hrpsolutions/hrmis/v2.0/LeavePlans?Company=${companyId}&${filterQuery}`,
  //     method: method,
  //     data: data,
  //   });
  // } else {
  return BcApiService.fetchData<LeavePlanResponse>({
    url: `/api/hrpsolutions/hrmis/v2.0/LeavePlans?Company=${companyId}&${filterQuery}`,
    method: method,
  });
  // }
}

export async function apiCreateLeavePlan(companyId: string, data: any) {
  return BcApiService.fetchData<LeavePlanResponseSingle>({
    url: `/api/hrpsolutions/hrmis/v2.0/LeavePlans?Company=${companyId}`,
    method: "POST",
    data: data,
  });
}

export async function apiLeavePlanDetail(
  companyId: string,
  method?: "GET" | "PATCH" | "DELETE",
  data?: any,
  systemId?: string,
  etag?: string,
  filterQuery?: string
) {
  if (method === "PATCH" || method === "DELETE") {
    return BcApiService.fetchData<LeavePlanResponseSingle>({
      url: `/api/hrpsolutions/hrmis/v2.0/LeavePlans(${systemId})?Company=${companyId}&${filterQuery}`,
      method,
      data,
      headers: {
        "If-Match": etag,
      },
    });
  } else {
    return BcApiService.fetchData<LeavePlanResponseSingle>({
      url: `/api/hrpsolutions/hrmis/v2.0/LeavePlans(${systemId})?Company=${companyId}&${filterQuery}`,
    });
  }
}

export async function apiLeavePlanLines(
  companyId: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  data?: any,
  systemId?: string,
  etag?: string,
  filterQuery?: string
) {
  if (method === "PATCH" || method === "DELETE") {
    return BcApiService.fetchData<LeavePlanResponse>({
      url: `/api/hrpsolutions/hrmis/v2.0/LeavePlanLines(${systemId})?Company=${companyId}&${filterQuery}`,
      method,
      data,
      headers: {
        "If-Match": etag,
      },
    });
  } else {
    console.log(method, data);
    return BcApiService.fetchData<LeavePlanResponse>({
      url: `/api/hrpsolutions/hrmis/v2.0/LeavePlanLines?Company=${companyId}&${filterQuery}`,
      method,
      data,
    });
  }
}

// --------------------------------- leave request ---------------------------------

export async function apiLeaveRequest(
  companyId: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  data?: any,
  filterQuery?: string
) {
  return BcApiService.fetchData<LeaveRequest>({
    url: `/api/hrpsolutions/hrmis/v2.0/HRMLeaveRequests?Company=${companyId}&${filterQuery}`,
    method,
    data,
  });
}
