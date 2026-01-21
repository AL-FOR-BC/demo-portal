import {
  DisciplinaryType,
  DisciplinaryTypeFormData,
  DisciplinaryTypeFormUpdate,
} from "../@types/disciplinaryTypes.dto";
import { BaseApiService } from "./base/BaseApiService";

class DisciplinaryTypesService extends BaseApiService {
  protected endpoint = "grievancesTypes";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches Disciplinary Types from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<DisciplinaryType[]>} Array of Disciplinary Types
   */
  async getDisciplinaryTypes(companyId: string, filterQuery?: string) {
    return this.get<DisciplinaryType>({ companyId, filterQuery });
  }

  /**
   * Fetches a single Disciplinary Type by ID
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Disciplinary Type system ID
   * @returns {Promise<DisciplinaryType>} Disciplinary Type data
   */
  async getDisciplinaryType(companyId: string, systemId: string) {
    return this.getById<DisciplinaryType>({
      companyId,
      systemId,
    });
  }

  /**
   * Creates a new Disciplinary Type
   * @async
   * @param {string} companyId - Company identifier
   * @param {DisciplinaryTypeFormData} data - Disciplinary Type form data
   * @returns {Promise<DisciplinaryType>} Created Disciplinary Type
   */
  async createDisciplinaryType(
    companyId: string,
    data: DisciplinaryTypeFormData
  ) {
    return this.create<DisciplinaryType>({ companyId, data });
  }

  /**
   * Updates an existing Disciplinary Type
   * @async
   * @param {string} companyId - Company identifier
   * @param {DisciplinaryTypeFormUpdate} data - Disciplinary Type update data
   * @param {string} systemId - Disciplinary Type system ID
   * @param {string} etag - ETag for concurrency control
   * @returns {Promise<DisciplinaryType>} Updated Disciplinary Type
   */
  async updateDisciplinaryType(
    companyId: string,
    data: DisciplinaryTypeFormUpdate,
    systemId: string,
    etag: string
  ) {
    return this.update<DisciplinaryType>({
      companyId,
      data,
      systemId,
      etag,
    });
  }

  /**
   * Deletes a Disciplinary Type
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - Disciplinary Type system ID
   * @returns {Promise<void>}
   */
  async deleteDisciplinaryType(companyId: string, systemId: string) {
    return this.delete({ companyId, systemId });
  }
}

export const disciplinaryTypesService = new DisciplinaryTypesService();
