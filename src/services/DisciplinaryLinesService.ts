import {
  DisciplinaryLine,
  DisciplinaryLineFormData,
  DisciplinaryLineFormUpdate,
} from "../@types/disciplinaryLines.dto";
import { BaseApiService } from "./base/BaseApiService";

class DisciplinaryLinesService extends BaseApiService {
  protected endpoint = "disciplinaryLines";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches Disciplinary Lines from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<DisciplinaryLine[]>} Array of Disciplinary Lines
   */
  async getDisciplinaryLines(companyId: string, filterQuery?: string) {
    return this.get<DisciplinaryLine>({ companyId, filterQuery });
  }

  /**
   * Fetches a single Disciplinary Line by ID
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Disciplinary Line system ID
   * @returns {Promise<DisciplinaryLine>} Disciplinary Line data
   */
  async getDisciplinaryLine(companyId: string, systemId: string) {
    return this.getById<DisciplinaryLine>({ companyId, systemId });
  }

  /**
   * Creates a new Disciplinary Line
   * @async
   * @param {string} companyId - Company identifier
   * @param {DisciplinaryLineFormData} data - Disciplinary Line form data
   * @returns {Promise<DisciplinaryLine>} Created Disciplinary Line
   */
  async createDisciplinaryLine(
    companyId: string,
    data: DisciplinaryLineFormData
  ) {
    return this.create<DisciplinaryLine>({ companyId, data });
  }

  /**
   * Updates an existing Disciplinary Line
   * @async
   * @param {string} companyId - Company identifier
   * @param {DisciplinaryLineFormUpdate} data - Disciplinary Line update data
   * @param {string} systemId - Disciplinary Line system ID
   * @param {string} etag - ETag for concurrency control
   * @returns {Promise<DisciplinaryLine>} Updated Disciplinary Line
   */
  async updateDisciplinaryLine(
    companyId: string,
    data: DisciplinaryLineFormUpdate,
    systemId: string,
    etag: string
  ) {
    return this.update<DisciplinaryLine>({
      companyId,
      data,
      systemId,
      etag,
    });
  }

  /**
   * Deletes a Disciplinary Line
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Disciplinary Line system ID
   * @param {string} etag - ETag for concurrency control
   * @returns {Promise<void>}
   */
  async deleteDisciplinaryLine(
    companyId: string,
    systemId: string,
    etag: string
  ) {
    return this.delete({ companyId, systemId, etag });
  }
}

export const disciplinaryLinesService = new DisciplinaryLinesService();
