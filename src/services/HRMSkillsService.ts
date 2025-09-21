import { BaseApiService } from "./base/BaseApiService";

export interface HRMSkill {
  systemId: string;
  code: string;
  description: string;
  "@odata.etag": string;
}

class HRMSkillsService extends BaseApiService {
  protected endpoint = "skills";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches HRM skills from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<HRMSkill[]>} Array of HRM skills
   */
  async getHRMSkills(companyId: string, filterQuery?: string) {
    return this.get<HRMSkill>({ companyId, filterQuery });
  }
}

export const hrmSkillsService = new HRMSkillsService();

