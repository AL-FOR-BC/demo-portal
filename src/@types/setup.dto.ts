export interface SetupSettings {
  allowCompanyChange: boolean;
  themeColor: string;
  companyLogo: string | null;
  favicon: string | null;
  shortcutDimCode1?: string | null;
  shortcutDimCode2?: string | null;
  // Add other settings as needed
}

export interface SetupResponse {
  data: SetupSettings;
}
