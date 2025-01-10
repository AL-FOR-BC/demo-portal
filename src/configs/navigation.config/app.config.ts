console.log("Environment variables:", import.meta.env);

export let apiPrefix = import.meta.env.VITE_EHUB_BACKEND_URL || "";
export let apiPrefixBC = import.meta.env.VITE_EHUB_BC_URL || "";
export let environment = import.meta.env.ENVIRONMENT || "";
export let environmentType = import.meta.env.ENVIRONMENT_TYPE || "";

if (environmentType === "HRP") {
  apiPrefix = import.meta.env.VITE_EHUB_BACKEND_URL_HRP || "";
  apiPrefixBC = import.meta.env.VITE_EHUB_BC_URL_HRP || "";
} else if (environmentType === "ROM_TEST") {
  apiPrefix = import.meta.env.VITE_EHUB_BACKEND_URL_ROM || "";
  apiPrefixBC = import.meta.env.VITE_EHUB_BC_URL_ROM || "";
  console.log("Environment variables:", import.meta.env);
} else {
  apiPrefix = import.meta.env.VITE_EHUB_BACKEND_URL || "";
  apiPrefixBC = import.meta.env.VITE_EHUB_BC_URL || "";
}

export type AppConfig = {
  apiPrefix: string;
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
  apiPrefixBC: string;
  environment: string;
};

const appConfig: AppConfig = {
  apiPrefix:
    environment === "production"
      ? "/api" // This will be handled by reverse proxy
      : apiPrefix,
  authenticatedEntryPath: "/dashboard",
  unAuthenticatedEntryPath: "/single-sign-on",
  apiPrefixBC,
  environment,
};
console.log("appConfig", appConfig);

export default appConfig;
