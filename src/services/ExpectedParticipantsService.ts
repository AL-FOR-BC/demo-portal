import { BaseApiService } from "./base/BaseApiService";
import { ExpectedParticipant } from "../@types/expectedParticipants.dto";

export class ExpectedParticipantsService extends BaseApiService {
  protected endpoint = "expectedparticipants";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  // Get expected participants for a specific training plan line
  async getExpectedParticipants(
    companyId: string,
    trainingNo: string,
    lineNo: number,
    programCode?: string
  ): Promise<ExpectedParticipant[]> {
    let filterQuery = `$filter=trainingNo eq '${trainingNo}' and lineNo eq ${lineNo}`;

    if (programCode) {
      filterQuery += ` and programCode eq '${programCode}'`;
    }

    return this.get<ExpectedParticipant>({
      companyId,
      filterQuery,
    });
  }

  // Create new expected participant
  async createExpectedParticipant(
    companyId: string,
    participantData: Partial<ExpectedParticipant>
  ): Promise<ExpectedParticipant> {
    const response = await this.create<ExpectedParticipant>({
      companyId,
      data: participantData,
    });
    return response.data;
  }

  // Update expected participant
  async updateExpectedParticipant(
    companyId: string,
    systemId: string,
    participantData: Partial<ExpectedParticipant>,
    etag: string
  ): Promise<ExpectedParticipant> {
    const response = await this.update<ExpectedParticipant>({
      companyId,
      systemId,
      data: participantData,
      etag,
    });
    return response.data;
  }

  // Delete expected participant
  async deleteExpectedParticipant(
    companyId: string,
    systemId: string,
    etag: string
  ): Promise<void> {
    await this.delete({
      companyId,
      systemId,
      etag,
    });
  }
}

export const expectedParticipantsService = new ExpectedParticipantsService();
