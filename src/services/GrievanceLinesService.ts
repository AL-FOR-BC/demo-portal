import { BaseApiService } from "./base/BaseApiService";
import {
  GrievanceLine,
  GrievanceLineFormData,
  GrievanceLineFormUpdate,
} from "../@types/grievanceLines.dto";

class GrievanceLinesService extends BaseApiService {
  protected endpoint = "grievanceLines";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  async getGrievanceLines(
    companyId: string,
    filterQuery?: string
  ): Promise<GrievanceLine[]> {
    const response = await this.get<GrievanceLine>({
      companyId,
      filterQuery,
    });
    return response;
  }

  async getGrievanceLine(
    companyId: string,
    systemId: string
  ): Promise<GrievanceLine> {
    const response = await this.getById<GrievanceLine>({
      companyId,
      systemId,
    });
    return response;
  }

  async createGrievanceLine(
    companyId: string,
    data: GrievanceLineFormData
  ): Promise<any> {
    const response = await this.create<GrievanceLine>({
      companyId,
      data,
    });
    return response;
  }

  async updateGrievanceLine(
    companyId: string,
    data: GrievanceLineFormUpdate,
    systemId: string,
    etag: string
  ): Promise<any> {
    const response = await this.update<GrievanceLine>({
      companyId,
      systemId,
      data,
      etag,
    });
    return response;
  }

  async deleteGrievanceLine(
    companyId: string,
    systemId: string,
    etag: string
  ): Promise<any> {
    const response = await this.delete({
      companyId,
      systemId,
      etag,
    });
    return response;
  }
}

export const grievanceLinesService = new GrievanceLinesService();
