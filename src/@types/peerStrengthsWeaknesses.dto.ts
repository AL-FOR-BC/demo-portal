export interface PeerStrengthsWeaknesses {
  "@odata.etag": string;
  systemId: string;
  documentNo?: string;
  lineNo?: number;
  evaluationType?: string;
  category?: string;
  description?: string;
}

export interface PeerStrengthsWeaknessesFormData {
  documentNo?: string;
  lineNo?: number;
  evaluationType?: string;
  category?: string;
  description?: string;
  systemId?: string;
}

export type PartialPeerStrengthsWeaknessesFormData =
  Partial<PeerStrengthsWeaknessesFormData>;

// API Response
export interface PeerStrengthsWeaknessesResponse {
  "@odata.context": string;
  value: PeerStrengthsWeaknesses[];
}
