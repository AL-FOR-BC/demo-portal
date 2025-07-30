export interface SetupSettings {
  allowCompanyChange: boolean;
  themeColor: string;
  companyLogo: string | null;
  // Add other settings as needed
}

export interface SetupResponse {
  data: SetupSettings;
}
