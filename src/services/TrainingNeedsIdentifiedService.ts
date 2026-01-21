import { BaseApiService } from "./base/BaseApiService";
import {
  TrainingNeedsIdentified,
  TrainingNeedsIdentifiedFormData,
} from "../@types/trainingNeedsIdentified.dto";

class TrainingNeedsIdentifiedService extends BaseApiService {
  protected endpoint = "trainingNeedsIdentified";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  async getTrainingNeedsIdentified(companyId: string, filterQuery?: string) {
    return this.get<TrainingNeedsIdentified>({ companyId, filterQuery });
  }

  async getTrainingNeedsIdentifiedById(companyId: string, systemId: string) {
    return this.getById<TrainingNeedsIdentified>({ companyId, systemId });
  }

  async createTrainingNeedsIdentified(
    companyId: string,
    data: TrainingNeedsIdentifiedFormData
  ) {
    return this.create<TrainingNeedsIdentified>({ companyId, data });
  }

  async updateTrainingNeedsIdentified(
    companyId: string,
    data: Partial<TrainingNeedsIdentifiedFormData>,
    systemId: string,
    etag: string
  ) {
    return this.update<TrainingNeedsIdentified>({
      companyId,
      data,
      systemId,
      etag,
    });
  }

  async deleteTrainingNeedsIdentified(companyId: string, systemId: string) {
    return this.delete({ companyId, systemId });
  }
}

export const trainingNeedsIdentifiedService =
  new TrainingNeedsIdentifiedService();
