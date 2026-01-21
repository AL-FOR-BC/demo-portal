import ApiService from "../../../services/ApiServices";
import type { AxiosResponse } from "axios";

export type AppSetupConfig = {
  setupId?: number;
  baseUrl: string;
  defaultCompany: string;
  ehubUsername: string;
  ehubPassword: string;
  lastModified?: string;
  modifiedBy?: string;
};

export type BcConfigPayload = {
  id?: string;
  tenant: string;
  clientId: string;
  clientSecret: string;
  url: string;
  email?: string;
  password?: string;
  companyId?: string;
};

export type EnvironmentConfigPayload = {
  id?: number;
  environmentType: string;
  frontendBasePath: string;
};

export type ProjectSetupConfig = {
  id: string;
  logo?: string;
  name?: string;
  color?: string;
  themeColor?: string;
  companyLogo?: string | null;
  favicon?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export const fetchAppSetupConfig = () => {
  return ApiService.fetchData<AppSetupConfig>({
    url: "/api/admin/app-setup",
    method: "get",
  });
};

export const updateAppSetupConfig = (payload: AppSetupConfig) => {
  return ApiService.fetchData<AppSetupConfig>({
    url: "/api/admin/app-setup",
    method: "put",
    data: payload,
  });
};

export const fetchBcConfig = () => {
  return ApiService.fetchData<BcConfigPayload>({
    url: "/api/admin/bc-config",
    method: "get",
  });
};

export const updateBcConfig = (payload: BcConfigPayload) => {
  return ApiService.fetchData<BcConfigPayload>({
    url: "/api/admin/bc-config",
    method: "put",
    data: payload,
  });
};

export const fetchEnvironmentConfig = () => {
  return ApiService.fetchData<EnvironmentConfigPayload>({
    url: "/api/admin/environment-config",
    method: "get",
  });
};

export const updateEnvironmentConfig = (payload: EnvironmentConfigPayload) => {
  return ApiService.fetchData<EnvironmentConfigPayload>({
    url: "/api/admin/environment-config",
    method: "put",
    data: payload,
  });
};

export type SetupSettingsConfig = {
  id: string;
  themeColor: string;
  companyLogo: string | null;
  favicon: string | null;
  allowCompanyChange: boolean;
  shortcutDimCode1?: string | null;
  shortcutDimCode2?: string | null;
};

export const fetchProjectSetupConfig = () => {
  return ApiService.fetchData<SetupSettingsConfig>({
    url: "/api/admin/settings",
    method: "get",
  });
};

export const updateProjectSetupConfig = (
  payload: {
  allowCompanyChange: boolean;
  themeColor?: string;
  companyLogo?: string | null;
  favicon?: string | null;
  shortcutDimCode1?: string | null;
  shortcutDimCode2?: string | null;
  }
): Promise<AxiosResponse<SetupSettingsConfig>> => {
  return ApiService.fetchData<SetupSettingsConfig>({
    url: "/api/admin/settings",
    method: "put",
    data: payload,
  });
};

export const fetchProjectSetups = () => {
  return ApiService.fetchData<ProjectSetupConfig[]>({
    url: "/api/admin/project-setup",
    method: "get",
  });
};

export const updateProjectSetup = (payload: ProjectSetupConfig) => {
  return ApiService.fetchData<ProjectSetupConfig>({
    url: `/api/admin/project-setup/${payload.id}`,
    method: "put",
    data: payload,
  });
};

export const verifyAdminPin = (pin: string) => {
  return ApiService.fetchData<{
    success: boolean;
    message: string;
  }>({
    url: "/api/admin/verify-pin",
    method: "post",
    data: { pin },
  });
};
