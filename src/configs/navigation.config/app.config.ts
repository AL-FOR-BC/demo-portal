console.log("Environment variables:", import.meta.env);

const apiPrefix = import.meta.env.VITE_EHUB_BACKEND_URL || "";
const apiPrefixBC = import.meta.env.VITE_EHUB_BC_URL || "";
const environment = import.meta.env.ENVIRONMENT || "";

console.log("apiPrefix:", apiPrefix);
console.log("apiPrefixBC:", apiPrefixBC);

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

export default appConfig;
