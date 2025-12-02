import { BaseApiService } from "./base/BaseApiService";
import { TrainingEvaluation } from "../@types/trainingEvaluation.dto";

export class TrainingEvaluationService extends BaseApiService {
  protected endpoint = "trainingevaluation";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  // Get all training evaluations
  async getTrainingEvaluations(companyId: string, filterQuery?: string) {
    return this.get<TrainingEvaluation>({
      companyId,
      filterQuery,
    });
  }

  // Get a specific training evaluation by systemId
  async getTrainingEvaluation(companyId: string, systemId: string) {
    return this.getById<TrainingEvaluation>({
      companyId,
      systemId,
    });
  }

  // Create a new training evaluation
  async createTrainingEvaluation(
    companyId: string,
    data: Partial<TrainingEvaluation>
  ) {
    return this.create<TrainingEvaluation>({
      companyId,
      data,
    });
  }

  // Update an existing training evaluation
  async updateTrainingEvaluation(
    companyId: string,
    systemId: string,
    data: Partial<TrainingEvaluation>,
    etag?: string
  ) {
    return this.update<TrainingEvaluation>({
      companyId,
      systemId,
      data,
      etag,
    });
  }

  // Delete a training evaluation
  async deleteTrainingEvaluation(
    companyId: string,
    systemId: string,
    etag?: string
  ) {
    return this.delete({
      companyId,
      systemId,
      etag,
    });
  }

  // Submit evaluation to HOD
  async submitEvaluationToHOD(companyId: string, data: { no: string }) {
    return this.create<{ no: string }>({
      companyId,
      data,
      type: "approval",
      customEndpoint: "HRMISActions_SendTrainingEvaluationtoHOD",
    });
  }
}

export const trainingEvaluationService = new TrainingEvaluationService();
