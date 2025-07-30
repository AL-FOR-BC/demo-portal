import ApiService from "./ApiServices";

export async function getSetupSettings() {
  return ApiService.fetchData<{
    allowCompanyChange: boolean;
    themeColor: string;
    companyLogo: string | null;
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
}) {
  return ApiService.fetchData<{
    allowCompanyChange: boolean;
    themeColor?: string;
    companyLogo?: string | null;
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
    id: string;
  }>({
    url: "/api/admin/settings/",
    method: "get",
  });
}
