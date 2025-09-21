import {
  TrainingRequest,
  TrainingRequestFormData,
  TrainingRequestFormUpdate,
} from "../@types/trainingRequest.dto";
import { BaseApiService } from "./base/BaseApiService";

class TrainingRequestService extends BaseApiService {
  protected endpoint = "trainingRequests";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches training requests from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<TrainingRequest[]>} Array of training requests
   */
  async getTrainingRequests(companyId: string, filterQuery?: string) {
    return this.get<TrainingRequest>({ companyId, filterQuery });
  }

  /**
   * Fetches a single training request by ID
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Training request system ID
   * @returns {Promise<TrainingRequest>} Training request data
   */
  async getTrainingRequest(companyId: string, systemId: string) {
    return this.getById<TrainingRequest>({
      companyId,
      systemId,
    });
  }

  /**
   * Creates a new training request
   * @async
   * @param {string} companyId - Company identifier
   * @param {TrainingRequestFormData} data - Training request form data
   * @returns {Promise<TrainingRequest>} Created training request
   */
  async createTrainingRequest(
    companyId: string,
    data: TrainingRequestFormData
  ) {
    return this.create<TrainingRequest>({ companyId, data });
  }

  /**
   * Updates an existing training request
   * @async
   * @param {string} companyId - Company identifier
   * @param {TrainingRequestFormUpdate} data - Training request update data
   * @param {string} systemId - Training request system ID
   * @param {string} etag - ETag for concurrency control
   * @returns {Promise<TrainingRequest>} Updated training request
   */
  async updateTrainingRequest(
    companyId: string,
    data: TrainingRequestFormUpdate,
    systemId: string,
    etag: string
  ) {
    return this.update<TrainingRequest>({
      companyId,
      data,
      systemId,
      etag,
    });
  }

  /**
   * Deletes a training request
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Training request system ID
   * @returns {Promise<void>}
   */
  async deleteTrainingRequest(companyId: string, systemId: string) {
    return this.delete({ companyId, systemId });
  }

  /**
   * Sends training request for approval
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Approval request data
   * @returns {Promise<any>} Approval response
   */
  async sendTrainingRequestForApproval(
    companyId: string,
    data: { no: string; senderEmailAddress: string }
  ) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_SendTrainingRequestApprovalRequest",
    });
  }

  /**
   * Cancels training request approval request
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Cancellation data
   * @returns {Promise<any>} Cancellation response
   */
  async cancelTrainingRequestApproval(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_CancelTrainingRequestApprovalRequest",
    });
  }

  /**
   * Submits training request
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Submit data
   * @returns {Promise<any>} Submit response
   */
  async submitTrainingRequest(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_SubmitTrainingRequest",
    });
  }
}

export const trainingRequestService = new TrainingRequestService();
