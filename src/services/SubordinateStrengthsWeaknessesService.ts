import { BaseApiService } from "./base/BaseApiService";
import {
  SubordinateStrengthsWeaknesses,
  SubordinateStrengthsWeaknessesFormData,
} from "../@types/subordinateStrengthsWeaknesses.dto";

class SubordinateStrengthsWeaknessesService extends BaseApiService {
  protected endpoint = "subordinateEvaluationStrengthsWeaknesses";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  async getSubordinateStrengthsWeaknesses(
    companyId: string,
    filterQuery?: string
  ) {
    return this.get<SubordinateStrengthsWeaknesses>({ companyId, filterQuery });
  }

  async getSubordinateStrengthsWeaknessesById(
    companyId: string,
    systemId: string
  ) {
    return this.getById<SubordinateStrengthsWeaknesses>({
      companyId,
      systemId,
    });
  }

  async createSubordinateStrengthsWeaknesses(
    companyId: string,
    data: SubordinateStrengthsWeaknessesFormData
  ) {
    return this.create<SubordinateStrengthsWeaknesses>({ companyId, data });
  }

  async updateSubordinateStrengthsWeaknesses(
    companyId: string,
    data: Partial<SubordinateStrengthsWeaknessesFormData>,
    systemId: string,
    etag: string
  ) {
    return this.update<SubordinateStrengthsWeaknesses>({
      companyId,
      data,
      systemId,
      etag,
    });
  }

  async deleteSubordinateStrengthsWeaknesses(
    companyId: string,
    systemId: string
  ) {
    return this.delete({ companyId, systemId });
  }
}

export const subordinateStrengthsWeaknessesService =
  new SubordinateStrengthsWeaknessesService();
