import { BaseApiService } from "./base/BaseApiService";

export interface TrainingRoom {
  systemId: string;
  code: string;
  description: string;
  capacity: number;
  venue: string;
  "@odata.etag": string;
}

class TrainingRoomsService extends BaseApiService {
  protected endpoint = "trainingrooms";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches training rooms from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<TrainingRoom[]>} Array of training rooms
   */
  async getTrainingRooms(companyId: string, filterQuery?: string) {
    return this.get<TrainingRoom>({ companyId, filterQuery });
  }
}

export const trainingRoomsService = new TrainingRoomsService();
