import { IPA, PartialPIPAFormData } from "../@types/ipa.dto";
import { BaseApiService } from "./base/BaseApiService";

class IpaService extends BaseApiService {
  protected endpoint = "ipas";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches leave requests from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<LeaveRequestValue[]>} Array of leave requests
   */

  async getIPAS(companyId: string, filterQuery?: string) {
    return this.get<IPA>({ companyId, filterQuery });
  }

  async getIPA(companyId: string, systemId: string, filterQuery?: string) {
    return this.getById<IPA>({ companyId, systemId, filterQuery });
  }

  async createIPA(companyId: string, data: PartialPIPAFormData) {
    return this.create<IPA>({ companyId, data });
  }

  async deleteIPALine(companyId: string, systemId: string) {
    return this.delete({ companyId, systemId, customEndpoint: "ipaLines" });
  }

  // async getLeaveRequests(companyId: string, filterQuery?: string) {
  //   return this.get<LeaveRequestValue>({ companyId, filterQuery });
  // }

  // async getLeaveRequest(companyId: string, systemId: string) {
  //   return this.getById<LeaveRequestValue>({ companyId, systemId });
  // }

  // async createLeaveRequest(companyId: string, data: LeaveFormData) {
  //   return this.create<LeaveRequestValue>({ companyId, data });
  // }

  // async updateLeaveRequest(
  //   companyId: string,
  //   method: "PATCH",
  //   data: LeaveFormUpdate,
  //   systemId: string,
  //   etag: string
  // ) {
  //   console.log(method);
  //   return this.update<LeaveRequestValue>({ companyId, data, systemId, etag });
  // }

  // async sendLeaveRequestForApproval(
  //   companyId: string,
  //   data: { no: string; senderEmailAddress: string }
  // ) {
  //   return this.create<{ no: string }>({
  //     companyId,
  //     data,
  //     type: "approval",
  //     customEndpoint: "HRMISActions_SendLeaveApprovalRequest",
  //   });
  // }

  // async cancelLeaveRequest(companyId: string, data: { no: string }) {
  //   return this.create<{ no: string }>({
  //     companyId,
  //     data,
  //     type: "approval",
  //     customEndpoint: "HRMISActions_CancelLeaveApprovalRequest",
  //   });
  // }

  // async deleteLeaveRequest(companyId: string, systemId: string) {
  //   return this.delete({ companyId, systemId });
  // }

  // // --------------------------------- leave plan ---------------------------------

  // async sendLeavePlanForApproval(
  //   companyId: string,
  //   data: { no: string; senderEmailAddress: string }
  // ) {
  //   return this.create<{ no: string }>({
  //     companyId,
  //     data,
  //     type: "approval",
  //     customEndpoint: "HRMISActions_SendLeavePlanApprovalRequest",
  //   });
  // }

  // async cancelLeavePlanRequest(companyId: string, data: { no: string }) {
  //   return this.create<{ no: string }>({
  //     companyId,
  //     data,
  //     type: "approval",
  //     customEndpoint: "HRMISActions_CancelLeavePlanApprovalRequest",
  //   });
  // }

  // async deleteLeavePlan(companyId: string, systemId: string) {
  //   return this.delete({ companyId, systemId,
  //     customEndpoint: "leavePlans"
  //    });
  // }
}

export const ipaService = new IpaService();
