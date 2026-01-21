import {
  ExitInterview,
  ExitInterviewFormData,
  ExitInterviewFormUpdate,
} from "../@types/exitInterview.dto";
import { BaseApiService } from "./base/BaseApiService";

class ExitInterviewService extends BaseApiService {
  protected endpoint = "exitInterview";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches exit interviews from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<ExitInterview[]>} Array of exit interviews
   */
  async getExitInterviews(companyId: string, filterQuery?: string) {
    return this.get<ExitInterview>({ companyId, filterQuery });
  }

  /**
   * Fetches a single exit interview by ID
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Exit interview system ID
   * @returns {Promise<ExitInterview>} Exit interview data
   */
  async getExitInterview(companyId: string, systemId: string) {
    return this.getById<ExitInterview>({ companyId, systemId });
  }

  /**
   * Creates a new exit interview
   * @async
   * @param {string} companyId - Company identifier
   * @param {ExitInterviewFormData} data - Exit interview form data
   * @returns {Promise<ExitInterview>} Created exit interview
   */
  async createExitInterview(companyId: string, data: ExitInterviewFormData) {
    return this.create<ExitInterview>({ companyId, data });
  }

  /**
   * Updates an existing exit interview
   * @async
   * @param {string} companyId - Company identifier
   * @param {ExitInterviewFormUpdate} data - Exit interview update data
   * @param {string} systemId - Exit interview system ID
   * @param {string} etag - ETag for concurrency control
   * @returns {Promise<ExitInterview>} Updated exit interview
   */
  async updateExitInterview(
    companyId: string,
    data: ExitInterviewFormUpdate,
    systemId: string,
    etag: string
  ) {
    return this.update<ExitInterview>({
      companyId,
      data,
      systemId,
      etag,
    });
  }

  /**
   * Deletes an exit interview
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Exit interview system ID
   * @returns {Promise<void>}
   */
  async deleteExitInterview(companyId: string, systemId: string) {
    return this.delete({ companyId, systemId });
  }

  /**
   * Sends exit interview for approval
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Approval request data
   * @returns {Promise<any>} Approval response
   */
  async sendExitInterviewForApproval(
    companyId: string,
    data: { no: string; senderEmailAddress: string }
  ) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_SendExitInterviewApprovalRequest",
    });
  }

  /**
   * Cancels exit interview approval request
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Cancellation data
   * @returns {Promise<any>} Cancellation response
   */
  async cancelExitInterviewApproval(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_CancelExitInterviewApprovalRequest",
    });
  }

  /**
   * Submits exit interview
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Exit interview system ID
   * @returns {Promise<any>} Submit response
   */
  async submitExitInterview(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_SubmitExitInterview",
    });
  }

  async printExitInterview(companyId: string, no: string) {
    return this.create<any>({
      companyId,
      data: {
        no: no,
      },
      type: "approval",
      customEndpoint: "HRMISActions_PrintExitInterview",
    });
  }
}

export const exitInterviewService = new ExitInterviewService();
