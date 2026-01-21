import {
  TrainingPlan,
  TrainingPlanFormData,
  TrainingPlanFormUpdate,
  TrainingPlanLine,
  TrainingPlanLineFormData,
  TrainingPlanLineFormUpdate,
} from "../@types/trainingPlan.dto";
import { BaseApiService } from "./base/BaseApiService";

class TrainingPlanService extends BaseApiService {
  protected endpoint = "trainingPlan";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches training plans from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<TrainingPlan[]>} Array of training plans
   */
  async getTrainingPlans(companyId: string, filterQuery?: string) {
    const expandQuery = "$expand=trainingPlanLines";
    const fullQuery = filterQuery
      ? `${filterQuery}&${expandQuery}`
      : expandQuery;
    return this.get<TrainingPlan>({ companyId, filterQuery: fullQuery });
  }

  /**
   * Fetches a single training plan by ID
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Training plan system ID
   * @returns {Promise<TrainingPlan>} Training plan data
   */
  async getTrainingPlan(companyId: string, systemId: string) {
    const expandQuery = "$expand=trainingPlanLines";
    return this.getById<TrainingPlan>({
      companyId,
      systemId,
      filterQuery: expandQuery,
    });
  }

  /**
   * Creates a new training plan
   * @async
   * @param {string} companyId - Company identifier
   * @param {TrainingPlanFormData} data - Training plan form data
   * @returns {Promise<TrainingPlan>} Created training plan
   */
  async createTrainingPlan(companyId: string, data: TrainingPlanFormData) {
    return this.create<TrainingPlan>({ companyId, data });
  }

  /**
   * Updates an existing training plan
   * @async
   * @param {string} companyId - Company identifier
   * @param {TrainingPlanFormUpdate} data - Training plan update data
   * @param {string} systemId - Training plan system ID
   * @param {string} etag - ETag for concurrency control
   * @returns {Promise<TrainingPlan>} Updated training plan
   */
  async updateTrainingPlan(
    companyId: string,
    data: TrainingPlanFormUpdate,
    systemId: string,
    etag: string
  ) {
    return this.update<TrainingPlan>({
      companyId,
      data,
      systemId,
      etag,
    });
  }

  /**
   * Deletes a training plan
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Training plan system ID
   * @returns {Promise<void>}
   */
  async deleteTrainingPlan(companyId: string, systemId: string) {
    return this.delete({ companyId, systemId });
  }

  /**
   * Fetches training plan lines from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} planNo - Training plan number
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<TrainingPlanLine[]>} Array of training plan lines
   */
  async getTrainingPlanLines(
    companyId: string,
    planNo: string,
    filterQuery?: string
  ) {
    const planFilter = `$filter=planNo eq '${planNo}'`;
    const fullQuery = filterQuery ? `${filterQuery}&${planFilter}` : planFilter;
    return this.get<TrainingPlanLine>({
      companyId,
      filterQuery: fullQuery,
      customEndpoint: "trainingPlanLines",
    });
  }

  /**
   * Fetches a single training plan line by ID
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Training plan line system ID
   * @returns {Promise<TrainingPlanLine>} Training plan line data
   */
  async getTrainingPlanLine(companyId: string, systemId: string) {
    return this.getById<TrainingPlanLine>({
      companyId,
      systemId,
      customEndpoint: "trainingPlanLines",
    });
  }

  /**
   * Creates a new training plan line
   * @async
   * @param {string} companyId - Company identifier
   * @param {TrainingPlanLineFormData} data - Training plan line form data
   * @returns {Promise<TrainingPlanLine>} Created training plan line
   */
  async createTrainingPlanLine(
    companyId: string,
    data: TrainingPlanLineFormData
  ) {
    return this.create<TrainingPlanLine>({
      companyId,
      data,
      customEndpoint: "trainingPlanLines",
    });
  }

  /**
   * Updates an existing training plan line
   * @async
   * @param {string} companyId - Company identifier
   * @param {TrainingPlanLineFormUpdate} data - Training plan line update data
   * @param {string} systemId - Training plan line system ID
   * @param {string} etag - ETag for concurrency control
   * @returns {Promise<TrainingPlanLine>} Updated training plan line
   */
  async updateTrainingPlanLine(
    companyId: string,
    data: TrainingPlanLineFormUpdate,
    systemId: string,
    etag: string
  ) {
    return this.update<TrainingPlanLine>({
      companyId,
      data,
      systemId,
      etag,
      customEndpoint: "trainingPlanLines",
    });
  }

  /**
   * Deletes a training plan line
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Training plan line system ID
   * @returns {Promise<void>}
   */
  async deleteTrainingPlanLine(companyId: string, systemId: string) {
    return this.delete({
      companyId,
      systemId,
      customEndpoint: "trainingPlanLines",
    });
  }

  /**
   * Sends training plan for approval
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Approval request data
   * @returns {Promise<any>} Approval response
   */
  async sendTrainingPlanForApproval(
    companyId: string,
    data: { no: string; senderEmailAddress: string }
  ) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_SendTrainingPlanApprovalRequest",
    });
  }

  /**
   * Cancels training plan approval request
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Cancellation data
   * @returns {Promise<any>} Cancellation response
   */
  async cancelTrainingPlanApproval(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_CancelTrainingPlanApprovalRequest",
    });
  }

  /**
   * Submits training plan
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Submit data
   * @returns {Promise<any>} Submit response
   */
  async submitTrainingPlan(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_SubmitTrainingPlan",
    });
  }

  /**
   * Approves training plan
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Approval data
   * @returns {Promise<any>} Approval response
   */
  async approveTrainingPlan(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_ApproveTrainingPlan",
    });
  }

  /**
   * Rejects training plan
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Rejection data
   * @returns {Promise<any>} Rejection response
   */
  async rejectTrainingPlan(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_RejectTrainingPlan",
    });
  }
}

export const trainingPlanService = new TrainingPlanService();
