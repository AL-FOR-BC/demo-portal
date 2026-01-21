import ApiService from "./ApiServices";

export async function getSetupSettings() {
  return ApiService.fetchData<{
    allowCompanyChange: boolean;
    themeColor: string;
    companyLogo: string | null;
    favicon: string | null;
    shortcutDimCode1?: string | null;
    shortcutDimCode2?: string | null;
    id: string;
  }>({
    url: "/api/admin/settings/",
    method: "get",
  });
}

export async function updateSetupSettings(settings: {
  allowCompanyChange: boolean;
  themeColor?: string;
  companyLogo?: string | null;
  favicon?: string | null;
  shortcutDimCode1?: string | null;
  shortcutDimCode2?: string | null;
}) {
  return ApiService.fetchData<{
    allowCompanyChange: boolean;
    themeColor?: string;
    companyLogo?: string | null;
    favicon?: string | null;
    shortcutDimCode1?: string | null;
    shortcutDimCode2?: string | null;
  }>({
    url: "/api/admin/settings/",
    method: "put",
    data: settings,
  });
}

export async function getAllowCompanyChangeSetting() {
  return ApiService.fetchData<{
    allowCompanyChange: boolean;
    themeColor: string;
    companyLogo: string | null;
    favicon: string | null;
    shortcutDimCode1?: string | null;
    shortcutDimCode2?: string | null;
    id: string;
  }>({
    url: "/api/admin/settings/",
    method: "get",
  });
}
