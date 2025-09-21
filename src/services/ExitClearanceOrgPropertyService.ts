import {
  ExitClearanceOrgProperty,
  ExitClearanceOrgPropertyFormData,
  ExitClearanceOrgPropertyFormUpdate,
} from "../@types/exitClearanceOrgProperty.dto";
import { BaseApiService } from "./base/BaseApiService";

class ExitClearanceOrgPropertyService extends BaseApiService {
  protected endpoint = "ExitClearanceOrgProperties";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches Exit Clearance organizational properties from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<ExitClearanceOrgProperty[]>} Array of Exit Clearance organizational properties
   */
  async getExitClearanceOrgProperties(companyId: string, filterQuery?: string) {
    return this.get<ExitClearanceOrgProperty>({ companyId, filterQuery });
  }

  /**
   * Fetches a single Exit Clearance organizational property by ID
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Exit Clearance organizational property system ID
   * @returns {Promise<ExitClearanceOrgProperty>} Exit Clearance organizational property data
   */
  async getExitClearanceOrgProperty(companyId: string, systemId: string) {
    return this.getById<ExitClearanceOrgProperty>({ companyId, systemId });
  }

  /**
   * Creates a new Exit Clearance organizational property
   * @async
   * @param {string} companyId - Company identifier
   * @param {ExitClearanceOrgPropertyFormData} data - Exit Clearance organizational property form data
   * @returns {Promise<ExitClearanceOrgProperty>} Created Exit Clearance organizational property
   */
  async createExitClearanceOrgProperty(
    companyId: string,
    data: ExitClearanceOrgPropertyFormData
  ) {
    return this.create<ExitClearanceOrgProperty>({ companyId, data });
  }

  /**
   * Updates an existing Exit Clearance organizational property
   * @async
   * @param {string} companyId - Company identifier
   * @param {ExitClearanceOrgPropertyFormUpdate} data - Exit Clearance organizational property update data
   * @param {string} systemId - Exit Clearance organizational property system ID
   * @param {string} etag - ETag for concurrency control
   * @returns {Promise<ExitClearanceOrgProperty>} Updated Exit Clearance organizational property
   */
  async updateExitClearanceOrgProperty(
    companyId: string,
    data: ExitClearanceOrgPropertyFormUpdate,
    systemId: string,
    etag: string
  ) {
    return this.update<ExitClearanceOrgProperty>({
      companyId,
      data,
      systemId,
      etag,
    });
  }

  /**
   * Deletes a Exit Clearance organizational property
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Exit Clearance organizational property system ID
   * @returns {Promise<void>}
   */
  async deleteExitClearanceOrgProperty(companyId: string, systemId: string) {
    return this.delete({ companyId, systemId });
  }

  /**
   * Fetches organizational properties for a specific Exit Clearance
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} ExitClearanceNo - Exit Clearance number
   * @returns {Promise<ExitClearanceOrgProperty[]>} Array of organizational properties
   */
  async getOrgPropertiesByExitClearance(
    companyId: string,
    ExitClearanceNo: string
  ) {
    const filterQuery = `$filter=ExitClearanceNo eq '${ExitClearanceNo}'`;
    return this.get<ExitClearanceOrgProperty>({ companyId, filterQuery });
  }
}

export const exitClearanceOrgPropertyService = new ExitClearanceOrgPropertyService();
