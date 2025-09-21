import { BaseApiService } from "./base/BaseApiService";

export interface TrainingRequestConference {
  systemId: string;
  code: string;
  description: string;
  unitCost: number;
  "@odata.etag": string;
}

class TrainingRequestConferencesService extends BaseApiService {
  protected endpoint = "trainingRequestsConferences";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches training request conferences from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<TrainingRequestConference[]>} Array of training request conferences
   */
  async getTrainingRequestConferences(companyId: string, filterQuery?: string) {
    return this.get<TrainingRequestConference>({ companyId, filterQuery });
  }
}

export const trainingRequestConferencesService =
  new TrainingRequestConferencesService();
