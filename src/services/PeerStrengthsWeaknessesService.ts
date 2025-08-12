import { BaseApiService } from "./base/BaseApiService";
import {
  PeerStrengthsWeaknesses,
  PeerStrengthsWeaknessesFormData,
} from "../@types/peerStrengthsWeaknesses.dto";

class PeerStrengthsWeaknessesService extends BaseApiService {
  protected endpoint = "peerEvaluationStrengthsWeaknesses";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  async getPeerStrengthsWeaknesses(companyId: string, filterQuery?: string) {
    return this.get<PeerStrengthsWeaknesses>({ companyId, filterQuery });
  }

  async getPeerStrengthsWeaknessesById(companyId: string, systemId: string) {
    return this.getById<PeerStrengthsWeaknesses>({ companyId, systemId });
  }

  async createPeerStrengthsWeaknesses(
    companyId: string,
    data: PeerStrengthsWeaknessesFormData
  ) {
    return this.create<PeerStrengthsWeaknesses>({ companyId, data });
  }

  async updatePeerStrengthsWeaknesses(
    companyId: string,
    data: Partial<PeerStrengthsWeaknessesFormData>,
    systemId: string,
    etag: string
  ) {
    return this.update<PeerStrengthsWeaknesses>({
      companyId,
      data,
      systemId,
      etag,
    });
  }

  async deletePeerStrengthsWeaknesses(companyId: string, systemId: string) {
    return this.delete({ companyId, systemId });
  }
}

export const peerStrengthsWeaknessesService =
  new PeerStrengthsWeaknessesService();
