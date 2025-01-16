import {
  LeaveFormData,
  LeaveFormUpdate,
  LeaveRequestResponse,
  LeaveRequestValue,
} from "../@types/documents/leave.types";
import {
  LeavePlanResponse,
  LeavePlanResponseSingle,
  LeaveRequest,
} from "../@types/leave.dto";
import { BaseApiService } from "./base/BaseApiService";
import BcApiService from "./BcApiServices";

class LeaveService extends BaseApiService {
  protected endpoint = "HRMLeaveRequests";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches leave requests from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<LeaveRequestValue[]>} Array of leave requests
   */
  async getLeaveRequests(companyId: string, filterQuery?: string) {
    return this.get<LeaveRequestValue>({ companyId, filterQuery });
  }

  async getLeaveRequest(companyId: string, systemId: string) {
    return this.getById<LeaveRequestValue>({ companyId, systemId });
  }

  async createLeaveRequest(companyId: string, data: LeaveFormData) {
    return this.create<LeaveRequestValue>({ companyId, data });
  }

  async updateLeaveRequest(
    companyId: string,
    method: "PATCH",
    data: LeaveFormUpdate,
    systemId: string,
    etag: string
  ) {
    return this.update<LeaveRequestValue>({ companyId, data, systemId, etag });
  }

  async sendLeaveRequestForApproval(
    companyId: string,
    data: { no: string; senderEmailAddress: string }
  ) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_SendLeaveApprovalRequest",
    });
  }

  async sendLeavePlanForApproval(
    companyId: string,
    data: { no: string; senderEmailAddress: string }
  ) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_SendLeavePlanApprovalRequest",
    });
  }

  async cancelLeavePlanRequest(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_CancelLeavePlanApprovalRequest",
    });
  }

  async cancelLeaveRequest(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_CancelLeaveApprovalRequest",
    });
  }

  async deleteLeaveRequest(companyId: string, systemId: string) {
    return this.delete({ companyId, systemId });
  }
}

export const leaveService = new LeaveService();

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

export async function apiLeaveRequestDetail(
  companyId: string,
  method: "GET" | "PATCH" | "DELETE",
  data?: any,
  systemId?: string,
  filterQuery?: string
) {
  return BcApiService.fetchData<LeaveRequest>({
    url: `/api/hrpsolutions/hrmis/v2.0/HRMLeaveRequests(${systemId})?Company=${companyId}&${filterQuery}`,
    method,
    data,
  });
}
