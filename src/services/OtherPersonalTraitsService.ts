import { BaseApiService } from "./base/BaseApiService";
import {
  OtherPersonalTrait,
  PartialOtherPersonalTraitFormData,
} from "../@types/pa.dto";

class OtherPersonalTraitsService extends BaseApiService {
  protected endpoint = "otherPersonalTraitsLines";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches other personal traits from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<OtherPersonalTrait[]>} Array of other personal traits
   */
  async getOtherPersonalTraits(companyId: string, filterQuery?: string) {
    return this.get<OtherPersonalTrait>({ companyId, filterQuery });
  }

  /**
   * Creates a new other personal trait
   * @async
   * @param {string} companyId - Company identifier
   * @param {PartialOtherPersonalTraitFormData} data - Other personal trait data
   * @returns {Promise<OtherPersonalTrait>} Created other personal trait
   */
  async createOtherPersonalTrait(
    companyId: string,
    data: PartialOtherPersonalTraitFormData
  ) {
    return this.create<OtherPersonalTrait>({ companyId, data });
  }

  /**
   * Updates an existing other personal trait
   * @async
   * @param {string} companyId - Company identifier
   * @param {PartialOtherPersonalTraitFormData} data - Other personal trait data
   * @param {string} systemId - System ID of the other personal trait
   * @param {string} etag - ETag for concurrency control
   * @returns {Promise<OtherPersonalTrait>} Updated other personal trait
   */
  async updateOtherPersonalTrait(
    companyId: string,
    data: PartialOtherPersonalTraitFormData,
    systemId: string,
    etag: string
  ) {
    return this.update<OtherPersonalTrait>({
      companyId,
      data,
      systemId,
      etag,
    });
  }

  /**
   * Deletes an other personal trait
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - System ID of the other personal trait
   * @returns {Promise<void>}
   */
  async deleteOtherPersonalTrait(companyId: string, systemId: string) {
    return this.delete({ companyId, systemId });
  }
}

export const otherPersonalTraitsService = new OtherPersonalTraitsService();
export { otherPersonalTraitsService as default };
