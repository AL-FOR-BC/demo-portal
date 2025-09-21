import { BaseApiService } from "./base/BaseApiService";

export interface FALocation {
  systemId: string;
  code: string;
  name: string;
}

export interface FALocationValue extends FALocation {
  "@odata.etag": string;
}

export interface FALocationResponse {
  "@odata.context": string;
  value: FALocationValue[];
}

class FALocationsService extends BaseApiService {
  protected endpoint = "faLocations";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches FA Locations from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<FALocation[]>} Array of FA Locations
   */
  async getFALocations(companyId: string, filterQuery?: string) {
    return this.get<FALocation>({ companyId, filterQuery });
  }

  /**
   * Fetches a single FA Location by ID
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} systemId - FA Location system ID
   * @returns {Promise<FALocation>} FA Location data
   */
  async getFALocation(companyId: string, systemId: string) {
    return this.getById<FALocation>({ companyId, systemId });
  }
}

export const faLocationsService = new FALocationsService();


