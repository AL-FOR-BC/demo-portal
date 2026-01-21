import { BaseApiService } from "./base/BaseApiService";

export interface TrainingRequestCoaching {
  systemId: string;
  code: string;
  description: string;
  unitCost: number;
  "@odata.etag": string;
}

class TrainingRequestCoachingService extends BaseApiService {
  protected endpoint = "trainingRequestsCoaching";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches training request coaching from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<TrainingRequestCoaching[]>} Array of training request coaching
   */
  async getTrainingRequestCoaching(companyId: string, filterQuery?: string) {
    return this.get<TrainingRequestCoaching>({ companyId, filterQuery });
  }
}

export const trainingRequestCoachingService =
  new TrainingRequestCoachingService();
