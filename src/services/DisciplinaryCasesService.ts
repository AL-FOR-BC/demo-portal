import {
  DisciplinaryCase,
  DisciplinaryCaseFormUpdate,
  DisciplinaryCaseSubmissionData,
} from "../@types/disciplinaryCases.dto";
import { BaseApiService } from "./base/BaseApiService";

class DisciplinaryCasesService extends BaseApiService {
  protected endpoint = "disciplinaryCases";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches Disciplinary Cases from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<DisciplinaryCase[]>} Array of Disciplinary Cases
   */
  async getDisciplinaryCases(companyId: string, filterQuery?: string) {
    return this.get<DisciplinaryCase>({ companyId, filterQuery });
  }

  /**
   * Fetches a single Disciplinary Case by ID
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Disciplinary Case system ID
   * @param {string} [expandQuery] - Optional OData expand query
   * @returns {Promise<DisciplinaryCase>} Disciplinary Case data
   */
  async getDisciplinaryCase(
    companyId: string,
    systemId: string,
    expandQuery?: string
  ) {
    return this.getById<DisciplinaryCase>({
      companyId,
      systemId,
      filterQuery: expandQuery,
    });
  }

  /**
   * Creates a new Disciplinary Case
   * @async
   * @param {string} companyId - Company identifier
   * @param {DisciplinaryCaseSubmissionData} data - Disciplinary Case submission data
   * @returns {Promise<DisciplinaryCase>} Created Disciplinary Case
   */
  async createDisciplinaryCase(
    companyId: string,
    data: DisciplinaryCaseSubmissionData
  ) {
    return this.create<DisciplinaryCase>({ companyId, data });
  }

  /**
   * Updates an existing Disciplinary Case
   * @async
   * @param {string} companyId - Company identifier
   * @param {DisciplinaryCaseFormUpdate} data - Disciplinary Case update data
   * @param {string} systemId - Disciplinary Case system ID
   * @param {string} etag - ETag for concurrency control
   * @returns {Promise<DisciplinaryCase>} Updated Disciplinary Case
   */
  async updateDisciplinaryCase(
    companyId: string,
    data: DisciplinaryCaseFormUpdate,
    systemId: string,
    etag: string
  ) {
    return this.update<DisciplinaryCase>({
      companyId,
      data,
      systemId,
      etag,
    });
  }

  /**
   * Deletes a Disciplinary Case
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Disciplinary Case system ID
   * @returns {Promise<void>}
   */
  async deleteDisciplinaryCase(companyId: string, systemId: string) {
    return this.delete({ companyId, systemId });
  }

  /**
   * Sends Disciplinary Case response
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Response data
   * @returns {Promise<any>} Response result
   */
  async sendDisciplinaryResponse(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_SendDisciplinaryResponse",
    });
  }

  /**
   * Notifies supervisor about Disciplinary Case
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
   * Sends disciplinary notification with options
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Notification data with sendNotificationOption
   * @returns {Promise<any>} Notification result
   */
  async sendDisciplinaryNotification(
    companyId: string,
    data: { no: string; sendNotificationOption: number }
  ) {
    return this.create<{ no: string; sendNotificationOption: number }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_SendDisciplinaryNotification",
    });
  }

  /**
   * Sends employee response for Disciplinary Case
   * @async
   * @param {string} companyId - Company identifier
   * @param {object} data - Response data
   * @returns {Promise<any>} Response result
   */
  async sendEmployeeResponse(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_SendEmployeeResponse",
    });
  }
}

export const disciplinaryCasesService = new DisciplinaryCasesService();
