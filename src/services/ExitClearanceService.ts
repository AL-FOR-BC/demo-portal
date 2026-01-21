import {
  ExitClearance,
  ExitClearanceFormData,
  ExitClearanceFormUpdate,
} from "../@types/exitClearance.dto";
import { BaseApiService } from "./base/BaseApiService";

class ExitClearanceService extends BaseApiService {
  protected endpoint = "exitClearance";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches Exit Clearances from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<ExitClearance[]>} Array of Exit Clearances
   */
  async getExitClearances(companyId: string, filterQuery?: string) {
    const expandQuery = "$expand=exitClearanceOrgProperties";
    const fullQuery = filterQuery
      ? `${filterQuery}&${expandQuery}`
      : expandQuery;
    return this.get<ExitClearance>({ companyId, filterQuery: fullQuery });
  }

  /**
   * Fetches a single Exit Clearance by ID
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Exit Clearance system ID
   * @returns {Promise<ExitClearance>} Exit Clearance data
   */
  async getExitClearance(companyId: string, systemId: string) {
    const expandQuery = "$expand=exitClearanceOrgProperties";
    return this.getById<ExitClearance>({
      companyId,
      systemId,
      filterQuery: expandQuery,
    });
  }

  /**
   * Creates a new Exit Clearance
   * @async
   * @param {string} companyId - Company identifier
   * @param {ExitClearanceFormData} data - Exit Clearance form data
   * @returns {Promise<ExitClearance>} Created Exit Clearance
   */
  async createExitClearance(companyId: string, data: ExitClearanceFormData) {
    return this.create<ExitClearance>({ companyId, data });
  }

  /**
   * Updates an existing Exit Clearance
   * @async
   * @param {string} companyId - Company identifier
   * @param {ExitClearanceFormUpdate} data - Exit Clearance update data
   * @param {string} systemId - Exit Clearance system ID
   * @param {string} etag - ETag for concurrency control
   * @returns {Promise<ExitClearance>} Updated Exit Clearance
   */
  async updateExitClearance(
    companyId: string,
    data: ExitClearanceFormUpdate,
    systemId: string,
    etag: string
  ) {
    return this.update<ExitClearance>({
      companyId,
      data,
      systemId,
      etag,
    });
  }

  /**
   * Deletes a Exit Clearance
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Exit Clearance system ID
   * @returns {Promise<void>}
   */
  async deleteExitClearance(companyId: string, systemId: string) {
    return this.delete({ companyId, systemId });
  }

  /**
   * Sends Exit Clearance for approval
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Approval request data
   * @returns {Promise<any>} Approval response
   */
  async sendExitClearanceForApproval(
    companyId: string,
    data: { no: string; senderEmailAddress: string }
  ) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_SendStaffHandoverApprovalRequest",
    });
  }

  /**
   * Cancels Exit Clearance approval request
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Cancellation data
   * @returns {Promise<any>} Cancellation response
   */
  async cancelExitClearanceApproval(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_CancelStaffHandoverApprovalRequest",
    });
  }

  /**
   * Submits Exit Clearance
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Submit data
   * @returns {Promise<any>} Submit response
   */
  async submitExitClearance(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_SubmitExitClearance",
    });
  }

  /**
   * Processes HR Officer clearance for Exit Clearance
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - HR Officer clearance data
   * @returns {Promise<any>} HR Officer clearance response
   */
  async processHROfficerInitialClearance(
    companyId: string,
    data: { no: string }
  ) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_HROfficerClearance",
    });
  }

  /**
   * Processes Finance clearance for Exit Clearance
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Finance clearance data
   * @returns {Promise<any>} Finance clearance response
   */
  async processFinanceClearance(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_FinanceClearance",
    });
  }

  /**
   * Processes IT clearance for Exit Clearance
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - IT clearance data
   * @returns {Promise<any>} IT clearance response
   */
  async processITClearance(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_ITClearance",
    });
  }

  /**
   * Processes Admin clearance for Exit Clearance
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Admin clearance data
   * @returns {Promise<any>} Admin clearance response
   */
  async processMedicalAdminClearance(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_AdminClearance",
    });
  }

  /**
   * Processes Head of Department clearance for Exit Clearance
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Head of Department clearance data
   * @returns {Promise<any>} Head of Department clearance response
   */
  async processHeadOfDepartmentClearance(
    companyId: string,
    data: { no: string }
  ) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_HeadOfDepartmentClearance",
    });
  }

  /**
   * Processes HR Manager final clearance for Exit Clearance
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - HR Manager clearance data
   * @returns {Promise<any>} HR Manager clearance response
   */
  async processHRManagerClearance(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_HRManagerClearance",
    });
  }

  /**
   * Processes HR Officer initial clearance for Exit Clearance
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - HR Officer clearance data
   * @returns {Promise<any>} HR Officer clearance response
   */
  async processHROfficerClearance(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_HROfficerClearance",
    });
  }

  /**
   * Processes Supervisor clearance for Exit Clearance
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Supervisor clearance data
   * @returns {Promise<any>} Supervisor clearance response
   */
  async processSupervisorClearance(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_SupervisorClearance",
    });
  }
}

export const exitClearanceService = new ExitClearanceService();
