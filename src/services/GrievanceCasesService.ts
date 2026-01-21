import {
  GrievanceCase,
  GrievanceCaseFormUpdate,
  GrievanceCaseSubmissionData,
} from "../@types/grievanceCases.dto";
import { BaseApiService } from "./base/BaseApiService";

class GrievanceCasesService extends BaseApiService {
  protected endpoint = "grievances";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches Grievance Cases from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<GrievanceCase[]>} Array of Grievance Cases
   */
  async getGrievanceCases(companyId: string, filterQuery?: string) {
    return this.get<GrievanceCase>({ companyId, filterQuery });
  }

  /**
   * Fetches a single Grievance Case by ID
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Grievance Case system ID
   * @param {string} [expandQuery] - Optional OData expand query
   * @returns {Promise<GrievanceCase>} Grievance Case data
   */
  async getGrievanceCase(
    companyId: string,
    systemId: string,
    expandQuery?: string
  ) {
    return this.getById<GrievanceCase>({
      companyId,
      systemId,
      filterQuery: expandQuery,
    });
  }

  /**
   * Creates a new Grievance Case
   * @async
   * @param {string} companyId - Company identifier
   * @param {GrievanceCaseSubmissionData} data - Grievance Case submission data
   * @returns {Promise<GrievanceCase>} Created Grievance Case
   */
  async createGrievanceCase(
    companyId: string,
    data: GrievanceCaseSubmissionData
  ) {
    return this.create<GrievanceCase>({ companyId, data });
  }

  /**
   * Updates an existing Grievance Case
   * @async
   * @param {string} companyId - Company identifier
   * @param {GrievanceCaseFormUpdate} data - Grievance Case update data
   * @param {string} systemId - Grievance Case system ID
   * @param {string} etag - ETag for concurrency control
   * @returns {Promise<GrievanceCase>} Updated Grievance Case
   */
  async updateGrievanceCase(
    companyId: string,
    data: GrievanceCaseFormUpdate,
    systemId: string,
    etag: string
  ) {
    return this.update<GrievanceCase>({
      companyId,
      data,
      systemId,
      etag,
    });
  }

  /**
   * Deletes a Grievance Case
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Grievance Case system ID
   * @returns {Promise<void>}
   */
  async deleteGrievanceCase(companyId: string, systemId: string) {
    return this.delete({ companyId, systemId });
  }

  /**
   * Sends Grievance Case response
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Response data
   * @returns {Promise<any>} Response result
   */
  async sendGrievanceResponse(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_SendGrievanceResponse",
    });
  }

  /**
   * Notifies supervisor, accused employee and HR about Grievance Case
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Notification data
   * @returns {Promise<any>} Notification result
   */
  async notifySupervisor(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_GDNotifySupervisor",
    });
  }

  /**
   * Withdraws Grievance Case
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Withdrawal data
   * @returns {Promise<any>} Withdrawal result
   */
  async withdrawCase(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_WithdrawCase",
    });
  }

  /**
   * Closes Grievance Case
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Close data
   * @returns {Promise<any>} Close result
   */
  async closeGrievanceCase(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_CloseGrievanceCase",
    });
  }
}

export const grievanceCasesService = new GrievanceCasesService();
