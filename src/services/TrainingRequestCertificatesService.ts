import { BaseApiService } from "./base/BaseApiService";

export interface TrainingRequestCertificate {
  systemId: string;
  code: string;
  description: string;
  unitCost: number;
  score: number;
  "@odata.etag": string;
}

class TrainingRequestCertificatesService extends BaseApiService {
  protected endpoint = "trainingRequestsCertificates";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches training request certificates from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<TrainingRequestCertificate[]>} Array of training request certificates
   */
  async getTrainingRequestCertificates(
    companyId: string,
    filterQuery?: string
  ) {
    return this.get<TrainingRequestCertificate>({ companyId, filterQuery });
  }
}

export const trainingRequestCertificatesService =
  new TrainingRequestCertificatesService();
