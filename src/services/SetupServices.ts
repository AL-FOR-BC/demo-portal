import ApiService from "./ApiServices";
import { SetupResponse, SetupSettings } from "../@types/setup.dto";

export async function getSetupSettings() {
  return ApiService.fetchData<SetupResponse>({
    url: "/api/admin/settings/",
    method: "get",
  });
}

export async function updateSetupSettings(settings: SetupSettings) {
  return ApiService.fetchData<SetupResponse>({
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
