import ApiService from "./ApiServices";

export async function getSetupSettings() {
  return ApiService.fetchData<{ allowCompanyChange: boolean; id: string }>({
    url: "/api/admin/settings/",
    method: "get",
  });
}

export async function updateSetupSettings(settings: { allowCompanyChange: boolean }) {
  return ApiService.fetchData<{ allowCompanyChange: boolean }>({
    url: "/api/admin/settings/",
    method: "put",
    data: settings,
  });
}

export async function getAllowCompanyChangeSetting() {
  return ApiService.fetchData<{ allowCompanyChange: boolean; id: string }>({
    url: "/api/admin/settings/",
    method: "get",
  });
}
